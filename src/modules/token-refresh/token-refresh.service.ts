import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../database/users/users.service';
import { GoogleAuthProvider } from '../google-sheet/providers/google-auth.provider';
import { BitrixServiceFactory } from '../bitrix/bitrix.factory';
import { BitrixConfig } from '../bitrix/bitrix.service';
import { BitrixTokenDto } from '../database/users/dto/bitrix-token.dto';

@Injectable()
export class TokenRefreshService {
  private readonly logger = new Logger(TokenRefreshService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly bitrixServiceFactory: BitrixServiceFactory,
  ) {}

  @Cron('0 */55 * * * *') // Chạy mỗi 55 phút
  async handleCron() {
    this.logger.log('Bắt đầu làm mới token cho tất cả người dùng');

    const users = await this.usersService.findAll();

    for (const user of users) {
      // Làm mới token Google
      if (user.token?.google_token) {
        try {
          const isRefreshSuccess = await this.googleAuthProvider.refreshToken(
            user.domain,
            user.token.google_token,
          );

          if (isRefreshSuccess) {
            this.logger.log(`Làm mới Google token cho ${user.domain} thành công`);
          } else {
            this.logger.warn(`Làm mới Google token cho ${user.domain} thất bại`);
          }
        } catch (error) {
          this.logger.error(`Lỗi khi làm mới Google token cho ${user.domain}: ${error.message}`);
        }
      }

      // Làm mới token Bitrix
      if (user.token?.bitrix_token) {
        try {
          const bitrixConfig: BitrixConfig = {
            oauth: {
              domain: user.domain,
              refresh_token: user.token.bitrix_token.refresh_token,
              access_token: user.token.bitrix_token.access_token,
            },
          };

          const bitrixService = this.bitrixServiceFactory.createService(bitrixConfig);
          const newToken = await bitrixService.refreshToken();

          // Cập nhật token mới vào cơ sở dữ liệu
          user.token.bitrix_token.access_token = newToken.access_token;
          user.token.bitrix_token.refresh_token = newToken.refresh_token;
          await this.usersService.updateTokens(user.domain, null, user.token.bitrix_token);

          this.logger.log(`Làm mới Bitrix token cho ${user.domain} thành công`);
        } catch (error) {
          this.logger.error(`Lỗi khi làm mới Bitrix token cho ${user.domain}: ${error.message}`);
        }
      }
    }

    this.logger.log('Hoàn thành làm mới token cho tất cả người dùng');
  }
} 
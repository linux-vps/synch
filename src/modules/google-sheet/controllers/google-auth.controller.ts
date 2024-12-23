import { Controller, Get, Query, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthProvider } from '../providers/google-auth.provider';
import { UsersService } from '../../database/users/users.service';
import { Logger } from '@nestjs/common';

/**
 * Controller để xử lý xác thực Google OAuth2.
 */
@Controller('auth/google')
export class GoogleAuthController {
    private readonly logger: Logger = new Logger(GoogleAuthController.name);

    constructor(
        private readonly googleAuthProvider: GoogleAuthProvider,
        private readonly usersService: UsersService
    ) {}

    @Get('callback')
    public async handleGoogleCallback(
        @Query('code') code: string,
        @Query('state') state: string,
        @Res() res: Response
    ): Promise<void> {
        this.logger.log(`Nhận callback từ Google cho domain: ${state}`);
        try {
            await this.googleAuthProvider.handleCallback(code, state);
            res.send('Xác thực thành công! Bạn có thể đóng cửa sổ này.');
        } catch (error) {
            this.logger.error(`Lỗi khi xử lý callback: ${error.message}`);
            res.status(500).send('Có lỗi xảy ra khi xử lý callback: ' + error.message);
        }
    }

    @Get(':domain')
    public async redirectToGoogle(
        @Param('domain') domain: string,
        @Res() res: Response
    ): Promise<void> {
        this.logger.log(`Bắt đầu quá trình xác thực cho domain: ${domain}`);
        try {
            const user = await this.usersService.findOne(domain);
            
            if (user?.token?.google_token) {
                const isTokenValid = await this.googleAuthProvider.verifyToken(user.token.google_token);
                
                if (isTokenValid) {
                    res.send('Tài khoản đã được xác thực với Google!');
                    return;
                }
                
                // Token không hợp lệ, thử refresh
                const isRefreshSuccess = await this.googleAuthProvider.refreshToken(domain, user.token.google_token);
                if (isRefreshSuccess) {
                    res.send('Token đã được làm mới thành công!');
                    return;
                }
            }

            // Nếu không có token hoặc refresh thất bại, redirect sang xác thực mới
            const authUrl: string = this.googleAuthProvider.getAuthUrl(domain);
            res.redirect(authUrl);
        } catch (error) {
            this.logger.error(`Lỗi khi xác thực cho domain: ${domain}: ${error.message}`);
            res.status(500).send('Có lỗi xảy ra: ' + error.message);
        }
    }
} 

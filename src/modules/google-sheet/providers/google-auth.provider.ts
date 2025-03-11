import { Inject, Injectable, Logger } from "@nestjs/common";
import { OAuth2Client, Credentials, TokenInfo } from 'google-auth-library';
import { UsersService } from "../../database/users/users.service";
import { GoogleTokenDto } from "../../database/users/dto/google-token.dto";

/**
 * Data Transfer Object cho cấu hình OAuth2.
 */
export interface GoogleOAuth2ConfigDto {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

/**
 * Nhà cung cấp xác thực Google qua OAuth2.
 */ 
@Injectable()
export class GoogleAuthProvider {
    private oauth2Client: OAuth2Client;
    private readonly logger: Logger = new Logger(GoogleAuthProvider.name);

    constructor(
        @Inject('GOOGLE_OAUTH2_CONFIG')
        private readonly googleOAuth2Config: GoogleOAuth2ConfigDto,
        private readonly usersService: UsersService
    ) {
        this.oauth2Client = new OAuth2Client(
            googleOAuth2Config.clientId,
            googleOAuth2Config.clientSecret,
            googleOAuth2Config.redirectUri
        );
    }

    public getAuthUrl(domain: string): string {
        const scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ];
        
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            state: domain
        });
    }

    public async handleCallback(code: string, state: string): Promise<void> {
        this.logger.log(`Xử lý callback cho domain: ${state}`);
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);

            await this.usersService.updateTokens(state, {
                access_token: tokens.access_token,
                refresh_token: code,
                scope: tokens.scope,
                token_type: tokens.token_type,
                expiry_date: new Date(tokens.expiry_date)
            });
            this.logger.log(`Cập nhật token thành công cho domain: ${state}`);
        } catch (error) {
            this.logger.error(`Lỗi khi xử lý callback cho domain: ${state}: ${error.message}`);
            throw error;
        }
    }

    public async getClient(): Promise<OAuth2Client> {
        return this.oauth2Client;
    }

    public async verifyToken(token: GoogleTokenDto): Promise<boolean> {
        try {
            this.oauth2Client.setCredentials({
                access_token: token.access_token,
                refresh_token: token.refresh_token,
                expiry_date: new Date(token.expiry_date).getTime()
            });

            const tokenInfo = await this.oauth2Client.getTokenInfo(token.access_token);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async refreshToken(domain: string, token: GoogleTokenDto): Promise<boolean> {
        this.logger.log(`Đang làm mới token cho domain: ${domain}`);
        try {
            this.oauth2Client.setCredentials({
                refresh_token: token.refresh_token
            });

            const { credentials } = await this.oauth2Client.refreshAccessToken();
            
            await this.usersService.updateTokens(domain, {
                access_token: credentials.access_token,
                refresh_token: credentials.refresh_token || token.refresh_token,
                scope: credentials.scope,
                token_type: credentials.token_type,
                expiry_date: new Date(credentials.expiry_date)
            });

            this.logger.log(`Làm mới token thành công cho domain: ${domain}`);
            return true;
        } catch (error) {
            this.logger.error(`Lỗi khi làm mới token cho domain: ${domain}: ${error.message}`);
            return false;
        }
    }
}

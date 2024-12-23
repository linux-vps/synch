import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleSheetController } from './google-sheet.controller';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { GoogleSheetService } from './providers/google-sheet.service';
import { GoogleAuthProvider } from './providers/google-auth.provider';
import { GoogleSheetConnectorProvider } from './providers/google-sheet-connector.provider';
import GoogleSheetConnectorDto from './dtos/google-sheet-connector.dto';
import { GoogleSheetServiceFactory } from './providers/google-sheet.factory';
import { UsersModule } from '../database/users/users.module';

@Module({
  imports: [UsersModule, ConfigModule],
  controllers: [GoogleSheetController, GoogleAuthController],
  providers: [
    GoogleSheetServiceFactory,
    {
      provide: 'GOOGLE_OAUTH2_CONFIG',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        clientId: configService.get('googleOAuth2.clientId'),
        clientSecret: configService.get('googleOAuth2.clientSecret'),
        redirectUri: configService.get('googleOAuth2.redirectUri'),
      }),
    },
    GoogleAuthProvider,
    GoogleSheetConnectorProvider,
    {
      provide: 'GOOGLE_SHEET_CONNECTOR',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connectorDto = new GoogleSheetConnectorDto({
          type: "service_account",
          project_id: configService.get('googleCredentials.project_id'),
          private_key_id: configService.get('googleCredentials.private_key_id'),
          private_key: configService.get('googleCredentials.private_key'),
          client_email: configService.get('googleCredentials.client_email'),
          client_id: configService.get('googleCredentials.client_id'),
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: configService.get('googleCredentials.client_x509_cert_url'),
        });
        return connectorDto;
      },
    },
  ],
  exports: [GoogleSheetServiceFactory, GoogleAuthProvider],
})
export class GoogleSheetModule {}

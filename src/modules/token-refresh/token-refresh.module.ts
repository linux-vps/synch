import { Module } from '@nestjs/common';
import { TokenRefreshService } from './token-refresh.service';
import { UsersModule } from '../database/users/users.module';
import { BitrixModule } from '../bitrix/bitrix.module';
import { GoogleSheetModule } from '../google-sheet/google-sheet.module';

@Module({
  imports: [
    UsersModule,
    BitrixModule,
    GoogleSheetModule, // Import module chứa GoogleAuthProvider
  ],
  providers: [TokenRefreshService],
  exports: [TokenRefreshService],
})
export class TokenRefreshModule {} 
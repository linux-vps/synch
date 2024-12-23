import { Injectable } from '@nestjs/common';
// import { GoogleSheetServiceFactory } from './modules/google-sheet/providers/google-sheet.factory';
// import { GoogleAuthProvider } from './modules/google-sheet/providers/google-auth.provider';
// import { UsersService } from './modules/database/users/users.service';
// import { TokenRefreshService } from './modules/token-refresh/token-refresh.service';
// import { BitrixService } from './modules/bitrix/bitrix.service';

@Injectable()
export class AppService {
  constructor(

  ) {}

  getHello(): string {
    return 'Hello World!';
  }


}

import { Injectable, Scope } from '@nestjs/common';
import { GoogleSheetService } from './google-sheet.service';
import { GoogleSheetConfig } from '../interfaces/google-sheet-config.interface';
import { GoogleAuthProvider } from './google-auth.provider';
import { UsersService } from 'src/modules/database/users/users.service';

@Injectable({ scope: Scope.DEFAULT })
export class GoogleSheetServiceFactory {
  constructor(private readonly googleAuthProvider: GoogleAuthProvider) {}

  createService(config: GoogleSheetConfig, usersService: UsersService): GoogleSheetService {
    return new GoogleSheetService(config, this.googleAuthProvider, usersService );
  }
} 
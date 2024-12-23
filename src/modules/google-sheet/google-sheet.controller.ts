import { Controller, Get, Query, Res, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthProvider } from './providers/google-auth.provider';
import { GoogleSheetService } from './providers/google-sheet.service';
import { GoogleSheetServiceFactory } from './providers/google-sheet.factory';
import { GoogleSheetConfig } from './interfaces/google-sheet-config.interface';
import { UsersService } from '../database/users/users.service';
import { GoogleTokenDto } from '../database/users/dto/google-token.dto';

/**
 * Controller để xử lý xác thực Google OAuth2.
 */
@Controller('google-sheet')
export class GoogleSheetController {
    constructor(
        private readonly googleAuthProvider: GoogleAuthProvider,
        private readonly googleSheetServiceFactory: GoogleSheetServiceFactory,
        private readonly usersService: UsersService,
    ) {}

    @Post()
    async createSpreadsheet(
        @Body('domain') domain: string,
        @Body('title') title: string,
    ) {
        const userDomain = await this.usersService.findOne(domain);
        if (!userDomain) {
            throw new NotFoundException('Domain not found in database');
        }
        const googleToken: GoogleSheetConfig = {
            access_token: userDomain.token.google_token.access_token,
            refresh_token: userDomain.token.google_token.refresh_token,
            scope: userDomain.token.google_token.scope,
            token_type: userDomain.token.google_token.token_type,
            expiry_date: userDomain.token.google_token.expiry_date.getTime(),
        };
        const googleSheetService = this.googleSheetServiceFactory.createService(googleToken, this.usersService);
        return await googleSheetService.createSpreadsheet(title, domain);
    }
}

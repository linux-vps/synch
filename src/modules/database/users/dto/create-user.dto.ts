import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SubscriptionDto } from './subscription.dto';
import { BitrixTokenDto } from './bitrix-token.dto';
import { GoogleTokenDto } from './google-token.dto';
import { TokenDto } from './token.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsNotEmpty()
  subscription: {
    type: string;
    expiry: string;
  };

  @ValidateNested()
  @Type(() => TokenDto)
  @IsNotEmpty()
  token: TokenDto;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  spreadsheetIds?: string[];
}

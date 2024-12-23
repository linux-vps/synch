import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BitrixTokenDto } from './bitrix-token.dto';
import { GoogleTokenDto } from './google-token.dto';

export class TokenDto {
  @ValidateNested()
  @Type(() => BitrixTokenDto)
  @IsNotEmpty()
  bitrix_token: BitrixTokenDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => GoogleTokenDto)
  google_token?: GoogleTokenDto;
}
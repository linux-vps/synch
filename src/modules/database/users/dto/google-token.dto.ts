import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class GoogleTokenDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsString()
  @IsNotEmpty()
  scope: string;

  @IsString()
  @IsNotEmpty()
  token_type: string;

  @IsDateString()
  @IsNotEmpty()
  expiry_date: Date;
}
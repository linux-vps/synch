import { IsNotEmpty, IsString } from 'class-validator';

export class BitrixTokenDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
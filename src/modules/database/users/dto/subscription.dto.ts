import { IsEnum, IsNotEmpty, IsDateString } from 'class-validator';

export class SubscriptionDto {
  @IsEnum(['trial', 'standard'])
  @IsNotEmpty()
  type: 'trial' | 'standard';

  @IsDateString()
  @IsNotEmpty()
  expiry: string;
}
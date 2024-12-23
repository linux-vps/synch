import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindBySpreadsheetDto {
  @ApiProperty({
    description: 'ID của Google Spreadsheet',
    example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
  })
  @IsNotEmpty()
  @IsString()
  spreadsheetId: string;
}

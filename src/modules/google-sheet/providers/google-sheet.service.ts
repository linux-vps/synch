import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleSheetConfig } from '../interfaces/google-sheet-config.interface';
import { GoogleAuthProvider } from './google-auth.provider';
import { UsersService } from 'src/modules/database/users/users.service';
import { 
  SheetType,
  SpreadsheetResponse,
  FormatRequest
} from '../interfaces/sheet-config.interface';
import { 
  SHEET_CONFIGS,
  DEFAULT_GRID_PROPERTIES
} from '../constants/sheet.constants';

@Injectable()
export class GoogleSheetService {
  private readonly logger = new Logger(GoogleSheetService.name);

  constructor(
    private readonly config: GoogleSheetConfig,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly usersService: UsersService,
  ) {}

  private async getClient() {
    const oAuth2Client = await this.googleAuthProvider.getClient();
    oAuth2Client.setCredentials(this.config);
    return oAuth2Client;
  }

  /**
   * Tạo mới spreadsheet với các sheet mặc định
   * @param title - Tiêu đề của spreadsheet
   * @param domain - Domain của người dùng
   * @returns Promise<string> - ID của spreadsheet
   * @throws Error nếu có lỗi xảy ra
   */
  async createSpreadsheet(title: string, domain: string): Promise<string> {
    this.logger.log(`Bắt đầu tạo spreadsheet với tiêu đề: ${title} cho domain: ${domain}`);

    const auth = await this.getClient();
    const sheets = google.sheets({ version: 'v4', auth });

    try {
      // 1. Tạo spreadsheet với các sheet
      const response = await sheets.spreadsheets.create({
        requestBody: {
          properties: { title },
          sheets: SHEET_CONFIGS.map(config => ({
            properties: {
              title: config.title,
              gridProperties: DEFAULT_GRID_PROPERTIES,
            },
          })),
        },
      });

      const spreadsheetId = response.data.spreadsheetId;
      const sheetIds = response.data.sheets.map(sheet => sheet.properties.sheetId);
      this.logger.log(`Tạo spreadsheet thành công, ID: ${spreadsheetId}`);

      // 2. Thêm tiêu đề cho từng sheet
      await Promise.all(
        SHEET_CONFIGS.map(config =>
          sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${config.title}!A1:${this.getColumnLetter(config.headers.length)}1`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [[...config.headers]],
            },
          }),
        ),
      );
      this.logger.log('Thêm tiêu đề cho các sheet thành công');

      // 3. Định dạng tiêu đề
      const formatRequests: ReadonlyArray<FormatRequest> = SHEET_CONFIGS.map((config, index) => [
        {
          repeatCell: {
            range: {
              sheetId: sheetIds[index],
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: config.headers.length,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                textFormat: { bold: true },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        },
        {
          updateSheetProperties: {
            properties: {
              sheetId: sheetIds[index],
              gridProperties: { frozenRowCount: 1 },
            },
            fields: 'gridProperties.frozenRowCount',
          },
        },
      ]).flat();

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [...formatRequests],
        },
      });
      this.logger.log('Định dạng tiêu đề cho các sheet thành công');

      // 4. Thêm spreadsheetId vào danh sách người dùng
      await this.usersService.addSpreadsheetId(domain, spreadsheetId);
      this.logger.log(`Đã thêm spreadsheetId vào người dùng ${domain}`);

      return spreadsheetId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Lỗi khi tạo spreadsheet: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Chuyển đổi số cột thành chữ cái (1 -> A, 2 -> B, etc.)
   * @param column - Số thứ tự cột (bắt đầu từ 1)
   * @returns string - Ký tự cột tương ứng
   */
  private getColumnLetter(column: number): string {
    let temp: number;
    let letter = '';
    while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = Math.floor((column - temp - 1) / 26);
    }
    return letter;
  }
}

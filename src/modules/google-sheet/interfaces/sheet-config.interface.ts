export enum SheetType {
  CONTACT = 'CONTACT',
  REQUISITE = 'REQUISITE',
  LOG = 'LOG'
}

export interface GridProperties {
  readonly rowCount: number;
  readonly columnCount: number;
}

export interface SheetConfig {
  readonly title: SheetType;
  readonly headers: readonly string[];
}

export interface SpreadsheetResponse {
  readonly spreadsheetId: string;
  readonly sheets: ReadonlyArray<{
    readonly properties: {
      readonly sheetId: number;
    };
  }>;
}

export interface FormatRequest {
  readonly repeatCell?: {
    readonly range: {
      readonly sheetId: number;
      readonly startRowIndex: number;
      readonly endRowIndex: number;
      readonly startColumnIndex: number;
      readonly endColumnIndex: number;
    };
    readonly cell: {
      readonly userEnteredFormat: {
        readonly backgroundColor: {
          readonly red: number;
          readonly green: number;
          readonly blue: number;
        };
        readonly textFormat: {
          readonly bold: boolean;
        };
      };
    };
    readonly fields: string;
  };
  readonly updateSheetProperties?: {
    readonly properties: {
      readonly sheetId: number;
      readonly gridProperties: {
        readonly frozenRowCount: number;
      };
    };
    readonly fields: string;
  };
}

import { TimeResult } from "./time-result.interface";

export interface CompanyList {
  order?: Record<string, any>;
  filter?: Record<string, any>;
  select?: string[];
}

export interface CompanyUpdate {
  id: string | number;
  fields?: Record<string, any>;
  params?: {
    REGISTER_SONET_EVENT: "Y" | "N";
  };
}

export interface CompanyAdd {
  fields?: Record<string, any>;
  params?: {
    REGISTER_SONET_EVENT: "Y" | "N";
  };
}

export interface CompanyGetResponse {
  result: Record<string, any>;
  time: TimeResult;
}

export interface CompanyListResponse {
  result: Record<string, any>[];
  total: number;
  next: number;
  time: TimeResult;
}

export interface CompanyAddResponse {
  result: string;
  time: TimeResult;
}

export interface CompanyUpdateResponse {
  result: boolean;
  time: TimeResult;
}

export interface CompanyDeleteResponse {
  result: boolean;
  time: TimeResult;
}

export interface CompanyFieldsResponse {
  result: {
    [key: string]: {
      type: string;
      isRequired: boolean;
      isReadOnly: boolean;
      isImmutable: boolean;
      isMultiple: boolean;
      isDynamic: boolean;
      title: string;
      statusType?: string;
    };
  };
  time: TimeResult;
}

import { TimeResult } from "./time-result.interface";

export interface ContactList {
  order?: Record<string, any>;
  filter?: Record<string, any>;
  select?: string[];
}

export interface ContactUpdate {
  id: string | number;
  fields?: Record<string, any>;
  params?: {
    REGISTER_SONET_EVENT: "Y" | "N";
  };
}

export interface ContactAdd {
  fields?: Record<string, any>;
  params?: {
    REGISTER_SONET_EVENT: "Y" | "N";
  };
}

export interface ContactGetResponse {
  result: Record<string, any>;
  time: TimeResult;
}

export interface ContactListResponse {
  result: Record<string, any>[];
  total: number;
  next: number;
  time: TimeResult;
}

export interface ContactAddResponse {
  result: string;
  time: TimeResult;
}

export interface ContactUpdateResponse {
  result: boolean;
  time: TimeResult;
}

export interface ContactDeleteResponse {
  result: boolean;
  time: TimeResult;
}

export interface ContactFieldsResponse {
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

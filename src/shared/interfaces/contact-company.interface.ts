import { TimeResult } from "./time-result.interface";

type BooleanChar = "Y" | "N";

interface CompanyItem {
  CONTACT_ID: string | number;
  SORT: number;
  IS_PRIMARY: BooleanChar;
}

export interface AddCompanyToContact {
  id: string | number;
  fields: CompanyItem;
}

export interface RemoveCompanyFromContact {
  id: string | number;
  fields: {
    CONTACT_ID: string | number;
  };
}

export interface ContactCompanyFields {
  result: CompanyItem;
  time: TimeResult;
}

export interface ContactCompanyItems {
  result: CompanyItem[];
  time: TimeResult;
}

export interface ContactCompanySet {
  id: string | number;
  items: CompanyItem[];
}

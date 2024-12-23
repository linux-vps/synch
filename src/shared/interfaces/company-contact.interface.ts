import { TimeResult } from "./time-result.interface";

type BooleanChar = "Y" | "N";

interface ContactItem {
  CONTACT_ID: string | number;
  SORT: number;
  IS_PRIMARY: BooleanChar;
}

export interface AddContactToCompany {
  id: string | number;
  fields: ContactItem;
}

export interface RemoveContactFromCompany {
  id: string | number;
  fields: {
    CONTACT_ID: string | number;
  };
}

export interface CompanyContactFields {
  result: ContactItem;
  time: TimeResult;
}

export interface CompanyContactItems {
  result: ContactItem[];
  time: TimeResult;
}

export interface CompanyContactSet {
  id: string | number;
  items: ContactItem[];
}

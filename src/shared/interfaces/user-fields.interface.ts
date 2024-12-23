export interface UserFieldList {
  order: Record<string, any>;
  filter: Record<string, any>;
  START: number;
}

export interface UserFieldAdd {
  fields: Record<string, any>;
  LIST?: {};
}

export interface UserFieldUpdate {
  id: string | number;
  fields: Record<string, any>;
  LIST?: {};
}

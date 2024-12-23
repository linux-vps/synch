export interface CRMListOptions {
  order?: Record<string, any>;
  filter?: Record<string, any>;
  select?: string[];
}

export interface CRMUpdate {
  id: string | number;
  fields?: Record<string, any>;
}

export interface CRMAdd {
  fields?: Record<string, any>;
  params?: {
    REGISTER_SONET_EVENT: 'Y' | 'N';
  };
}

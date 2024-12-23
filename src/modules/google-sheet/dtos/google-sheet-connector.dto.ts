import { IsString } from 'class-validator';

export default class GoogleSheetConnectorDto {
  @IsString()
  readonly type: string;

  @IsString()
  readonly project_id: string;

  @IsString()
  readonly private_key_id: string;

  @IsString()
  readonly private_key: string;

  @IsString()
  readonly client_email: string;

  @IsString()
  readonly client_id: string;

  @IsString()
  readonly auth_uri: string;

  @IsString()
  readonly token_uri: string;

  @IsString()
  readonly auth_provider_x509_cert_url: string;
  
  @IsString()
  readonly client_x509_cert_url: string;
  
  constructor(data: Partial<GoogleSheetConnectorDto>) {
    Object.assign(this, data);
  }
  
}

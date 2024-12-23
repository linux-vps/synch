import { registerAs } from '@nestjs/config';

export const googleCredentialsConfig = registerAs('googleCredentials', () => ({
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
}));

export const googleOAuth2Config = registerAs('googleOAuth2', () => ({
  clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_OAUTH2_REDIRECT_URI,
})); 

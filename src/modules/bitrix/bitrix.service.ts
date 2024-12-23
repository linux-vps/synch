import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

/**
 * Cấu hình OAuth cho BitrixService.
 */
export interface OAuthConfig {
  domain: string;
  clientId?: string;
  clientSecret?: string;
  refresh_token: string;
  access_token?: string;
}

/**
 * Cấu hình Webhook cho BitrixService.
 */
export interface WebhookConfig {
  webhookUrl: string;
}

/**
 * Cấu hình tổng thể cho BitrixService.
 */
export interface BitrixConfig {
  oauth?: OAuthConfig;
  webhook?: WebhookConfig;
}

/**
 * Dịch vụ Bitrix để gọi API Bitrix24.
 */
@Injectable()
export class BitrixService {
  private readonly oauthConfig?: OAuthConfig;
  private readonly webhookUrl?: string;
  private readonly axiosInstance: AxiosInstance;
  private readonly logger: Logger = new Logger(BitrixService.name);

  constructor(private readonly config: BitrixConfig, private readonly fixedConfig: FixedBitrixConfig) {
    const { clientId, clientSecret } = fixedConfig;

    if (config.oauth) {
      const { domain, refresh_token } = config.oauth;

      if (!domain || !refresh_token) {
        throw new Error('Invalid OAuth data');
      }

      this.oauthConfig = {
        ...config.oauth,
        clientId,
        clientSecret,
      };

      this.axiosInstance = axios.create({
        baseURL: `https://${domain}/rest/`,
      });
    }

    if (config.webhook) {
      this.webhookUrl = config.webhook.webhookUrl;
      this.axiosInstance = axios.create({ baseURL: this.webhookUrl });
    }

    if (!config.oauth && !config.webhook) {
      throw new Error('Either OAuth or webhook configuration is required');
    }
  }

  /**
   * Làm mới token OAuth.
   * @returns Access token mới.
   * @throws Lỗi nếu không thể làm mới token.
   */
  async refreshToken(): Promise<any> {
    if (!this.oauthConfig) {
      throw new Error('OAuth configuration is missing');
    }

    const { clientId, clientSecret, refresh_token } = this.oauthConfig;

    try {
      this.logger.log(`Đang làm mới token cho domain: ${this.oauthConfig.domain}`);
      const response = await axios.get('https://oauth.bitrix.info/oauth/token/', {
        params: {
          grant_type: 'refresh_token',
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token,
        },
      });

      this.oauthConfig.access_token = response.data.access_token;
      this.oauthConfig.refresh_token = response.data.refresh_token || refresh_token;
      this.logger.log(`Làm mới token thành công cho domain: ${this.oauthConfig.domain}`);

      return this.oauthConfig;
    } catch (error: any) {
      const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      this.logger.error(`Không thể làm mới token: ${errorMessage}`);
      throw new Error(`Không thể làm mới token: ${errorMessage}`);
    }
  }

  /**
   * Gọi API Bitrix24.
   * @param method Tên phương thức API.
   * @param params Tham số gọi API.
   * @returns Kết quả từ Bitrix24.
   */
  public async call(method: string, params?: any): Promise<any> {
    try {
      this.logger.log(`Gọi API method: ${method}`);
      if (this.webhookUrl) {
        const response = await this.axiosInstance.post(method, { ...params });
        return response.data;
      }

      if (!this.oauthConfig?.access_token) {
        await this.refreshToken();
      }

      const response = await this.axiosInstance.post(
        method,
        { ...params },
        { params: { auth: this.oauthConfig?.access_token } },
      );
      this.logger.log(`Gọi API method: ${method} thành công`);
      return response.data;
    } catch (error) {
      this.logger.warn(`Lỗi khi gọi API method: ${method}, đang thử làm mới token`);
      await this.refreshToken();
      try {
        const response = await this.axiosInstance.post(
          method,
          { ...params },
          { params: { auth: this.oauthConfig?.access_token } },
        );
        this.logger.log(`Gọi API method: ${method} thành công sau khi làm mới token`);
        return response.data;
      } catch (err) {
        this.logger.error(`Lỗi khi gọi API method: ${method} sau khi làm mới token: ${err.message}`);
        throw err;
      }
    }
  }
}

/**
 * Cấu hình cố định cho `BitrixService`.
 */
export interface FixedBitrixConfig {
  clientId: string;
  clientSecret: string;
}

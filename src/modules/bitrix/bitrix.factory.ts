import { Injectable, Scope } from '@nestjs/common';
import { BitrixService, BitrixConfig, FixedBitrixConfig } from './bitrix.service';

/**
 * Factory để tạo các instance của BitrixService dựa trên cấu hình khách hàng.
 */
@Injectable({ scope: Scope.DEFAULT })
export class BitrixServiceFactory {
  private readonly fixedConfig: FixedBitrixConfig = {
    clientId: 'local.67491c437fec37.85102546', 
    clientSecret: 'KZkai60Jj6V2CZsbudADsO0i7RmLAbOPEW3Rak27u1FCKPWMiN', 
  };

  /**
   * Tạo một instance BitrixService với cấu hình khách hàng.
   * @param config Cấu hình khách hàng.
   * @returns Instance của BitrixService.
   */
  createService(config: BitrixConfig): BitrixService {
    return new BitrixService(config, this.fixedConfig);
  }
} 
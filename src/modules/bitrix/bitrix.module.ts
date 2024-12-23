import { Module, DynamicModule, Global } from '@nestjs/common';
import { BitrixServiceFactory } from './bitrix.factory';
import { CrmModule } from './crm/crm.module';

@Global()
@Module({
  providers: [BitrixServiceFactory],
  exports: [BitrixServiceFactory],
  imports: [CrmModule],
})
export class BitrixModule {}
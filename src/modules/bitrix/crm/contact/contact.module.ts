import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactCompanyService } from './contact-company.service';
import { ContactUserFiledsService } from './contact-user-fields.service';
import { BitrixServiceFactory } from '../../bitrix.factory';

@Module({
  providers: [ContactService, ContactCompanyService, ContactUserFiledsService, BitrixServiceFactory],
  exports: [ContactService, ContactCompanyService, ContactUserFiledsService]
})
export class ContactModule {}

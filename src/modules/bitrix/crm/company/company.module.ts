import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyUserFieldsService } from './company-user-fields.service';
import { CompanyContactService } from './company-contact.service';

@Module({
  providers: [CompanyService, CompanyUserFieldsService, CompanyContactService]
})
export class CompanyModule {}

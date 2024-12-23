import { Module } from '@nestjs/common';
import { ContactModule } from './contact/contact.module';
import { CompanyModule } from './company/company.module';
import { TestController } from './contact/test.controller';
import { UsersService } from 'src/modules/database/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/database/users/entities/user.entity';

@Module({
  imports: [ContactModule, CompanyModule, TypeOrmModule.forFeature([User])],
  controllers: [TestController],
  providers: [UsersService]
})
export class CrmModule {}
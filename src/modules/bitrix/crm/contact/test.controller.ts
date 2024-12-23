import { Controller, Get, Param, Body, Post, Delete, Put } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactAdd, ContactAddResponse, ContactDeleteResponse, ContactGetResponse, ContactUpdate, ContactUpdateResponse } from '../../../../shared/interfaces/contact.interface';
import { BitrixConfig } from '../../bitrix.service';
import { UsersService } from '../../../database/users/users.service';

/**
 * Controller để test ContactService với cấu hình từ cơ sở dữ liệu.
 */
@Controller('test')
export class TestController {
  constructor(
    private readonly contactService: ContactService,
    private readonly usersService: UsersService,
  ) {}

  @Post('contact/add/:domain')
  async addContact(
    @Param('domain') domain: string,
    @Body() createContactDto: { fields: ContactAdd['fields']; params?: ContactAdd['params'] },
  ): Promise<ContactAddResponse> {
    const user = await this.usersService.findOne(domain);
    const config: BitrixConfig = {
      oauth: {
        domain: user.domain,
        access_token: user.token.bitrix_token.access_token,
        refresh_token: user.token.bitrix_token.refresh_token,
      },
    };
    const { fields, params } = createContactDto;
    return this.contactService.add({ fields, params }, config);
  }

  @Post('contact/:id/:domain')
  async getContact(
    @Param('id') id: string | number,
    @Param('domain') domain: string,
  ): Promise<ContactGetResponse> {
    const user = await this.usersService.findOne(domain);
    const config: BitrixConfig = {
      oauth: {
        domain: user.domain,
        access_token: user.token.bitrix_token.access_token,
        refresh_token: user.token.bitrix_token.refresh_token,
      },
    };
    return this.contactService.get(id, config);
  }

  @Put('contact/update/:id/:domain')
  async updateContact(
    @Param('id') id: string | number,
    @Param('domain') domain: string,
    @Body('fields') fields: ContactUpdate['fields'],
  ): Promise<ContactUpdateResponse> {
    const user = await this.usersService.findOne(domain);
    const config: BitrixConfig = {
      oauth: {
        domain: user.domain,
        access_token: user.token.bitrix_token.access_token,
        refresh_token: user.token.bitrix_token.refresh_token,
      },
    };
    return this.contactService.update({ id, fields }, config);
  }

  @Delete('contact/delete/:id/:domain')
  async deleteContact(
    @Param('id') id: string | number,
    @Param('domain') domain: string,
  ): Promise<ContactDeleteResponse> {
    const user = await this.usersService.findOne(domain);
    const config: BitrixConfig = {
      oauth: {
        domain: user.domain,
        access_token: user.token.bitrix_token.access_token,
        refresh_token: user.token.bitrix_token.refresh_token,
      },
    };
    return this.contactService.delete(id, config);
  }
}
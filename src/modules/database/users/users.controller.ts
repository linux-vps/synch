import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GoogleTokenDto } from './dto/google-token.dto';
import { BitrixTokenDto } from './dto/bitrix-token.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Patch('tokens')
  @ApiOperation({ summary: 'Cập nhật tokens của người dùng' })
  updateTokens(
    @Body('domain') domain: string,
    @Body('google_token') googleTokenDto?: GoogleTokenDto,
    @Body('bitrix_token') bitrixTokenDto?: BitrixTokenDto,
  ): Promise<User> {
    return this.usersService.updateTokens(domain, googleTokenDto, bitrixTokenDto);
  }

  @Get(':domain')
  @ApiOperation({ summary: 'Lấy thông tin một người dùng theo domain' })
  findOne(@Param('domain') domain: string): Promise<User> {
    return this.usersService.findOne(domain);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới người dùng' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':domain')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  update(
    @Param('domain') domain: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(domain, updateUserDto);
  }


  // Tìm người dùng theo Spreadsheet ID
  @Get('spreadsheet/:spreadsheetId')
  @ApiOperation({ summary: 'Tìm người dùng theo Spreadsheet ID' })
  findBySpreadsheetId(
    @Param('spreadsheetId') spreadsheetId: string
  ): Promise<User> {
    return this.usersService.findBySpreadsheetId(spreadsheetId);
  }

  // Xóa spreadsheetId
  @Delete(":domain/:spreadsheetId")
  async removeSpreadsheetId(
    @Param() param: { domain: string, spreadsheetId: string },
  ): Promise<User> {
    console.log(param);
    if (param.domain && param.spreadsheetId)
      return this.usersService.removeSpreadsheetId(param.domain, param.spreadsheetId); 
    else
      console.log("domain or spreadsheetId is null");
  }

  @Delete(':domain')
  @ApiOperation({ summary: 'Xóa người dùng' })
  remove(@Param('domain') domain: string ): Promise<void> {
    return this.usersService.remove(domain);
  }




  // // Thêm spreadsheetId vào domain cho người dùng
  // @Put(':domain/spreadsheets/:spreadsheetId')
  // async addSpreadsheetId(
  //   @Param('domain') domain: string,
  //   @Param('spreadsheetId') spreadsheetId: string,
  // ): Promise<User> {
  //   return this.usersService.addSpreadsheetId(domain, spreadsheetId);
  // }


}

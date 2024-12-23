import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GoogleTokenDto } from './dto/google-token.dto';
import { BitrixTokenDto } from './dto/bitrix-token.dto';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    this.logger.log('Lấy danh sách tất cả người dùng');
    return this.userRepository.find();
  }

  async findOne(domain: string): Promise<User> {
    this.logger.log(`Tìm người dùng với domain: ${domain}`);
    if (!domain) {
      throw new BadRequestException('Domain không được để trống');
    }

    const user = await this.userRepository.findOne({ where: { domain } });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với domain ${domain}`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Tạo người dùng mới với domain: ${createUserDto.domain}`);
    const missingFields: string[] = [];

    if (!createUserDto.domain) missingFields.push('domain');
    if (!createUserDto.subscription) missingFields.push('subscription');
    if (!createUserDto.token?.bitrix_token) missingFields.push('token.bitrix_token');

    if (missingFields.length > 0) {
      throw new BadRequestException(`Thiếu các trường bắt buộc: ${missingFields.join(', ')}`);
    }

    // Kiểm tra domain đã tồn tại
    const existingUser = await this.userRepository.findOne({
      where: { domain: createUserDto.domain }
    });
    
    if (existingUser) {
      throw new BadRequestException(`Domain ${createUserDto.domain} đã tồn tại`);
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(domain: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Cập nhật người dùng với domain: ${domain}`);
    if (!domain) {
      throw new BadRequestException('Domain không được để trống');
    }

    const user = await this.findOne(domain);

    // Kiểm tra nếu cập nhật subscription
    if (updateUserDto.subscription) {
      if (!updateUserDto.subscription.type || !updateUserDto.subscription.expiry) {
        throw new BadRequestException('Subscription cần có đầy đủ type và expiry');
      }
    }

    // Kiểm tra nếu cập nhật token
    if (updateUserDto.token?.bitrix_token) {
      if (!updateUserDto.token.bitrix_token.access_token || 
          !updateUserDto.token.bitrix_token.refresh_token) {
        throw new BadRequestException('Bitrix token cần có đầy đủ access_token và refresh_token');
      }
    }

    if (updateUserDto.token?.google_token) {
      const { access_token, refresh_token, scope, token_type, expiry_date } = updateUserDto.token.google_token;
      if (!access_token || !refresh_token || !scope || !token_type || !expiry_date) {
        throw new BadRequestException('Google token cần có đầy đủ access_token, refresh_token, scope, token_type và expiry_date');
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }
  /**
   * Update tokens for a user.
   * @param domain - The domain of the user.
   * @param googleTokenDto - The Google token data transfer object.
   * @param bitrixTokenDto - The Bitrix token data transfer object.
   * @returns The updated user.
   */
  async updateTokens(domain: string, googleTokenDto?: GoogleTokenDto, bitrixTokenDto?: BitrixTokenDto): Promise<User> {
    if (!domain) {
      throw new BadRequestException('Domain không được để trống');
    }

    const user = await this.findOne(domain);

    if (googleTokenDto) {
      const { access_token, refresh_token, scope, token_type, expiry_date } = googleTokenDto;
      if (!access_token || !refresh_token ||  !expiry_date) {
        throw new BadRequestException('Google token cần có đầy đủ access_token, refresh_token, scope, token_type và expiry_date');
      }
      user.token.google_token = googleTokenDto;
      return this.userRepository.save(user);
    }

    if (bitrixTokenDto) {
      const { access_token, refresh_token } = bitrixTokenDto;
      if (!access_token || !refresh_token) {
        throw new BadRequestException('Bitrix token cần có đầy đủ access_token và refresh_token');
      }
      user.token.bitrix_token = bitrixTokenDto;
      return this.userRepository.save(user);
    }

    return this.userRepository.save(user);
  }

  async remove(domain: string): Promise<void> {
    if (!domain) {
      throw new BadRequestException('Domain không được để trống');
    }

    const user = await this.findOne(domain);
    await this.userRepository.remove(user);
  }


// Thêm spreadsheetId vào danh sách
async addSpreadsheetId(domain: string, spreadsheetId: string): Promise<User> {
  const user = await this.findOne(domain);
  if (!user.spreadsheetIds) {
    user.spreadsheetIds = [];
  }
  if (!user.spreadsheetIds.includes(spreadsheetId)) {
    user.spreadsheetIds.push(spreadsheetId);
    return this.userRepository.save(user);
  }
  return user;
}

// Xóa spreadsheetId khỏi danh sách
async removeSpreadsheetId(domain: string, spreadsheetId: string): Promise<User> {
  const user = await this.findOne(domain);
  // Nếu user đã có danh sách spreadsheetId,
  // thì lọc ra những id khác với spreadsheetId cần xóa
  if (user.spreadsheetIds) {
    user.spreadsheetIds = user.spreadsheetIds.filter(id => id !== spreadsheetId);
    // rồi lưu lại thay đổi
    return this.userRepository.save(user);
  }
  // nếu user chưa có danh sách spreadsheetId, thì trả về user hiện tại
  return user;
}
async findBySpreadsheetId(spreadsheetId: string): Promise<User> {
  const users = await this.userRepository.find();

  for (const user of users) {
    if (user.spreadsheetIds?.includes(spreadsheetId)) {
      return user;
    }
  }

  throw new NotFoundException(`User with spreadsheet ${spreadsheetId} not found`);
}
}
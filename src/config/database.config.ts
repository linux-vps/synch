import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/database/users/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.DATABASE_URL || 'mongodb://localhost:27017/synchdb',
  synchronize: true,
  entities: [User],
  useUnifiedTopology: true,
  useNewUrlParser: true,
  // ssl: process.env.DATABASE_SSL === 'true', // Nếu cần SSL
};

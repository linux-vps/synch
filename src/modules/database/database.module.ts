import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UsersModule } from './users/users.module';

@Module({
  providers: [DatabaseService],
  imports: [UsersModule]
})
export class DatabaseModule {}

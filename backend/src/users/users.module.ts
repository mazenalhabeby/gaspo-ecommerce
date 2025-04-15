import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService, RedisService } from '@/common';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, RedisService],
})
export class UsersModule {}

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@Prisma/client';

export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from 'src/common';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    PrismaService,
    {
      provide: 'S3_CLIENT',
      useFactory: () =>
        new S3Client({
          region: process.env.AWS_REGION!,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY!,
            secretAccessKey: process.env.AWS_SECRET_KEY!,
          },
        }),
    },
  ],
})
export class CategoriesModule {}

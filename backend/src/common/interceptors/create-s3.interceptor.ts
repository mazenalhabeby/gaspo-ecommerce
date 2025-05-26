// src/common/interceptors/create-s3-interceptor.ts
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { s3 } from '../configs/s3.config';
import { Request } from 'express';

type FieldConfig = { name: string; maxCount: number };

export function createS3Interceptor(folder: string, fields: FieldConfig[]) {
  return FileFieldsInterceptor(fields, {
    storage: multerS3({
      s3,
      bucket: process.env.S3_BUCKET!,
      key: (req: Request, file, cb) => {
        const filename = `${folder}/${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      const allowed = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
      ];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Unsupported file type'), false);
      }
    },
  });
}

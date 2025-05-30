import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { s3 } from '../configs/s3.config';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import * as path from 'path';

type FieldConfig = { name: string; maxCount: number };

export function S3Interceptor(folder: string, fields: FieldConfig[]) {
  return FileFieldsInterceptor(fields, {
    storage: multerS3({
      s3,
      bucket: process.env.S3_BUCKET!,
      key: (req: Request, file, cb) => {
        // 1. Extract category name from body or fallback
        const body = req.body as Record<string, any> | undefined;
        const rawName =
          (body?.name as string | undefined)?.toLowerCase() ?? 'image';

        // 2. Sanitize it to safe filename
        const safeName = rawName
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/gi, '');

        // 3. Get file extension
        const ext = path.extname(file.originalname); // e.g., .jpg

        // 4. Create unique filename
        const filename = `${folder}/${safeName}-${randomUUID()}${ext}`;

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

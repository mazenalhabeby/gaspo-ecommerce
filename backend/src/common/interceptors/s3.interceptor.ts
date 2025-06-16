import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { S3Client } from '@aws-sdk/client-s3';

type FieldConfig = { name: string; maxCount: number };
type Options = {
  useSlugFolder?: boolean; // whether to create nested folders by slug
  fallbackNameField?: string; // optional body field to fallback as file name (e.g., 'name')
};

interface UploadRequest extends Request {
  __uploadUuid?: string;
}

export function S3Interceptor(
  baseFolder: string,
  fields: FieldConfig[],
  options?: Options,
) {
  return FileFieldsInterceptor(fields, {
    storage: multerS3({
      s3: new S3Client({
        region: process.env.AWS_REGION!,
        endpoint: process.env.AWS_ENDPOINT,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY!,
          secretAccessKey: process.env.AWS_SECRET_KEY!,
        },
        forcePathStyle: true,
      }),

      bucket: process.env.S3_BUCKET!,
      key: (req: Request, file, cb) => {
        const uploadReq = req as UploadRequest;

        const body = req.body as Record<string, any> | undefined;

        // 1. Try to get a slug or fallback name from body
        const slugOrName = options?.useSlugFolder
          ? ((body?.slug as string | undefined) ?? 'unknown')
          : ((body?.[options?.fallbackNameField || 'name'] as
              | string
              | undefined) ?? 'image');

        const safeName = slugOrName
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/gi, '');

        const ext = path.extname(file.originalname);

        if (!uploadReq.__uploadUuid) {
          uploadReq.__uploadUuid = randomUUID();
        }

        const folderName = `${safeName}-${uploadReq.__uploadUuid}`;
        const imageUuid = randomUUID();

        // 2. Determine final path (flat or nested)
        const fullPath = options?.useSlugFolder
          ? `${baseFolder}/${folderName}/image-${imageUuid}${ext}`
          : `${baseFolder}/${folderName}${ext}`;

        cb(null, fullPath);
      },
    }),

    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max
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

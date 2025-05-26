// src/common/interceptors/local-upload.interceptor.ts
import { diskStorage } from 'multer';

export function localUploadInterceptor(folder: string) {
  return {
    storage: diskStorage({
      destination: `./uploads/${folder}`,
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  };
}

import { ProductStatus } from '@prisma/client';

export interface FindAllParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  status?: ProductStatus;
}

import { IsOptional, IsString } from 'class-validator';
import { Category } from '@Prisma/client';

type CategoryCreateTableField = Pick<
  Category,
  'name' | 'slug' | 'description' | 'parentId'
>;
export class CreateCategoryDto implements CategoryCreateTableField {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  parentId: string | null;
}

import { IsArray, IsString } from 'class-validator';

export class DeleteCategoriesDto {
  @IsArray()
  @IsString({ each: true })
  slugs: string[];
}

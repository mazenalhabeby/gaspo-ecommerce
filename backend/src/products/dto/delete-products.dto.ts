import { IsArray, IsString } from 'class-validator';

export class DeleteProductsDto {
  @IsArray()
  @IsString({ each: true })
  slugs: string[];
}

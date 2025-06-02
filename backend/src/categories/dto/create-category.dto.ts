import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class TranslationDto {
  @IsString()
  name: string;

  @IsString()
  language: string;

  @IsString()
  description: string;
}

export class CreateCategoryDto {
  @IsString()
  @IsOptional()
  parentId: string | null;

  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  @IsArray()
  translations: TranslationDto[];
}

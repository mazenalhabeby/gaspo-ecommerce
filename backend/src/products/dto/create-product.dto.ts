import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductImageDto {
  @IsString() url: string;
  @IsOptional() @IsString() altText?: string;
  @IsOptional() @IsInt() position?: number;
}

export class ProductTranslationDto {
  @IsString() language: string;
  @IsString() name: string;
  @IsString() description: string;
  @IsOptional() @IsArray() descriptionJson?: any[];
}

export class ProductVariantDto {
  @IsString() slug: string;
  @IsOptional() @IsString() sku?: string;
  @IsNumber() price: number;
  @IsInt() stock: number;
}

export class CreateProductDto {
  @IsString() name: string;
  @IsString() slug: string;
  @IsString() description: string;
  @IsString() imageUrl: string;
  @IsNumber() price: number;
  @IsInt() stock: number;
  @IsOptional() @IsString() sku?: string;
  @IsOptional() @IsObject() metadata?: Record<string, any>;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsArray() bundles?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  translations: ProductTranslationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];
}

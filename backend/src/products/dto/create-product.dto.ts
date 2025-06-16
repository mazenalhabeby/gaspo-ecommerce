import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { WeightUnit } from '@prisma/client';

export class PackageDto {
  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  length: number;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  breadth: number;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  width: number;

  @IsString()
  unit: string;
}

export class AttributeDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class ProductVariantTranslationDto {
  @IsString()
  language: string;

  @IsString()
  name: string;
}

export class VariantDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  sku: string;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  price: number;

  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  stock: number;

  @IsOptional()
  @Type(() => AttributeDto)
  attributes?: AttributeDto[];

  @IsOptional()
  @Type(() => ProductVariantTranslationDto)
  ProductTranslations?: ProductVariantTranslationDto[];

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class ProductTranslationDto {
  @IsString()
  language: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDesc?: string;

  @IsOptional()
  descriptionJson?: any;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDesc?: string;

  @IsString()
  categoryId: string;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  price?: number;

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  stock?: number;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  weight: number;

  @IsEnum(WeightUnit)
  weightUnit: WeightUnit;

  @IsOptional()
  @Type(() => AttributeDto)
  variantFields?: string[];

  @IsOptional()
  @Type(() => PackageDto)
  packages?: PackageDto[];

  @IsOptional()
  @Type(() => VariantDto)
  variants?: VariantDto[];

  @IsOptional()
  @Transform(({ value }) => {
    try {
      const parsed: unknown =
        typeof value === 'string' ? JSON.parse(value) : value;
      return Array.isArray(parsed) ? (parsed as ProductTranslationDto[]) : [];
    } catch {
      return [];
    }
  })
  @Type(() => ProductTranslationDto)
  ProductTranslations?: ProductTranslationDto[];

  @IsOptional()
  metadata?: string | Record<string, any>;

  @IsOptional()
  bundleMetadata?: string | Record<string, any>;
}

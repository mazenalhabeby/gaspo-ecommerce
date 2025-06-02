import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { WeightUnit } from '@Prisma/client';

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes?: AttributeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantTranslationDto)
  translations?: ProductVariantTranslationDto[];
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
  descriptionJson?: any; // Optional for rich-text editors
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

  @IsUUID()
  categoryId: string;

  @IsString()
  currency: string;

  @IsString()
  sku: string;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  price: number;

  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  stock: number;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  weight: number;

  @IsEnum(WeightUnit)
  weightUnit: WeightUnit;

  @IsArray()
  @IsString({ each: true })
  variantFields: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  packages?: PackageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants?: VariantDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  translations?: ProductTranslationDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsObject()
  bundleMetadata?: Record<string, any>;
}

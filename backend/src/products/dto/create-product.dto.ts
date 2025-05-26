import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { WeightUnit } from '@Prisma/client';

export class PackageDto {
  @Transform(({ value }: { value: string }) => parseFloat(value), {
    toClassOnly: true,
  })
  @IsNumber()
  length: number;

  @Transform(({ value }: { value: string }) => parseFloat(value), {
    toClassOnly: true,
  })
  @IsNumber()
  breadth: number;

  @Transform(({ value }: { value: string }) => parseFloat(value), {
    toClassOnly: true,
  })
  @IsNumber()
  width: number;

  @IsString()
  unit: string; // Use string or create an enum if you want
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

  @Transform(({ value }: { value: string }) => parseFloat(value), {
    toClassOnly: true,
  })
  @IsNumber()
  price: number;

  @Transform(({ value }: { value: string }) => parseInt(value, 10), {
    toClassOnly: true,
  })
  @IsNumber()
  stock: number;

  @IsOptional()
  attributes: Record<string, string>;
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

  @IsString()
  sku: string;

  @Transform(({ value }: { value: string }) => parseFloat(value), {
    toClassOnly: true,
  })
  @IsNumber()
  price: number;

  @Transform(({ value }: { value: string }) => parseInt(value, 10), {
    toClassOnly: true,
  })
  @IsNumber()
  stock: number;

  @Transform(({ value }: { value: string }) => parseFloat(value), {
    toClassOnly: true,
  })
  @IsNumber()
  weight: number;

  @IsEnum(WeightUnit)
  weightUnit: WeightUnit;

  @IsString({ each: true })
  variantFields: string[];

  @IsOptional()
  @Type(() => PackageDto)
  packages?: PackageDto[];

  @IsOptional()
  @Type(() => VariantDto)
  variants?: VariantDto[];
}

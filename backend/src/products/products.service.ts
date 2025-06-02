import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import slugify from 'slugify';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateProductDto,
    files: { images?: Express.Multer.File[] },
  ) {
    const imageFiles = files?.images || [];

    if (!imageFiles.length) {
      throw new BadRequestException('At least one product image is required.');
    }

    const imageData = imageFiles.map((file, index) => ({
      url: this.getFileUrl(file),
      position: index,
    }));

    // Parse complex fields from JSON (in case of multipart/form-data)
    const parsedPackages = this.safeJsonParseArray(dto.packages);
    const parsedVariantFields = this.safeJsonParseArray(dto.variantFields);
    const parsedVariants = this.safeJsonParseArray<{
      name: string;
      sku: string;
      price: number;
      stock: number;
      slug?: string;
      attributes?: Record<string, any>;
      translations?: { language: string; name: string }[];
    }>(dto.variants);
    const parsedTranslations = this.safeJsonParseArray(dto.translations);

    // Filter and sanitize variants
    const validVariants = parsedVariants
      .filter(
        (v) =>
          v.name &&
          v.sku &&
          typeof v.price !== 'undefined' &&
          typeof v.stock !== 'undefined',
      )
      .map((v) => ({
        ...v,
        slug: v.slug ? v.slug : slugify(v.name, { lower: true, strict: true }),
      }));

    // Start DB operation
    try {
      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          currency: dto.currency,
          sku: dto.sku,
          price: Number(dto.price),
          stock: Number(dto.stock),
          weight: Number(dto.weight),
          weightUnit: dto.weightUnit,
          categoryId: dto.categoryId,
          seoTitle: dto.seoTitle,
          seoDesc: dto.seoDesc,
          packages: parsedPackages || [],
          variantFields: Array.isArray(parsedVariantFields)
            ? parsedVariantFields
            : [],
          metadata: dto.metadata || {},
          bundleMetadata: dto.bundleMetadata || {},

          // Translations
          ProductTranslations: {
            create: parsedTranslations.map(
              (t: {
                language: string;
                name: string;
                description?: string;
                seoTitle?: string | null;
                seoDesc?: string | null;
                descriptionJson?: any;
              }) => ({
                language: t.language,
                name: t.name,
                description: t.description ?? '',
                seoTitle: t.seoTitle ?? null,
                seoDesc: t.seoDesc ?? null,
              }),
            ),
          },

          // Images
          images: {
            create: imageData,
          },

          // Variants + attributes + translations
          variants: {
            create: validVariants.map((variant) => ({
              name: variant.name,
              slug: variant.slug,
              sku: variant.sku,
              price: Number(variant.price),
              stock: Number(variant.stock),

              attributes: variant.attributes
                ? {
                    create: Object.entries(variant.attributes).map(
                      ([key, value]) => ({
                        name: key,
                        value: String(value),
                      }),
                    ),
                  }
                : undefined,

              translations: variant.translations
                ? {
                    create: variant.translations.map((t) => ({
                      language: t.language,
                      name: t.name,
                    })),
                  }
                : undefined,
            })),
          },
        },
        include: {
          images: true,
          variants: {
            include: {
              attributes: true,
              translations: true,
            },
          },
          ProductTranslations: true,
        },
      });

      return product;
    } catch (error) {
      throw handlePrismaError(error, 'product');
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        images: true,
        variants: {
          include: {
            attributes: true,
            ProductImage: true,
          },
        },
        Category: true,
      },
    });
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        variants: {
          include: {
            attributes: true,
            ProductImage: true,
          },
        },
        Category: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  private getFileUrl(file?: Express.Multer.File): string {
    const s3File = file as Express.Multer.File & { location?: string };
    return s3File?.location || file?.path || '';
  }

  private safeJsonParseArray<T = any>(value: unknown): T[] {
    try {
      if (typeof value === 'string') {
        const parsed = JSON.parse(value) as unknown;
        return Array.isArray(parsed) ? (parsed as T[]) : [];
      } else if (Array.isArray(value)) {
        return value as T[];
      }
      return [];
    } catch {
      return [];
    }
  }
}

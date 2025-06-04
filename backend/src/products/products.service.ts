import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from 'src/common';
import {
  CreateProductDto,
  ProductTranslationDto,
} from './dto/create-product.dto';
import slugify from 'slugify';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('S3_CLIENT') private readonly s3: S3Client,
  ) {}

  async create(
    dto: CreateProductDto,
    files: { images?: Express.Multer.File[] },
  ) {
    const imageFiles = files?.images || [];

    if (!imageFiles.length) {
      throw new BadRequestException('At least one product image is required.');
    }

    const tempSlug = (dto.slug ?? dto.name ?? 'unknown')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/gi, '');

    const originalImageData = this.buildImageData(imageFiles, dto.name ?? '');

    // Parse complex fields
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
    const parsedTranslations =
      this.safeJsonParseArray<ProductTranslationDto>(dto.ProductTranslations) ??
      [];

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
        slug: v.slug || slugify(v.name, { lower: true, strict: true }),
      }));

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
          ProductTranslations: {
            create: Array.isArray(parsedTranslations)
              ? parsedTranslations.map((t) => ({
                  language: t.language,
                  name: t.name,
                  description: t.description ?? '',
                  seoTitle: t.seoTitle ?? null,
                  seoDesc: t.seoDesc ?? null,
                }))
              : [],
          },
          images: {
            create: originalImageData,
          },
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
                        value:
                          typeof value === 'string'
                            ? value
                            : JSON.stringify(value),
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
          categories: {
            include: {
              translations: true,
            },
          },
          reviews: true,
          ProductTranslations: true,
        },
      });

      const finalFolder = `products/${product.id}`;
      const oldFolder = `products/temp-${tempSlug}`;

      await this.moveImagesToFinalFolder(
        oldFolder,
        finalFolder,
        product.images,
      );

      await this.deleteS3Folder(oldFolder);

      return product;
    } catch (error) {
      throw handlePrismaError(error, 'product');
    }
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: {
        images: true,
        variants: {
          include: {
            attributes: true,
            ProductImage: true,
          },
        },
        categories: {
          include: {
            translations: true,
          },
        },
        reviews: true,
        ProductTranslations: true,
      },
    });

    return products;
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
        categories: {
          include: {
            translations: true,
          },
        },
        reviews: true,
        ProductTranslations: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    console.log(product.variants);
    return product;
  }

  async update(
    slug: string,
    dto: UpdateProductDto,
    files: { images?: Express.Multer.File[] },
  ) {
    const imageFiles = files?.images || [];

    const parsedPackages = this.safeJsonParseArray(dto.packages);
    const parsedVariantFields = this.safeJsonParseArray(dto.variantFields);
    const parsedVariants =
      this.safeJsonParseArray<{
        name: string;
        sku: string;
        price: number;
        stock: number;
        slug?: string;
        attributes?: Record<string, any>;
        translations?: { language: string; name: string }[];
      }>(dto.variants) || [];
    const parsedTranslations: ProductTranslationDto[] =
      this.safeJsonParseArray<ProductTranslationDto>(dto.ProductTranslations) ||
      [];

    const validVariants = parsedVariants
      .filter(
        (v) =>
          v.name && v.sku && v.price !== undefined && v.stock !== undefined,
      )
      .map((v) => ({
        ...v,
        slug: v.slug || slugify(v.name, { lower: true, strict: true }),
      }));

    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { slug },
        include: { images: true },
      });

      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }

      // Build new image metadata if files are provided
      const imageData = imageFiles.length
        ? this.buildImageData(imageFiles, dto.name ?? '')
        : [];

      if (imageFiles.length > 0) {
        // Delete old image files from S3
        await Promise.all(
          existingProduct.images.map((img) => this.deleteIfExists(img.url)),
        );

        // Remove image records from DB
        await this.prisma.productImage.deleteMany({
          where: { productId: existingProduct.id },
        });

        // Recreate image records (uploaded directly to correct folder via fallbackNameField: 'id')
        await Promise.all(
          imageData.map((data, index) =>
            this.prisma.productImage.create({
              data: {
                productId: existingProduct.id,
                url: data.url,
                position: index,
                altText: data.altText,
              },
            }),
          ),
        );
      }

      const product = await this.prisma.product.update({
        where: { slug },
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
          packages: parsedPackages,
          variantFields: parsedVariantFields,
          metadata: dto.metadata,
          bundleMetadata: dto.bundleMetadata,

          // Replace all translations
          ProductTranslations: {
            deleteMany: {},
            create: parsedTranslations.map((t) => ({
              language: t.language,
              name: t.name,
              description: t.description ?? '',
              seoTitle: t.seoTitle ?? null,
              seoDesc: t.seoDesc ?? null,
            })),
          },

          // Replace all images
          images: imageFiles.length
            ? {
                deleteMany: {},
                create: imageData,
              }
            : undefined,

          // Replace all variants
          variants: {
            deleteMany: {},
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

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) throw new NotFoundException('Product not found');

    // Delete related assets
    await this.deleteRelatedProductData(product.id);

    await this.prisma.product.delete({ where: { id } });

    return {
      message: 'Product deleted successfully',
      deletedId: id,
    };
  }

  // ✅ Remove Multiple Products
  async removeMany(slugs: string[]) {
    const products = await this.prisma.product.findMany({
      where: { slug: { in: slugs } },
      include: { images: true },
    });

    if (!products.length) {
      throw new BadRequestException('No matching products found.');
    }

    const productIds = products.map((p) => p.id);
    await this.deleteRelatedProductData(productIds);

    const result = await this.prisma.product.deleteMany({
      where: { slug: { in: slugs } },
    });

    return {
      deletedCount: result.count,
      message: `Deleted ${result.count} products successfully`,
    };
  }

  // ----------- Helpers -----------

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

  private buildImageData(files: Express.Multer.File[], fallbackName: string) {
    return files.map((file, index) => ({
      url: this.getFileUrl(file),
      position: index,
      altText: fallbackName || `Product image ${index + 1}`,
    }));
  }
  // ✅ Delete Related Data and S3 Files
  private async deleteRelatedProductData(productIds: string[] | string) {
    const ids = Array.isArray(productIds) ? productIds : [productIds];

    await Promise.all([
      this.prisma.productTranslation.deleteMany({
        where: { productId: { in: ids } },
      }),

      this.prisma.variantAttribute.deleteMany({
        where: { variant: { productId: { in: ids } } },
      }),
      this.prisma.productVariant.deleteMany({
        where: { productId: { in: ids } },
      }),
      this.prisma.productImage.deleteMany({
        where: { productId: { in: ids } },
      }),
    ]);

    // Remove entire folder (optional but safe cleanup)
    await Promise.all(
      ids.map(async (id) => {
        const folder = `products/${id}`;
        await this.deleteS3Folder(folder);
      }),
    );
  }

  // ✅ Delete file from S3
  private async deleteIfExists(imageUrl: string) {
    try {
      const url = new URL(imageUrl);
      const key = url.pathname.slice(1);

      if (!key) return;

      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: key,
        }),
      );
      console.log(`✅ Deleted from S3: ${key}`);
    } catch (error) {
      console.error('❌ Failed to delete from S3:', error);
    }
  }

  private async deleteS3Folder(folderPrefix: string) {
    try {
      const bucket = process.env.S3_BUCKET!;
      const listCommand = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: `products/${folderPrefix}`,
      });

      const listedObjects = await this.s3.send(listCommand);

      if (!listedObjects.Contents || listedObjects.Contents.length === 0)
        return;

      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: listedObjects.Contents.map((obj) => ({
            Key: obj.Key!,
          })),
          Quiet: true,
        },
      });

      await this.s3.send(deleteCommand);
      console.log(`✅ Deleted old folder: products/${folderPrefix}`);
    } catch (error) {
      console.error('❌ Failed to delete old folder from S3:', error);
    }
  }

  private async moveImagesToFinalFolder(
    oldFolder: string,
    newFolder: string,
    images: { id: string; url: string }[],
  ) {
    const bucket = process.env.S3_BUCKET!;
    const copyCommands = images.map((img) => {
      const url = new URL(img.url);
      const oldKey = url.pathname.slice(1);
      const newKey = oldKey.replace(oldFolder, newFolder);

      return this.s3.send(
        new CopyObjectCommand({
          Bucket: bucket,
          CopySource: `${bucket}/${oldKey}`,
          Key: newKey,
          ACL: 'public-read',
        }),
      );
    });

    await Promise.all(copyCommands);

    // Optional: delete old files
    await Promise.all(images.map((img) => this.deleteIfExists(img.url)));

    // Update image URLs in DB
    await Promise.all(
      images.map((img) => {
        const url = new URL(img.url);
        const oldKey = url.pathname.slice(1);
        const newKey = oldKey.replace(oldFolder, newFolder);
        const newUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${newKey}`;

        return this.prisma.productImage.update({
          where: { id: img.id },
          data: { url: newUrl },
        });
      }),
    );
  }
}

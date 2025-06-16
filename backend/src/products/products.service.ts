import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { isObject, PrismaService } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import slugify from 'slugify';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  Prisma,
  Product,
  ProductImage,
  ProductVariant,
  ProductTranslation,
  VariantAttribute,
  ProductVariantTranslation,
} from '@prisma/client';
import { DeleteProductsDto } from './dto/delete-products.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

// Type guard to ensure an unknown value is a plain object

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('S3_CLIENT') private readonly s3: S3Client,
  ) {}

  /**
   * Creates a new product along with its related entities such as images, translations, variants, and associated metadata.
   *
   * This method performs the following steps:
   * 1. Validates that at least one product image is provided.
   * 2. Generates a temporary slug and S3 folder for image uploads.
   * 3. Parses and prepares nested DTO arrays for packages, variant fields, translations, and variants.
   * 4. Executes a database transaction to:
   *    - Create the product record.
   *    - Create related translations, images, and variants (including their attributes and translations).
   *    - Fetches the complete product with all relations after creation.
   * 5. Moves uploaded images from the temporary S3 folder to the final product folder.
   * 6. Cleans up temporary resources in case of errors.
   *
   * @param dto - The data transfer object containing product details and nested relations.
   * @param files - An object containing uploaded image files (expects at least one image).
   * @returns The newly created product with its images, variants, and translations.
   * @throws {BadRequestException} If no images are provided.
   * @throws {NotFoundException} If the product cannot be found after creation.
   * @throws {InternalServerErrorException} If image finalization fails.
   * @throws {Prisma.PrismaClientKnownRequestError} For database-related errors.
   */
  async create(
    dto: CreateProductDto,
    files: { images?: Express.Multer.File[] },
  ) {
    // Ensure at least one image is provided; throw if not
    const imageFiles = files?.images || [];
    if (!imageFiles.length) {
      throw new BadRequestException('At least one product image is required.');
    }

    // Generate a temporary slug for the product (used for temp S3 folder)
    const tempSlug = slugify(dto.slug ?? dto.name ?? 'unknown', {
      lower: true,
      strict: true,
    });

    // Define the temporary S3 folder for image uploads
    const tempFolder = `products/temp-${tempSlug}`;

    // Build image data array for Prisma create
    const imageData = this.buildImageData(imageFiles, dto.name);

    // Parse nested arrays (guaranteed by DTO validation)
    const parsedPackages = Array.isArray(dto.packages) ? dto.packages : [];
    const parsedVariantFields = Array.isArray(dto.variantFields)
      ? dto.variantFields
      : [];
    const translations = Array.isArray(dto.ProductTranslations)
      ? dto.ProductTranslations
      : [];
    const variants = Array.isArray(dto.variants) ? dto.variants : [];

    // Convert DTO arrays into pure JSON-compatible values
    const packagesJson: unknown = JSON.parse(JSON.stringify(parsedPackages));
    const variantFieldsJson: unknown = JSON.parse(
      JSON.stringify(parsedVariantFields),
    );

    let product: Product & {
      images: ProductImage[];
      variants: (ProductVariant & {
        attributes: VariantAttribute[];
        translations: ProductVariantTranslation[];
      })[];
      ProductTranslations: ProductTranslation[];
    };
    try {
      product = await this.prisma.$transaction(async (tx) => {
        // 1. Create product with nested translations, images, and variants
        const core = await tx.product.create({
          data: {
            name: dto.name,
            slug: dto.slug,
            description: dto.description,
            seoTitle: dto.seoTitle,
            seoDesc: dto.seoDesc,
            categoryId: dto.categoryId,
            currency: dto.currency,
            price: dto.price,
            stock: dto.stock,
            weight: dto.weight,
            weightUnit: dto.weightUnit,
            // Cast arrays to JSON for Prisma
            packages: packagesJson as Prisma.InputJsonValue[],
            variantFields: variantFieldsJson as string[],
            metadata: isObject(dto.metadata)
              ? (JSON.parse(
                  JSON.stringify(dto.metadata),
                ) as Prisma.InputJsonValue)
              : {},
            bundleMetadata: isObject(dto.bundleMetadata)
              ? (JSON.parse(
                  JSON.stringify(dto.bundleMetadata),
                ) as Prisma.InputJsonValue)
              : {},
          },
        });
        // 2) Create ProductTranslations via createMany or multiple create calls
        if (translations.length) {
          await tx.productTranslation.createMany({
            data: translations.map((t) => ({
              productId: core.id,
              language: t.language,
              name: t.name,
              description: t.description,
              seoTitle: t.seoTitle,
              seoDesc: t.seoDesc,
              descriptionJson:
                t.descriptionJson === null || t.descriptionJson === undefined
                  ? Prisma.JsonNull
                  : (t.descriptionJson as Prisma.InputJsonValue),
            })),
          });
        }
        // 3) Create images (via createMany if you prefer, instead of nested create)
        await tx.productImage.createMany({
          data: imageData.map((img, idx) => ({
            productId: core.id,
            url: img.url,
            position: idx,
            altText: img.altText,
          })),
        }); // 4) Create variants (and inside each, attributes and translations)
        for (const v of variants) {
          const variant = await tx.productVariant.create({
            data: {
              productId: core.id,
              name: v.name,
              slug: v.slug || slugify(v.name, { lower: true, strict: true }),
              sku: v.sku,
              price: v.price,
              stock: v.stock,
              metadata: isObject(v.metadata)
                ? (v.metadata as Prisma.InputJsonValue)
                : ({} as Prisma.InputJsonValue),
            },
          });
          if (v.attributes) {
            await tx.variantAttribute.createMany({
              data: v.attributes.map((a) => ({
                variantId: variant.id,
                name: a.name,
                value: a.value,
              })),
            });
          }
          if (v.ProductTranslations) {
            await tx.productVariantTranslation.createMany({
              data: v.ProductTranslations.map((pt) => ({
                variantId: variant.id,
                language: pt.language,
                name: pt.name,
              })),
            });
          }
        }

        // 5) Finally read back the aggregates you care about
        const productWithRlations = await tx.product.findUnique({
          where: { id: core.id },
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

        if (!productWithRlations) {
          throw new NotFoundException('Product not found after creation');
        }

        return productWithRlations;
      });
    } catch (error) {
      // If any DB operation fails, remove the temp S3 folder:
      try {
        await this.deleteS3Folder(tempFolder);
      } catch (cleanupErr) {
        console.error(
          'Failed to clean up temp S3 folder after DB error:',
          cleanupErr,
        );
      }
      throw handlePrismaError(error, 'product');
    }

    try {
      await this.moveImagesToFinalFolder(
        tempFolder,
        `products/${product.id}`,
        product.images,
      );
      await this.deleteS3Folder(tempFolder);
    } catch {
      await this.safeCleanupProduct(product.id);
      throw new InternalServerErrorException(
        'Failed to finalize product images.',
      );
    }

    return product;
  }

  /**
   * Updates an existing product and its related entities (images, variants, translations) by slug.
   *
   * This method performs a comprehensive update of a product, including:
   * - Scalar fields (name, description, price, etc.)
   * - JSON fields (packages, variantFields, metadata, bundleMetadata)
   * - Product translations (replacing all if provided)
   * - Product images (deleting old images and uploading new ones if provided)
   * - Product variants (upserting, deleting removed, updating or creating new, including attributes and translations)
   *
   * All operations are performed within a database transaction to ensure consistency.
   * If new images are uploaded, they are first stored in a temporary S3 folder and then moved to the final location after a successful transaction.
   * In case of any error, temporary files are cleaned up and a relevant exception is thrown.
   *
   * @param slug - The unique slug of the product to update.
   * @param dto - The data transfer object containing updated product fields and nested relations.
   * @param files - An object containing uploaded image files (if any).
   * @returns The fully updated product with all related entities.
   * @throws NotFoundException If the product with the given slug does not exist or cannot be found after update.
   * @throws InternalServerErrorException If image finalization fails after a successful DB update.
   */
  async update(
    slug: string,
    dto: UpdateProductDto,
    files: { images?: Express.Multer.File[] },
  ) {
    // 1) Fetch the existing product (so we know its ID and current relations)
    const existing = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        variants: { include: { attributes: true, translations: true } },
        ProductTranslations: true,
      },
    });
    if (!existing) {
      throw new NotFoundException(`Product with slug "${slug}" not found.`);
    }

    // 2) Prepare a unique temp folder for any new uploads
    const slugBase = slugify(slug, { lower: true, strict: true });
    const tempFolder = `products/temp-${slugBase}-${Date.now()}`;

    // 3) Build image data for newly uploaded files (if any)
    const imageFiles = files.images || [];
    const imageData = this.buildImageData(
      imageFiles,
      dto.name ?? existing.name,
    );

    // 4) Parse nested arrays from the DTO
    const parsedPackages = Array.isArray(dto.packages) ? dto.packages : [];
    const parsedVariantFields = Array.isArray(dto.variantFields)
      ? dto.variantFields
      : [];
    const translations = Array.isArray(dto.ProductTranslations)
      ? dto.ProductTranslations
      : [];
    const variantsDto = Array.isArray(dto.variants) ? dto.variants : [];

    // 5) Convert to JSON‐compatible values
    const packagesJson: unknown = JSON.parse(JSON.stringify(parsedPackages));
    const variantFieldsJson: unknown = JSON.parse(
      JSON.stringify(parsedVariantFields),
    );

    // 6) Build up the “data” object incrementally so we only set JSON fields when provided
    const updateData: Prisma.ProductUpdateInput = {
      // Always update scalar fields if defined, otherwise leave unchanged:
      name: dto.name ?? undefined,
      description: dto.description ?? undefined,
      seoTitle: dto.seoTitle ?? undefined,
      seoDesc: dto.seoDesc ?? undefined,
      currency: dto.currency ?? undefined,
      price: dto.price ?? undefined,
      stock: dto.stock ?? undefined,
      weight: dto.weight ?? undefined,
      weightUnit: dto.weightUnit ?? undefined,
    };

    if (dto.packages) {
      updateData.packages = packagesJson as Prisma.InputJsonValue;
    }

    if (dto.variantFields) {
      updateData.variantFields = variantFieldsJson as string[];
    }

    if (isObject(dto.metadata)) {
      updateData.metadata = JSON.parse(
        JSON.stringify(dto.metadata),
      ) as Prisma.InputJsonValue;
    }

    if (isObject(dto.bundleMetadata)) {
      updateData.bundleMetadata = JSON.parse(
        JSON.stringify(dto.bundleMetadata),
      ) as Prisma.InputJsonValue;
    }

    // 7) Begin transaction to update all nested data
    let updatedProduct: Product & {
      images: ProductImage[];
      variants: (ProductVariant & {
        attributes: VariantAttribute[];
        translations: ProductVariantTranslation[];
      })[];
      ProductTranslations: ProductTranslation[];
    };
    try {
      updatedProduct = await this.prisma.$transaction(async (tx) => {
        // 7a) Update core product row with whichever fields were provided
        await tx.product.update({
          where: { slug },
          data: updateData,
        });

        // 7b) Replace ProductTranslations if the DTO provided any
        if (dto.ProductTranslations) {
          // 1) Delete all existing translations for this product
          await tx.productTranslation.deleteMany({
            where: { productId: existing.id },
          });
          // 2) Create the new translations (if any)
          if (translations.length) {
            await tx.productTranslation.createMany({
              data: translations.map((t) => ({
                productId: existing.id,
                language: t.language,
                name: t.name,
                description: t.description,
                seoTitle: t.seoTitle,
                seoDesc: t.seoDesc,
                descriptionJson:
                  t.descriptionJson == null
                    ? Prisma.JsonNull
                    : (t.descriptionJson as Prisma.InputJsonValue),
              })),
            });
          }
        }

        // 7c) If new images were uploaded, delete old ones and insert the new ones
        if (imageFiles.length) {
          // 1) Delete each old S3 object
          await Promise.all(
            existing.images.map((img) => this.deleteIfExists(img.url)),
          );
          // 2) Delete old image rows in DB
          await tx.productImage.deleteMany({
            where: { productId: existing.id },
          });
          // 3) Insert new image rows
          if (imageData.length) {
            await tx.productImage.createMany({
              data: imageData.map((img, idx) => ({
                productId: existing.id,
                url: img.url,
                position: idx,
                altText: img.altText,
              })),
            });
          }
        }

        // 7d) Handle variants (upsert style)
        // Determine which existing variant IDs should be kept
        const incomingVariantIds = variantsDto
          .filter((v) => typeof v.id === 'string')
          .map((v) => v.id as string);

        // Delete any variants that the DTO did not include
        await tx.productVariant.deleteMany({
          where: {
            productId: existing.id,
            id: { notIn: incomingVariantIds },
          },
        });

        // Now upsert (update or create) each variant from the DTO
        for (const vDto of variantsDto) {
          if (vDto.id) {
            // 7d.i) Update an existing variant
            await tx.productVariant.update({
              where: { id: vDto.id },
              data: {
                name: vDto.name,
                slug: vDto.slug,
                sku: vDto.sku,
                price: vDto.price,
                stock: vDto.stock,
                metadata: isObject(vDto.metadata)
                  ? (JSON.parse(
                      JSON.stringify(vDto.metadata),
                    ) as Prisma.InputJsonValue)
                  : undefined,
              },
            });

            // If attributes provided, replace them
            if (vDto.attributes) {
              // a) Delete all old attributes
              await tx.variantAttribute.deleteMany({
                where: { variantId: vDto.id },
              });
              // b) Create new attributes
              if (vDto.attributes.length) {
                await tx.variantAttribute.createMany({
                  data: vDto.attributes.map((a) => ({
                    variantId: vDto.id!,
                    name: a.name,
                    value: a.value,
                  })),
                });
              }
            }

            // If variant translations provided, replace them
            if (vDto.ProductTranslations) {
              await tx.productVariantTranslation.deleteMany({
                where: { variantId: vDto.id },
              });
              if (vDto.ProductTranslations.length) {
                await tx.productVariantTranslation.createMany({
                  data: vDto.ProductTranslations.map((pt) => ({
                    variantId: vDto.id!,
                    language: pt.language,
                    name: pt.name,
                  })),
                });
              }
            }
          } else {
            // 7d.ii) Create a brand‐new variant
            const createdVariant = await tx.productVariant.create({
              data: {
                productId: existing.id,
                name: vDto.name,
                slug:
                  vDto.slug ||
                  slugify(vDto.name, { lower: true, strict: true }),
                sku: vDto.sku,
                price: vDto.price,
                stock: vDto.stock,
                metadata: isObject(vDto.metadata)
                  ? (JSON.parse(
                      JSON.stringify(vDto.metadata),
                    ) as Prisma.InputJsonValue)
                  : {},
              },
            });

            // Insert its attributes (if any)
            if (vDto.attributes && vDto.attributes.length) {
              await tx.variantAttribute.createMany({
                data: vDto.attributes.map((a) => ({
                  variantId: createdVariant.id,
                  name: a.name,
                  value: a.value,
                })),
              });
            }

            // Insert its translations (if any)
            if (vDto.ProductTranslations && vDto.ProductTranslations.length) {
              await tx.productVariantTranslation.createMany({
                data: vDto.ProductTranslations.map((pt) => ({
                  variantId: createdVariant.id,
                  language: pt.language,
                  name: pt.name,
                })),
              });
            }
          }
        }

        // 7e) Finally, re‐fetch the fully updated product with the relations
        const productWithRelations = await tx.product.findUnique({
          where: { id: existing.id },
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

        if (!productWithRelations) {
          throw new NotFoundException('Product not found after update.');
        }
        return productWithRelations;
      });
    } catch (dbError) {
      // 8) If any DB operation fails, clean up the temp folder immediately
      try {
        await this.deleteS3Folder(tempFolder);
      } catch (cleanupErr) {
        console.error(
          'Failed to clean up temp S3 folder after DB error:',
          cleanupErr,
        );
      }
      throw handlePrismaError(dbError, 'product');
    }

    // 9) If new images were uploaded, move them from temp → final
    if (imageFiles.length) {
      try {
        const imagesToMove = updatedProduct.images.map((img) => ({
          id: img.id,
          url: img.url,
        }));

        await this.moveImagesToFinalFolder(
          tempFolder,
          `products/${updatedProduct.id}`,
          imagesToMove,
        );
        await this.deleteS3Folder(tempFolder);
      } catch (s3Error) {
        console.error('Error moving updated images to final folder:', s3Error);
        await this.safeCleanupProduct(updatedProduct.id);
        throw new InternalServerErrorException(
          'Failed to finalize updated product images.',
        );
      }
    }

    // 10) Return the fully updated product
    return updatedProduct;
  }

  /**
   * Retrieves a paginated list of products based on the provided filter parameters.
   *
   * @param params - Optional filtering and pagination parameters.
   * @param params.page - The page number to retrieve (defaults to 1 if not provided or invalid).
   * @param params.pageSize - The number of items per page (defaults to 20 if not provided or invalid).
   * @param params.categoryId - Optional category ID to filter products by category.
   * @param params.status - Optional status to filter products by status.
   * @returns An object containing the list of products (`items`) and pagination metadata (`meta`), including total count, current page, page size, and total pages.
   *
   * @remarks
   * - Products are ordered by creation date in descending order.
   * - Each product includes its ID, name, slug, price, status, and the first image URL (if available).
   * - Uses a database transaction to fetch both the total count and the paginated items efficiently.
   */
  async findAll(params: PaginationQueryDto = {}) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize =
      params.pageSize && params.pageSize > 0 ? params.pageSize : 10;

    const whereClause: Prisma.ProductWhereInput = {};
    if (params.categoryId) whereClause.categoryId = params.categoryId;
    if (params.status) whereClause.status = params.status;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.product.count({ where: whereClause }),
      this.prisma.product.findMany({
        where: whereClause,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          status: true,
          currency: true,
          categoryId: true,
          images: { take: 1, select: { url: true } },
          variants: true,
        },
      }),
    ]);

    const productList = {
      items,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    return productList;
  }

  /**
   * Retrieves a single product by its slug, including related images, variants, translations, categories, and recent reviews.
   *
   * @param slug - The unique slug identifier of the product to retrieve.
   * @returns A promise that resolves to the product object with its related data.
   * @throws NotFoundException If no product with the given slug is found.
   */
  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: {
          include: {
            attributes: true,
            translations: true,
            ProductImage: true,
          },
        },
        ProductTranslations: true,
        categories: { include: { translations: true } },
        reviews: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    return product;
  }

  /**
   * Removes a product and all its related data from the database and S3 storage.
   *
   * This method performs the following steps:
   * 1. Finds the product by its ID, including its images.
   * 2. Throws a NotFoundException if the product does not exist.
   * 3. Within a database transaction:
   *    - Deletes all associated images from S3.
   *    - Deletes all related product translations, variant attributes, product variants, and product images.
   *    - Deletes the product itself.
   * 4. Deletes the S3 folder prefix associated with the product.
   *
   * @param id - The unique identifier of the product to remove.
   * @returns An object containing a success message and the ID of the deleted product.
   * @throws NotFoundException if the product with the given ID does not exist.
   */
  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    await this.prisma.$transaction(async (tx) => {
      // Delete images from S3
      await Promise.all(
        product.images.map((img) => this.deleteIfExists(img.url)),
      );

      // Delete nested rows
      await Promise.all([
        tx.productTranslation.deleteMany({ where: { productId: id } }),
        tx.variantAttribute.deleteMany({
          where: { variant: { productId: id } },
        }),
        tx.productVariant.deleteMany({ where: { productId: id } }),
        tx.productImage.deleteMany({ where: { productId: id } }),
      ]);

      // Delete the product itself
      await tx.product.delete({ where: { id } });
    });

    // Delete the S3 prefix
    await this.deleteS3Folder(`products/${id}`);

    return { message: 'Product deleted successfully', deletedId: id };
  }

  /**
   * Deletes multiple products and their related data from the database and S3 storage.
   *
   * This method performs the following steps:
   * 1. Finds all products matching the provided slugs, including their images.
   * 2. Throws a BadRequestException if no matching products are found.
   * 3. Deletes all associated images from S3 storage.
   * 4. Deletes related nested data (translations, variant attributes, variants, images) and the products themselves in a database transaction.
   * 5. Deletes the S3 folder for each product.
   *
   * @param dto - Data transfer object containing an array of product slugs to delete.
   * @returns An object containing the number of deleted products and a message.
   * @throws {BadRequestException} If no matching products are found.
   */
  async removeMany(dto: DeleteProductsDto) {
    const products = await this.prisma.product.findMany({
      where: { slug: { in: dto.slugs } },
      include: { images: true },
    });
    if (!products.length) {
      throw new BadRequestException('No matching products found.');
    }

    const ids = products.map((p) => p.id);

    // Delete all images from S3
    await Promise.all(
      products.flatMap((p) =>
        p.images.map((img) => this.deleteIfExists(img.url)),
      ),
    );

    // Delete nested data and products in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.productTranslation.deleteMany({
        where: { productId: { in: ids } },
      });
      await tx.variantAttribute.deleteMany({
        where: { variant: { productId: { in: ids } } },
      });
      await tx.productVariant.deleteMany({
        where: { productId: { in: ids } },
      });
      await tx.productImage.deleteMany({
        where: { productId: { in: ids } },
      });
      const res = await tx.product.deleteMany({ where: { id: { in: ids } } });
      return res;
    });

    // Delete each S3 prefix
    await Promise.all(ids.map((id) => this.deleteS3Folder(`products/${id}`)));

    return {
      deletedCount: result.count,
      message: `Deleted ${result.count} products.`,
    };
  }

  // ────────────── Shared Logic ──────────────

  /**
   * Builds an array of image data objects from the provided uploaded files.
   *
   * @param files - An array of Express Multer file objects, each representing an uploaded image file.
   * @param fallbackName - A fallback string to use as the alt text if none is provided.
   * @returns An array of objects, each containing the image URL, its position in the array, and alt text.
   */
  private buildImageData(
    files: Express.Multer.File[],
    fallbackName: string,
  ): { url: string; position: number; altText: string }[] {
    return files.map((file, index) => {
      const s3File = file as Express.Multer.File & { location?: string };
      const url = s3File.location || '';
      return {
        url,
        position: index,
        altText: fallbackName || `product-image-${index + 1}`,
      };
    });
  }

  /**
   * Deletes an object from the S3 bucket if the provided image URL is valid and the object exists.
   *
   * This method parses the given image URL to extract the S3 object key and attempts to delete
   * the corresponding object from the S3 bucket specified by the `S3_BUCKET` environment variable.
   * If the key is invalid or missing, the method returns without performing any action.
   * Any errors encountered during the deletion process are caught and logged to the console.
   *
   * @param imageUrl - The full URL of the image to be deleted from S3.
   * @returns A promise that resolves when the deletion attempt is complete.
   */
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
    } catch (error) {
      console.error('Failed to delete from S3:', error);
    }
  }

  /**
   * Deletes all objects within a specified S3 folder (prefix).
   *
   * This method lists all objects in the given S3 prefix and deletes them in a single batch operation.
   * If the folder is empty or does not exist, the method returns without performing any deletion.
   * Any errors encountered during the process are logged to the console.
   *
   * @param prefix - The S3 prefix (folder path) whose contents should be deleted.
   * @returns A promise that resolves when the deletion operation is complete.
   */
  private async deleteS3Folder(prefix: string) {
    try {
      const bucket = process.env.S3_BUCKET!;
      const listed = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix,
        }),
      );
      if (!listed.Contents?.length) return;
      await this.s3.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: listed.Contents.map((o) => ({ Key: o.Key! })),
            Quiet: true,
          },
        }),
      );
    } catch (error) {
      console.error('Failed to delete S3 folder:', error);
    }
  }

  /**
   * Moves a list of images from a temporary S3 folder to a final destination folder,
   * updates their URLs in the database, and ensures public-read access.
   *
   * For each image:
   * 1. Copies the image from the old S3 prefix to the new prefix.
   * 2. Deletes the original image from the old prefix.
   * 3. Updates the image URL in the database to reflect the new S3 location.
   *
   * @param oldPrefix - The S3 key prefix where the images are currently stored.
   * @param newPrefix - The S3 key prefix where the images should be moved.
   * @param images - An array of image objects containing `id` and `url` properties.
   *
   * @throws Will throw an error if any S3 or database operation fails.
   *
   * @remarks
   * - Assumes that `this.s3` is an initialized S3 client and `this.prisma` is a Prisma client.
   * - The function is asynchronous and processes images sequentially.
   */
  private async moveImagesToFinalFolder(
    oldPrefix: string,
    newPrefix: string,
    images: { id: string; url: string }[],
  ) {
    const bucket = process.env.S3_BUCKET!;
    for (const img of images) {
      const urlObj = new URL(img.url);
      const oldKey = urlObj.pathname.slice(1);
      const newKey = oldKey.replace(oldPrefix, newPrefix);

      // 1. Copy object
      await this.s3.send(
        new CopyObjectCommand({
          Bucket: bucket,
          CopySource: `${bucket}/${oldKey}`,
          Key: newKey,
          ACL: 'public-read',
        }),
      );

      // 2. Delete old object
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: oldKey,
        }),
      );

      // 3. Update the DB URL
      const newUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${newKey}`;
      await this.prisma.productImage.update({
        where: { id: img.id },
        data: { url: newUrl },
      });
    }
  }

  /**
   * Safely cleans up all resources associated with a given product.
   *
   * This method performs the following steps:
   * 1. Fetches all images associated with the product.
   * 2. Deletes the images from S3 storage.
   * 3. Deletes all related database records (variant attributes, variants, images, translations, and the product itself)
   *    within a single transaction to ensure consistency.
   * 4. Removes any remaining S3 folder/prefix related to the product.
   *
   * If any step fails, the error is caught and logged, but not rethrown.
   *
   * @param productId - The unique identifier of the product to clean up.
   * @returns A promise that resolves when the cleanup process is complete.
   */
  private async safeCleanupProduct(productId: string) {
    try {
      // 1. Fetch associated images
      const images = await this.prisma.productImage.findMany({
        where: { productId },
      });
      // 2. Delete images from S3
      await Promise.all(images.map((img) => this.deleteIfExists(img.url)));
      // 3. Delete nested rows + product in a transaction
      await this.prisma.$transaction(async (tx) => {
        await tx.variantAttribute.deleteMany({
          where: { variant: { productId } },
        });
        await tx.productVariant.deleteMany({
          where: { productId },
        });
        await tx.productImage.deleteMany({
          where: { productId },
        });
        await tx.productTranslation.deleteMany({
          where: { productId },
        });
        await tx.product.delete({ where: { id: productId } });
      });
      // 4. Delete any remaining S3 prefix
      await this.deleteS3Folder(`products/${productId}`);
    } catch (cleanupError) {
      console.error(
        'Cleanup after failed create() did not complete:',
        cleanupError,
      );
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/common';
import { Product } from '@Prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new product in the database.
   *
   * @param dto - The data transfer object containing the details of the product to be created.
   * @returns A promise that resolves to the created product.
   *
   * @throws {BadRequestException} If a product with the same SKU already exists.
   *
   * The `dto` parameter includes the following properties:
   * - `name` (string): The name of the product.
   * - `slug` (string): A unique slug identifier for the product.
   * - `description` (string): A description of the product.
   * - `imageUrl` (string): The URL of the product's main image.
   * - `price` (number): The price of the product.
   * - `stock` (number): The initial stock quantity of the product.
   * - `sku` (string | undefined): The stock keeping unit of the product (optional).
   * - `categoryId` (string): The ID of the category the product belongs to.
   * - `metadata` (Record<string, any> | undefined): Additional metadata for the product (optional).
   * - `bundles` (string[] | undefined): IDs of bundles the product is part of (optional).
   * - `images` (Array<{ url: string; altText: string; position?: number }>): A list of images for the product.
   * - `translations` (Array<{ language: string; name: string; description: string; descriptionJson?: any[] }>): Translations for the product in different languages.
   * - `variants` (Array<{ slug: string; sku: string; price: number; stock: number }> | undefined): Variants of the product (optional).
   *
   * The created product includes the following related entities:
   * - `images`: The list of associated images.
   * - `ProductTranslations`: The translations for the product.
   * - `variants`: The variants of the product.
   * - `PriceHistorys`: The price history of the product.
   * - `StockMovements`: The stock movement history of the product.
   * - `Category`: The category the product belongs to.
   * - `bundledIn`: The bundles the product is part of.
   */
  async createProduct(dto: CreateProductDto): Promise<Product> {
    if (dto.sku) {
      const exists = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });
      if (exists) throw new BadRequestException('SKU already exists');
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        price: dto.price,
        stock: dto.stock,
        sku: dto.sku,
        categoryId: dto.categoryId,
        metadata: dto.metadata,

        // 🔗 Related Bundles
        bundledIn: dto.bundles?.length
          ? {
              connect: dto.bundles.map((id) => ({ id })),
            }
          : undefined,

        // 📦 Images
        images: {
          create: dto.images.map((img, i) => ({
            url: img.url,
            altText: img.altText,
            position: img.position ?? i,
          })),
        },

        // 🈯️ Translations
        ProductTranslations: {
          create: dto.translations.map((t) => ({
            language: t.language,
            name: t.name,
            description: t.description,
            descriptionJson: t.descriptionJson ?? [],
          })),
        },

        // 🧩 Variants
        variants: dto.variants?.length
          ? {
              create: dto.variants.map((v) => ({
                slug: v.slug,
                sku: v.sku,
                price: v.price,
                stock: v.stock,
              })),
            }
          : undefined,

        // 💰 Price History
        PriceHistorys: {
          create: {
            price: dto.price,
            reason: 'Initial price',
          },
        },

        // 🪙 Stock Movement
        StockMovements: {
          create: {
            type: 'IN',
            quantity: dto.stock,
            reason: 'Initial stock',
          },
        },
      },
      include: {
        images: true,
        ProductTranslations: true,
        variants: true,
        PriceHistorys: true,
        StockMovements: true,
        Category: true,
        bundledIn: true,
      },
    });

    return product;
  }

  /**
   * Updates an existing product with the provided data.
   *
   * @param id - The unique identifier of the product to update.
   * @param dto - The data transfer object containing the updated product details.
   *
   * @returns A promise that resolves to the updated product.
   *
   * @throws {NotFoundException} If the product with the specified ID does not exist.
   *
   * The `dto` parameter supports the following fields:
   * - `name`: The name of the product.
   * - `slug`: The slug (URL-friendly identifier) of the product.
   * - `description`: A textual description of the product.
   * - `imageUrl`: The URL of the product's main image.
   * - `price`: The price of the product.
   * - `stock`: The stock quantity of the product.
   * - `sku`: The stock keeping unit identifier for the product.
   * - `metadata`: Additional metadata for the product.
   * - `categoryId`: The ID of the category the product belongs to (nullable).
   * - `bundles`: An array of IDs representing bundles the product is part of (optional).
   * - `images`: An array of image objects to overwrite the product's images. Each image object should include:
   *   - `url`: The URL of the image.
   *   - `altText`: The alternative text for the image.
   *   - `position`: The position of the image (optional, defaults to the index in the array).
   * - `translations`: An array of translation objects to overwrite the product's translations. Each translation object should include:
   *   - `language`: The language code of the translation.
   *   - `name`: The translated name of the product.
   *   - `description`: The translated description of the product.
   *   - `descriptionJson`: A JSON representation of the description (optional, defaults to an empty array).
   *
   * The method also handles the following:
   * - Overwriting bundles associated with the product.
   * - Clearing and recreating the product's images.
   * - Clearing and recreating the product's translations.
   *
   * The updated product includes related entities such as images, variants, price history, stock movements, translations, category, and bundles.
   */
  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        price: dto.price,
        stock: dto.stock,
        sku: dto.sku,
        metadata: dto.metadata,
        categoryId: dto.categoryId ?? null,

        // 🧩 Bundles (overwrite)
        bundledIn: dto.bundles?.length
          ? {
              set: dto.bundles.map((bundleId) => ({ id: bundleId })),
            }
          : undefined,

        // 🖼️ Images (overwrite)
        images: dto.images
          ? {
              deleteMany: {}, // clear old
              create: dto.images.map((img, i) => ({
                url: img.url,
                altText: img.altText,
                position: img.position ?? i,
              })),
            }
          : undefined,

        // 🌍 Translations (overwrite)
        ProductTranslations: dto.translations
          ? {
              deleteMany: {}, // clear old
              create: dto.translations.map((t) => ({
                language: t.language,
                name: t.name,
                description: t.description,
                descriptionJson: t.descriptionJson ?? [],
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        variants: true,
        PriceHistorys: true,
        StockMovements: true,
        ProductTranslations: true,
        Category: true,
        bundledIn: true,
      },
    });
  }

  /**
   * Updates multiple products in the database.
   *
   * @param products - An array of objects, each containing the `id` of the product to update
   * and the `data` object with the updated product details.
   * @returns A promise that resolves to an array of updated `Product` entities.
   *
   * @remarks
   * This method iterates over the provided products array, updating each product
   * individually using the `updateProduct` method. The updated products are collected
   * and returned as an array.
   *
   * @example
   * ```typescript
   * const productsToUpdate = [
   *   { id: '123', data: { name: 'Product A', price: 100 } },
   *   { id: '456', data: { name: 'Product B', price: 200 } },
   * ];
   *
   * const updatedProducts = await productService.updateMany(productsToUpdate);
   * console.log(updatedProducts);
   * ```
   */
  async updateMany(
    products: { id: string; data: UpdateProductDto }[],
  ): Promise<Product[]> {
    const updated: Product[] = [];

    for (const item of products) {
      const product = await this.updateProduct(item.id, item.data);
      updated.push(product);
    }

    return updated;
  }

  /**
   * Deletes a product by its unique identifier.
   *
   * @param id - The unique identifier of the product to be deleted.
   * @returns A promise that resolves to the deleted product.
   * @throws NotFoundException - If no product with the given ID exists.
   */
  async deleteProduct(id: string): Promise<{ id: string }> {
    const exists = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Product not found');

    await this.prisma.productTranslation.deleteMany({
      where: { productId: id },
    });
    await this.prisma.productImage.deleteMany({ where: { productId: id } });
    await this.prisma.productVariant.deleteMany({ where: { productId: id } });
    await this.prisma.priceHistory.deleteMany({ where: { productId: id } });
    await this.prisma.stockMovement.deleteMany({ where: { productId: id } });
    await this.prisma.review.deleteMany({ where: { productId: id } });
    await this.prisma.wishlist.deleteMany({ where: { productId: id } });
    await this.prisma.cartItem.deleteMany({ where: { productId: id } });
    await this.prisma.orderItem.deleteMany({ where: { productId: id } });

    await this.prisma.product.update({
      where: { id },
      data: {
        bundles: {
          set: [],
        },
        bundledIn: {
          set: [],
        },
      },
    });

    const deleted = await this.prisma.product.delete({ where: { id } });

    return {
      id: deleted.id,
    };
  }
}

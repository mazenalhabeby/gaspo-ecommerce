import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';
import { CreateCategoryDto, TranslationDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  Prisma,
  Category,
  CategoryTranslation as Translation,
} from '@prisma/client';
import slugify from 'slugify';
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { PrismaService } from 'src/common';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('S3_CLIENT') private readonly s3: S3Client,
  ) {}

  /**
   * Creates a new category with optional image and translations.
   *
   * @param dto - The data transfer object containing category details and translations.
   * @param imageUrl - (Optional) The URL of the category image.
   * @returns The newly created category, including its translations and product count.
   * @throws {BadRequestException} If the category slug is already in use.
   * @throws {Prisma.PrismaClientKnownRequestError} For other Prisma-related errors.
   * @throws Will rollback the category and delete the uploaded image if translation creation fails.
   */
  async create(dto: CreateCategoryDto, imageUrl?: string) {
    const { translations, ...data } = dto;
    const { slug } = this.deriveSlug(translations);

    let category: { id: string; imageUrl?: string | null }; // Replace with actual Category type if available
    try {
      category = await this.prisma.category.create({
        data: { ...data, slug, imageUrl },
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Category slug already in use.');
      }
      throw handlePrismaError(error, 'category');
    }

    if (translations.length) {
      try {
        await this.prisma.categoryTranslation.createMany({
          data: translations.map((t) => ({
            categoryId: category.id,
            language: t.language,
            name: t.name,
            description: t.description,
          })),
        });
      } catch (error: any) {
        // rollback category and S3 on translation failure
        if (category.imageUrl) {
          await this.deleteFolderFromUrl(category.imageUrl);
        }
        await this.prisma.category.delete({ where: { id: category.id } });
        throw handlePrismaError(error, 'categoryTranslation');
      }
    }

    return this.prisma.category.findUnique({
      where: { id: category.id },
      include: {
        translations: true,
        _count: { select: { products: true } },
      },
    });
  }

  /**
   * Retrieves all categories from the database, including their translations and the count of associated products.
   *
   * @returns {Promise<Array<Category & { translations: Translation[]; _count: { products: number } }>>}
   *   A promise that resolves to an array of categories, each with its translations and product count.
   *
   * @remarks
   * - Results are ordered by creation date in descending order.
   * - Uses Prisma ORM for database access.
   */
  async findAll(): Promise<
    Array<
      Category & {
        translations: Translation[];
        _count: { products: number };
        name: string;
      }
    >
  > {
    const categories = await this.prisma.category.findMany({
      include: {
        translations: true,
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const categoriesWithNames = categories.map((category) => {
      const en = category.translations.find((t) => t.language === 'en');
      return {
        ...category,
        name: (en ? en.name : '').replace(/^\s+|\s+$/g, ''),
      };
    });

    return categoriesWithNames;
  }

  /**
   * Retrieves a single category by its slug, including its translations and products.
   *
   * @param slug - The unique slug identifier of the category to retrieve.
   * @returns A promise that resolves to the category object, including its translations and products.
   * @throws NotFoundException if the category with the given slug does not exist.
   */
  async findOne(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        translations: true,
        products: true,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  /**
   * Updates an existing category identified by its slug.
   *
   * This method updates the category's main fields, optionally changes its image,
   * and can also update its translations. If the English translation's name changes,
   * the slug is regenerated. If a new image URL is provided and differs from the old one,
   * the old image folder is deleted. Translations, if provided, are replaced entirely.
   *
   * Throws a `NotFoundException` if the category does not exist.
   * Throws a `BadRequestException` if the new slug is already in use.
   * Handles other Prisma errors via `handlePrismaError`.
   *
   * @param slug - The unique slug of the category to update.
   * @param dto - The data transfer object containing updated category fields and translations.
   * @param newImageUrl - (Optional) The new image URL for the category.
   * @returns The updated category, including its translations and product count.
   * @throws NotFoundException if the category is not found.
   * @throws BadRequestException if the new slug is already in use.
   */
  async update(slug: string, dto: UpdateCategoryDto, newImageUrl?: string) {
    const { translations, ...data } = dto;
    const existing = await this.prisma.category.findUnique({
      where: { slug },
      include: { translations: true },
    });
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    // Remove old image prefix if a new image is provided
    if (existing.imageUrl && newImageUrl && existing.imageUrl !== newImageUrl) {
      await this.deleteFolderFromUrl(existing.imageUrl);
    }

    // Determine if slug must change
    let updatedSlug: string | undefined;
    if (translations) {
      const oldEn = existing.translations.find((t) => t.language === 'en');
      const newEn = translations.find((t) => t.language === 'en');
      if (newEn && newEn.name && (!oldEn || oldEn.name !== newEn.name)) {
        updatedSlug = slugify(newEn.name, { lower: true, strict: true });
      }
    }

    // Build update payload only for provided fields
    const updateData: Prisma.CategoryUpdateInput = {
      ...('name' in data ? { name: data.name } : {}),
      ...('parentId' in data ? { parentId: data.parentId } : {}),
      ...(updatedSlug ? { slug: updatedSlug } : {}),
      ...(newImageUrl !== undefined ? { imageUrl: newImageUrl } : {}),
    };

    let updated: { id: string };
    try {
      updated = await this.prisma.category.update({
        where: { slug },
        data: updateData,
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Category slug already in use.');
      }
      throw handlePrismaError(error, 'category');
    }

    // Replace translations if provided
    if (translations) {
      // Delete old, then bulk‐insert new
      await this.prisma.categoryTranslation.deleteMany({
        where: { categoryId: existing.id },
      });
      if (translations.length) {
        await this.prisma.categoryTranslation.createMany({
          data: translations.map((t) => ({
            categoryId: existing.id,
            language: t.language,
            name: t.name,
            description: t.description,
          })),
        });
      }
    }

    return this.prisma.category.findUnique({
      where: { id: updated.id },
      include: {
        translations: true,
        _count: { select: { products: true } },
      },
    });
  }

  /**
   * Removes a category by its ID.
   *
   * This method performs the following steps:
   * 1. Finds the category by the provided ID.
   * 2. Throws a NotFoundException if the category does not exist.
   * 3. If the category has an associated image URL, deletes the corresponding folder.
   * 4. Deletes all translations related to the category.
   * 5. Deletes the category itself.
   *
   * @param id - The unique identifier of the category to remove.
   * @returns An object containing a success message and the ID of the deleted category.
   * @throws NotFoundException If the category with the given ID does not exist.
   */
  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.imageUrl) {
      await this.deleteFolderFromUrl(category.imageUrl);
    }

    await this.prisma.categoryTranslation.deleteMany({
      where: { categoryId: id },
    });
    await this.prisma.category.delete({ where: { id } });

    return { message: 'Category deleted successfully', deletedId: id };
  }

  /**
   * Removes multiple categories identified by their slugs.
   *
   * This method performs the following steps:
   * 1. Finds all categories matching the provided slugs.
   * 2. Throws a BadRequestException if no matching categories are found.
   * 3. Deletes the associated S3 folders for each category's image, if present.
   * 4. Deletes all translations related to the found categories.
   * 5. Deletes the categories themselves.
   *
   * @param slugs - An array of category slugs to be removed.
   * @returns An object containing the number of deleted categories and a success message.
   * @throws {BadRequestException} If no matching categories are found.
   */
  async removeMany(slugs: string[]) {
    const categories = await this.prisma.category.findMany({
      where: { slug: { in: slugs } },
    });
    if (!categories.length) {
      throw new BadRequestException('No matching categories found.');
    }

    // Delete each S3 folder
    await Promise.all(
      categories.map((c) =>
        c.imageUrl ? this.deleteFolderFromUrl(c.imageUrl) : Promise.resolve(),
      ),
    );

    // Delete translations, then categories
    const ids = categories.map((c) => c.id);
    await this.prisma.categoryTranslation.deleteMany({
      where: { categoryId: { in: ids } },
    });
    const result = await this.prisma.category.deleteMany({
      where: { id: { in: ids } },
    });

    return {
      deletedCount: result.count,
      message: `Deleted ${result.count} categories successfully`,
    };
  }

  // ────────────── Shared Logic ──────────────

  /**
   * Generates a URL-friendly slug from the English translation's name.
   *
   * @param translations - An array of translation objects, each containing a language and name.
   * @returns The slugified version of the English translation's name.
   * @throws BadRequestException If no English translation is found or the English name is empty.
   */
  private deriveSlug(translations: TranslationDto[]): {
    name: string;
    slug: string;
  } {
    const en = translations.find((t) => t.language === 'en');
    if (!en || !en.name.trim()) {
      throw new BadRequestException(
        'English translation is required for slug generation.',
      );
    }
    const name = en.name.trim();
    const slug = slugify(name, { lower: true, strict: true });
    return { name, slug };
  }

  /**
   * Deletes all objects within a specific S3 folder, determined by the given image URL.
   *
   * This method extracts the folder and ID from the provided image URL, constructs the S3 prefix,
   * lists all objects under that prefix, and deletes them from the S3 bucket.
   *
   * @param imageUrl - The URL of the image whose containing folder should be deleted from S3.
   * @returns A promise that resolves when the folder and its contents have been deleted, or resolves early if nothing is found.
   * @throws Logs an error to the console if the deletion fails.
   */
  private async deleteFolderFromUrl(imageUrl: string) {
    try {
      const url = new URL(imageUrl);
      const key = url.pathname.slice(1); // e.g. "categories/abc123/hero.jpg"
      const [folder, id] = key.split('/'); // ["categories","abc123",…]
      if (!folder || !id) return;
      const prefix = `${folder}/${id}/`; // "categories/abc123/"

      const listed = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: process.env.S3_BUCKET!,
          Prefix: prefix,
        }),
      );
      if (!listed.Contents?.length) return;

      await this.s3.send(
        new DeleteObjectsCommand({
          Bucket: process.env.S3_BUCKET!,
          Delete: {
            Objects: listed.Contents.map((o) => ({ Key: o.Key! })),
            Quiet: true,
          },
        }),
      );
      console.log(`✅ Deleted S3 folder: ${prefix}`);
    } catch (err) {
      console.error('❌ Failed to delete S3 folder:', err);
    }
  }
}

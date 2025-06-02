import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService, slugify } from 'src/common';
import { CreateCategoryDto, TranslationDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    @Inject('S3_CLIENT') private readonly s3: S3Client,
  ) {}

  async create(dto: CreateCategoryDto, imageUrl?: string) {
    try {
      const { translations, ...categoryData } = dto;

      const slug = this.getSlug(translations);

      const category = await this.prisma.category.create({
        data: {
          ...categoryData,
          imageUrl,
          slug,
        },
      });

      await Promise.all(
        translations.map((translation) =>
          this.prisma.categoryTranslation.create({
            data: {
              ...translation,
              categoryId: category.id,
            },
          }),
        ),
      );

      return category;
    } catch (error: any) {
      throw handlePrismaError(error, 'category');
    }
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: { _count: { select: { products: true } }, translations: true },
    });
    return categories;
  }

  async findOne(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { products: true, translations: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(slug: string, dto: UpdateCategoryDto, newImageUrl?: string) {
    const { translations, ...categoryData } = dto;

    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    // ✅ If new image uploaded, remove the old one
    if (existing.imageUrl && newImageUrl && existing.imageUrl !== newImageUrl) {
      await this.deleteIfExists(existing.imageUrl);
    }

    // ✅ Check for English name change to regenerate slug
    const existingEn = await this.prisma.categoryTranslation.findFirst({
      where: { categoryId: existing.id, language: 'en' },
    });

    const newEn = translations?.find((t) => t.language === 'en');

    let updatedSlug = existing.slug;

    if (existingEn && newEn && newEn.name !== existingEn.name) {
      updatedSlug = slugify(newEn.name);
    }

    try {
      const updated = await this.prisma.category.update({
        where: { slug },
        data: {
          ...categoryData,
          slug: updatedSlug,
          imageUrl: newImageUrl ?? existing.imageUrl,
        },
      });

      // ✅ Upsert translations per language
      if (translations && translations.length > 0) {
        await Promise.all(
          translations.map((translation) =>
            this.prisma.categoryTranslation.upsert({
              where: {
                categoryId_language: {
                  categoryId: existing.id,
                  language: translation.language,
                },
              },
              update: {
                name: translation.name,
                description: translation.description,
              },
              create: {
                categoryId: existing.id,
                language: translation.language,
                name: translation.name,
                description: translation.description,
              },
            }),
          ),
        );
      }

      return updated;
    } catch (error) {
      throw handlePrismaError(error, 'category');
    }
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) throw new NotFoundException('Category not found');

    if (category.imageUrl) {
      await this.deleteIfExists(category.imageUrl);
    }

    await this.prisma.categoryTranslation.deleteMany({
      where: { categoryId: id },
    });

    await this.prisma.category.delete({ where: { id } });

    return { message: 'Category deleted successfully', deletedId: id };
  }

  async removeMany(slugs: string[]) {
    const categories = await this.prisma.category.findMany({
      where: { slug: { in: slugs } },
    });

    const categoryIds = categories.map((cat) => cat.id);

    await Promise.all(
      categories.map((category) =>
        category.imageUrl ? this.deleteIfExists(category.imageUrl) : null,
      ),
    );

    await this.prisma.categoryTranslation.deleteMany({
      where: { categoryId: { in: categoryIds } },
    });

    const result = await this.prisma.category.deleteMany({
      where: { slug: { in: slugs } },
    });

    return {
      deletedCount: result.count,
      message: `Deleted ${result.count} categories successfully`,
    };
  }

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
      console.log(`✅ Deleted old image from S3: ${key}`);
    } catch (error) {
      console.error('❌ Failed to delete old image from S3:', error);
    }
  }

  private getSlug(translations: TranslationDto[]): string {
    const enTranslation = translations.find((t) => t.language === 'en');

    if (!enTranslation) {
      throw new BadRequestException(
        'English translation is required for slug generation.',
      );
    }

    const slug = slugify(enTranslation.name);
    return slug;
  }
}

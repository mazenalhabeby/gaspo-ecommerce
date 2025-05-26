import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { CreateCategoryDto } from './dto/create-category.dto';
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
      const category = await this.prisma.category.create({
        data: { ...dto, imageUrl },
      });
      return category;
    } catch (error: any) {
      throw handlePrismaError(error, 'category');
    }
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
    return categories;
  }

  async findOne(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { products: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(slug: string, dto: UpdateCategoryDto, newImageUrl?: string) {
    const existing = await this.prisma.category.findUnique({ where: { slug } });

    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    if (existing.imageUrl && newImageUrl && existing.imageUrl !== newImageUrl) {
      await this.deleteIfExists(existing.imageUrl);
    }

    try {
      const updated = await this.prisma.category.update({
        where: { slug },
        data: {
          ...dto,
          imageUrl: newImageUrl ?? existing.imageUrl,
        },
      });
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

    return await this.prisma.category.delete({ where: { id } });
  }

  async removeMany(ids: string[]) {
    const categories = await this.prisma.category.findMany({
      where: { id: { in: ids } },
    });

    for (const category of categories) {
      if (category.imageUrl) {
        await this.deleteIfExists(category.imageUrl);
      }
    }

    return this.prisma.category.deleteMany({
      where: { id: { in: ids } },
    });
  }

  private async deleteIfExists(imageUrl: string) {
    const bucket = process.env.S3_BUCKET;
    const s3BaseUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

    const key = imageUrl.replace(s3BaseUrl, '');

    if (!key) return;

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
      console.log(`✅ Deleted old image from S3: ${key}`);
    } catch (error) {
      console.error('❌ Failed to delete old image from S3:', error);
    }
  }
}

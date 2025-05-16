import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@Prisma/client';
import { PrismaService } from 'src/common';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new category in the database.
   *
   * @param dto - The data transfer object containing the details of the category to be created.
   * @returns A promise that resolves to the created `Category` object.
   * @throws ConflictException - If a category with the same name already exists.
   * @throws BadRequestException - If the category could not be created due to other reasons.
   */
  async create(dto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.create({
        data: { name: dto.name },
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002' &&
        (
          error as { code?: string; meta?: { target?: string[] } }
        ).meta?.target?.includes('name')
      ) {
        throw new ConflictException('Category name must be unique');
      }
      throw new BadRequestException('Could not create category');
    }
  }

  /**
   * Updates an existing category with the provided data.
   *
   * @param id - The unique identifier of the category to update.
   * @param dto - The data transfer object containing the updated category details.
   * @returns A promise that resolves to the updated category.
   * @throws NotFoundException - If the category with the given ID does not exist.
   * @throws BadRequestException - If the category could not be updated due to invalid data or other issues.
   */
  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const exists = await this.prisma.category.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Category not found');

    try {
      return await this.prisma.category.update({
        where: { id },
        data: { ...dto },
      });
    } catch {
      throw new BadRequestException('Could not update category');
    }
  }

  /**
   * Deletes a category by its unique identifier.
   *
   * @param id - The unique identifier of the category to delete.
   * @returns A promise that resolves when the category is successfully deleted.
   * @throws {NotFoundException} If the category with the given ID does not exist.
   * @throws {BadRequestException} If the category contains associated products and cannot be deleted.
   */
  async delete(id: string): Promise<{ id: string }> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.products.length > 0) {
      throw new BadRequestException('Cannot delete category with products');
    }

    const deleted = await this.prisma.category.delete({ where: { id } });
    return { id: deleted.id };
  }

  /**
   * Retrieves all categories from the database, including their associated products.
   *
   * @returns {Promise<Category[]>} A promise that resolves to an array of categories,
   * each including their related products.
   */
  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({ include: { products: true } });
  }

  /**
   * Retrieves a single category by its unique identifier.
   *
   * @param id - The unique identifier of the category to retrieve.
   * @returns A promise that resolves to the category object, including its associated products.
   * @throws NotFoundException - If no category is found with the given identifier.
   */
  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}

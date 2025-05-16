import { Controller, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@Prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return await this.productsService.createProduct(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.updateProduct(id, dto);
  }

  @Put()
  async updateMany(
    @Body() updates: { id: string; data: UpdateProductDto }[],
  ): Promise<Product[]> {
    return await this.productsService.updateMany(updates);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ id: string }> {
    return await this.productsService.deleteProduct(id);
  }
}

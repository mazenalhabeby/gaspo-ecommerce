import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductsDto } from './dto/delete-products.dto';
import { S3Interceptor } from 'src/common/interceptors/s3.interceptor';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    S3Interceptor('products', [{ name: 'images', maxCount: 10 }], {
      useSlugFolder: true,
      fallbackNameField: 'name',
    }),
  )
  create(
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
    },
    @Body() dto: CreateProductDto,
  ) {
    const imageFiles = files?.images ?? [];
    if (!imageFiles.length) {
      throw new BadRequestException('At least one product image is required.');
    }

    return this.productsService.create(dto, files);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }

  @Patch(':slug')
  @UseInterceptors(
    S3Interceptor('products', [{ name: 'images', maxCount: 10 }], {
      useSlugFolder: true,
      fallbackNameField: 'id',
    }),
  )
  update(
    @Param('slug') slug: string,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
    },
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(slug, dto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Delete()
  removeMany(@Body() dto: DeleteProductsDto) {
    return this.productsService.removeMany(dto.slugs);
  }
}

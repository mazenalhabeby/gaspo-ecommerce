import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { S3Interceptor } from 'src/common/interceptors/s3.interceptor';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    S3Interceptor('products', [{ name: 'images', maxCount: 10 }]),
  )
  create(
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
    },
    @Body() dto: CreateProductDto,
  ) {
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
}

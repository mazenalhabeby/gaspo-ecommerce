import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, TranslationDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { S3Interceptor } from 'src/common/interceptors/s3.interceptor';
import { DeleteCategoriesDto } from './dto/delete-caredories.dto';
import { ParseJsonPipe } from 'src/common';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(
    S3Interceptor('categories', [{ name: 'image', maxCount: 1 }]),
  )
  create(
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Body('translations', ParseJsonPipe) translations: TranslationDto[],
    @Body() categoryData: Omit<CreateCategoryDto, 'translations'>,
  ) {
    const file = files.image?.[0];
    if (!file) throw new BadRequestException('Image upload failed');

    const s3File = file as Express.Multer.File & { location?: string };
    if (typeof s3File.location !== 'string') {
      throw new BadRequestException('Image upload failed: missing S3 location');
    }

    const dto: CreateCategoryDto = {
      ...categoryData,
      translations,
    };

    return this.categoriesService.create(dto, s3File.location);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }

  @Patch(':slug')
  @UseInterceptors(
    S3Interceptor('categories', [{ name: 'image', maxCount: 1 }]),
  )
  async updateCategory(
    @Param('slug') slug: string,
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Body('translations', ParseJsonPipe) translations: TranslationDto[],
    @Body() categoryData: Omit<UpdateCategoryDto, 'translations'>,
  ) {
    const file = files?.image?.[0] as Express.Multer.File & {
      location?: string;
    };

    const newImageUrl = file?.location;

    const dto: UpdateCategoryDto = {
      ...categoryData,
      translations,
    };

    return this.categoriesService.update(slug, dto, newImageUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Delete()
  removeMany(@Body() dto: DeleteCategoriesDto) {
    console.log(dto);
    return this.categoriesService.removeMany(dto.slugs);
  }
}

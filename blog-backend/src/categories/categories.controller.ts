import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Get all categories
  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  // Get a category by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // Create a new category
  @Post()
  async create(@Body('name') name: string) {
    return this.categoriesService.create(name);
  }

  // Add categories to a content
  @Post('content/:contentId/categories')
  async addCategoriesToContent(
    @Param('contentId') contentId: string,
    @Body('categoryIds') categoryIds: string[],
  ) {
    return this.categoriesService.addCategoriesToContent(contentId, categoryIds);
  }

  // Get categories associated with content
  @Get('content/:contentId/categories')
  async getCategoriesForContent(@Param('contentId') contentId: string) {
    return this.categoriesService.getCategoriesForContent(contentId);
  }
}

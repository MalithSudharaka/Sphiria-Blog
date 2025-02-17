import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all categories
  async findAll() {
    return this.prisma.categories.findMany();
  }

  // Get a category by ID
  async findOne(id: string) {
    const category = await this.prisma.categories.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // Create a new category
  async create(name: string) {
    try {
      return await this.prisma.categories.create({
        data: { name },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Category name must be unique');
      }
      throw new BadRequestException('Failed to create category');
    }
  }

  // Add categories to content
  async addCategoriesToContent(contentId: string, categoryIds: string[]) {
    const categories = await this.prisma.categories.findMany({
      where: { id: { in: categoryIds } },
    });
  
    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('Some categories not found');
    }
  
    const contentCategoriesData: Prisma.ContentCategoryCreateManyInput[] = categoryIds.map((categoryId) => ({
      contentId,
      categoryId,
    }));
  
    return this.prisma.contentCategory.createMany({
      data: contentCategoriesData,
    });
  }
  

  // Get categories associated with a content
  async getCategoriesForContent(contentId: string) {
    return this.prisma.contentCategory.findMany({
      where: { contentId },
      include: { category: true }, // Include category data
    });
  }
}

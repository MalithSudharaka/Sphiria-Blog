import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.categories.findMany();
  }

  async findOne(id: string) {
    const category = await this.prisma.categories.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(name: string) {
    try {
      return await this.prisma.categories.create({
        data: { name },
      });
    } catch (error) {
      throw new BadRequestException('Category creation failed');
    }
  }

  async update(id: string, name: string) {
    const existingCategory = await this.prisma.categories.findUnique({ where: { id } });
    if (!existingCategory) throw new NotFoundException('Category not found');

    return this.prisma.categories.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: string) {
    const category = await this.prisma.categories.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.categories.delete({
      where: { id },
    });
  }

  async addCategoriesToContent(contentId: string, categoryIds: string[]) {
    return this.prisma.content.update({
      where: { id: contentId },
      data: {
        categories: {
          connect: categoryIds.map(id => ({ id })),
        },
      },
    });
  }

  async getCategoriesForContent(contentId: string) {
    return this.prisma.content.findUnique({
      where: { id: contentId },
      include: { categories: true },
    });
  }
}

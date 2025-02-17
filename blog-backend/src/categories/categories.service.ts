import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.categories.findMany();
  }

  async findOne(id: string) {
    const category = await this.prisma.categories.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

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
}

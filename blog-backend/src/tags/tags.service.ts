import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  // Get all tags
  async findAll() {
    return this.prisma.tag.findMany();
  }

  // Fetch tags that match the query
  async getSuggestedTags(query: string) {
    return this.prisma.tag.findMany({
      where: {
        name: {
          startsWith: query, // Match tags starting with the query string
        },
      },
      select: {
        name: true,
      },
    });
  }

  // Create a new tag
  async createTag(name: string) {
    try {
      const newTag = await this.prisma.tag.create({
        data: { name },
      });
      return newTag; // Ensure this is returning a valid object
    } catch (error) {
      throw new BadRequestException('Tag creation failed');
    }
  }
  

  // Update an existing tag
  async updateTag(id: string, name: string) {
    const existingTag = await this.prisma.tag.findUnique({ where: { id } });

    if (!existingTag) {
      throw new NotFoundException('Tag not found');
    }

    return this.prisma.tag.update({
      where: { id },
      data: { name },
    });
  }

  // Delete a tag
  async deleteTag(id: string) {
    const existingTag = await this.prisma.tag.findUnique({ where: { id } });

    if (!existingTag) {
      throw new NotFoundException('Tag not found');
    }

    return this.prisma.tag.delete({
      where: { id },
    });
  }
}

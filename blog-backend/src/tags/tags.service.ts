import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.tag.create({
      data: {
        name,
      },
    });
  }
}

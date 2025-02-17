import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async saveContent(content: string, tagNames: string[], categoryNames: string[]) {
    // Find or create tags
    const tags = await Promise.all(
      tagNames.map(async (name) =>
        this.prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );

    // Find or create categories
    const categories = await Promise.all(
      categoryNames.map(async (name) =>
        this.prisma.categories.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );

    // Create content with related tags and categories
    return this.prisma.content.create({
      data: {
        content,
        tags: {
          create: tags.map(tag => ({
            tag: { connect: { id: tag.id } },
          })),
        },
        categories: {
          create: categories.map(category => ({
            category: { connect: { id: category.id } },
          })),
        },
      },
      include: { tags: { include: { tag: true } }, categories: { include: { category: true } } },
    });
  }

  async getContents() {
    const contents = await this.prisma.content.findMany({
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
    });

    // Transform the result to include only tag and category names
    return contents.map((content) => ({
      id: content.id,
      content: content.content,
      tags: content.tags.map(tagRelation => tagRelation.tag.name),  // Extract only tag names
      categories: content.categories.map(categoryRelation => categoryRelation.category.name),  // Extract only category names
    }));
  }
}

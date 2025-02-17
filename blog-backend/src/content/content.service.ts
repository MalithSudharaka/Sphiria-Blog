import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async saveContent(content: string, tagNames: string[]) {
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

    // Create content with related tags
    return this.prisma.content.create({
      data: {
        content,
        tags: {
          create: tags.map(tag => ({
            tag: { connect: { id: tag.id } },
          })),
        },
      },
      include: { tags: { include: { tag: true } } },
    });
  }

  async getContents() {
    const contents = await this.prisma.content.findMany({
      include: {
        tags: { include: { tag: true } },
      },
    });

    // Transform the result to include only tag names
    return contents.map((content) => ({
      id: content.id,
      content: content.content,
      tags: content.tags.map(tagRelation => tagRelation.tag.name), // Extract only tag names
    }));
  }
}

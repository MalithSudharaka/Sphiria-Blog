import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';

export enum ContentType {
  EVENTS = 'EVENTS',
  BLOG = 'BLOG',
  NEWS = 'NEWS',
  CHARITY = 'CHARITY',
  OTHER = 'OTHER',
}

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async saveContent(
    content: string,
    tagNames: string[],
    categoryNames: string[],
    type: ContentType,
    title: string,
    location: string,
    time: string,
    thumbnail: string,
  ) {
    // Find or create tags
    const tags = await Promise.all(
      tagNames.map(async (name) =>
        this.prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        }),
      ),
    );

    // Find or create categories
    const categories = await Promise.all(
      categoryNames.map(async (name) =>
        this.prisma.categories.upsert({
          where: { name },
          update: {},
          create: { name },
        }),
      ),
    );

    // Handle time validation (if it's a valid ISO-8601 string)
    let validTime: Date | null = null;
    if (time && !isNaN(new Date(time).getTime())) {
      validTime = new Date(time); // Valid time string, convert to Date object
    } else if (type === ContentType.EVENTS) {
      throw new Error('Invalid event time');
    }

    // Create content with related tags, categories, and additional fields (type, title, location, time)
    return this.prisma.content.create({
      data: {
        content,
        type,
        title,
        location,
        time: validTime,
        thumbnail,
        tags: {
          create: tags.map((tag) => ({
            tag: { connect: { id: tag.id } },
          })),
        },
        categories: {
          create: categories.map((category) => ({
            category: { connect: { id: category.id } },
          })),
        },
      },
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
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
      title: content.title, // Include title in the response
      type: content.type, // Include type in the response
      thumbnail: content.thumbnail, // Include thumbnail in the response
      location: content.location, // Include location (if type is event)
      time: content.time, // Include time (if type is event)
      tags: content.tags.map((tagRelation) => tagRelation.tag.name), // Extract only tag names
      categories: content.categories.map(
        (categoryRelation) => categoryRelation.category.name,
      ), // Extract only category names
    }));
  }
}

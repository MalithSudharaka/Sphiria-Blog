import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';

export enum ContentType {
  EVENTS = 'EVENTS',
  BLOG = 'BLOG',
  NEWS = 'NEWS',
  CHARITY = 'CHARITY',
  OTHER = 'OTHER',
}

export enum ContentMode {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
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
    mode: string,
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
        mode,
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

  async getContents(filter?: { mode?: string }) {
    const contents = await this.prisma.content.findMany({
      where: filter, // Add filter condition here
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
    });

    return contents.map((content) => ({
      id: content.id,
      content: content.content,
      title: content.title,
      type: content.type,
      thumbnail: content.thumbnail,
      location: content.location,
      mode: content.mode,
      time: content.time,
      tags: content.tags.map((tagRelation) => tagRelation.tag.name),
      categories: content.categories.map(
        (categoryRelation) => categoryRelation.category.name,
      ),
    }));
  }

  // Update method in ContentService
  async updateContent(
    id: string,
    content: string,
    tagNames: string[],
    categoryNames: string[],
    type: ContentType,
    title: string,
    location: string,
    time: string,
    thumbnail: string,
    mode: ContentMode,
  ) {
    // Validation
    if (!content || !title || !type) {
      throw new Error('Content, title, and type are required');
    }

    if (type === ContentType.EVENTS && (!location || !time)) {
      throw new Error('Location and time are required for events');
    }

    if (!Object.values(ContentMode).includes(mode)) {
      throw new Error('Invalid content mode');
    }

    // Transaction for data consistency
    return this.prisma.$transaction(async (prisma) => {
      // Handle tags
      const tags = await Promise.all(
        tagNames.map((name) =>
          prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
          }),
        ),
      );

      // Handle categories
      const categories = await Promise.all(
        categoryNames.map((name) =>
          prisma.categories.upsert({
            where: { name },
            update: {},
            create: { name },
          }),
        ),
      );

      // Process time
      const validTime = time ? new Date(time) : null;
      if (
        type === ContentType.EVENTS &&
        (!validTime || isNaN(validTime.getTime()))
      ) {
        throw new Error('Valid time is required for events');
      }

      // Update content with relations
      const updatedContent = await prisma.content.update({
        where: { id },
        data: {
          content,
          title,
          type,
          location,
          time: validTime,
          thumbnail,
          mode,
          tags: {
            deleteMany: {},
            create: tags.map((tag) => ({
              tag: { connect: { id: tag.id } },
            })),
          },
          categories: {
            deleteMany: {},
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

      // Transform response
      return {
        id: updatedContent.id,
        content: updatedContent.content,
        title: updatedContent.title,
        type: updatedContent.type,
        thumbnail: updatedContent.thumbnail,
        location: updatedContent.location,
        mode: updatedContent.mode,
        time: updatedContent.time,
        tags: updatedContent.tags.map((tr) => tr.tag.name),
        categories: updatedContent.categories.map((cr) => cr.category.name),
      };
    });
  }
}

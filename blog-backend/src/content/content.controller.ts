import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Query,
  Put,
  Param,
} from '@nestjs/common';
import { ContentService, ContentType, ContentMode } from './content.service';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  async createContent(
    @Body()
    body: {
      content: string;
      title: string;
      type: ContentType;
      tags: string[];
      categories: string[];
      location?: string;
      time?: string;
      thumbnail?: string;
      mode: string;
      seoTitle: string;
      metaDescription: string;
      metaKeywords: string[];
    },
    @Res() res,
  ) {
    // Validation
    if (!body.content || !body.title || !body.type) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Content, title, and type are required',
      });
    }

    if (body.type === ContentType.EVENTS && (!body.location || !body.time)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Location and time are required for events',
      });
    }

    try {
      const savedContent = await this.contentService.saveContent(
        body.content,
        body.tags,
        body.categories,
        body.type,
        body.title,
        body.location || '', // Provide empty string default
        body.time || '', // Provide empty string default
        body.thumbnail || '',
        body.mode,
        body.seoTitle,
        body.metaDescription,
        body.metaKeywords,
      );

      return res.status(HttpStatus.CREATED).json({
        message: 'Content saved successfully!',
        data: savedContent,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  }

  @Get()
  async getContents(@Query('mode') mode: string, @Res() res) {
    try {
      const filter = mode ? { mode } : {};
      const contents = await this.contentService.getContents(filter);
      return res.status(HttpStatus.OK).json(contents);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  }

  @Put(':id')
  async updateContent(
    @Param('id') id: string,
    @Body()
    body: {
      content: string;
      title: string;
      type: ContentType;
      tags: string[];
      categories: string[];
      location?: string;
      time?: string;
      thumbnail?: string;
      mode: ContentMode;
      seoTitle: string;
      metaDescription: string;
      metaKeywords: string[];
    },
    @Res() res,
  ) {
    try {
      const updatedContent = await this.contentService.updateContent(
        id,
        body.content,
        body.tags,
        body.categories,
        body.type,
        body.title,
        body.location || '', // Provide empty string default
        body.time || '', // Provide empty string default
        body.thumbnail || '',
        body.mode,
        body.seoTitle,
        body.metaDescription,
        body.metaKeywords,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Content updated successfully',
        data: updatedContent,
      });
    } catch (error) {
      const status = error.message.includes('not found')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;

      return res.status(status).json({
        error: error.message,
      });
    }
  }
}

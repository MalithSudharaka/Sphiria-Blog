import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ContentService } from './content.service';
export enum ContentType {
  EVENTS = 'EVENTS',
  BLOG = 'BLOG',
  NEWS = 'NEWS',
  CHARITY = 'CHARITY',
  OTHER = 'OTHER',
}

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @Post()
  async saveContent(
    @Body('content') content: string,
    @Body('title') title: string, // Add title parameter
    @Body('type') type: ContentType, // Add type parameter
    @Body('tags') tags: string[],
    @Body('categories') categories: string[],
    @Body('location') location: string, // Add location parameter (for events)
    @Body('time') time: string, // Add time parameter (for events)
    @Res() res,
  ) {
    if (!content || !title || !type) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Content, title, and type are required',
      });
    }

    // Validate that location and time are provided for events
    if (type === ContentType.EVENTS && (!location || !time)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Location and time are required for events',
      });
    }
    const savedContent = await this.contentService.saveContent(
      content,
      tags,
      categories,
      type,
      title,
      location,
      time,
    );

    return res.status(HttpStatus.CREATED).json({
      message: 'Content saved successfully!',
      data: savedContent,
    });
  }

  @Get()
  async getContents(@Res() res) {
    const contents = await this.contentService.getContents();
    return res.status(HttpStatus.OK).json(contents);
  }
}

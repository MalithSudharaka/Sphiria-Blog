import { Controller, Get, Post, Body, Res, HttpStatus,Query, Put, Param } from '@nestjs/common';
import { ContentService } from './content.service';
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
    @Body('thumbnail') thumbnail: string, // Add thumbnail parameter
    @Body('mode') mode: string, // Add thumbnail parameter
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
      thumbnail,
      mode,
    );

    return res.status(HttpStatus.CREATED).json({
      message: 'Content saved successfully!',
      data: savedContent,
    });
  }

  @Get()
  async getContents(@Query('mode') mode: string, @Res() res) {
    const filter = mode ? { mode } : {};
    const contents = await this.contentService.getContents(filter);
    return res.status(HttpStatus.OK).json(contents);
  }

  @Put(':id')
async updateContent(
  @Param('id') id: string,
  @Body() body: {
    content: string;
    title: string;
    type: ContentType;
    tags: string[];
    categories: string[];
    location: string;
    time: string;
    thumbnail: string;
    mode: ContentMode;
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
      body.location,
      body.time,
      body.thumbnail,
      body.mode
    );
    
    return res.status(HttpStatus.OK).json({
      message: 'Content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      error: error.message
    });
  }
}
}

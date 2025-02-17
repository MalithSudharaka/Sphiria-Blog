import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  async saveContent(
    @Body('content') content: string,
    @Body('tags') tags: string[],
    @Res() res
  ) {
    if (!content) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Content is required' });
    }

    const savedContent = await this.contentService.saveContent(content, tags);
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

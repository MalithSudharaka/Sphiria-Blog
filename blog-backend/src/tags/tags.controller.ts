import { Controller, Get, Post, Body, Query, Res, HttpStatus } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  // Endpoint to get tag suggestions based on query
  @Get('suggest')
  async suggestTags(@Query('query') query: string, @Res() res) {
    const suggestedTags = await this.tagService.getSuggestedTags(query);
    return res.status(HttpStatus.OK).json(suggestedTags);
  }

  // Endpoint to create a new tag
  @Post()
  async createTag(@Body() body: { name: string }, @Res() res) {
    const tag = await this.tagService.createTag(body.name);
    return res.status(HttpStatus.CREATED).json({ message: 'Tag created', tag });
  }
}

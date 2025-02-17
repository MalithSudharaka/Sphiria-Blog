import { 
    Controller, Get, Post, Patch, Delete, Body, Query, Param, Res, HttpStatus, BadRequestException, NotFoundException 
  } from '@nestjs/common';
  import { TagsService } from './tags.service';
  
  @Controller('tags')
  export class TagsController {
    constructor(private readonly tagService: TagsService) {}
  
    // Get all tags
    @Get()
    async findAll() {
      return this.tagService.findAll();
    }
  
    // Get tag suggestions based on query
    @Get('suggest')
    async suggestTags(@Query('query') query: string, @Res() res) {
      const suggestedTags = await this.tagService.getSuggestedTags(query);
      return res.status(HttpStatus.OK).json(suggestedTags);
    }
  
    // Create a new tag
    @Post()
    async createTag(@Body() body: { name: string }, @Res() res) {
      if (!body.name) {
        throw new BadRequestException('Tag name is required');
      }
      const tag = await this.tagService.createTag(body.name);
      return res.status(HttpStatus.CREATED).json({ message: 'Tag created', tag });
    }
  
    // Update an existing tag
    @Patch(':id')
    async updateTag(@Param('id') id: string, @Body() body: { name: string }, @Res() res) {
      if (!body.name) {
        throw new BadRequestException('Tag name is required');
      }
      const updatedTag = await this.tagService.updateTag(id, body.name);
      return res.status(HttpStatus.OK).json({ message: 'Tag updated', updatedTag });
    }
  
    // Delete a tag
    @Delete(':id')
    async deleteTag(@Param('id') id: string, @Res() res) {
      await this.tagService.deleteTag(id);
      return res.status(HttpStatus.OK).json({ message: 'Tag deleted' });
    }
  }
  
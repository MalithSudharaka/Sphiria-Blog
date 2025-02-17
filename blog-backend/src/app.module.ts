import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ContentModule } from './content/content.module';
import { TagsService } from './tags/tags.service';
import { TagsController } from './tags/tags.controller';
import { TagsModule } from './tags/tags.module';
import { CategoriesService } from './categories/categories.service';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [ContentModule, TagsModule, CategoriesModule],
  controllers: [AppController, TagsController, CategoriesController],
  providers: [AppService, PrismaService, TagsService, CategoriesService],
})
export class AppModule {}

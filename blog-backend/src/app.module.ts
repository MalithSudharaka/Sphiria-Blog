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
import { MetaSettingsService } from './meta-settings/meta-settings.service';
import { MetaSettingsController } from './meta-settings/meta-settings.controller';
import { MetaSettingsModule } from './meta-settings/meta-settings.module';

@Module({
  imports: [ContentModule, TagsModule, CategoriesModule, MetaSettingsModule],
  controllers: [AppController, TagsController, CategoriesController, MetaSettingsController],
  providers: [AppService, PrismaService, TagsService, CategoriesService, MetaSettingsService],
})
export class AppModule {}

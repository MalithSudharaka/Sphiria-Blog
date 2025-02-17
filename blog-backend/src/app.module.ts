import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ContentModule } from './content/content.module';
import { TagsService } from './tags/tags.service';
import { TagsController } from './tags/tags.controller';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [ContentModule, TagsModule],
  controllers: [AppController, TagsController],
  providers: [AppService, PrismaService, TagsService],
})
export class AppModule {}

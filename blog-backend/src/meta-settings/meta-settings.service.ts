import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMetaSettingsDto } from './dto/create-meta-settings.dto';

@Injectable()
export class MetaSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    return this.prisma.metaSettings.findFirst();
  }

  async updateSettings(data: CreateMetaSettingsDto) {
    const existing = await this.prisma.metaSettings.findFirst();
    if (existing) {
      return this.prisma.metaSettings.update({
        where: { id: existing.id },
        data,
      });
    }
    return this.prisma.metaSettings.create({ data });
  }
}

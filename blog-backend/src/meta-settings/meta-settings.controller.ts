import { Controller, Get, Put, Body } from '@nestjs/common';
import { MetaSettingsService } from './meta-settings.service';
import { CreateMetaSettingsDto } from './dto/create-meta-settings.dto';

@Controller('meta-settings')
export class MetaSettingsController {
  constructor(private readonly service: MetaSettingsService) {}

  @Get()
  getSettings() {
    return this.service.getSettings();
  }

  @Put()
  updateSettings(@Body() data: CreateMetaSettingsDto) {
    return this.service.updateSettings(data);
  }
}

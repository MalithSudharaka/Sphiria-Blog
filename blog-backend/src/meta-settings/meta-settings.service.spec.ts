import { Test, TestingModule } from '@nestjs/testing';
import { MetaSettingsService } from './meta-settings.service';

describe('MetaSettingsService', () => {
  let service: MetaSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetaSettingsService],
    }).compile();

    service = module.get<MetaSettingsService>(MetaSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

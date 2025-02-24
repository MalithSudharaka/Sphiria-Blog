import { Test, TestingModule } from '@nestjs/testing';
import { MetaSettingsController } from './meta-settings.controller';

describe('MetaSettingsController', () => {
  let controller: MetaSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetaSettingsController],
    }).compile();

    controller = module.get<MetaSettingsController>(MetaSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

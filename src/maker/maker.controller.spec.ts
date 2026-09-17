import { Test, TestingModule } from '@nestjs/testing';
import { MakerController } from './maker.controller';

describe('MakerController', () => {
  let controller: MakerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MakerController],
    }).compile();

    controller = module.get<MakerController>(MakerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

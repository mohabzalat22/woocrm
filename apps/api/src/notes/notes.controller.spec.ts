import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('NotesController', () => {
  let controller: NotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { Feature1Service } from './feature1/feature1.module';
import { Feature2Service } from './feature2/feature2.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: Feature1Service,
          useValue: { getHello: () => 'Hello from Feature1!' },
        },
        {
          provide: Feature2Service,
          useValue: { getHello: () => 'Hello from Feature2!' },
        },
      ],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);

      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const oldDemoMessage = process.env.RAILWAY_DEMO_MESSAGE;

  beforeEach(async () => {
    process.env.RAILWAY_DEMO_MESSAGE = 'demo-from-test';
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    if (oldDemoMessage === undefined) {
      delete process.env.RAILWAY_DEMO_MESSAGE;
      return;
    }
    process.env.RAILWAY_DEMO_MESSAGE = oldDemoMessage;
  });

  describe('root', () => {
    it('should return hello world and railway variable', () => {
      expect(appController.getHello()).toBe('Hello World!\ndemo-from-test');
    });
  });
});

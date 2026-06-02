import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const railwayDemoVar = process.env.RAILWAY_DEMO_MESSAGE ?? 'not-set';
    return `Hello World!\n${railwayDemoVar}`;
  }
}

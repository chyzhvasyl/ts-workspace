import { Controller, Get } from '@nestjs/common';

import { Feature1Service } from './feature1/feature1.module';
import { Feature2Service } from './feature2/feature2.module';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly feature1: Feature1Service,
    private readonly feature2: Feature2Service,
  ) {}

  @Get()
  getData(): { message: string } {
    return this.appService.getData();
  }
}

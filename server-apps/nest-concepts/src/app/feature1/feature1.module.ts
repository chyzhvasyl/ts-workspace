import { Injectable, Module } from '@nestjs/common';

import { Feature2Module, Feature2Service } from '../feature2/feature2.module';

@Injectable()
export class Feature1Service {
  getHello(): string {
    return 'Hello from Feature1!';
  }
}

@Module({
  providers: [Feature1Service],
  exports: [Feature1Service],
  imports: [Feature2Module],
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Feature1Module {
  constructor(private readonly _feature2: Feature2Service) {}
}

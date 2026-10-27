import { Inject, Injectable, Module } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class Feature2Service {
  constructor(@Inject(REQUEST) _request: Request) {
    // Injected for DI only; never read.
  }

  getHello(): string {
    return 'Hello from Feature2!';
  }
}

@Module({
  providers: [Feature2Service],
  exports: [Feature2Service],
})
export class Feature2Module {}

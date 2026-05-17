import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { Feature1Service } from '../feature1/feature1.module';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly feature1: Feature1Service) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}

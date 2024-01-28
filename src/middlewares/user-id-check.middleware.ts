import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (isNaN(+req.params.id) || +req.params.id <= 0) {
      throw new BadRequestException('Invalid ID');
    }

    return next();
  }
}

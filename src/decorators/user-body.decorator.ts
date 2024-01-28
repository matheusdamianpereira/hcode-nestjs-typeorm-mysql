import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';

export const UserBody = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request.body) {
      throw new BadRequestException('Body não encontrado.');
    }

    const body = { ...request.body };

    if (body.role) {
      body.role = +body.role;
    }

    if (!filter) {
      return body;
    }

    return body[filter];
  },
);

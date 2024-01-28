import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const User = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new NotFoundException(
        'Usuário não encontrador no Request. Use o AuthGuard para obter o usuário.',
      );
    }

    if (!filter) {
      return request.user;
    }

    return request.user[filter];
  },
);

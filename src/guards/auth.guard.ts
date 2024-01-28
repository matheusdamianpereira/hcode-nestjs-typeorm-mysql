import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    const formattedAuthorization = (authorization ?? '').replace('Bearer ', '');

    try {
      const data = await this.authService.checkToken(formattedAuthorization);

      request.tokenPayload = data;

      request.user = await this.userService.show(data.id);

      return true;
    } catch (err) {
      return false;
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { AuthRegisterDTOMock } from '../testing/auth-register-dto.mock';
import { JwtAccessTokenMock } from '../testing/jwt-access-token.mock';
import { JwtResetTokenMock } from '../testing/jwt-reset-token.mock';
import { JwtServiceMock } from '../testing/jwt-service.mock';
import { MailerServiceMock } from '../testing/mailer-service.mock';
import { UserEntityListMock } from '../testing/user-entity-list.mock';
import { UserRepositoryMock } from '../testing/user-repository.mock';
import { UserServiceMock } from '../testing/user-service.mock';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepositoryMock,
        JwtServiceMock,
        UserServiceMock,
        MailerServiceMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('token', () => {
    it('createToken method', async () => {
      const result = await authService.createToken(UserEntityListMock[0]);

      expect(result).toEqual({ accessToken: JwtAccessTokenMock });
    });

    it('isValidToken method', async () => {
      const result = await authService.checkToken(JwtAccessTokenMock);

      expect(result).toBeTruthy();
    });
  });

  describe('authentication', () => {
    it('login method', async () => {
      const result = await authService.login('johndoe@gmail.com', '123456');

      expect(result).toEqual({ accessToken: JwtAccessTokenMock });
    });

    it('forget method', async () => {
      const result = await authService.forget('johndoe@gmail.com');

      expect(result).toEqual({ success: true });
    });

    it('reset method', async () => {
      const result = await authService.reset('654321', JwtResetTokenMock);

      expect(result).toEqual({ accessToken: JwtAccessTokenMock });
    });

    it('register method', async () => {
      const result = await authService.register(AuthRegisterDTOMock);

      expect(result).toEqual({ accessToken: JwtAccessTokenMock });
    });
  });
});

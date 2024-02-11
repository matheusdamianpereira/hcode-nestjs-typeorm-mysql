import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '../file/file.service';
import { AuthGuard } from '../guards/auth.guard';
import { AuthForgetDTOMock } from '../testing/auth-forget-dto.mock';
import { AuthLoginDTOMock } from '../testing/auth-login-dto.mock';
import { AuthRegisterDTOMock } from '../testing/auth-register-dto.mock';
import { AuthResetDTOMock } from '../testing/auth-reset-dto.mock';
import { AuthServiceMock } from '../testing/auth-service.mock';
import { FileServiceMock } from '../testing/file-service.mock';
import { getPhotoMock } from '../testing/get-photo.mock';
import { guardMock } from '../testing/guard.mock';
import { JwtAccessTokenMock } from '../testing/jwt-access-token.mock';
import { JwtResetTokenMock } from '../testing/jwt-reset-token.mock';
import { UserEntityListMock } from '../testing/user-entity-list.mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthServiceMock, FileServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    fileService = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
    expect(fileService).toBeDefined();
  });

  describe('Authentication flow', () => {
    test('login method', async () => {
      const result = await authController.login(AuthLoginDTOMock);

      expect(result).toEqual({ accessToken: JwtAccessTokenMock });
    });

    test('register method', async () => {
      const result = await authController.register(AuthRegisterDTOMock);

      expect(result).toEqual({ accessToken: JwtAccessTokenMock });
    });

    test('forget method', async () => {
      const result = await authController.forget(AuthForgetDTOMock);

      expect(result).toEqual({ success: true });
    });

    test('reset method', async () => {
      const result = await authController.reset(AuthResetDTOMock);

      expect(result).toEqual({ accessToken: JwtResetTokenMock });
    });
  });

  describe('Authenticated routes', () => {
    test('me method', async () => {
      const result = await authController.me(UserEntityListMock[0]);

      expect(result).toEqual(UserEntityListMock[0]);
    });

    test('uploadPhoto method', async () => {
      const photo = await getPhotoMock();

      const result = await authController.uploadPhoto(
        UserEntityListMock[0],
        photo,
      );

      expect(result).toEqual({ success: true });
    });
  });
});

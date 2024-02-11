import { AuthService } from '../auth/auth.service';
import { JwtAccessTokenMock } from './jwt-access-token.mock';
import { JwtPayloadMock } from './jwt-payload.mock';
import { JwtResetTokenMock } from './jwt-reset-token.mock';

export const AuthServiceMock = {
  provide: AuthService,
  useValue: {
    createToken: jest.fn().mockReturnValue({ accessToken: JwtAccessTokenMock }),
    checkToken: jest.fn().mockReturnValue(JwtPayloadMock),
    isValidToken: jest.fn().mockReturnValue(true),
    login: jest.fn().mockResolvedValue({ accessToken: JwtAccessTokenMock }),
    forget: jest.fn().mockResolvedValue({ success: true }),
    reset: jest.fn().mockResolvedValue({ accessToken: JwtResetTokenMock }),
    register: jest.fn().mockResolvedValue({ accessToken: JwtAccessTokenMock }),
  },
};

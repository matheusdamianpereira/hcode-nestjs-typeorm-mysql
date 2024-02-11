import { JwtService } from '@nestjs/jwt';
import { JwtAccessTokenMock } from './jwt-access-token.mock';
import { JwtPayloadMock } from './jwt-payload.mock';

export const JwtServiceMock = {
  provide: JwtService,
  useValue: {
    signAsync: jest.fn().mockResolvedValue(JwtAccessTokenMock),
    verifyAsync: jest.fn().mockResolvedValue(JwtPayloadMock),
  },
};

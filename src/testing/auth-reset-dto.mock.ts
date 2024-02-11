import { AuthResetDTO } from '../auth/dto/auth-reset.dto';
import { JwtResetTokenMock } from './jwt-reset-token.mock';

export const AuthResetDTOMock: AuthResetDTO = {
  password: '654321',
  token: JwtResetTokenMock,
};

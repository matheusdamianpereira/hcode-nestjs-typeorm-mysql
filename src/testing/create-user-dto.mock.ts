import { Role } from '../enums/role.enum';
import { CreateUserDTO } from '../user/dto/create-user.dto';

export const CreateUserDTOMock: CreateUserDTO = {
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  password: '123456',
  birthAt: '1990-01-01',
  role: Role.User,
};

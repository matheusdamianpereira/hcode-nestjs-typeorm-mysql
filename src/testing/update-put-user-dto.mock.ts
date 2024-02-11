import { Role } from '../enums/role.enum';
import { UpdatePutUserDTO } from '../user/dto/update-put-user.dto';

export const UpdatePutUserDTOMock: UpdatePutUserDTO = {
  name: 'John Doe Updated',
  email: 'johndoe@gmail.com',
  password: '123456',
  birthAt: '1990-01-01',
  role: Role.User,
};

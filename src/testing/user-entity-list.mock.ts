import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const UserEntityListMock: UserEntity[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '$2b$10$o7BeGx0wxfMP0tEqmEHW9uGin1OrGMqYRl4/yBjNSmAV6r1ToNdQK',
    birthAt: new Date('1990-01-01'),
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: '2 John Doe',
    email: '2johndoe@gmail.com',
    password: '$2b$10$o7BeGx0wxfMP0tEqmEHW9uGin1OrGMqYRl4/yBjNSmAV6r1ToNdQK',
    birthAt: new Date('1990-01-01'),
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: '3 John Doe',
    email: '3johndoe@gmail.com',
    password: '$2b$10$o7BeGx0wxfMP0tEqmEHW9uGin1OrGMqYRl4/yBjNSmAV6r1ToNdQK',
    birthAt: new Date('1990-01-01'),
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

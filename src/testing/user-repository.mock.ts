import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { UserEntityListMock } from './user-entity-list.mock';

export const UserRepositoryMock = {
  provide: getRepositoryToken(UserEntity),
  useValue: {
    existsBy: jest.fn().mockResolvedValue(true),
    create: jest.fn(),
    save: jest.fn().mockResolvedValue(UserEntityListMock[0]),
    find: jest.fn().mockResolvedValue(UserEntityListMock),
    findOneBy: jest.fn().mockResolvedValue(UserEntityListMock[0]),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

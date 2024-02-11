import { UserService } from '../user/user.service';
import { UserEntityListMock } from './user-entity-list.mock';

export const UserServiceMock = {
  provide: UserService,
  useValue: {
    create: jest.fn().mockResolvedValue(UserEntityListMock[0]),
    list: jest.fn().mockResolvedValue(UserEntityListMock),
    show: jest.fn().mockResolvedValue(UserEntityListMock[0]),
    update: jest.fn().mockResolvedValue(UserEntityListMock[0]),
    updatePartial: jest.fn().mockResolvedValue(UserEntityListMock[0]),
    delete: jest.fn().mockResolvedValue(true),
    exists: jest.fn().mockResolvedValue(true),
  },
};

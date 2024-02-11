import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTOMock } from '../testing/create-user-dto.mock';
import { UpdatePatchUserDTOMock } from '../testing/update-patch-user-dto.mock';
import { UpdatePutUserDTOMock } from '../testing/update-put-user-dto.mock';
import { UserEntityListMock } from '../testing/user-entity-list.mock';
import { UserRepositoryMock } from '../testing/user-repository.mock';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create', () => {
    it('create method', async () => {
      jest.spyOn(userRepository, 'existsBy').mockResolvedValueOnce(false);

      const result = await userService.create(CreateUserDTOMock);

      expect(result).toEqual(UserEntityListMock[0]);
    });
  });

  describe('read', () => {
    it('list method', async () => {
      const result = await userService.list();

      expect(result).toEqual(UserEntityListMock);
    });

    it('show method', async () => {
      const result = await userService.show(1);

      expect(result).toEqual(UserEntityListMock[0]);
    });
  });

  describe('update', () => {
    it('update method', async () => {
      const result = await userService.update(1, UpdatePutUserDTOMock);

      expect(result).toEqual(UserEntityListMock[0]);
    });

    it('updatePartial method', async () => {
      const result = await userService.updatePartial(1, UpdatePatchUserDTOMock);

      expect(result).toEqual(UserEntityListMock[0]);
    });
  });

  describe('delete', () => {
    it('delete method', async () => {
      const result = await userService.delete(1);

      expect(result).toBeTruthy();
    });
  });
});

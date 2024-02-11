import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDTO) {
    const existingUser = await this.usersRepository.existsBy({
      email: data.email,
    });

    if (existingUser) {
      throw new BadRequestException(`Este e-mail já está sendo usado.`);
    }

    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    const user = this.usersRepository.create(data);

    return await this.usersRepository.save(user);
  }

  async list() {
    return await this.usersRepository.find();
  }

  async show(id: number) {
    await this.exists(id);

    return await this.usersRepository.findOneBy({
      id,
    });
  }

  async update(
    id: number,
    { birthAt, email, name, password, role }: UpdatePutUserDTO,
  ) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    await this.usersRepository.update(id, {
      birthAt: birthAt ? new Date(birthAt) : null,
      email,
      name,
      password,
      role: +role,
    });

    return await this.show(id);
  }

  async updatePartial(
    id: number,
    { birthAt, password, ...user }: UpdatePatchUserDTO,
  ) {
    await this.exists(id);

    const data: any = { ...user };

    if (birthAt) {
      data.birthAt = new Date(birthAt);
    }

    if (password) {
      const salt = await bcrypt.genSalt();

      data.password = await bcrypt.hash(password, salt);
    }

    await this.usersRepository.update(id, data);

    return await this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);

    await this.usersRepository.delete({ id });

    return true;
  }

  async exists(id: number) {
    const existingUser = await this.usersRepository.existsBy({ id });

    if (!existingUser) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
}

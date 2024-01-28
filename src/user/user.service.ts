import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDTO) {
    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    return await this.prismaService.user.create({
      data,
    });
  }

  async list() {
    return await this.prismaService.user.findMany();
  }

  async show(id: number) {
    await this.exists(id);

    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    { birthAt, email, name, password, role }: UpdatePutUserDTO,
  ) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        birthAt: birthAt ? new Date(birthAt) : null,
        email,
        name,
        password,
        role: +role,
      },
    });
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

    return await this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prismaService.user.delete({ where: { id } });
  }

  async exists(id: number) {
    const existingUser = await this.prismaService.user.count({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
}

import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  private readonly issuer = 'login';
  private readonly audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  async createToken(user: User) {
    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      {
        expiresIn: '7 days',
        subject: `${user.id}`,
        issuer: this.issuer,
        audience: this.audience,
      },
    );

    return { accessToken };
  }

  async checkToken(token: string) {
    try {
      const data = await this.jwtService.verifyAsync(token, {
        issuer: this.issuer,
        audience: this.audience,
      });

      return data;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async isValidToken(token: string) {
    try {
      await this.checkToken(token);
      return true;
    } catch (err) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    return await this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail está incorreto.');
    }

    const token = await this.jwtService.signAsync(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: `${user.id}`,
        issuer: 'forget',
        audience: this.audience,
      },
    );

    await this.mailerService.sendMail({
      subject: 'Recuperação de senha',
      to: email,
      template: './forget',
      context: {
        name: user.name,
        token,
      },
    });

    return true;
  }

  async reset(password: string, token: string) {
    try {
      const data = await this.jwtService.verifyAsync(token, {
        issuer: 'forget',
        audience: this.audience,
      });

      if (isNaN(+data.id)) {
        throw new BadRequestException('Token inválido.');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await this.prismaService.user.update({
        where: {
          id: +data.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      return await this.createToken(user);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);

    return await this.createToken(user);
  }
}

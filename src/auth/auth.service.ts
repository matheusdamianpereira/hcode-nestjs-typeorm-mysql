import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  private readonly issuer = 'login';
  private readonly audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createToken(user: UserEntity) {
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
    const user = await this.usersRepository.findOneBy({
      email,
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
    const user = await this.usersRepository.findOneBy({
      email,
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

    return { success: true };
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

      await this.usersRepository.update(+data.id, {
        password: hashedPassword,
      });

      const user = await this.userService.show(+data.id);

      return await this.createToken(user);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async register(data: AuthRegisterDTO) {
    delete data.role;

    const user = await this.userService.create(data);

    return await this.createToken(user);
  }
}

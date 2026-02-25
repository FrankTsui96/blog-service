import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 登录并下发 Token
  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // 验证密码（bcrypt.compare 会将明文与数据库哈希值对比）
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { sub: user.id, email: user.email };
      console.log('payload', payload);
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('邮箱或密码错误');
  }

  // 注册用户
  async register(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      throw new BadRequestException('用户已存在');
    }
    const hashedPassword = await bcrypt.hash(pass, 10);
    return this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }
}

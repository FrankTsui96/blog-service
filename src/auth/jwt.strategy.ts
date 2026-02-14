import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma.service';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从 Authorization: Bearer <token> 中提取
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string, // 必须和 Module 里的 secret 一致
    });
  }

  // 验证通过后，会将 payload 挂载到 request.user 上
  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在或已失效');
    }

    // 返回的对象会被挂载到 request.user 上
    // 为了安全，我们不返回 password 字段
    return { userId: user.id, email: user.email };
  }
}

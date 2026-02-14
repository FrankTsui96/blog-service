import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  @ApiResponse({ status: 200, description: '注册成功' })
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }
}

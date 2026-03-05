import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  /** 邮箱 */
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  /** 密码 */
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Length } from 'class-validator';

export class CreateTagDto {
  /** 标签名称 */
  @IsString()
  @IsNotEmpty({ message: '标签名称不能为空' })
  @Length(1, 20, { message: '标签名称长度为1-20个字符' })
  name: string;

  /** 标签颜色 */
  @IsString()
  @IsOptional()
  color?: string;
}

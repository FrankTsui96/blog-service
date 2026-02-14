import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateArticleDto {
  /** 标题 */
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  @MinLength(5, { message: '标题至少5个字符' })
  title: string;

  /** 内容 */
  @IsString()
  content?: string;
}

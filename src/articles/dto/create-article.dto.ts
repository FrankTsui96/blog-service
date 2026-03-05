import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsDate,
  IsArray,
  ValidateNested,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleType } from '@prisma/client';

export class CreatePhotoDto {
  /** 图片URL */
  @IsString()
  @IsNotEmpty({ message: '图片URL不能为空' })
  url: string;

  /** 图片标题 */
  @IsString()
  @IsNotEmpty({ message: '图片标题不能为空' })
  title: string;

  /** 图片描述 */
  @IsString()
  @IsOptional()
  description?: string;

  /** 图片拍摄时间 */
  @Type(() => Date)
  @IsDate({ message: '拍摄时间格式不正确' })
  @IsOptional()
  shotAt?: Date;
}

export class CreateArticleDto {
  /** 标题 */
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  @MinLength(5, { message: '标题至少5个字符' })
  title: string;

  /** 副标题 */
  @IsString()
  @IsOptional()
  subtitle?: string;

  /** 封面图片URL */
  @IsString()
  @IsOptional()
  coverUrl?: string;

  /** 内容 */
  @IsString()
  @IsOptional()
  content?: string;

  /** 类型 */
  @IsEnum(ArticleType)
  @IsNotEmpty({ message: '类型不能为空' })
  type: ArticleType;

  /** 标签 */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagNames?: string[];

  /** 照片 */
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePhotoDto)
  photos?: CreatePhotoDto[];

  /** 作品 */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  workIds?: string[];

  /** 汉字 */
  @IsArray()
  @IsString({ each: true })
  @Length(1, 1, { each: true, message: '每个汉字必须是一个字符' })
  @IsOptional()
  characters?: string[];
}

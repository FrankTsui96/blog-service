import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleType, WorkType } from '@prisma/client';

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

export class CreateWorkDto {
  /** 作品类型 */
  @IsEnum(WorkType)
  @IsNotEmpty({ message: '作品类型不能为空' })
  type: WorkType;

  /** 作品标题 */
  @IsString()
  @IsNotEmpty({ message: '作品标题不能为空' })
  title: string;

  /** 作品副标题 */
  @IsString()
  @IsOptional()
  subtitle?: string;

  /** 作品描述 */
  @IsString()
  @IsOptional()
  description?: string;

  /** 作品封面图片URL */
  @IsString()
  @IsOptional()
  coverUrl?: string;

  /** 作品出版方/发行方/制作方 */
  @IsString()
  @IsOptional()
  publisher?: string;

  /** 作品出版时间/发行时间/制作时间 */
  @Type(() => Date)
  @IsDate({ message: '出版时间格式不正确' })
  @IsOptional()
  publishedAt?: Date;
}

export class CreateHanziDto {
  /** 汉字 */
  @IsString()
  @IsNotEmpty({ message: '汉字不能为空' })
  character: string;
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
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkDto)
  works?: CreateWorkDto[];

  /** 汉字 */
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateHanziDto)
  hanzi?: CreateHanziDto[];
}

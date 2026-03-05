import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { WorkType } from '@prisma/client';
import { Type } from 'class-transformer';

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

  /** 作品出版时间 */
  @Type(() => Date)
  @IsDate({ message: '出版时间格式不正确' })
  @IsOptional()
  publishedAt?: Date;

  /** 创作者/导演/表演者/制作人 */
  @IsString()
  @IsOptional()
  creator?: string;
}

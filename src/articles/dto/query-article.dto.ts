import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ArticleType } from '@prisma/client';

export class ArticleQueryDto extends PaginationDto {
  /** 文章标题关键字 */
  @IsString()
  @IsOptional()
  title?: string;

  /** 作者ID */
  @IsInt()
  @IsOptional()
  authorId?: string;

  /** 文章类型 */
  @IsEnum(ArticleType)
  @IsOptional()
  type?: ArticleType;

  // 这里可以继续扩展分类 ID、状态等搜索条件
}

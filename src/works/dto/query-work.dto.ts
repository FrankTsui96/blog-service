import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { WorkType } from '@prisma/client';

export class QueryWorkDto extends PaginationDto {
  /** 作品标题关键字 */
  @IsString()
  @IsOptional()
  title?: string;

  /** 作品类型 */
  @IsEnum(WorkType)
  @IsOptional()
  type?: WorkType;
}

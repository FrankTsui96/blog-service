import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class PhotoQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: '照片标题模糊查询' })
  @IsString()
  @IsOptional()
  title?: string;
}

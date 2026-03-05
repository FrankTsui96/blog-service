// src/common/dto/page-options.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly pageSize?: number = 10;

  // 计算跳过的条数
  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.pageSize ?? 10);
  }
}

import { IsString, IsOptional } from 'class-validator';

export class QueryTagDto {
  /** 标签名称关键字 */
  @IsString()
  @IsOptional()
  name?: string;
}

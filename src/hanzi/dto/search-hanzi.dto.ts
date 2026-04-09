import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchHanziDto {
  @ApiProperty({ description: '搜索关键词（汉字或拼音）', example: '好' })
  @IsString()
  @IsOptional()
  @MinLength(1)
  keyword?: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryBookDto {
  @ApiProperty({ description: '图书 ISBN', example: '9787101115970' })
  @IsString()
  @IsNotEmpty()
  isbn: string;
}

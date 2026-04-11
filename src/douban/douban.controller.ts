import { Controller, Get, Query } from '@nestjs/common';
import { DoubanService } from './douban.service';
import { QueryBookDto } from './dto/query-book.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('豆瓣图书')
@Controller('douban')
export class DoubanController {
  constructor(private readonly doubanService: DoubanService) {}

  @Get('book')
  @ApiOperation({ summary: '通过 ISBN 从豆瓣获取图书信息' })
  @ApiQuery({ name: 'isbn', type: String, description: '图书 ISBN' })
  async getBookInfo(@Query() query: QueryBookDto) {
    return this.doubanService.getBookInfoByISBN(query.isbn);
  }
}

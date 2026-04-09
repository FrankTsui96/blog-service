import { Controller, Get, Query } from '@nestjs/common';
import { HanziService } from './hanzi.service';
import { SearchHanziDto } from './dto/search-hanzi.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('汉字模块')
@Controller('hanzi')
export class HanziController {
  constructor(private readonly hanziService: HanziService) {}

  @Get('search')
  @ApiOperation({ summary: '模糊搜索汉字（支持汉字和拼音）' })
  @ApiResponse({ status: 200, description: '搜索成功' })
  async search(@Query() dto: SearchHanziDto) {
    return this.hanziService.search(dto.keyword);
  }
}

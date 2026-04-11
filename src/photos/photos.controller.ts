import { Controller, Get, Query } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotoQueryDto } from './dto/query-photo.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('照片模块')
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get()
  @ApiOperation({ summary: '分页获取照片' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findByPage(@Query() dto: PhotoQueryDto) {
    return this.photosService.findByPage(dto);
  }
}

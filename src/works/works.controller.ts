import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { QueryWorkDto } from './dto/query-work.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('作品模块')
@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建作品' })
  @ApiResponse({ status: 200, description: '创建成功' })
  async create(@Body() body: CreateWorkDto) {
    return this.worksService.create(body);
  }

  @Get()
  @ApiOperation({ summary: '分页获取作品' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findByPage(@Query() query: QueryWorkDto) {
    return this.worksService.findByPage(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 id 获取单个作品' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string) {
    return this.worksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新作品' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() body: UpdateWorkDto) {
    return this.worksService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除作品' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string) {
    return this.worksService.delete(id);
  }
}

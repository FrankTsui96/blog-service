import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/user.decorator';
import type { ActiveUser } from '@/types/interfaces';
import { ArticleQueryDto } from './dto/query-article.dto';

@ApiTags('文章模块')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({ status: 200, description: '创建成功' })
  async create(
    @Body() data: CreateArticleDto,
    @CurrentUser() user: ActiveUser,
  ) {
    return this.articlesService.create(data, user.userId);
  }

  @Get()
  @ApiOperation({ summary: '分页获取文章' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findByPage(@Query() articleQueryDto: ArticleQueryDto) {
    return this.articlesService.findByPage(articleQueryDto);
  }

  @Get('id/:id')
  @ApiOperation({ summary: '根据 id 获取单篇文章' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOneById(@Param('id') id: string) {
    return this.articlesService.findOneById(id);
  }

  @Get(':slug')
  @ApiOperation({ summary: '根据 slug 获取单篇文章' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOneBySlug(@Param('slug') slug: string) {
    return this.articlesService.findOneBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新文章' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() body: UpdateArticleDto) {
    return this.articlesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除文章' })
  @ApiResponse({ status: 200, description: '删除成功' })
  delete(@Param('id') id: string) {
    return this.articlesService.delete(id);
  }
}

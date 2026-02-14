import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { ArticleQueryDto } from './dto/query-article.dto';
import { Article, Prisma } from '@prisma/client';
import { PaginationResult } from '@/interfaces/pagination-result.interface';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  // 创建文章
  async create(data: Prisma.ArticleCreateInput): Promise<Article> {
    return this.prisma.article.create({ data });
  }

  // 分页获取文章
  async findByPage(
    articleQueryDto: ArticleQueryDto,
  ): Promise<PaginationResult<Article>> {
    const { skip, page, pageSize, title, authorId } = articleQueryDto;

    // 1. 构建过滤条件
    const where: Prisma.ArticleWhereInput = {
      // 这里的逻辑可以根据需求调整：如模糊查询、精确匹配
      ...(title && { title: { contains: title, mode: 'insensitive' } }),
      ...(authorId && { authorId }),
    };

    // 2. 并行查询数据和总数
    const [records, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } }, // 按需关联
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      records,
      page: page ?? 1,
      pageSize: pageSize ?? 10,
      total,
    };
  }

  // 获取单篇文章
  async findOne(id: number): Promise<Article | null> {
    return this.prisma.article.findUnique({ where: { id } });
  }

  // 更新文章
  async update(id: number, data: Prisma.ArticleUpdateInput): Promise<Article> {
    return this.prisma.article.update({ where: { id }, data });
  }

  // 删除文章
  async delete(id: number): Promise<Article> {
    return this.prisma.article.delete({ where: { id } });
  }
}

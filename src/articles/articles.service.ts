import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { ArticleQueryDto } from './dto/query-article.dto';
import { Article, Prisma } from '@prisma/client';
import { PaginationResult } from '@/interfaces/pagination-result.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { pinyin } from 'pinyin-pro';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 核心方法：生成唯一的 Slug
   */
  private async generateSlug(title: string): Promise<string> {
    // 1. 将汉字转为拼音 (例如: "我的文章" -> "wo-de-wen-zhang")
    const pinyinStr = pinyin(title, {
      toneType: 'none', // 不带声调
      type: 'array',
    }).join('-');

    // 2. 使用 slugify 清洗 (转小写、移除特殊字符)
    const baseSlug = slugify(pinyinStr, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // 3. 检查数据库中是否存在相同的 slug
    let slug = baseSlug;
    let count = 1;

    // 循环检查，直到找到一个唯一的 slug
    while (true) {
      const existing = await this.prisma.article.findUnique({
        where: { slug },
      });

      if (!existing) {
        break; // 如果不存在，说明这个 slug 可用
      }

      // 如果已存在，就在末尾加上数字后缀再次尝试
      slug = `${baseSlug}-${count}`;
      count++;
    }

    return slug;
  }

  // 创建文章
  async create(dto: CreateArticleDto, authorId: string): Promise<Article> {
    const { photos, tagNames, works, hanzi, ...rest } = dto;
    const slug = await this.generateSlug(dto.title);

    return this.prisma.article.create({
      data: {
        ...rest,
        slug,
        // 关联当前作者
        author: {
          connect: { id: authorId },
        },
        // 1. 照片：一对多关系，直接创建
        relatedPhotos: {
          create: photos ?? [],
        },
        // 2. 标签：多对多，唯一性由 name 保证
        tags: {
          connectOrCreate: (tagNames ?? []).map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        // 3. 汉字：多对多，唯一性由 character 保证
        relatedHanzi: {
          connectOrCreate: (hanzi ?? []).map((h) => ({
            where: { character: h.character },
            create: { character: h.character },
          })),
        },
        // 4. 作品：这里假设是创建新作品记录
        relatedWorks: {
          create: works ?? [],
        },
      },
      // 包含关联数据返回，方便前端立刻拿到详情
      include: {
        tags: true,
        relatedPhotos: true,
        relatedHanzi: true,
        relatedWorks: true,
      },
    });
  }

  // 分页获取文章
  async findByPage(
    articleQueryDto: ArticleQueryDto,
  ): Promise<PaginationResult<Article>> {
    const { skip, page, pageSize, title, authorId, type } = articleQueryDto;

    // 1. 构建过滤条件
    const where: Prisma.ArticleWhereInput = {
      // 这里的逻辑可以根据需求调整：如模糊查询、精确匹配
      ...(title && { title: { contains: title, mode: 'insensitive' } }),
      ...(authorId && { authorId }),
      ...(type && { type }),
    };

    console.log(
      `skip: ${skip}, page: ${page}, pageSize: ${pageSize}, title: ${title}, authorId: ${authorId}, type: ${type}`,
    );

    // 2. 并行查询数据和总数
    const [records, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true } },
          tags: true,
        }, // 按需关联
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
  async findOneById(id: string): Promise<Article | null> {
    return this.prisma.article.findUnique({ where: { id } });
  }

  /**
   * 根据 Slug 获取文章详情（带上所有卫星表数据）
   */
  async findOneBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, email: true }, // 只取作者的基本信息
        },
        tags: true,
        relatedPhotos: {
          orderBy: { order: 'asc' }, // 照片按顺序排
        },
        relatedWorks: true,
        relatedHanzi: true,
      },
    });

    if (!article) {
      throw new NotFoundException(`文章 ${slug} 未找到`);
    }

    return article;
  }

  // 更新文章
  async update(id: string, data: Prisma.ArticleUpdateInput): Promise<Article> {
    return this.prisma.article.update({ where: { id }, data });
  }

  // 删除文章
  async delete(id: string): Promise<Article> {
    return this.prisma.article.delete({ where: { id } });
  }
}

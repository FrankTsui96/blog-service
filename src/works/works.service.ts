import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Work, Prisma } from '@prisma/client';
import { PaginationResult } from '@/interfaces/pagination-result.interface';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { QueryWorkDto } from './dto/query-work.dto';

@Injectable()
export class WorksService {
  constructor(private readonly prisma: PrismaService) {}

  // 创建作品
  async create(dto: CreateWorkDto): Promise<Work> {
    return this.prisma.work.create({
      data: dto,
    });
  }

  // 分页获取作品
  async findByPage(
    workQueryDto: QueryWorkDto,
  ): Promise<PaginationResult<Work>> {
    const { skip, page, pageSize, title, type } = workQueryDto;

    // 1. 构建过滤条件
    const where: Prisma.WorkWhereInput = {
      ...(title && { title: { contains: title, mode: 'insensitive' } }),
      ...(type && { type }),
    };

    // 2. 并行查询数据和总数
    const [records, total] = await Promise.all([
      this.prisma.work.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.work.count({ where }),
    ]);

    return {
      records,
      page: page ?? 1,
      pageSize: pageSize ?? 10,
      total,
    };
  }

  // 根据 id 获取单个作品
  async findOne(id: string): Promise<Work | null> {
    const work = await this.prisma.work.findUnique({
      where: { id },
    });
    if (!work) {
      throw new NotFoundException('作品不存在');
    }
    return work;
  }

  // 更新作品
  async update(id: string, data: UpdateWorkDto): Promise<Work> {
    const work = await this.prisma.work.update({
      where: { id },
      data,
    });
    if (!work) {
      throw new NotFoundException('作品不存在');
    }
    return work;
  }

  // 删除作品
  async delete(id: string): Promise<Work> {
    const work = await this.prisma.work.delete({
      where: { id },
    });
    if (!work) {
      throw new NotFoundException('作品不存在');
    }
    return work;
  }
}

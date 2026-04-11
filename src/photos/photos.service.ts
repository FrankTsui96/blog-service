import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Photo, Prisma } from '@prisma/client';
import { PaginationResult } from '@/interfaces/pagination-result.interface';
import { PhotoQueryDto } from './dto/query-photo.dto';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPage(dto: PhotoQueryDto): Promise<PaginationResult<Photo>> {
    const { skip, page, pageSize, title } = dto;

    const where: Prisma.PhotoWhereInput = {
      ...(title && { title: { contains: title, mode: 'insensitive' } }),
    };

    const [records, total] = await Promise.all([
      this.prisma.photo.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.photo.count({ where }),
    ]);

    return {
      records,
      page: page ?? 1,
      pageSize: pageSize ?? 10,
      total,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { QueryTagDto } from './dto/query-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建标签
   * @param createTagDto 创建标签DTO
   * @returns 创建的标签
   */
  async create(createTagDto: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        name: createTagDto.name,
        color: createTagDto.color,
      },
    });
  }

  /**
   * 获取所有标签
   * @returns 所有标签
   */
  async findAll(queryTagDto: QueryTagDto) {
    return this.prisma.tag.findMany({
      where: {
        name: {
          ...(queryTagDto.name && {
            contains: queryTagDto.name,
            mode: 'insensitive',
          }),
        },
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} tag`;
  }

  update(id: string, updateTagDto: UpdateTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} tag`;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Hanzi } from '@prisma/client';

@Injectable()
export class HanziService {
  constructor(private readonly prisma: PrismaService) {}

  async search(keyword?: string): Promise<Hanzi[]> {
    if (!keyword) {
      return [];
    }

    const isLatin = /^[a-zA-Z]/.test(keyword);

    if (isLatin) {
      // 拼音前缀搜索：unnest + ILIKE
      return this.prisma.$queryRaw<Hanzi[]>`
        SELECT * FROM "Hanzi"
        WHERE EXISTS (
          SELECT 1 FROM unnest(pinyin) AS p
          WHERE p ILIKE ${keyword + '%'}
        )
        ORDER BY "createdAt" DESC
      `;
    }

    // 汉字模糊搜索
    return this.prisma.hanzi.findMany({
      where: { character: { contains: keyword, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
    });
  }
}

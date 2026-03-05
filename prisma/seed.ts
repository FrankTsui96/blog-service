import { PrismaClient, ArticleType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

async function main() {
  // 1. 手动创建 pg 连接池
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in .env file');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  // 2. 将适配器注入 PrismaClient
  const prisma = new PrismaClient({ adapter });

  console.log('检测到数据库已有数据，开始同步种子数据...');

  // 1. 先创建一个用户
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Frank',
      password: '$2b$10$FAsLokKKihIFt22.bj9f9umvYAbxtfuH9L8SzE3E.7yJcaYykbEdy', // 实际开发记得哈希
    },
  });

  // 2. 创建一个“说字”文章
  await prisma.article.create({
    data: {
      title: '说字：汉',
      slug: 'han',
      type: ArticleType.SHUOZI,
      content: '“汉”字的起源与演变...',
      authorId: admin.id,
      relatedHanzi: {
        create: [{ character: '汉', pinyin: ['hàn'] }],
      },
    },
  });

  // 3. 创建一个“视线”文章（带照片）
  await prisma.article.create({
    data: {
      title: '大理的午后',
      slug: 'da-li-wu-hou',
      type: ArticleType.SIGHT,
      authorId: admin.id,
      relatedPhotos: {
        create: [
          { url: 'https://example.com/p1.jpg', title: '苍山', order: 1 },
          { url: 'https://example.com/p2.jpg', title: '洱海', order: 2 },
        ],
      },
    },
  });

  console.log('Seed 数据注入成功！');

  await prisma.$disconnect();
}

main().catch((e) => console.error(e));

import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';

@Global() // 让这个模块变成全局可见，其他模块不用 import 也能用
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 关键：必须导出，别人才能注入
})
export class PrismaModule {}

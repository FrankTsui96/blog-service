import { Module } from '@nestjs/common';
import { HanziController } from './hanzi.controller';
import { HanziService } from './hanzi.service';

@Module({
  controllers: [HanziController],
  providers: [HanziService],
})
export class HanziModule {}

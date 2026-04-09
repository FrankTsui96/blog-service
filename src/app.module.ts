import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { WorksModule } from './works/works.module';
import { TagsModule } from './tags/tags.module';
import { HanziModule } from './hanzi/hanzi.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    ArticlesModule,
    AuthModule,
    UploadModule,
    WorksModule,
    TagsModule,
    HanziModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  // 允许前端跨域访问
  app.enableCors();
  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 极其重要：开启自动转换（包括 @Type 的转换）
      whitelist: true, // 自动剥离 DTO 中未定义的属性
      forbidNonWhitelisted: true, // 发现多余属性直接报错
    }),
  );
  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('我的个人博客 API')
    .setDescription('这是基于 NestJS + Prisma 7 构建的后端接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 这里的 'api-docs' 是你访问文档的路径
  SwaggerModule.setup('api-docs', app, document, {
    explorer: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发命令

```bash
pnpm install                # 安装依赖
pnpm run start:dev          # 本地开发（热重载，默认端口 3000）
pnpm run build              # 构建（输出到 dist/）
pnpm run lint               # ESLint 检查并自动修复
pnpm run format             # Prettier 格式化
pnpm run test               # 运行单元测试（jest）
pnpm run test:e2e           # 运行 e2e 测试

# Prisma 相关（Prisma 7.x）
npx prisma migrate dev      # 创建并应用迁移
npx prisma migrate deploy   # 生产环境应用迁移
npx prisma generate         # 生成 Prisma Client
npx prisma studio           # 可视化数据库管理

# 运行单个测试
pnpm run test -- --testPathPattern=articles.service
```

## 技术栈

- **框架**: NestJS 11 + TypeScript
- **ORM**: Prisma 7.4（使用 `@prisma/adapter-pg` + `pg` Pool，非传统 PrismaClient 直连）
- **数据库**: PostgreSQL 16
- **认证**: Passport + JWT（`@nestjs/passport`, `@nestjs/jwt`）
- **API 文档**: Swagger（`@nestjs/swagger`，访问路径 `/api-docs`）
- **文件上传**: 阿里云 OSS（`ali-oss`）
- **包管理**: pnpm
- **部署**: Docker + GitHub Actions + 阿里云 ACR

## 架构概览

### 模块结构

项目采用 NestJS 模块化架构，所有业务模块注册在 `AppModule`：

| 模块 | 路径 | 路由前缀 | 说明 |
|------|------|----------|------|
| PrismaModule | `src/prisma/` | — | 全局数据库模块，使用 `@Global()` 装饰 |
| AuthModule | `src/auth/` | `/auth` | 登录/注册，JWT 签发 |
| ArticlesModule | `src/articles/` | `/articles` | 文章 CRUD + 分页 + slug 生成 |
| WorksModule | `src/works/` | `/works` | 作品 CRUD |
| TagsModule | `src/tags/` | `/tags` | 标签 CRUD |
| UploadModule | `src/upload/` | — | 文件上传到阿里云 OSS |

### 公共模块（`src/common/`）

| 目录 | 说明 |
|------|------|
| `dto/pagination.dto.ts` | 分页基类 DTO（`page` / `pageSize`，带 `skip` getter） |
| `interceptors/transform.interceptor.ts` | 统一响应包装为 `{ data, code: 200, message: '请求成功' }` |
| `filters/http-exception.filter.ts` | 统一错误格式 `{ code, message, data: null }` |
| `decorators/user.decorator.ts` | `@CurrentUser()` 装饰器，提取当前登录用户 |

### 其他共享目录

- `src/interfaces/` — 共享接口定义（如 `PaginationResult`）
- `src/types/` — 类型扩展（Express Request 类型补充等）

### 关键设计模式

- **全局验证管道**: `ValidationPipe` 开启 `transform`（自动类型转换）、`whitelist`（剥离多余字段）、`forbidNonWhitelisted`
- **认证守卫**: 写操作使用 `@UseGuards(JwtAuthGuard)`，通过 `@CurrentUser()` 装饰器获取当前用户
- **路径别名**: `tsconfig.json` 配置 `@/*` → `./src/*`，代码中使用 `@/` 路径别名导入

### Prisma 7.x 配置要点

本项目使用 Prisma 7.4，与传统 Prisma 配置有显著差异：

- `schema.prisma` 中 `datasource` **不含** `url = env("DATABASE_URL")`
- `prisma.config.ts`（项目根目录）定义 CLI 配置，通过 `dotenv/config` 加载环境变量
- `PrismaService`（`src/prisma/prisma.service.ts`）使用 `@prisma/adapter-pg` + `pg.Pool` 连接数据库
- 运行时 `DATABASE_URL` 从 `process.env` 读取
- 数据库种子脚本：`npx prisma db seed`（通过 `ts-node prisma/seed.ts` 执行）

### 数据模型关系

```
User ──< Article >── Tag
              ├──< Photo（一对多，cascade 删除）
              ├──< Work（多对多）
              └──< Hanzi（多对多）

ArticleType: TECH | LIFE | SIGHT | SHUOZI | OTHER
WorkType: BOOK | MUSIC | MOVIE | GAME | OTHER
```

### Slug 生成

文章创建时自动生成 slug：中文标题 → `pinyin-pro` 转拼音 → `slugify` 清洗 → 数据库唯一性检查（冲突时追加数字后缀）

## 环境变量

本地开发使用 `.env` 文件（已在 `.gitignore` 中），模板见 `.env.example`：

```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/blog_db?schema=public"
JWT_SECRET="your_jwt_secret"
```

OSS 相关变量（`OSS_REGION`、`OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`、`OSS_BUCKET`）用于上传功能，按需配置。

## 部署

### Docker + CI/CD 流程

1. 推送到 `main` 分支触发 GitHub Actions（`.github/workflows/deploy.yml`）
2. Actions 构建镜像 → 推送到阿里云 ACR
3. SSH 连接服务器执行 `docker compose pull backend && docker compose up -d backend`
4. 容器启动时自动执行 `npx prisma migrate deploy`（见 `Dockerfile` CMD）

### docker-compose.yml

- **nginx-gateway**: Nginx 反向代理，对外暴露 80/443
- **backend**: 本项目，从 `.env.production` 读取环境变量
- **frontend**: 前端静态资源
- **db**: PostgreSQL 16，数据持久化到 `./postgres_data`

### 生产环境变量

在服务器 `/home/ubuntu/blog-app/` 下创建 `.env.production`（手动创建，不通过 Git 同步）：

```bash
DATABASE_URL="postgresql://postgres:152720@db:5432/blog_db?schema=public"
JWT_SECRET="152720"
```
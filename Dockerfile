# 阶段 1: 构建 (Build Stage)
FROM node:24-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm i pnpm -g

# 1. 先拷贝依赖定义文件 (利用 Docker 缓存)
COPY package.json pnpm-lock.yaml ./
# 如果有 prisma 文件夹，也需要拷贝进来
COPY prisma ./prisma/
# Prisma 7 需要 prisma.config.ts
COPY prisma.config.ts ./

# 安装所有依赖（包括 devDependencies，用于构建）
RUN pnpm install --frozen-lockfile

# 2. 关键：生成 Prisma Client
# Prisma 7 需要从 prisma.config.ts 读取配置
RUN npx prisma generate

# 3. 拷贝源代码
COPY . .

# 4. 执行 NestJS 构建
RUN pnpm run build

# 阶段 2: 运行 (Run Stage)
FROM node:24-alpine
WORKDIR /app

# 安装 pnpm
RUN npm i pnpm -g

# 拷贝依赖定义文件
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
# Prisma 7 需要 prisma.config.ts
COPY prisma.config.ts ./

# 只安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 生成 Prisma Client（生产环境也需要）
RUN npx prisma generate

# 拷贝构建后的代码
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# 启动命令：先运行数据库迁移，再启动应用
# DATABASE_URL 会从 docker-compose.yml 的 env_file 中读取
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

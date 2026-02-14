# 阶段 1: 构建 (Build Stage)
FROM node:24-alpine AS builder 

WORKDIR /app

# 安装 pnpm
RUN npm i pnpm -g

# 1. 先拷贝依赖定义文件 (利用 Docker 缓存)
COPY package.json pnpm-lock.yaml ./
# 如果有 prisma 文件夹，也需要拷贝进来
COPY prisma ./prisma/

# 安装所有依赖
RUN pnpm install

# 2. 关键：生成 Prisma Client
# 这步必须在 build 之前，它会生成代码到 node_modules/.prisma
RUN npx prisma generate

# 3. 拷贝源代码
COPY . .

# 4. 执行 NestJS 构建
RUN pnpm run build

# 5. 【优化】只保留生产环境需要的依赖，减小镜像体积
RUN pnpm prune --prod

# 阶段 2: 运行 (Run Stage)
FROM node:24-alpine
WORKDIR /app

# 拷贝构建后的代码
COPY --from=builder /app/dist ./dist
# 拷贝精简后的生产环境依赖
COPY --from=builder /app/node_modules ./node_modules
# 拷贝 package.json
COPY --from=builder /app/package.json ./
# 如果后端需要读取 prisma schema (某些高级功能需要)，可以也拷贝下
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# 启动命令：先运行数据库迁移，再启动应用
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
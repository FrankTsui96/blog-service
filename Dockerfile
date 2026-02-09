# 阶段 1: 构建
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i pnpm -g
RUN pnpm install
COPY . .
RUN pnpm run build

# 阶段 2: 运行
FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main"]

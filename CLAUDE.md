## docker-compose.yml 内容

```yml
services:
  # Nginx 网关
  nginx-gateway:
    image: nginx:stable-alpine
    container_name: blog-gateway
    ports:
      - '80:80' # 只有它对外
      - '443:443' # 以后配 HTTPS 用
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro # 挂载配置文件
    depends_on:
      - frontend
      - backend
    restart: always

  # 后端服务
  backend:
    # 镜像名，后面 CI 会推送到这里
    image: crpi-xga1c7tdwvfzydbb.cn-hangzhou.personal.cr.aliyuncs.com/franktsui96/blog-service:latest
    container_name: blog-backend
    restart: always
    depends_on:
      - db
    env_file:
      - .env.production # 👈 从此文件读取环境变量（DATABASE_URL、JWT_SECRET）

  # 前端服务
  frontend:
    image: crpi-xga1c7tdwvfzydbb.cn-hangzhou.personal.cr.aliyuncs.com/franktsui96/blog-fe:latest
    container_name: blog-frontend
    restart: always

  # 数据库
  db:
    image: postgres:16
    container_name: blog-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: '152720'
      POSTGRES_DB: blog_db
    volumes:
      - ./postgres_data:/var/lib/postgresql/data # 【核心】持久化存储，数据存放在服务器当前目录的 postgres_data 下
    restart: always
```

## 环境变量配置说明

### 本地开发

- 使用 `.env` 文件
- `DATABASE_URL` 连接到 `localhost:5432`
- 文件已被 `.gitignore` 忽略

### 生产部署

- 在服务器的 `/home/ubuntu/blog-app/` 目录下创建 `.env.production` 文件
- `DATABASE_URL` 连接到 `db:5432`（Docker 内部服务名）
- 内容示例：
  ```bash
  DATABASE_URL="postgresql://postgres:152720@db:5432/blog_db?schema=public"
  JWT_SECRET="152720"
  ```
- **重要**：这个文件需要手动在服务器上创建，不会通过 Git 同步

### 模板文件

- `.env.example` - 环境变量模板，可以提交到 Git

---

## 部署清单

### 重要：项目使用 Prisma 7.x

本项目使用 **Prisma 7.4.0**，配置方式与旧版本不同：

- ✅ `schema.prisma` 中**不再使用** `url = env("DATABASE_URL")`
- ✅ `prisma.config.ts` 用于 CLI 工具（migrate、generate）的配置
- ✅ `PrismaService` 使用 `@prisma/adapter-pg` 和 pg Pool 连接数据库
- ✅ 运行时从 `process.env.DATABASE_URL` 读取连接字符串

### 首次部署前的准备工作：

1. ✅ **在服务器上创建 `.env.production`**

   ```bash
   cd /home/ubuntu/blog-app
   cat > .env.production << 'EOF'
   DATABASE_URL="postgresql://postgres:152720@db:5432/blog_db?schema=public"
   JWT_SECRET="152720"
   EOF
   ```

2. ✅ **更新服务器上的 `docker-compose.yml`**
   - 在 `backend` 服务中添加 `env_file: - .env.production`
   - 完整配置见上方 docker-compose.yml 内容

3. ✅ **Dockerfile 已自动化数据库迁移**
   - 容器启动时会自动运行 `npx prisma migrate deploy`
   - 数据库表会自动创建/更新

### 后续部署流程：

1. 本地提交代码并推送到 `main` 分支
2. GitHub Actions 自动构建镜像并推送到阿里云
3. GitHub Actions 通过 SSH 连接服务器，执行：
   ```bash
   docker compose pull backend
   docker compose up -d backend
   ```
4. 容器启动时自动运行数据库迁移
5. 部署完成 ✅

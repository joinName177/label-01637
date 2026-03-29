# 使用跨平台 Node.js 镜像 (支持 ARM64 和 AMD64)
FROM node:20-alpine AS builder

WORKDIR /app

# 安装构建依赖（better-sqlite3 需要编译）
RUN apk add --no-cache python3 make g++

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 编译 TypeScript
RUN npm run build

# 生产阶段
FROM node:20-alpine AS production

WORKDIR /app

# 安装运行时依赖（better-sqlite3 需要）
RUN apk add --no-cache python3 make g++

# 复制 package 文件
COPY package*.json ./

# 只安装生产依赖
RUN npm install --only=production && npm cache clean --force

# 复制编译后的代码
COPY --from=builder /app/dist ./dist

# 创建数据目录
RUN mkdir -p /app/data

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# 启动应用
CMD ["node", "dist/index.js"]

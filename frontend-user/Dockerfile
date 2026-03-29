# 使用跨平台 Node.js 镜像构建 (支持 ARM64 和 AMD64)
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 设置构建时环境变量（API 地址由 nginx 代理）
ENV VITE_API_URL=""

# 构建应用
RUN npm run build

# 生产阶段 - 使用跨平台 nginx 镜像
FROM nginx:alpine AS production

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

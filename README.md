# 云端聊天室 - 在线实时聊天应用

## How to Run

### 使用 Docker Compose 运行（推荐）

```bash
# 构建并启动所有服务
docker-compose up --build -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 本地开发运行

```bash
# 后端
cd backend
npm install
npm run dev

# 前端（新终端）
cd frontend-user
npm install
npm run dev
```

## Services

| 服务 | 端口 | 描述 |
|------|------|------|
| frontend-user | 8081 | 用户端前端界面 |
| backend | 3001 (内部) | 后端 API 和 WebSocket 服务 |

### 访问地址

- **用户端**: http://localhost:8081

### 技术栈

- **前端**: React 19 + TypeScript + Tailwind CSS 4 + Vite
- **后端**: Node.js + Express + Socket.io
- **数据库**: SQLite (better-sqlite3)
- **容器化**: Docker + Docker Compose

## 测试账号

本应用无需注册登录，直接输入昵称即可加入聊天室。

- 进入聊天室时可以输入任意昵称
- 也可以点击"随机"按钮自动生成昵称
- 支持多个浏览器窗口同时登录不同用户进行测试

## 题目内容

用react+ts+tailwind 创建一个在线聊天室应用，需要有后端存储聊天数据。

---

## 项目结构

```
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── index.ts        # 主入口，Express + Socket.io
│   │   └── db.ts           # SQLite 数据库操作
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend-user/           # 用户端前端
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── types/          # TypeScript 类型定义
│   │   └── utils/          # 工具函数
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml       # Docker Compose 配置
├── .gitignore
└── README.md
```

## 功能特性

### 实时聊天
- WebSocket 实现实时消息推送
- 消息即时发送和接收
- 支持多行消息输入

### 多房间支持
- 公共大厅、技术交流、游戏天地、音乐分享
- 一键切换房间
- 房间内在线人数显示

### 消息持久化
- SQLite 数据库存储所有聊天记录
- 加入房间时自动加载历史消息
- 系统消息记录用户加入/离开

### 用户管理
- 随机昵称生成
- 随机头像颜色分配
- 在线用户实时列表

### 现代化 UI
- 深色主题设计
- 毛玻璃效果
- 流畅动画过渡
- 响应式布局

## API 接口

### REST API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /health | 健康检查 |
| GET | /api/rooms | 获取房间列表 |
| GET | /api/messages/:roomId | 获取房间历史消息 |

### WebSocket 事件

| 事件 | 方向 | 描述 |
|------|------|------|
| join | Client → Server | 用户加入聊天 |
| switchRoom | Client → Server | 切换房间 |
| sendMessage | Client → Server | 发送消息 |
| message | Server → Client | 接收新消息 |
| onlineUsers | Server → Client | 在线用户列表更新 |

## 镜像验证

验证镜像是否支持 ARM 架构：

```bash
# 验证后端镜像
docker pull --platform linux/arm64 node:20-alpine

# 验证前端镜像
docker pull --platform linux/arm64 nginx:alpine
```

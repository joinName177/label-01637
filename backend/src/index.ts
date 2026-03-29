import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { dbOperations } from './db.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// 在线用户管理
interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  color: string;
  socketId: string;
  roomId: string;
}

const onlineUsers = new Map<string, OnlineUser>();

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// REST API
app.get('/api/rooms', (_req, res) => {
  const rooms = dbOperations.getRooms();
  const roomsWithCount = rooms.map(room => {
    const count = Array.from(onlineUsers.values()).filter(u => u.roomId === room.id).length;
    return { ...room, memberCount: count };
  });
  res.json(roomsWithCount);
});

app.get('/api/messages/:roomId', (req, res) => {
  const { roomId } = req.params;
  const messages = dbOperations.getMessages(roomId);
  res.json(messages.reverse().map(msg => ({
    id: msg.id,
    userId: msg.user_id,
    userName: msg.user_name,
    userAvatar: msg.user_avatar,
    userColor: msg.user_color,
    content: msg.content,
    timestamp: msg.created_at,
    type: msg.type,
  })));
});

// Socket.io 事件处理
io.on('connection', (socket) => {
  console.log(`用户连接: ${socket.id}`);

  // 用户加入聊天
  socket.on('join', (userData: { id: string; name: string; avatar: string; color: string; roomId: string }) => {
    const user: OnlineUser = {
      ...userData,
      socketId: socket.id,
    };
    
    onlineUsers.set(socket.id, user);
    socket.join(userData.roomId);
    
    dbOperations.saveUser({
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      color: userData.color,
    });

    const systemMessage = {
      id: `sys-${Date.now()}`,
      userId: 'system',
      userName: '系统',
      userAvatar: '📢',
      userColor: '#888',
      content: `${userData.name} 加入了聊天室`,
      timestamp: new Date().toISOString(),
      type: 'system',
    };
    
    dbOperations.saveMessage({
      id: systemMessage.id,
      roomId: userData.roomId,
      userId: systemMessage.userId,
      userName: systemMessage.userName,
      userAvatar: systemMessage.userAvatar,
      userColor: systemMessage.userColor,
      content: systemMessage.content,
      type: systemMessage.type,
    });
    
    io.to(userData.roomId).emit('message', systemMessage);
    broadcastOnlineUsers(userData.roomId);
  });

  // 切换房间
  socket.on('switchRoom', (data: { oldRoomId: string; newRoomId: string }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    socket.leave(data.oldRoomId);
    socket.join(data.newRoomId);
    user.roomId = data.newRoomId;

    broadcastOnlineUsers(data.oldRoomId);
    broadcastOnlineUsers(data.newRoomId);
  });

  // 发送消息
  socket.on('sendMessage', (messageData: {
    id: string;
    roomId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    userColor: string;
    content: string;
  }) => {
    // 验证消息长度
    const MAX_LENGTH = 500;
    if (!messageData.content || messageData.content.length > MAX_LENGTH) {
      return;
    }

    const message = {
      ...messageData,
      content: messageData.content.trim().slice(0, MAX_LENGTH),
      timestamp: new Date().toISOString(),
      type: 'message',
    };

    dbOperations.saveMessage({
      id: message.id,
      roomId: message.roomId,
      userId: message.userId,
      userName: message.userName,
      userAvatar: message.userAvatar,
      userColor: message.userColor,
      content: message.content,
      type: message.type,
    });

    io.to(messageData.roomId).emit('message', message);
  });

  // 用户断开连接
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      const systemMessage = {
        id: `sys-${Date.now()}`,
        userId: 'system',
        userName: '系统',
        userAvatar: '📢',
        userColor: '#888',
        content: `${user.name} 离开了聊天室`,
        timestamp: new Date().toISOString(),
        type: 'system',
      };
      
      dbOperations.saveMessage({
        id: systemMessage.id,
        roomId: user.roomId,
        userId: systemMessage.userId,
        userName: systemMessage.userName,
        userAvatar: systemMessage.userAvatar,
        userColor: systemMessage.userColor,
        content: systemMessage.content,
        type: systemMessage.type,
      });
      
      io.to(user.roomId).emit('message', systemMessage);
      
      onlineUsers.delete(socket.id);
      broadcastOnlineUsers(user.roomId);
    }
    console.log(`用户断开: ${socket.id}`);
  });
});

function broadcastOnlineUsers(roomId: string) {
  const users = Array.from(onlineUsers.values())
    .filter(u => u.roomId === roomId)
    .map(u => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      color: u.color,
      isOnline: true,
    }));
  
  io.to(roomId).emit('onlineUsers', users);
  
  // 广播房间成员数更新给所有客户端
  broadcastRoomCounts();
}

function broadcastRoomCounts() {
  const rooms = dbOperations.getRooms();
  const roomCounts = rooms.map(room => ({
    id: room.id,
    memberCount: Array.from(onlineUsers.values()).filter(u => u.roomId === room.id).length,
  }));
  io.emit('roomCounts', roomCounts);
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📦 数据库已初始化`);
});

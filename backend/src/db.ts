import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'chat.db');
const db: DatabaseType = new Database(dbPath);

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT NOT NULL,
    user_color TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'message',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
  );

  CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
  CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
`);

// 初始化默认房间
const insertRoom = db.prepare(`
  INSERT OR IGNORE INTO rooms (id, name, icon, description) VALUES (?, ?, ?, ?)
`);

const defaultRooms = [
  { id: '1', name: '公共大厅', icon: '🏠', description: '欢迎来到公共聊天室' },
  { id: '2', name: '技术交流', icon: '💻', description: '讨论编程和技术' },
  { id: '3', name: '游戏天地', icon: '🎮', description: '游戏爱好者聚集地' },
  { id: '4', name: '音乐分享', icon: '🎵', description: '分享你喜欢的音乐' },
];

defaultRooms.forEach(room => {
  insertRoom.run(room.id, room.name, room.icon, room.description);
});

export interface DBMessage {
  id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  user_color: string;
  content: string;
  type: string;
  created_at: string;
}

export interface DBRoom {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface DBUser {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

// 数据库操作函数
export const dbOperations = {
  // 获取所有房间
  getRooms: (): DBRoom[] => {
    return db.prepare('SELECT * FROM rooms').all() as DBRoom[];
  },

  // 获取房间消息（最近100条）
  getMessages: (roomId: string, limit = 100): DBMessage[] => {
    return db.prepare(`
      SELECT * FROM messages 
      WHERE room_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(roomId, limit) as DBMessage[];
  },

  // 保存消息
  saveMessage: (message: {
    id: string;
    roomId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    userColor: string;
    content: string;
    type: string;
  }): void => {
    db.prepare(`
      INSERT INTO messages (id, room_id, user_id, user_name, user_avatar, user_color, content, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      message.id,
      message.roomId,
      message.userId,
      message.userName,
      message.userAvatar,
      message.userColor,
      message.content,
      message.type
    );
  },

  // 保存用户
  saveUser: (user: DBUser): void => {
    db.prepare(`
      INSERT OR REPLACE INTO users (id, name, avatar, color)
      VALUES (?, ?, ?, ?)
    `).run(user.id, user.name, user.avatar, user.color);
  },

  // 获取用户
  getUser: (id: string): DBUser | undefined => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as DBUser | undefined;
  },
};

export default db;

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8B500', '#FF8C00'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getRandomAvatar = (name: string): string => {
  const initial = name.charAt(0).toUpperCase();
  return initial;
};

export const formatTime = (date: Date | string): string => {
  let d: Date;
  if (typeof date === 'string') {
    // 处理 SQLite 返回的时间格式 (如 "2026-02-06 09:44:23")
    // 如果不包含时区信息，假设为 UTC 时间
    if (!date.includes('T') && !date.includes('Z')) {
      d = new Date(date.replace(' ', 'T') + 'Z');
    } else {
      d = new Date(date);
    }
  } else {
    d = date;
  }
  
  // 检查日期是否有效
  if (isNaN(d.getTime())) {
    return '--:--';
  }
  
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  
  if (isToday) {
    return d.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    return d.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};

export const getRandomName = (): string => {
  const adjectives = ['快乐的', '勇敢的', '聪明的', '可爱的', '神秘的', '闪亮的', '温柔的', '活泼的'];
  const nouns = ['小猫', '小狗', '兔子', '熊猫', '狐狸', '小鸟', '蝴蝶', '海豚'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${noun}${num}`;
};

// API 基础 URL
export const getApiUrl = (): string => {
  // 优先使用环境变量，否则检测当前环境
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // 生产环境使用相对路径（通过 nginx 代理）
  if (import.meta.env.PROD) {
    return '';
  }
  // 本地开发使用 localhost
  return 'http://localhost:3001';
};

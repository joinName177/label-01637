export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  joinedAt?: Date;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userColor: string;
  content: string;
  timestamp: string | Date;
  type: 'message' | 'system';
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  description: string;
  memberCount: number;
}

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { Message, User, Room } from '../types';
import { generateId, getRandomColor, getRandomAvatar, getRandomName, getApiUrl } from '../utils/helpers';

interface ChatError {
  type: 'connection' | 'fetch' | 'send';
  message: string;
}

export const useChat = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const apiUrl = useMemo(() => getApiUrl(), []);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 初始化 Socket 连接
  useEffect(() => {
    const socketUrl = apiUrl || window.location.origin;
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      path: '/socket.io',
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket 已连接');
      setIsConnected(true);
      setError(null);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket 已断开');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', () => {
      setError({ type: 'connection', message: '连接服务器失败，请检查网络' });
      setIsConnected(false);
    });

    socketRef.current.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('onlineUsers', (users: User[]) => {
      setOnlineUsers(users);
    });

    socketRef.current.on('roomCounts', (counts: { id: string; memberCount: number }[]) => {
      setRooms(prevRooms => 
        prevRooms.map(room => {
          const update = counts.find(c => c.id === room.id);
          return update ? { ...room, memberCount: update.memberCount } : room;
        })
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [apiUrl]);

  // 获取房间列表
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${apiUrl}/api/rooms`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setRooms(data);
        if (data.length > 0 && !currentRoom) {
          setCurrentRoom(data[0]);
        }
        setError(null);
      } catch (err) {
        console.error('获取房间列表失败:', err);
        setError({ type: 'fetch', message: '获取房间列表失败，请刷新页面重试' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [apiUrl, currentRoom]);

  // 获取房间历史消息
  const fetchMessages = useCallback(async (roomId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiUrl}/api/messages/${roomId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('获取消息失败:', err);
      setError({ type: 'fetch', message: '获取历史消息失败' });
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // 加入聊天
  const joinChat = useCallback((userName?: string) => {
    if (!currentRoom) {
      setError({ type: 'fetch', message: '请先选择一个房间' });
      return;
    }

    if (!isConnected) {
      setError({ type: 'connection', message: '未连接到服务器，请稍后重试' });
      return;
    }

    const name = userName || getRandomName();
    const color = getRandomColor();
    const user: User = {
      id: generateId(),
      name,
      avatar: getRandomAvatar(name),
      color,
      isOnline: true,
      joinedAt: new Date(),
    };

    setCurrentUser(user);
    setIsJoined(true);
    setError(null);

    fetchMessages(currentRoom.id);

    socketRef.current?.emit('join', {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      color: user.color,
      roomId: currentRoom.id,
    });
  }, [currentRoom, fetchMessages, isConnected]);

  // 发送消息
  const sendMessage = useCallback((content: string) => {
    if (!currentUser || !content.trim() || !currentRoom) return;

    if (!isConnected) {
      setError({ type: 'send', message: '消息发送失败，请检查网络连接' });
      return;
    }

    socketRef.current?.emit('sendMessage', {
      id: generateId(),
      roomId: currentRoom.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userColor: currentUser.color,
      content: content.trim(),
    });
  }, [currentUser, currentRoom, isConnected]);

  // 切换房间
  const switchRoom = useCallback((room: Room) => {
    if (!currentRoom || room.id === currentRoom.id) return;

    socketRef.current?.emit('switchRoom', {
      oldRoomId: currentRoom.id,
      newRoomId: room.id,
    });

    setCurrentRoom(room);
    fetchMessages(room.id);
  }, [currentRoom, fetchMessages]);

  // 使用 useMemo 优化返回对象，避免不必要的重渲染
  return useMemo(() => ({
    currentUser,
    messages,
    onlineUsers,
    rooms,
    currentRoom,
    isJoined,
    isConnected,
    isLoading,
    error,
    joinChat,
    sendMessage,
    switchRoom,
    clearError,
  }), [
    currentUser,
    messages,
    onlineUsers,
    rooms,
    currentRoom,
    isJoined,
    isConnected,
    isLoading,
    error,
    joinChat,
    sendMessage,
    switchRoom,
    clearError,
  ]);
};

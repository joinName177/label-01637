import { memo } from 'react';
import type { Room, Message, User } from '../types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatRoomProps {
  room: Room;
  messages: Message[];
  currentUser: User | null;
  onSendMessage: (content: string) => void;
}

export const ChatRoom = memo(function ChatRoom({ room, messages, currentUser, onSendMessage }: ChatRoomProps) {
  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-xl">
      {/* 房间头部 */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{room.icon}</span>
            <div>
              <h2 className="text-lg font-semibold text-white">{room.name}</h2>
              <p className="text-sm text-slate-400">{room.description}</p>
            </div>
          </div>
          
        </div>
      </header>
      
      {/* 消息列表 */}
      <MessageList messages={messages} currentUserId={currentUser?.id} />
      
      {/* 输入区域 */}
      <div className="flex-shrink-0">
        <MessageInput onSend={onSendMessage} />
      </div>
    </main>
  );
});

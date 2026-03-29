import { useEffect, useRef, memo } from 'react';
import type { Message } from '../types';
import { formatTime } from '../utils/helpers';

interface MessageListProps {
  messages: Message[];
  currentUserId: string | undefined;
}

export const MessageList = memo(function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💭</div>
          <p className="text-slate-500">还没有消息，来说点什么吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">
      {messages.map((message, index) => {
        const isCurrentUser = message.userId === currentUserId;
        const isSystem = message.type === 'system';
        const showAvatar = index === 0 || 
          messages[index - 1].userId !== message.userId ||
          messages[index - 1].type === 'system';

        if (isSystem) {
          return (
            <div key={message.id} className="flex justify-center my-6">
              <div className="px-4 py-2 bg-white/5 rounded-full text-sm text-slate-400 backdrop-blur-sm border border-white/5">
                {message.content}
              </div>
            </div>
          );
        }

        return (
          <div
            key={message.id}
            className={`flex items-end gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
          >
            {/* 头像 */}
            {showAvatar ? (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium text-sm shrink-0 shadow-lg"
                style={{ backgroundColor: message.userColor }}
              >
                {message.userAvatar}
              </div>
            ) : (
              <div className="w-10 shrink-0" />
            )}

            {/* 消息内容 */}
            <div className={`max-w-[65%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
              {/* 用户名和时间 */}
              {showAvatar && (
                <div className={`flex items-center gap-2 mb-1.5 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: message.userColor }}
                  >
                    {message.userName}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              )}
              
              {/* 消息气泡 */}
              <div
                className={`px-4 py-3 rounded-2xl max-w-full overflow-hidden ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-br-md shadow-lg shadow-purple-500/20'
                    : 'bg-white/10 text-slate-200 rounded-bl-md backdrop-blur-sm border border-white/5'
                }`}
              >
                <p className="text-sm leading-relaxed break-all whitespace-pre-wrap overflow-wrap-anywhere" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
});

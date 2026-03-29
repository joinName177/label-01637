import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
}

export const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const MAX_LENGTH = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && message.length <= MAX_LENGTH) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 自动调整高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  return (
    <div className="px-6 py-4 border-t border-white/5 bg-slate-900/30 backdrop-blur-xl">
      <form onSubmit={handleSubmit}>
        <div 
          className={`flex items-end gap-3 p-2 rounded-2xl bg-white/5 border transition-all duration-300 ${
            isFocused 
              ? 'border-purple-500/50 shadow-lg shadow-purple-500/10' 
              : 'border-white/10'
          }`}
        >
          {/* 输入框 */}
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
            rows={1}
            maxLength={MAX_LENGTH}
            className="flex-1 bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none py-2.5 text-sm leading-relaxed max-h-[120px]"
          />
          
          {/* 发送按钮 */}
          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              message.trim()
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
      
      {/* 提示信息 */}
      <div className="mt-2 flex items-center justify-between px-2">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px]">Enter</kbd>
            发送
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px]">Shift</kbd>
            +
            <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px]">Enter</kbd>
            换行
          </span>
        </div>
        <span className={`text-xs transition-colors ${message.length >= MAX_LENGTH ? 'text-red-400' : message.length > MAX_LENGTH * 0.8 ? 'text-yellow-400' : 'text-slate-500'}`}>
          {message.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
};

import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
}

// 常用 Unicode emoji 分类
const emojiCategories = [
  {
    name: '表情',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']
  },
  {
    name: '手势',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏']
  },
  {
    name: '爱心',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟']
  },
  {
    name: '其他',
    emojis: ['🎉', '🎊', '🎁', '🎈', '🎂', '🍰', '☕', '🍵', '🍻', '🥂', '🍷', '🍹', '🍺', '⭐', '🌟', '✨', '💫', '🔥', '💯', '✅', '❌', '⚠️', '💡', '🔔', '🎵', '🎶', '📸', '💻', '📱', '📞', '✉️', '📧', '📦', '🚀', '⚡', '🌈', '☀️', '🌙', '⭐', '❄️', '🌊', '🌴', '🍀', '🌸', '🌺', '🌹', '🌷', '🌻', '🌼', '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥝', '🍕', '🍔', '🍟', '🌭', '🍿', '🧀', '🍗', '🍖', '🌮', '🌯', '🍜', '🍲', '🍝', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍪', '🎂', '🍰', '🍫', '🍬', '🍭', '🍮', '🍯']
  }
];

export const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiPanelRef = useRef<HTMLDivElement>(null);

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

  // 插入 emoji 到光标位置
  const insertEmoji = (emoji: string) => {
    if (!inputRef.current) return;
    
    const start = inputRef.current.selectionStart;
    const end = inputRef.current.selectionEnd;
    const text = message || '';
    
    // 检查插入后是否超过最大长度
    const newText = text.substring(0, start) + emoji + text.substring(end);
    if (newText.length > MAX_LENGTH) {
      return;
    }
    
    setMessage(newText);
    
    // 调整光标位置到 emoji 后面
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(start + emoji.length, start + emoji.length);
      }
    }, 0);
    
    // 插入后关闭面板
    setShowEmojiPanel(false);
  };

  // 自动调整高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  // 点击外部关闭 emoji 面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPanelRef.current && 
        !emojiPanelRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.emoji-button')
      ) {
        setShowEmojiPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="px-6 py-4 border-t border-white/5 bg-slate-900/30 backdrop-blur-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div 
            className={`flex items-end gap-3 p-2 rounded-2xl bg-white/5 border transition-all duration-300 ${
              isFocused 
                ? 'border-purple-500/50 shadow-lg shadow-purple-500/10' 
                : 'border-white/10'
            }`}
          >
            {/* emoji 按钮 */}
            <button
              type="button"
              onClick={() => setShowEmojiPanel(!showEmojiPanel)}
              className={`emoji-button p-2 rounded-xl transition-all duration-300 ${
                showEmojiPanel 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
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

          {/* emoji 面板 */}
          {showEmojiPanel && (
            <div 
              ref={emojiPanelRef}
              className="absolute bottom-full mb-3 left-0 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-80 animate-in slide-in-from-bottom-2 fade-in duration-200"
            >
              {/* 分类标签 */}
              <div className="flex border-b border-white/10">
                {emojiCategories.map((category, index) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => setSelectedCategory(index)}
                    className={`flex-1 py-3 text-xs transition-all duration-200 ${
                      selectedCategory === index 
                        ? 'text-purple-400 border-b-2 border-purple-400' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              {/* emoji 网格 */}
              <div className="p-3 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-8 gap-1">
                  {emojiCategories[selectedCategory].emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-lg focus:outline-none"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
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

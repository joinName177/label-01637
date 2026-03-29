import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
}

const EMOJI_CATEGORIES = [
  {
    name: '常用',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']
  },
  {
    name: '手势',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸']
  },
  {
    name: '物体',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '⏏️', '▶️', '⏸️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↩️', '↪️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '💲', '💱', '™️', '©️', '®️', '〽️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️', '💯', '✅', '☑️', '✔️', '❌', '❎', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔲', '🔳', '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏴‍☠️']
  }
];

export const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const MAX_LENGTH = 500;

  const insertEmoji = (emoji: string) => {
    if (!inputRef.current) return;
    
    const start = inputRef.current.selectionStart || 0;
    const end = inputRef.current.selectionEnd || 0;
    const newMessage = message.slice(0, start) + emoji + message.slice(end);
    
    if (newMessage.length <= MAX_LENGTH) {
      setMessage(newMessage);
      setShowEmojiPicker(false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(start + emoji.length, start + emoji.length);
        }
      }, 0);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="px-6 py-4 border-t border-white/5 bg-slate-900/30 backdrop-blur-xl relative">
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
          
          {/* Emoji 按钮 */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 rounded-xl transition-all duration-300 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
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
        
        {/* Emoji 选择面板 */}
        {showEmojiPicker && (
          <div 
            ref={emojiPickerRef}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* 分类标签 */}
            <div className="flex border-b border-white/10">
              {EMOJI_CATEGORIES.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`flex-1 py-2 text-sm transition-colors ${
                    activeCategory === index
                      ? 'text-white bg-white/10 border-b-2 border-purple-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Emoji 列表 */}
            <div className="p-2 max-h-40 overflow-y-auto">
              <div className="grid grid-cols-7 gap-1">
                {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => insertEmoji(emoji)}
                    className="p-1.5 text-lg hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
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

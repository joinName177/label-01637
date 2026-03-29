import { useState } from 'react';
import { getRandomName } from '../utils/helpers';

interface JoinScreenProps {
  onJoin: (name?: string) => void;
  isConnected: boolean;
}

export const JoinScreen = ({ onJoin, isConnected }: JoinScreenProps) => {
  const [name, setName] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConnected) {
      onJoin(name || undefined);
    }
  };

  const handleRandomName = () => {
    setName(getRandomName());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo 和标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl shadow-purple-500/30 mb-6">
            <span className="text-4xl">💬</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight font-display">
            云端聊天室
          </h1>
          <p className="text-slate-400 text-lg">
            与世界各地的朋友实时交流
          </p>
        </div>
        
        {/* 登录卡片 */}
        <div 
          className={`backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-500 ${
            isHovered ? 'scale-[1.02] shadow-purple-500/20' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                你的昵称
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入昵称或留空随机生成"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={handleRandomName}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 transition-colors"
                >
                  🎲 随机
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!isConnected}
              className={`w-full py-4 px-6 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                isConnected
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isConnected ? '加入聊天室 →' : '连接服务器中...'}
            </button>
          </form>
          
          {/* 连接状态 */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <span className="relative flex h-2.5 w-2.5">
                {isConnected ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500 animate-pulse"></span>
                )}
              </span>
              <span>{isConnected ? '服务器已连接' : '正在连接服务器...'}</span>
            </div>
          </div>
        </div>
        
        {/* 功能特点 */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { icon: '⚡', label: '实时消息' },
            { icon: '💾', label: '消息持久化' },
            { icon: '🌍', label: '多房间' },
          ].map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { memo } from 'react';
import type { Room, User } from '../types';

interface SidebarProps {
  rooms: Room[];
  currentRoom: Room | null;
  onlineUsers: User[];
  currentUser: User | null;
  onRoomChange: (room: Room) => void;
  isConnected: boolean;
}

export const Sidebar = memo(function Sidebar({ rooms, currentRoom, onlineUsers, currentUser, onRoomChange, isConnected }: SidebarProps) {
  return (
    <aside className="w-72 h-full flex-shrink-0 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col overflow-hidden">
      {/* 用户信息 */}
      {currentUser && (
        <div className="flex-shrink-0 p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ backgroundColor: currentUser.color }}
            >
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">{currentUser.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                {isConnected ? '在线' : '重连中...'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 房间列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
            聊天房间
          </h4>
          <div className="space-y-1">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onRoomChange(room)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  currentRoom?.id === room.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                    : 'hover:bg-white/5'
                }`}
              >
                <span className="text-2xl">{room.icon}</span>
                <div className="flex-1 text-left min-w-0">
                  <h5 className={`font-medium truncate ${
                    currentRoom?.id === room.id ? 'text-purple-300' : 'text-slate-300'
                  }`}>
                    {room.name}
                  </h5>
                  <p className="text-xs text-slate-500 truncate">{room.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentRoom?.id === room.id 
                    ? 'bg-purple-500/30 text-purple-300' 
                    : 'bg-white/5 text-slate-500 group-hover:bg-white/10'
                }`}>
                  {room.memberCount}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* 在线用户 */}
        <div className="p-4 border-t border-white/5">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            在线用户 ({onlineUsers.length})
          </h4>
          <div className="space-y-1">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: user.color }}
                >
                  {user.avatar}
                </div>
                <span className={`text-sm truncate ${
                  user.id === currentUser?.id ? 'text-purple-300 font-medium' : 'text-slate-400'
                }`}>
                  {user.name}
                  {user.id === currentUser?.id && (
                    <span className="ml-1 text-xs text-slate-500">(你)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 底部信息 */}
      <div className="p-4 border-t border-white/5">
        <div className="text-center text-xs text-slate-600">
          云端聊天室 v1.0
        </div>
      </div>
    </aside>
  );
});

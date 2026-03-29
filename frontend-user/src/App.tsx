import { JoinScreen, Sidebar, ChatRoom, ErrorToast } from './components';
import { useChat } from './hooks/useChat';

function App() {
  const {
    currentUser,
    messages,
    onlineUsers,
    rooms,
    currentRoom,
    isJoined,
    isConnected,
    error,
    joinChat,
    sendMessage,
    switchRoom,
    clearError,
  } = useChat();

  if (!isJoined) {
    return <JoinScreen onJoin={joinChat} isConnected={isConnected} />;
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-slate-950 overflow-hidden">
      {/* 错误提示 */}
      {error && <ErrorToast message={error.message} onClose={clearError} />}
      
      {/* 动态背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>
      
      {/* 网格背景 */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      {/* 主内容 */}
      <div className="relative z-10 flex w-full h-full">
        <Sidebar
          rooms={rooms}
          currentRoom={currentRoom}
          onlineUsers={onlineUsers}
          currentUser={currentUser}
          onRoomChange={switchRoom}
          isConnected={isConnected}
        />
        
        <ChatRoom
          room={currentRoom}
          messages={messages}
          currentUser={currentUser}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;

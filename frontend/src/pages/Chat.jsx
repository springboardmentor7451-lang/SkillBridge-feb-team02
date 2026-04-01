import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Send, User as UserIcon, Check, CheckCheck, MessageSquare, Star } from "lucide-react";
import { getConversationHistory, getConversations } from "../services/messageService";
import { useSocket } from "../context/SocketProvider";
import useAuth from "../context/useAuth";

const Chat = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        if (data.success) {
          let convs = data.data;
          const targetUser = location.state?.targetUser;

          // If we came from a 'Chat' button with a targetUser AND current user is NGO
          if (targetUser && currentUser?.role === "ngo") {
            const targetUserId = targetUser._id?.toString();
            const existingConv = convs.find(c => c.user._id?.toString() === targetUserId);
            
            if (existingConv) {
              setActiveConversation(existingConv.user);
            } else {
              // Add a temporary conversation placeholder for the new user
              const newPlaceholder = {
                user: targetUser,
                lastMessage: "Start a new conversation...",
                timestamp: new Date().toISOString(),
                isPlaceholder: true
              };
              convs = [newPlaceholder, ...convs];
              setActiveConversation(targetUser);
            }
          } else if (convs.length > 0 && !activeConversation) {
            setActiveConversation(convs[0].user);
          }
          
          setConversations(convs);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [location.state, currentUser?.role]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (activeConversation?._id) {
        try {
          const data = await getConversationHistory(activeConversation._id.toString());
          if (data.success) {
            setMessages(data.data);
          }
        } catch (error) {
          console.error("Error fetching history:", error);
        }
      }
    };
    fetchHistory();
  }, [activeConversation?._id]);

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (message) => {
        const activeId = activeConversation?._id?.toString();
        // If message is from active conversation or to current user
        if (
          message.sender_id?._id?.toString() === activeId ||
          message.receiver_id?._id?.toString() === activeId
        ) {
          setMessages((prev) => [...prev, message]);
        }
        
        // Refresh conversations list to update last message
        refreshConversations();
      });

      socket.on("message_sent", (message) => {
        const activeId = activeConversation?._id?.toString();
        if (message.receiver_id?._id?.toString() === activeId) {
          setMessages((prev) => [...prev, message]);
        }
        refreshConversations();
      });

      return () => {
        socket.off("receive_message");
        socket.off("message_sent");
      };
    }
  }, [socket, activeConversation?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const refreshConversations = async () => {
    try {
      const data = await getConversations();
      if (data.success) {
        const updatedConvs = data.data;
        setConversations(updatedConvs);
        
        // If we currently have a placeholder active, update it to the real conversation user
        if (activeConversation) {
           const activeId = activeConversation._id?.toString();
           const match = updatedConvs.find(c => c.user._id?.toString() === activeId);
           if (match) {
             setActiveConversation(match.user);
           }
        }
      }
    } catch (error) {
      console.error("Error refreshing conversations:", error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation?._id || !socket?.connected) return;

    socket.emit("send_message", {
      receiver_id: activeConversation._id.toString(),
      content: newMessage,
    });

    setNewMessage("");
  };

  if (loading && conversations.length === 0) {
    return <div className="pt-32 text-center text-slate-500">Loading chats...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12">
      <div className="max-w-6xl mx-auto h-[calc(100vh-180px)] min-h-[600px] flex shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white border border-slate-100">
        
        {/* Sidebar */}
        <div className="w-80 md:w-96 border-r border-slate-100 flex flex-col bg-white">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Messages</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <MessageSquare size={24} />
                </div>
                <p className="text-slate-400 text-sm font-medium">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversation?._id === conv.user._id;
                return (
                  <div
                    key={conv.user._id}
                    onClick={() => setActiveConversation(conv.user)}
                    className={`p-4 flex items-center gap-4 cursor-pointer transition-all relative group ${
                      isActive
                        ? "bg-indigo-50/50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                    )}
                    
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transform transition-transform group-hover:scale-105 shadow-sm ${
                        conv.user.role === 'ngo' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                         {conv.user.role === 'ngo' ? "NGO" : <UserIcon size={20} />}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`font-bold truncate text-sm ${isActive ? "text-indigo-900" : "text-slate-800"}`}>
                          {conv.user.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter shrink-0 ml-2">
                           {conv.isPlaceholder ? "New" : new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${!conv.read && !isActive ? "text-slate-900" : "text-slate-500"}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Panel */}
        <div className="flex-1 flex flex-col bg-slate-50/30 relative">
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="p-4 px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs shadow-inner ${
                    activeConversation.role === 'ngo' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {activeConversation.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight flex items-center gap-2">
                      {activeConversation.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar scrollbar-thin flex flex-col gap-6">
                {messages.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                     <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4 transition-transform hover:scale-110">
                        <Send size={24} className="text-indigo-400 -rotate-12" />
                     </div>
                     <p className="text-sm font-bold uppercase tracking-widest opacity-60">Start the conversation</p>
                  </div>
                )}
                
                {messages.map((msg, idx) => {
                  const isMine = msg.sender_id?._id === currentUser._id || msg.sender_id === currentUser._id;
                  const showAvatar = idx === 0 || messages[idx-1]?.sender_id?._id !== msg.sender_id?._id;
                  
                  return (
                    <div key={idx} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                      <div
                        className={`max-w-[75%] md:max-w-md px-5 py-3.5 rounded-3xl text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${
                          isMine
                            ? "bg-slate-900 text-white rounded-tr-sm"
                            : "bg-white text-slate-800 rounded-tl-sm border border-slate-100"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 px-2">
                        <span className="text-[10px] text-slate-400 font-bold tracking-tight">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Input Box */}
              <div className="p-6 bg-white border-t border-slate-100">
                <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-slate-50 rounded-[2rem] p-2 pl-5 pr-3 border border-slate-100 shadow-inner group transition-all focus-within:bg-white focus-within:shadow-md focus-within:border-indigo-100">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={socket?.connected ? "Write your message here..." : "Connecting to secure chat..."}
                    disabled={!socket?.connected}
                    className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none disabled:opacity-50 font-medium text-slate-700"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !socket?.connected}
                    className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all shrink-0 cursor-pointer shadow-lg shadow-slate-200 active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 text-center">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-center transform -rotate-6">
                  <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-500">
                    <MessageSquare size={44} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-lg transform rotate-12">
                   <Star size={24} fill="currentColor" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Secure Chat</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Connect and collaborate with matched volunteers and organizations safely and efficiently.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="px-5 py-2 bg-white rounded-full text-xs font-bold text-slate-400 border border-slate-100 shadow-sm">
                   End-to-end focus
                </div>
                <div className="px-5 py-2 bg-white rounded-full text-xs font-bold text-slate-400 border border-slate-100 shadow-sm">
                   Real-time delivery
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

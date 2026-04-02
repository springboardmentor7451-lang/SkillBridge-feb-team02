import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, MessageSquare, Star } from "lucide-react";
import useAuth from "../context/useAuth";
import { useSocket } from "../context/SocketProvider";
import { getNotifications, markAllAsRead, markAsRead } from "../services/notificationService";

const Navbar = ({ openAuthModal, role }) => {
  const { isAuthenticated, logoutUser, user } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const data = await getNotifications();
          if (data.success) {
            setNotifications(data.data);
            setUnreadCount(data.data.filter(n => !n.read).length);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (socket) {
      socket.on("new_notification", (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
      return () => socket.off("new_notification");
    }
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markAsRead(notification._id);
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification read:", error);
      }
    }
    setShowNotifications(false);
    navigate("/chat");
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative">
      <nav className="w-[90%] mx-auto rounded-full flex justify-between items-center px-6 md:px-8 py-3 bg-white shadow-md fixed top-7 left-1/2 -translate-x-1/2 z-40 border border-slate-100">
        <Link
          to={user?.role === "ngo" ? "/ngo" : "/volunteer"}
          onClick={closeMenu}
          className="text-2xl font-extrabold text-slate-900 tracking-tighter no-underline z-50"
        >
          ServeSync
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 border-r border-slate-100 pr-6 mr-1">
                <Link 
                  to="/chat" 
                  title="Messages"
                  className={`p-2 rounded-full transition-all ${location.pathname === '/chat' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <MessageSquare size={20} />
                </Link>
                
                {role === "volunteer" && (
                  <Link 
                    to="/matches" 
                    title="Matches"
                    className={`p-2 rounded-full transition-all ${location.pathname === '/matches' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Star size={20} />
                  </Link>
                )}

                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2 rounded-full transition-all relative border-none bg-transparent cursor-pointer ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                      <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <span className="font-bold text-slate-800">Notifications</span>
                        <button 
                          onClick={handleMarkAllRead}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-transparent border-none cursor-pointer"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-sm">No notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n._id} 
                              onClick={() => handleNotificationClick(n)}
                              className={`p-4 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-all cursor-pointer group ${!n.read ? 'bg-indigo-50/30' : ''}`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm text-slate-700 leading-tight pr-2 group-hover:text-indigo-600 transition-colors">
                                  {n.message}
                                </p>
                                {!n.read && (
                                  <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0 shadow-sm" />
                                )}
                              </div>
                              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                {new Date(n.timestamp).toLocaleDateString()} at {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <Link to="/profile" className="no-underline">
                  <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm border-2 border-slate-100 shadow-sm transition-transform hover:scale-105">
                    {userInitial}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                className="px-6 py-2 rounded-full font-bold text-sm transition-colors bg-transparent text-slate-500 hover:text-slate-900 border-none cursor-pointer"
                onClick={() => openAuthModal("login")}
              >
                Log In
              </button>

              <button
                className="px-6 py-2.5 rounded-full font-bold text-sm transition-all bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 border-none cursor-pointer shadow-sm"
                onClick={() => openAuthModal("signup")}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 text-slate-600 z-50 bg-transparent border-none cursor-pointer"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-md z-40 transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="pt-32 relative px-8 flex flex-col h-full">
          {isAuthenticated ? (
            <div className="flex flex-col gap-6 w-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-2xl">
                  {userInitial}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{user?.name}</h3>
                  <p className="text-slate-500 text-sm italic capitalize">{role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                 <Link to="/chat" onClick={closeMenu} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl text-slate-700 no-underline font-bold text-sm">
                   <MessageSquare className="text-indigo-500" /> Messages
                 </Link>
                 {role === "volunteer" && (
                   <Link to="/matches" onClick={closeMenu} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl text-slate-700 no-underline font-bold text-sm">
                     <Star className="text-amber-500" /> Matches
                   </Link>
                 )}
              </div>

              <nav className="flex flex-col gap-4">
                <Link to="/profile" onClick={closeMenu} className="text-xl font-bold text-slate-800 no-underline py-2 border-b border-slate-50">Profile Settings</Link>
                {role === "ngo" && (
                  <Link to="/ngo" onClick={closeMenu} className="text-xl font-bold text-slate-800 no-underline py-2 border-b border-slate-50">NGO Dashboard</Link>
                )}
                {role === "volunteer" && (
                  <>
                    <Link to="/volunteer" onClick={closeMenu} className="text-xl font-bold text-slate-800 no-underline py-2 border-b border-slate-50">Volunteer Dashboard</Link>
                    <Link to="/my-applications" onClick={closeMenu} className="text-xl font-bold text-slate-800 no-underline py-2 border-b border-slate-50">My Applications</Link>
                  </>
                )}
              </nav>

              <button
                onClick={handleLogout}
                className="mt-auto mb-10 px-8 py-4 rounded-full text-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-all border-none cursor-pointer shadow-lg shadow-red-200"
              >
                Logout Account
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center h-full pb-20">
              <button
                className="px-10 py-5 rounded-full text-xl font-bold w-full max-w-xs bg-slate-100 text-slate-800 hover:bg-slate-200"
                onClick={() => { closeMenu(); openAuthModal("login"); }}
              >
                Log In
              </button>

              <button
                className="px-10 py-5 rounded-full text-xl font-bold w-full max-w-xs bg-slate-900 text-white hover:bg-slate-800 shadow-xl"
                onClick={() => { closeMenu(); openAuthModal("signup"); }}
              >
                Sign Up Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

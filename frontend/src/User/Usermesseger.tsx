import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useTheme } from "@/components/theme-provider";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  MessageSquare,
  X,
  Send,
  User,
  Phone,
  Loader2,
  AlertCircle
} from "lucide-react";

// --- 🎨 Config ---
const FONT_FAMILY = "font-['Kanit',_sans-serif]";
const API_BASE = "http://localhost:5000";

// --- Types ---
type Message = {
  _id: string;
  message: string;
  senderId: string;
  senderName?: string;
  timestamp: string;
  isMe?: boolean;
};

type Tradesman = {
  _id: string;
  Name: string;
  Position?: string;
  Profile?: string;
  role?: string;
};

export default function Usermessager() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // --- Data States ---
  const [currentUser, setCurrentUser] = useState<Tradesman | null>(null);
  const [tradesmen, setTradesmen] = useState<Tradesman[]>([]);
  const [selectedUser, setSelectedUser] = useState<Tradesman | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- UI States ---
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // ป้องกัน Hydration Error
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Fetch Initial Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // 1. ดึงข้อมูลตัวเอง
        const meRes = await axios.get(`${API_BASE}/api/login/dashboardUser`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        });
        
        const data = meRes.data;
        // Logic หา ID
        const realId = data._id || data.id || data.userId || (data.user && data.user._id);
        if (realId) {
            setCurrentUser({ ...data, _id: realId });
        }

        // 2. ดึงรายชื่อทั้งหมด
        const usersRes = await axios.get(`${API_BASE}/api/login/all-tradesman`, { 
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setTradesmen(usersRes.data);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Filter Logic ---
  const filteredUsers = tradesmen.filter((t) => {
    if (!currentUser) return false;
    if (t._id === currentUser._id) return false; // ไม่แสดงตัวเอง
    
    // กรองตาม Tab (ตัวอย่าง Logic คร่าวๆ)
    // ถ้ามี field role จริงๆ ให้ใช้ t.role แทน
    let matchTab = true;
    // if (activeTab === "admin") matchTab = t.role === "admin"; 

    // กรองตาม Search
    const term = search.toLowerCase();
    const matchSearch = t.Name.toLowerCase().includes(term) || 
                        (t.Position && t.Position.toLowerCase().includes(term));
    
    return matchTab && matchSearch;
  });

  if (!mounted) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900" />;

  const isDark = theme === "dark";

  // --- Theme Classes Helper ---
  const primaryBg = isDark ? "bg-yellow-500" : "bg-blue-500";
  const primaryText = isDark ? "text-yellow-500" : "text-blue-500";
  const mainText = isDark ? "text-gray-100" : "text-gray-800";
  const subText = isDark ? "text-gray-400" : "text-gray-500";
  const pageBg = isDark ? "bg-gray-900" : "bg-gray-50";
  const cardStyle = isDark 
    ? "bg-gray-800 border border-white/20 shadow-md" 
    : "bg-white border border-gray-200 shadow-sm";
  const inputStyle = isDark
    ? "bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500"
    : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400";

  if (isLoading) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${pageBg} ${mainText}`}>
        <Loader2 className={`h-8 w-8 animate-spin ${primaryText}`} />
        <p className="text-sm opacity-60 ml-2">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className={`h-screen container mx-auto max-w-380 overflow-hidden ${pageBg} ${mainText} p-4 lg:p-6 ${FONT_FAMILY} transition-colors duration-300 flex flex-col`}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap');`}</style>
      
      {/* Header Section */}
      <div className="mb-6 shrink-0">
        <h1 className={`text-2xl font-semibold mb-1 ${primaryText}`}>ภาพรวมข้อความจากช่าง</h1>
        <p className={`${subText} text-sm`}>จัดการและติดตามข้อความแจ้งเตือนทั้งหมดในระบบ</p>
        <div className="mt-2 text-xs opacity-50">
            เข้าสู่ระบบโดย: <span className="font-medium">{currentUser?.Name}</span>
        </div>
      </div>

      {/* Cards Section (Static Stats for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 shrink-0">
        <div className={`${cardStyle} p-4 lg:p-6 rounded-xl flex items-center justify-between hover:scale-[1.01] transition-transform`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg bg-opacity-10 ${primaryText} bg-current`}>
                <MessageSquare size={20} />
              </div>
              <span className={`${subText} font-medium text-sm lg:text-base`}>ผู้ใช้งานทั้งหมด</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold">{tradesmen.length}</h2>
          </div>
        </div>
        {/* Cards อื่นๆ สามารถใส่ Logic นับจำนวนจริงได้ทีหลัง */}
        <div className={`${cardStyle} p-4 lg:p-6 rounded-xl flex items-center justify-between hover:scale-[1.01] transition-transform`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                <AlertTriangle size={20} />
              </div>
              <span className={`${subText} font-medium text-sm lg:text-base`}>แจ้งปัญหา</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold">-</h2>
          </div>
        </div>
        <div className={`${cardStyle} p-4 lg:p-6 rounded-xl flex items-center justify-between hover:scale-[1.01] transition-transform`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <CheckCircle size={20} />
              </div>
              <span className={`${subText} font-medium text-sm lg:text-base`}>ออนไลน์</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold">-</h2>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6 flex-1 min-h-0">
        
        {/* Left: User List (Table) */}
        <div className={`col-span-12 lg:col-span-8 ${cardStyle} rounded-xl overflow-hidden flex flex-col h-full`}>
          
          {/* Filter Bar */}
          <div className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"} flex flex-wrap gap-4 justify-between items-center shrink-0`}>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
              {['ทั้งหมด', 'ช่าง', 'พนักงาน'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab === 'ทั้งหมด' ? 'all' : tab)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    (activeTab === 'all' && tab === 'ทั้งหมด') || activeTab === tab
                      ? `${primaryBg} ${isDark ? "text-gray-900" : "text-white"} shadow-md`
                      : `${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-auto">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${subText}`} size={16} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหา ชื่อ, ตำแหน่ง..." 
                className={`pl-9 pr-4 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 w-full lg:w-64 ${inputStyle} ${isDark ? "focus:ring-yellow-500" : "focus:ring-blue-500"}`}
              />
            </div>
          </div>

          {/* Table Header */}
          <div className={`grid grid-cols-12 ${isDark ? "bg-gray-900/30" : "bg-gray-50"} p-4 text-xs uppercase font-semibold tracking-wider ${subText} shrink-0`}>
            <div className="col-span-6">ชื่อ / ตำแหน่ง</div>
            <div className="col-span-3 text-center hidden sm:block">สถานะ</div>
            <div className="col-span-3 text-end hidden sm:block">จัดการ</div>
          </div>

          {/* Table Rows (Real Data Map) */}
          <div className={`divide-y overflow-y-auto overscroll-contain flex-1 ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
            {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                const isSelected = selectedUser?._id === user._id;
                const profileSrc = `${API_BASE}/uploads/Profile/${user.Profile || "default.png"}`;

                return (
                    <div 
                    key={user._id} 
                    onClick={() => setSelectedUser(user)}
                    className={`grid grid-cols-12 p-4 items-center transition-all cursor-pointer border-l-4 
                        ${isSelected 
                        ? `${isDark ? "bg-gray-700/50 border-yellow-500" : "bg-blue-50 border-blue-500"}` 
                        : `${isDark ? "hover:bg-gray-700/30 border-transparent" : "hover:bg-gray-50 border-transparent"}`
                        }`}
                    >
                    <div className="col-span-6 flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center shrink-0`}>
                            <img 
                                src={profileSrc} 
                                alt={user.Name} 
                                className="h-full w-full object-cover"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                        </div>
                        <div>
                            <h4 className={`font-medium ${mainText} text-sm ${isSelected ? primaryText : ""}`}>{user.Name}</h4>
                            <p className={`${subText} text-xs mt-0.5`}>{user.Position || "พนักงานทั่วไป"}</p>
                        </div>
                    </div>
                    <div className="col-span-3 justify-center hidden sm:flex items-center">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-500/20 text-emerald-500`}>
                        ออนไลน์
                        </span>
                    </div>
                    <div className="col-span-3 text-end hidden sm:block">
                        <button className={`text-xs px-3 py-1 rounded-full border ${isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"}`}>
                            ดูประวัติ
                        </button>
                    </div>
                    </div>
                );
                })
            ) : (
                <div className="p-8 text-center opacity-50 flex flex-col items-center">
                    <User size={48} className="mb-2" />
                    <p>ไม่พบรายชื่อ</p>
                </div>
            )}
          </div>
        </div>

        {/* Right: Chat Panel or Placeholder */}
        <div className="col-span-12 lg:col-span-4 h-full flex flex-col min-h-0">
          {selectedUser && currentUser ? (
            <ChatPanel 
              targetUser={selectedUser} 
              currentUser={currentUser}
              onClose={() => setSelectedUser(null)}
              theme={{ cardStyle, primaryText, subText, inputStyle, isDark, primaryBg, mainText }} 
            />
          ) : (
            <div className={`${cardStyle} p-6 rounded-xl h-full flex flex-col items-center justify-center`}>
              <div className={`flex flex-col items-center justify-center text-center opacity-50 ${subText}`}>
                <MessageSquare size={64} className="mb-4" />
                <p className="text-base font-medium">เลือกรายชื่อทางซ้าย</p>
                <p className="text-sm">เพื่อเริ่มสนทนา</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub Component: Chat Panel (With Real Logic) ---
function ChatPanel({ targetUser, currentUser, onClose, theme }: { targetUser: Tradesman, currentUser: Tradesman, onClose: () => void, theme: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
        setLoadingChat(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE}/api/messages/history/${targetUser._id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            
            // Map API data to UI format
            const mappedMessages = res.data.map((msg: any) => ({
                _id: msg._id,
                message: msg.message,
                senderId: msg.senderId,
                isMe: msg.senderId === currentUser._id || msg.isMe, // Check ownership
                timestamp: msg.timestamp
            }));
            
            setMessages(mappedMessages);
        } catch (err) {
            console.error("Failed to load chat", err);
        } finally {
            setLoadingChat(false);
        }
    };

    if (targetUser._id) {
        fetchMessages();
    }
  }, [targetUser._id, currentUser._id]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        setTimeout(() => {
            scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
        }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const tempId = Date.now().toString();
    const newMessage: Message = {
        _id: tempId,
        message: inputValue,
        senderId: currentUser._id,
        isMe: true,
        timestamp: new Date().toISOString()
    };

    // Optimistic Update
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    try {
        const token = localStorage.getItem("token");
        await axios.post(`${API_BASE}/api/messages/send`, {
            receiverId: targetUser._id,
            message: newMessage.message,
            senderName: currentUser.Name
        }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
        // In real app, you might want to replace tempId with real ID from response
    } catch (err) {
        console.error("Failed to send", err);
        // Handle error (maybe show alert icon)
    }
  };

  const profileSrc = `${API_BASE}/uploads/Profile/${targetUser.Profile || "default.png"}`;

  return (
    <div className={`${theme.cardStyle} rounded-xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-200`}>
      {/* Chat Header */}
      <div className={`p-3 border-b ${theme.isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} flex justify-between items-center shrink-0 shadow-sm`}>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className={`p-1.5 rounded-full active:bg-gray-500/20 ${theme.subText} lg:hidden`}>
            <X size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full overflow-hidden bg-gray-500`}>
                <img src={profileSrc} alt={targetUser.Name} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
            <div>
                <h3 className={`font-semibold text-sm ${theme.mainText}`}>{targetUser.Name}</h3>
                <span className={`text-[10px] ${theme.subText} block -mt-0.5`}>
                ออนไลน์
                </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button className={`p-2 rounded-full ${theme.subText}`}>
                <Phone size={16} />
            </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto p-3 space-y-3 overscroll-contain ${theme.isDark ? "bg-gray-900/50" : "bg-gray-50/50"}`}>
        {loadingChat ? (
            <div className="h-full flex items-center justify-center">
                <Loader2 className={`animate-spin ${theme.subText}`} />
            </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40 text-xs">
            <p>เริ่มการสนทนา</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm shadow-sm break-words ${
                msg.isMe 
                  ? `${theme.primaryBg} ${theme.isDark ? "text-gray-900" : "text-white"} rounded-tr-none` 
                  : `${theme.isDark ? "bg-gray-700 text-white" : "bg-white border border-gray-200 text-gray-800"} rounded-tl-none`
              }`}>
                <p className="leading-tight">{msg.message}</p>
                <div className={`text-[9px] mt-1 text-right opacity-60`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className={`p-3 border-t ${theme.isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shrink-0`}>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${theme.isDark ? "border-gray-600 bg-gray-900 focus-within:border-yellow-500" : "border-gray-300 bg-gray-50 focus-within:border-blue-500"}`}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="พิมพ์ข้อความ..." 
            className={`flex-1 bg-transparent focus:outline-none text-sm ${theme.mainText}`} 
          />
          <button 
            onClick={handleSend}
            className={`p-1.5 rounded-full transition-all ${inputValue.trim() ? `${theme.primaryText} active:scale-95` : "text-gray-400 cursor-not-allowed"}`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
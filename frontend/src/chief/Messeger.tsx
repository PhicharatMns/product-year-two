import { useTheme } from "@/components/theme-provider";
import { useEffect, useState, useRef, ChangeEvent, FormEvent } from "react";
import type { ReactNode } from "react";

// *** ไอคอนที่ใช้ (ลบ Plus และ X ที่ไม่ได้ใช้ออกแล้ว) ***
import { 
  Search, 
  MessageSquare, 
  Inbox, 
  Shapes, 
  TriangleAlert,
  Clock,
  Check
} from "lucide-react";

// --- Types (เปลี่ยนใหม่ทั้งหมด) ---
export type TechnicianMessage = {
  id: string;
  technicianName: string;
  subject: string;
  category: string; // "แจ้งปัญหา", "ขอข้อมูล", "ส่งงาน", "อื่นๆ"
  status: "ใหม่" | "กำลังดำเนินการ" | "ปิดงาน";
  timestamp: string;
};

type ColorName = "green" | "blue" | "purple" | "gray" | "yellow" | "red" | "indigo" | "pink";

// (เปลี่ยน) สรุปตามหมวดหมู่ข้อความ
type MessageCategorySummary = {
  category: string;
  messageCount: number;
};

// --- Mock Data (เปลี่ยนใหม่ทั้งหมด) ---
const initialMessages: TechnicianMessage[] = [
  { id: "M001", technicianName: "สมชาย", subject: "แอร์ไม่เย็น (ห้อง 101)", category: "แจ้งปัญหา", status: "ใหม่", timestamp: "14/11/68 09:15" },
  { id: "M002", technicianName: "สมศักดิ์", subject: "ขอเบิกสายไฟ VAF", category: "ขอข้อมูล", status: "ใหม่", timestamp: "14/11/68 09:05" },
  { id: "M003", technicianName: "วิชัย", subject: "ท่อประปาแตก (ชั้น 2)", category: "แจ้งปัญหา", status: "กำลังดำเนินการ", timestamp: "13/11/68 18:30" },
  { id: "M004", technicianName: "สมชาย", subject: "เปลี่ยนหลอดไฟทางเดินชั้น 3 เรียบร้อย", category: "ส่งงาน", status: "ปิดงาน", timestamp: "13/11/68 17:00" },
  { id: "M005", technicianName: "มานะ", subject: "ขอทราบสต็อกสีทาภายใน", category: "ขอข้อมูล", status: "ปิดงาน", timestamp: "13/11/68 15:20" },
  { id: "M006", technicianName: "วิชัย", subject: "ส่งงานซ่อมประตูห้อง 205", category: "ส่งงาน", status: "ปิดงาน", timestamp: "13/11/68 14:10" },
  { id: "M007", technicianName: "สมศักดิ์", subject: "ปั๊มน้ำเสียงดังผิดปกติ", category: "แจ้งปัญหา", status: "ใหม่", timestamp: "14/11/68 10:00" },
];


// --- Helper Components ---

// 1. Badge (*** แก้ไขตามคำขอ: ขยายขนาด ***)
type BadgeProps = { children: ReactNode; color?: ColorName; };
const Badge = ({ children, color = "gray" }: BadgeProps) => {
  const { theme } = useTheme();
  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  }[color];
  return (
    // เปลี่ยนจาก px-2.5 py-0.5 text-xs เป็น px-3 py-1 text-sm
    <span className={`inline-flex  items-center justify-center rounded-full  min-w-15 px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}>
      {children}
    </span>
  );
};

// 2. colorMap (เหมือนเดิม)
const colorMap: Record<ColorName, { light: string, dark: string }> = {
  blue: { light: "bg-blue-600", dark: "bg-blue-500" },
  green: { light: "bg-green-600", dark: "bg-green-500" },
  purple: { light: "bg-purple-600", dark: "bg-purple-500" },
  yellow: { light: "bg-yellow-500", dark: "bg-yellow-400" },
  red: { light: "bg-red-600", dark: "bg-red-500" },
  indigo: { light: "bg-indigo-600", dark: "bg-indigo-500" },
  pink: { light: "bg-pink-600", dark: "bg-pink-500" },
  gray: { light: "bg-gray-600", dark: "bg-gray-500" },
};

// 3. MessageCategorySummary (เหมือนเดิม)
type MessageCategorySummaryProps = {
  summaryData: MessageCategorySummary[];
  getCategoryColor: (category: string) => ColorName;
  theme: string | undefined;
};
const MessageCategorySummary = ({ summaryData, getCategoryColor, theme }: MessageCategorySummaryProps) => {
  const grandTotalMessages = summaryData.reduce((sum, cat) => sum + cat.messageCount, 0);
  const categoryCount = summaryData.length;
  if (grandTotalMessages === 0 || categoryCount === 0) return null;

  return (
    <div className="h-110">
      <h3 className="text-md font-semibold mb-2">สัดส่วนข้อความ</h3>
      <div className=" items-center gap-4 mb-3">
        <span className={`text-sm flex-shrink-0 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {categoryCount} หมวดหมู่
        </span>
        <div className="flex w-full h-3 rounded-full overflow-hidden">
          {summaryData.map((summary, index) => {
            const percentage = (summary.messageCount / grandTotalMessages) * 100;
            const colorName = getCategoryColor(summary.category);
            const bgColor = theme === "dark" ? colorMap[colorName].dark : colorMap[colorName].light;
            return (
              <div
                key={index}
                className={`${bgColor} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
                title={`${summary.category}: ${summary.messageCount} ข้อความ (${percentage.toFixed(1)}%)`}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1 gap-x-4 gap-y-2 text-sm">
        {summaryData.map((summary, index) => {
          const colorName = getCategoryColor(summary.category);
          const bgColor = theme === "dark" ? colorMap[colorName].dark : colorMap[colorName].light;
          const percentage = (summary.messageCount / grandTotalMessages) * 100;
          return (
            <div key={index} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${bgColor}`}></span>
              <span className="font-medium">{summary.category}</span>
              <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. AddMessageForm (*** ลบออก ***)
// 5. AddMessageModal (*** ลบออก ***)

// 6. StatCard Component (เปลี่ยนชื่อจาก 7 เป็น 4)
type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorClass: string; // เช่น "text-blue-500"
  theme: string | undefined;
}

const StatCard = ({ title, value, icon, colorClass, theme }: StatCardProps) => {
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
 <div className={`flex items-center w-full p-4 rounded-lg shadow-sm border ${bg} ${border}`}>
  <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
    {icon}
  </div>
  <div className="ml-4">
    <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
      {title}
    </p>
    <p className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      {value}
    </p>
    
  </div>
</div>
);
}


// --- Main Component (ปรับปรุงใหม่ทั้งหมด) ---

export default function MessageDashboard() { // เปลี่ยนชื่อ
  // --- Hooks & Context ---
  const { theme } = useTheme();

  // --- State (ปรับปรุง - ลบ state การเพิ่มข้อความ) ---
  const [messages, setMessages] = useState<TechnicianMessage[]>(initialMessages); 
  const [fade, setFade] = useState(false);
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [Focused, setFocused] = useState(false);
  const [tabFade, setTabFade] = useState(true);
  const tabAnimationTimeout = useRef<number | null>(null);

  // (*** ลบ State ที่เกี่ยวกับการเพิ่มข้อความ ***)
  // const [isAddingMessage, setIsAddingMessage] = useState(false);
  // const [newMessage, setNewMessage] = useState({ ... });


  // --- Theme Styles (เหมือนเดิม) ---
  const pageBg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-300";
  const titleText = theme === "dark" ? "text-white" : "text-gray-900";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  // --- Effects (เหมือนเดิม) ---
  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => {
      clearTimeout(timer);
      if (tabAnimationTimeout.current) {
        clearTimeout(tabAnimationTimeout.current);
      }
    };
  }, []);

  // --- Derived Data & Logic (เหมือนเดิม) ---
  const categories = [...new Set(messages.map((item) => item.category))];
  const tabs = ["ทั้งหมด", ...categories];

  const messageCategorySummary: MessageCategorySummary[] = categories.map(category => {
    const messagesInCategory = messages.filter(item => item.category === category);
    const messageCount = messagesInCategory.length; 
    return { category, messageCount };
  });

  const filteredMessages = messages
    .filter((item) => (activeTab === "ทั้งหมด" ? true : item.category === activeTab))
    .filter((item) => {
      if (search === "") return true;
      const searchTerm = search.toLowerCase();
      return (
        item.subject.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.technicianName.toLowerCase().includes(searchTerm) ||
        item.id.toLowerCase().includes(searchTerm)
      );
    });

  // (ปรับปรุง) Stat Cards
  const totalMessages = messages.length;
  const newMessagesCount = messages.filter(item => item.category === "แจ้งปัญหา" && item.status !== "ปิดงาน").length; // นับ "แจ้งปัญหา" ที่ยังไม่ปิด
  const sentWorkCount = messages.filter(item => item.category === "ส่งงาน" && item.status !== "ปิดงาน").length; // นับ "ส่งงาน" ที่ยังไม่ปิด

  const stats = [
    { 
      title: "ข้อความทั้งหมด", 
      value: totalMessages, 
      icon: <Inbox size={24} />, 
      colorClass: theme === 'dark' ? "text-blue-400" : "text-blue-600" 
    },
    { 
      title: "แจ้งปัญหา (ค้างอยู่)", 
      value: newMessagesCount, 
      icon: <TriangleAlert size={24} />, 
      colorClass: theme === 'dark' ? "text-red-400" : "text-red-600" 
    },
    { 
      title: "รอตรวจงาน", 
      value: sentWorkCount, 
      icon: <Check size={24} />, 
      colorClass: theme === 'dark' ? "text-green-400" : "text-green-600" 
    },
  ];

  // --- Handlers (ปรับปรุง - ลบ Handlers การเพิ่มข้อความ) ---

  // 1. Helper สี (ปรับปรุง)
  const getCategoryColor = (category: string): ColorName => {
    switch (category) {
      case "แจ้งปัญหา": return "red";
      case "ขอข้อมูล": return "blue";
      case "ส่งงาน": return "green";
      default: return "gray";
    }
  };

  // (ใหม่) Helper สีสำหรับ Status
  const getStatusColor = (status: TechnicianMessage["status"]): ColorName => {
    switch (status) {
      case "ใหม่": return "yellow";
      case "กำลังดำเนินการ": return "indigo";
      case "ปิดงาน": return "green";
      default: return "gray";
    }
  };


  // 2. Tab Click (เหมือนเดิม)
  const handleTabClick = (tabName: string) => {
    if (tabName === activeTab || !fade) return;
    if (tabAnimationTimeout.current) clearTimeout(tabAnimationTimeout.current);
    setTabFade(false);
    tabAnimationTimeout.current = setTimeout(() => {
      setActiveTab(tabName);
      setTabFade(true);
    }, 300);
  };

  // 3. Handlers "เพิ่มข้อความ" (*** ลบออก ***)
  // (handleShowAddMessageForm, handleCancelAddMessage, handleMessageFormChange, handleSubmitAddMessage)


  // --- JSX Return (ออกแบบใหม่) ---
  return (
    <div className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"} ${pageBg} ${text} min-h-screen`}>
      <div className={` max-w-380 h-screen transition-opacity duration-300 p-5 mx-auto container`}>
        
        {/* 1. Header (เหมือนเดิม) */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${titleText}`}>
            ภาพรวมข้อความจากช่าง
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            ติดตามและจัดการข้อความแจ้งเตือนทั้งหมด
          </p>
        </div>

        {/* 2. Stat Cards (KPIs) (เหมือนเดิม) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => (
            <StatCard 
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              colorClass={stat.colorClass}
              theme={theme}
            />
          ))}
        </div>

        {/* 3. Main Content (2-Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 3.1 Left Column (Main Table) (เหมือนเดิม) */}
          <div className={`lg:col-span-2  ${cardBg} border ${border} rounded-lg shadow-sm`}>
            {/* Card Header: Search + Tabs (เหมือนเดิม) */}
            <div className={`p-5 border-b ${border}`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Tabs */}
                <div className={`flex items-center  pb-2 md:pb-0`}>
                  {tabs.map((tabName) => {
                    const isActive = activeTab === tabName;
                    const activeClasses = theme === "dark" ? "bg-yellow-500 text-gray-900" : "bg-blue-600 text-white";
                    const inactiveClasses = theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
                    return (
                      <button
                        type="button"
                        key={tabName}
                        onClick={() => handleTabClick(tabName)}
                        className={`py-1.5 px-4 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses} ml-2 first:ml-0`}
                      >
                        {tabName}
                      </button>
                    );
                  })}
                </div>
                  {/* Search Bar */}
                  <div className="relative  w-50">
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
s                   />
                    <input
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="ค้นหา (เรื่อง, ช่าง, ID)"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className={`pl-10 pr-3 py-2 rounded-md transition-all duration-300 w-full md:w-50
                       ${theme === "dark" ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600" : "bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"}`}
                    />
                </div>
              </div>
            </div>
            
              
              <div className={`block w-full overflow-y-auto max-h-130 transition-opacity duration-300 ${tabFade ? "opacity-100" : "opacity-0"}`}>
                
                  {/* Grid Header (แทน <thead>) */}
                  <div className={`sticky top-0 z-10 grid grid-cols-12 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} border-b ${border}`}>
                    <div className={`p-4 col-span-5 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>เรื่อง / ช่าง</div>
                    <div className={`p-4 col-span-3 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>หมวดหมู่</div>
                    <div className={`p-4 col-span-2 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>สถานะ</div>
                    <div className={`p-4 col-span-2 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>เวลา</div>
                  </div>

                  {/* Grid Body (แทน <tbody>) */}
                  <div className={`divide-y  ${border}`}>
                    {filteredMessages.map((item) => (
                      // Grid Row (แทน <tr>)
                      <div
                        key={item.id}
                        className={`grid grid-cols-12 transition-colors ${hoverBg}`}
                      >
                        {/* Cell 1: เรื่อง / ช่าง (แทน <td>) */}
                        <div className="p-4 col-span-5 whitespace-nowrap">
                          <p className="font-medium">{item.subject}</p>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            โดย: {item.technicianName} (ID: {item.id})
                          </p>
                        </div>
                        
                        {/* Cell 2: หมวดหมู่ (แทน <td>) */}
                        <div className="p-4  col-span-3 whitespace-nowrap">
                          <Badge color={getCategoryColor(item.category)}>{item.category}</Badge>
                        </div>
                        
                        {/* Cell 3: สถานะ (แทน <td>) */}
                        <div className="p-4 col-span-2 whitespace-nowrap">
                          <Badge color={getStatusColor(item.status)}>{item.status}</Badge>
                        </div>
                    
                        {/* Cell 4: เวลา (แทน <td>) */}
                        <div className="p-4 col-span-2 whitespace-nowrap">
                          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{item.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filteredMessages.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                      <p>{search ? `ไม่พบผลลัพธ์สำหรับ "${search}"` : `ไม่มีข้อมูลในหมวดหมู่ "${activeTab}"`}</p>
                    </div>
                  )}
                </div>
          
          </div>
          
          {/* 3.2 Right Column (Sidebar) (*** แก้ไข: ลบการ์ดปุ่มออก ***) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* (*** ลบ Quick Actions Card ออก ***) */}

            {/* Message Summary Card (เหมือนเดิม) */}
            <div className={`${cardBg}  border ${border} rounded-lg shadow-sm p-4`}>
              <MessageCategorySummary
                    summaryData={messageCategorySummary}
                    getCategoryColor={getCategoryColor}
                    theme={theme}
                  />
            </div>
          </div>
        </div>
      </div>
      
      
      {/* --- Modals (*** ลบออก ***) --- */}
      
    </div>
  );
}
import React, { useEffect, useState, ChangeEvent, FormEvent, ReactNode, createContext, useContext } from "react";
import { 
  Search, 
  Plus, 
  X, 
  TriangleAlert, 
  FileText,    
  ClipboardList,
  Warehouse,    
  ChevronDown
} from "lucide-react";

// --- Mock Theme Provider ---
const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

// --- Types ---
export type ReportItem = {
  id: string;
  title: string;
  category: 'ปัญหา (Admin)' | 'เอกสาร' | 'อุปกรณ์';
  detail: string; 
  date: string;   
  status: 'Pending' | 'Resolved' | 'Submitted';
};

type ColorName = "green" | "blue" | "purple" | "gray" | "yellow" | "red" | "indigo" | "pink";
type ReportStatus = 'Pending' | 'Resolved' | 'Submitted';

// --- Mock Data ---
const initialReportsData: ReportItem[] = [
  { id: "P001", title: "เซิร์ฟเวอร์ฐานข้อมูลขัดข้อง", category: "ปัญหา (Admin)", detail: "สถานะ: กำลังแก้ไข", date: "16/11/68", status: "Pending" },
  { id: "D001", title: "รายงานสรุปยอดขายประจำเดือน", category: "เอกสาร", detail: "ส่งโดย: ฝ่ายบัญชี", date: "15/11/68", status: "Submitted" },
  { id: "P002", title: "ผู้ใช้ไม่สามารถล็อกอินได้ (กลุ่ม A)", category: "ปัญหา (Admin)", detail: "สถานะ: แก้ไขแล้ว", date: "14/11/68", status: "Resolved" },
  { id: "D002", title: "แผนการตลาดไตรมาส 4", category: "เอกสาร", detail: "ส่งโดย: ฝ่ายการตลาด", date: "14/11/68", status: "Submitted" },
  { id: "P003", title: "ระบบส่งอีเมลล่าช้า", category: "ปัญหา (Admin)", detail: "สถานะ: ตรวจสอบอยู่", date: "13/11/68", status: "Pending" },
  { id: "E001", title: "เมาส์ไร้สายชำรุด", category: "อุปกรณ์", detail: "ส่งโดย: ทีม PM", date: "12/11/68", status: "Submitted" },
  { id: "D003", title: "เอกสารข้อกำหนดโครงการใหม่", category: "เอกสาร", detail: "ส่งโดย: ทีม PM", date: "12/11/68", status: "Submitted" },
];

// --- Helper Components ---

// 1. Badge
type BadgeProps = { children: ReactNode; color?: ColorName; };
const Badge = ({ children, color = "gray" }: BadgeProps) => {
  const { theme } = useTheme();
  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  }[color];
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}>
      {children}
    </span>
  );
};

// 2. StatCard
type StatCardProps = { title: string; value: string | number; icon: ReactNode; colorClass: string; theme: string | undefined; }
const StatCard = ({ title, value, icon, colorClass, theme }: StatCardProps) => {
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  return (
    <div className={`flex items-center w-full p-4 rounded-lg shadow-sm border ${bg} ${border}`}>
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>{icon}</div>
      <div className="ml-4">
        <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{title}</p>
        <p className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{value}</p>
      </div>
    </div>
  );
}

// 3. Kanban Card
type KanbanCardProps = {
  report: ReportItem;
  theme: string | undefined;
  getStatusColor: (status: ReportStatus) => ColorName;
}
const KanbanCard = ({ report, theme, getStatusColor }: KanbanCardProps) => {
  const cardBg = theme === "dark" ? "bg-gray-700" : "bg-white";
  const border = theme === "dark" ? "border-gray-600" : "border-gray-200";
  const titleText = theme === "dark" ? "text-white" : "text-gray-900";
  const detailText = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const metaText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`p-3 rounded-lg border ${border} ${cardBg} shadow-sm cursor-pointer hover:shadow-md transition-shadow group`}>
      {/* Card Header */}
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-semibold ${titleText} line-clamp-2`}>{report.title}</span>
        <Badge color={getStatusColor(report.status)}>{report.status}</Badge>
      </div>

      {/* Card Body */}
      <p className={`text-sm ${detailText} mb-3 line-clamp-3`}>
        {report.detail}
      </p>

      {/* Card Footer */}
      <div className={`flex justify-between items-center text-xs ${metaText}`}>
        <span>{report.date}</span>
        <span className="font-mono opacity-70">#{report.id}</span>
      </div>
    </div>
  );
};

// 4. Kanban Column (Responsive Optimized)
type KanbanColumnProps = {
  title: string;
  reports: ReportItem[];
  theme: string | undefined;
  getStatusColor: (status: ReportStatus) => ColorName;
  getCategoryColor: (category: string) => ColorName;
}
const KanbanColumn = ({ title, reports, theme, getStatusColor, getCategoryColor }: KanbanColumnProps) => {
  const columnBg = theme === "dark" ? "bg-gray-800" : "bg-gray-100";
  const titleText = theme === "dark" ? "text-white" : "text-gray-900";
  const countText = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const colorName = getCategoryColor(title);
  const colorMap: Record<ColorName, string> = {
    red: "border-red-500",
    blue: "border-blue-500",
    yellow: "border-yellow-500",
    green: "border-green-500",
    purple: "border-purple-500",
    indigo: "border-indigo-500",
    pink: "border-pink-500",
    gray: "border-gray-500",
  };

  return (
    <div className="w-[85vw] sm:w-80 md:w-96 flex-shrink-0 snap-center flex flex-col h-full max-h-full">
      
      {/* Header */}
      <div className={`flex items-center justify-between p-3 rounded-t-lg ${columnBg} border-t-4 ${colorMap[colorName]} flex-shrink-0 shadow-sm mb-1`}>
        <h3 className={`font-semibold ${titleText}`}>{title}</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} ${countText}`}>
          {reports.length}
        </span>
      </div>

      {/* Body (Scrollable) */}
      <div className={`p-2 flex flex-col gap-2 rounded-b-lg ${columnBg} flex-grow overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600`}>
        {reports.map(report => (
          <KanbanCard 
            key={report.id}
            report={report}
            theme={theme}
            getStatusColor={getStatusColor}
          />
        ))}
        {reports.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-sm">ไม่มีรายการ</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 5. Modal Component
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  theme: string | undefined;
  categories: string[];
  newReport: any;
  onFormChange: (e: ChangeEvent<any>) => void;
}
const AddReportModal = ({ isOpen, onClose, onSubmit, theme, categories, newReport, onFormChange }: ModalProps) => {
  if (!isOpen) return null;
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-900";
  const inputBg = theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className={`${bg} rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`text-lg font-semibold ${text}`}>แจ้งรายงานใหม่</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>หัวข้อ</label>
            <input required name="title" value={newReport.title} onChange={onFormChange} className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${inputBg}`} placeholder="ระบุหัวข้อ..." />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>หมวดหมู่</label>
            <select name="category" value={newReport.category} onChange={onFormChange} className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${inputBg}`}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>รายละเอียด</label>
            <textarea required name="detail" value={newReport.detail} onChange={onFormChange} rows={3} className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${inputBg}`} placeholder="รายละเอียดเพิ่มเติม..." />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">ยกเลิก</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function Getpaperexecutive() {
  const { theme } = useTheme();
  const [reports, setReports] = useState<ReportItem[]>(initialReportsData);
  const [fade, setFade] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ReportStatus>("All");
  const [isAddingReport, setIsAddingReport] = useState(false);
  const [newReport, setNewReport] = useState({ title: "", category: "ปัญหา (Admin)", detail: "" });

  const categories = ["ปัญหา (Admin)", "เอกสาร", "อุปกรณ์"];
  const statuses: ReportStatus[] = ['Pending', 'Resolved', 'Submitted'];

  const filteredReports = reports
    .filter((item) => statusFilter === "All" ? true : item.status === statusFilter)
    .filter((item) => {
      if (search === "") return true;
      const s = search.toLowerCase();
      return item.title.toLowerCase().includes(s) || item.id.toLowerCase().includes(s) || item.detail.toLowerCase().includes(s);
    });

  const stats = [
    { title: "รายงานทั้งหมด", value: reports.length, icon: <ClipboardList size={24} />, colorClass: theme === 'dark' ? "text-blue-400" : "text-blue-600" },
    { title: "ปัญหารอแก้ไข", value: reports.filter(r => r.category === 'ปัญหา (Admin)' && r.status === 'Pending').length, icon: <TriangleAlert size={24} />, colorClass: theme === 'dark' ? "text-red-400" : "text-red-600" },
    { title: "เอกสารทั้งหมด", value: reports.filter(r => r.category === 'เอกสาร').length, icon: <FileText size={24} />, colorClass: theme === 'dark' ? "text-purple-400" : "text-purple-600" },
    { title: "อุปกรณ์", value: reports.filter(r => r.category === 'อุปกรณ์').length, icon: <Warehouse size={24} />, colorClass: theme === 'dark' ? "text-yellow-500" : "text-yellow-600" },
  ];

  useEffect(() => { setTimeout(() => setFade(true), 50); }, []);

  const getCategoryColor = (c: string): ColorName => c === "ปัญหา (Admin)" ? "red" : c === "เอกสาร" ? "blue" : c === "อุปกรณ์" ? "yellow" : "gray";
  const getStatusColor = (s: ReportStatus): ColorName => s === "Pending" ? "red" : s === "Resolved" ? "green" : "blue";
  
  const handleSubmitAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newReport.title) return;
    const newItem: ReportItem = {
      id: `R${Math.floor(Math.random() * 9000) + 1000}`,
      title: newReport.title,
      category: newReport.category as any,
      detail: newReport.detail,
      date: new Date().toLocaleDateString("th-TH"),
      status: newReport.category === 'ปัญหา (Admin)' ? 'Pending' : 'Submitted',
    };
    setReports([newItem, ...reports]);
    setIsAddingReport(false);
    setNewReport({ title: "", category: "ปัญหา (Admin)", detail: "" });
  };

  const pageBg = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const titleText = theme === "dark" ? "text-white" : "text-gray-900";

  return (
    // ⭐️ เพิ่ม Style tag สำหรับโหลด Font "Kanit" โดยเฉพาะ
    // และกำหนด inline style fontFamily ให้กับ Container หลัก
    <div 
      className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"} ${pageBg} h-[100dvh] flex flex-col overflow-hidden`}
      style={{ fontFamily: "'Kanit', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500;600&display=swap');
      `}</style>
      
      {/* Content Wrapper */}
      <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 flex-shrink-0">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${titleText}`}>Board บริหารงาน</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 font-light">ติดตามสถานะรายงานและงานต่าง ๆ (Kanban View)</p>
          </div>
          <button
            onClick={() => setIsAddingReport(true)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            <Plus size={18} />
            <span>แจ้งรายงานใหม่</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 flex-shrink-0">
          {stats.map((stat) => <StatCard key={stat.title} {...stat} theme={theme} />)}
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4 flex-shrink-0 z-20">
          <div className="relative w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={`appearance-none w-full md:w-48 pl-3 pr-10 py-2.5 text-sm rounded-lg border cursor-pointer transition-colors ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="All">ทุกสถานะ</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              placeholder="ค้นหา: หัวข้อ, รหัส..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border transition-colors ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Kanban Board Area */}
        <div className="flex-grow relative min-h-0 -mx-4 md:mx-0 bg-transparent">
           <div className="absolute inset-0 flex overflow-x-auto overflow-y-hidden px-4 md:px-0 gap-4 pb-2 snap-x snap-mandatory scroll-smooth">
              {categories.map(category => (
                  <KanbanColumn
                      key={category}
                      title={category}
                      reports={filteredReports.filter(r => r.category === category)}
                      theme={theme}
                      getStatusColor={getStatusColor}
                      getCategoryColor={getCategoryColor}
                  />
              ))}
              <div className="w-1 md:hidden flex-shrink-0 snap-center" />
           </div>
        </div>
      </div>

      {/* Modal */}
      <AddReportModal
        isOpen={isAddingReport}
        onClose={() => setIsAddingReport(false)}
        onSubmit={handleSubmitAdd}
        theme={theme}
        categories={categories}
        newReport={newReport}
        onFormChange={(e) => setNewReport(prev => ({ ...prev, [e.target.name]: e.target.value }))}
      />
    </div>
  );
}
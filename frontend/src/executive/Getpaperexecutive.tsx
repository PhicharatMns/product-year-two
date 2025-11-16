import { useTheme } from "@/components/theme-provider"; // (สมมติว่าคุณมีไฟล์นี้อยู่)
import { useEffect, useState, useRef, ChangeEvent, FormEvent } from "react";
import type { ReactNode } from "react";

// 1. นำเข้า Icons (เพิ่ม ChevronDown สำหรับ Dropdown)
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

// --- Types (เหมือนเดิม) ---
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

// --- Mock Data (เหมือนเดิม) ---
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

// 1. Badge (เหมือนเดิม)
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
  }[color];
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}>
      {children}
    </span>
  );
};

// 2. StatCard (เหมือนเดิม)
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

// 3. AddReportModal (เหมือนเดิม - ไม่ได้คัดลอกมาเพื่อประหยัดพื้นที่)
// (สมมติว่า AddReportModal และ AddReportForm อยู่ที่นี่)
// ... (วางโค้ด AddReportModal และ AddReportForm จากตัวอย่างก่อนหน้า)

// ⭐️ 4. (ใหม่) Kanban Card Component
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
    <div className={`p-3 rounded-lg border ${border} ${cardBg} shadow-sm cursor-pointer hover:shadow-md transition-shadow`}>
      {/* Card Header: Title & Status */}
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-semibold ${titleText}`}>{report.title}</span>
        <Badge color={getStatusColor(report.status)}>{report.status}</Badge>
      </div>

      {/* Card Body: Detail */}
      <p className={`text-sm ${detailText} mb-3`}>
        {report.detail}
      </p>

      {/* Card Footer: Date & ID */}
      <div className={`flex justify-between items-center text-xs ${metaText}`}>
        <span>{report.date}</span>
        <span>ID: {report.id}</span>
      </div>
    </div>
  );
};

// ⭐️ 5. (ใหม่) Kanban Column Component
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
    // ⭐️ กำหนดความกว้างของคอลัมน์
    <div className="w-80 md:w-96 flex-shrink-0">
      {/* Column Header */}
      <div className={`flex items-center justify-between p-3 rounded-t-lg ${columnBg} border-t-4 ${colorMap[colorName]}`}>
        <h3 className={`font-semibold ${titleText}`}>{title}</h3>
        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} ${countText}`}>
          {reports.length}
        </span>
      </div>

      {/* Column Body (Card List) */}
      <div className={`p-3 flex flex-col gap-3 rounded-b-lg ${columnBg} h-full max-h-[65vh] overflow-y-auto`}>
        {reports.map(report => (
          <KanbanCard 
            key={report.id}
            report={report}
            theme={theme}
            getStatusColor={getStatusColor}
          />
        ))}
        {reports.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            <p>ไม่มีรายงาน</p>
          </div>
        )}
      </div>
    </div>
  );
}


// --- Main Component (Getpaperexecutive) ---

export default function Getpaperexecutive() {
  // --- Hooks & Context ---
  const { theme } = useTheme();

  // --- State ---
  const [reports, setReports] = useState<ReportItem[]>(initialReportsData);
  const [fade, setFade] = useState(false);
  const [search, setSearch] = useState("");
  // ⭐️ (ใหม่) State สำหรับ Status Filter
  const [statusFilter, setStatusFilter] = useState<"All" | ReportStatus>("All");

  const [isAddingReport, setIsAddingReport] = useState(false);
  const [newReport, setNewReport] = useState({
    title: "", category: "ปัญหา (Admin)", detail: ""
  });

  // --- Theme Styles ---
  const pageBg = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const text = theme === "dark" ? "text-white" : "text-gray-300";
  const titleText = theme === "dark" ? "text-white" : "text-gray-900";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";

  // --- Effects ---
  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // --- Derived Data & Logic ---
  
  // ⭐️ (ใหม่) Categories และ Statuses สำหรับ Filter
  const categories = [...new Set(reports.map((item) => item.category))];
  const statuses: ReportStatus[] = ['Pending', 'Resolved', 'Submitted'];

  // ⭐️ (ใหม่) Logic การ Filter (รวม Search และ Status)
  const filteredReports = reports
    .filter((item) => {
      // Filter Status
      return statusFilter === "All" ? true : item.status === statusFilter;
    })
    .filter((item) => {
      // Filter Search
      if (search === "") return true;
      const searchTerm = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.id.toLowerCase().includes(searchTerm) ||
        item.detail.toLowerCase().includes(searchTerm)
      );
    });

  // คำนวณข้อมูลสำหรับ Stat Cards (เหมือนเดิม)
  const totalReports = reports.length;
  const pendingProblems = reports.filter(r => r.category === 'ปัญหา (Admin)' && r.status === 'Pending').length;
  const totalDocuments = reports.filter(r => r.category === 'เอกสาร').length;
  const totalItems = reports.filter(r => r.category === 'อุปกรณ์').length;
  
  const stats = [
    { title: "รายงานทั้งหมด", value: totalReports, icon: <ClipboardList size={24} />, colorClass: theme === 'dark' ? "text-blue-400" : "text-blue-600" },
    { title: "ปัญหารอแก้ไข", value: pendingProblems, icon: <TriangleAlert size={24} />, colorClass: theme === 'dark' ? "text-red-400" : "text-red-600" },
    { title: "เอกสารทั้งหมด", value: totalDocuments, icon: <FileText size={24} />, colorClass: theme === 'dark' ? "text-purple-400" : "text-purple-600" },
    { title: "อุปกรณ์", value: totalItems, icon: <Warehouse size={24} />, colorClass: theme === 'dark' ? "text-yellow-500" : "text-yellow-600" },
  ];

  // --- Handlers ---

  // 1. Helper สี (เหมือนเดิม)
  const getCategoryColor = (category: string): ColorName => {
    switch (category) {
      case "ปัญหา (Admin)": return "red";
      case "เอกสาร": return "blue";
      case "อุปกรณ์": return "yellow";
      default: return "gray";
    }
  };

  // ⭐️ 2. (ใหม่) Helper สีสำหรับ Status
  const getStatusColor = (status: ReportStatus): ColorName => {
    switch (status) {
      case "Pending": return "red";
      case "Resolved": return "green";
      case "Submitted": return "blue";
      default: return "gray";
    }
  };

  // 3. Handlers "เพิ่มรายงาน" (เหมือนเดิม)
  const handleShowAddForm = () => { setIsAddingReport(true); setNewReport({ title: "", category: categories[0] || "ปัญหา (Admin)", detail: "" }); };
  const handleCancelAdd = () => { setIsAddingReport(false); };
  const handleFormInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setNewReport(prev => ({ ...prev, [name]: value })); };
  const handleSubmitAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newReport.title || !newReport.detail) { alert("กรุณากรอกหัวข้อและรายละเอียด"); return; }
    const reportToAdd: ReportItem = {
      id: `R${Math.floor(Math.random() * 9000) + 1000}`,
      title: newReport.title,
      category: newReport.category as 'ปัญหา (Admin)' | 'เอกสาร' | 'อุปกรณ์',
      detail: newReport.detail,
      date: new Date().toLocaleDateString("th-TH"),
      status: newReport.category === 'ปัญหา (Admin)' ? 'Pending' : 'Submitted',
    };
    setReports(prevItems => [reportToAdd, ...prevItems]);
    handleCancelAdd();
  };


  // --- ⭐️ JSX Return (ดีไซน์ใหม่สไตล์ Kanban) ---
  return (
    // ⭐️ ใช้ `flex flex-col h-screen` เพื่อบังคับให้ Board อยู่ในพื้นที่จำกัด
    <div className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"} ${pageBg} ${text} min-h-screen h-screen flex flex-col`}>
      
      {/* ⭐️ ใช้ `overflow-hidden` กับ container หลัก */}
      <div className={`max-w-full h-full transition-opacity duration-300 p-4 md:p-6 lg:p-8 mx-auto container flex flex-col`}>
        
        {/* 1. Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 flex-shrink-0">
          <div>
            <h1 className={`text-3xl font-bold ${titleText}`}>
              Board รายงาน
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              ติดตามสถานะรายงานผ่าน Kanban Board
            </p>
          </div>
          <div>
            <button
              onClick={handleShowAddForm}
              className={`flex items-center gap-2 w-full md:w-auto justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark' 
                  ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } shadow-sm`}
            >
              <Plus size={18} />
              แจ้งรายงานใหม่
            </button>
          </div>
        </div>

        {/* 2. Stat Cards (KPIs) */}
        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-4 flex-shrink-0">
          {stats.map((stat) => (
            <StatCard 
              key={stat.title}
              {...stat}
              theme={theme}
            />
          ))}
        </div>

        {/* ⭐️ 3. Filter Row (ดีไซน์ใหม่) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 flex-shrink-0">
          {/* Status Filter Dropdown */}
          <div className="relative w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | ReportStatus)}
              className={`pl-3 pr-8 py-2 text-sm rounded-lg transition-all duration-300 w-full md:w-48 appearance-none
                ${theme === "dark" ? "bg-gray-800 text-white focus:outline-none ring-2 ring-transparent focus:ring-yellow-500 border border-gray-700" : "bg-white text-gray-900 focus:outline-none ring-2 ring-transparent focus:ring-blue-500 border border-gray-300"}`}
            >
              <option value="All">ทุกสถานะ</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            />
            <input
              placeholder="ค้นหารายงาน"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`pl-10 pr-3 py-2 text-sm rounded-lg transition-all duration-300 w-full
                ${theme === "dark" ? "bg-gray-800 text-white focus:outline-none ring-2 ring-transparent focus:ring-yellow-500 border border-gray-700" : "bg-white text-gray-900 focus:outline-none ring-2 ring-transparent focus:ring-blue-500 border border-gray-300"}`}
            />
          </div>
        </div>


        {/* ⭐️ 4. Kanban Board Area (นี่คือส่วนที่ขอ) */}
  <div className={`flex-grow   overflow-x-auto overflow-y-hidden -mx-4`}>
    {/* ⭐️ เพิ่ม min-w-full ที่นี่ */}
    <div className="flex flex- h-full gap-4 px-4 pb-4 min-w-full">
        
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

    </div>
</div>

      </div>
      
      {/* --- Modals --- (เหมือนเดิม) */}
      {/* <AddReportModal
        isOpen={isAddingReport}
        onCancel={handleCancelAdd}
        theme={theme}
        categories={categories}
        onSubmit={handleSubmitAdd}
        newReport={newReport}
        onFormChange={handleFormInputChange}
      />
      */}
    </div>
  );
}
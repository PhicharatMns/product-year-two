import { useTheme } from "@/components/theme-provider";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";

// นำเข้าไอคอน (ต้องติดตั้ง lucide-react)
// *** แก้ไข: เพิ่ม MoreHorizontal กลับเข้ามา ***
import { Search, MoreHorizontal } from "lucide-react";

// --- Types (กลับไปใช้แบบดั้งเดิม) ---

// *** 1. Type สำหรับ "รายการเบิกของ" ***
export type NotificationItem = {
  time: string;
  job: string;
  name: string;
  Lname: string;
  Description: string;
  title: string;
};

// *** 2. Type สำหรับ Context ***
type OutletContextType = {
  openMessAdmin: (item: NotificationItem) => void;
};

// *** 3. Type สำหรับ "ข้อความจากช่าง" ***
type TechnicianMessageItem = {
  date: string;
  name: string;
  report: string; // เรื่อง (Subject)
  detail: string; // เนื้อหา (Body)
};

// --- Mock Data (กลับไปใช้แบบดั้งเดิม) ---

// *** 1. ข้อมูล "รายการเบิกของ" ***
const object: NotificationItem[] = [
  {
    time: "01/10/68",
    job: "ซ่อมไฟฟ้า",
    name: "สมชาย",
    Lname: "ใจเย็น",
    Description: "ซื้อไฟฟ้าใหม่ 10 จุด",
    title: "ใช้สายเคเบิลใหม่",
  },
  {
    time: "03/10/68",
    job: "ซ่อมระบบ",
    name: "อนันต์",
    Lname: "ทองดี",
    Description: "ซ่อมระบบไฟฟ้า",
    title: "เดินสายไฟเพิ่ม",
  },
  {
    time: "05/10/68",
    job: "ติดตั้งระบบ",
    name: "สมศรี",
    Lname: "ใจดี",
    Description: "ติดตั้งระบบ เซิร์ฟเวอร์",
    title: "ตู้เซิฟเวอร์ใหม่",
  },
  {
    time: "07/10/68",
    job: "ตรวจสอบ",
    name: "สายฝน",
    Lname: "สุขใจ",
    Description: "ตรวจสอบระบบไฟฟ้า",
    title: "ตรวจสอบไฟฟ้า",
  },
  {
    time: "09/10/68",
    job: "ซ่อมเครื่องใช้",
    name: "มานพ",
    Lname: "ใจตรง",
    Description: "ซ่อมเครื่องปริ้น",
    title: "ซ่อมเครื่องปริ้นใหม่",
  },
];

// *** 2. ข้อมูล "ข้อความจากช่าง" ***
const technicianMessages: TechnicianMessageItem[] = [
  {
    date: "01/10/68",
    name: "สมชาย ใจเย็น",
    report: "ตรวจเช็คแอร์ห้องประชุมใหญ่",
    detail: "พบว่าคอมเพรสเซอร์เสีย...",
  },
  {
    date: "03/10/68",
    name: "อนันต์ ทองดี",
    report: "ติดตั้งระบบไฟเพิ่มเติม",
    detail: "เดินสายไฟใหม่ 10 จุด",
  },
  {
    date: "05/10/68",
    name: "สมศรี ใจดี",
    report: "ซ่อมท่อน้ำห้องน้ำหญิง",
    detail: "ท่อรั่วบริเวณข้อต่อ",
  },
];

// --- Helper Components (เหมือนเดิม) ---

const getInitials = (name: string, lname: string = "") => {
  const first = name.charAt(0) || "";
  const last = lname.charAt(0) || "";
  return (first + last).toUpperCase();
};

type AvatarProps = {
  name: string;
  Lname: string;
};
const Avatar = ({ name, Lname }: AvatarProps) => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-blue-900" : "bg-blue-100";
  const text = theme === "dark" ? "text-blue-300" : "text-blue-700";

  return (
    <div
      className={`flex-shrink-0 h-10 w-10 rounded-full ${bg} ${text} flex items-center justify-center font-semibold`}
    >
            {getInitials(name, Lname)}   {" "}
    </div>
  );
};

type BadgeProps = {
  children: ReactNode;
  color?: "green" | "blue" | "purple" | "gray";
};
const Badge = ({ children, color = "gray" }: BadgeProps) => {
  const { theme } = useTheme();

  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    purple:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  }[color];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}
    >
            {children}   {" "}
    </span>
  );
};

// --- Main Component ---

export default function Notification() {
  // --- Hooks & Context ---
  const { theme } = useTheme();
  const { openMessAdmin } = useOutletContext() as OutletContextType; // *** ใช้งาน Context *** // --- State ---

  const [fade, setFade] = useState(false);
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [Focused, setFocused] = useState(false);
  const [tabFade, setTabFade] = useState(true);
  const tabAnimationTimeout = useRef<number | null>(null); // --- Theme Styles ---
  
  const bg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const text = theme === "dark" ? "text-white" : "text-gray-800";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"; 

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => {
      clearTimeout(timer);
      if (tabAnimationTimeout.current) {
        clearTimeout(tabAnimationTimeout.current);
      }
    };
  }, []); // --- Derived Data & Logic (สำหรับ "รายการเบิกของ") ---

  const jobTypes = [...new Set(object.map((item) => item.job))];
  const tabs = ["ทั้งหมด", ...jobTypes];

  const filteredItems = object // *** กรองจาก "object" (รายการเบิกของ) ***
    .filter((item) => {
      if (activeTab === "ทั้งหมด") return true;
      return item.job === activeTab;
    })
    .filter((item) => {
      if (search === "") return true;
      const searchTerm = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.Lname.toLowerCase().includes(searchTerm) ||
        item.job.toLowerCase().includes(searchTerm) ||
        item.Description.toLowerCase().includes(searchTerm) ||
        item.title.toLowerCase().includes(searchTerm)
      );
    });
  const getJobColor = (job: string) => {
    const colors: ("green" | "blue" | "purple" | "gray")[] = [
      "blue",
      "green",
      "purple",
    ];
    const hash = job
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  const handleTabClick = (tabName: string) => {
    if (tabName === activeTab || !fade) return;
    if (tabAnimationTimeout.current) clearTimeout(tabAnimationTimeout.current);
    setTabFade(false);
    tabAnimationTimeout.current = setTimeout(() => {
      setActiveTab(tabName);
      setTabFade(true);
    }, 300);
  }; // --- Handler (สำหรับ "ข้อความจากช่าง") ---

  const handleMessageClick = (msg: TechnicianMessageItem) => {
    // แปลง TechnicianMessageItem -> NotificationItem
    const [firstName, lastName] = msg.name.split(" ");
    const itemToOpen: NotificationItem = {
      time: msg.date,
      job: "ข้อความ", // ใส่ Job เริ่มต้น
      name: firstName || "N/A",
      Lname: lastName || "",
      Description: msg.detail,
      title: msg.report,
    };
    openMessAdmin(itemToOpen);
  }; // --- JSX Return ---

  return (
    <div
      className={`transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
           {" "}
      <div className={`p-5 mx-auto container max-w-full ${text}`}>
               {" "}
        <div className="mb-5">
                    {/* --- Header --- */}         {" "}
          <p
            className={`text-3xl font-extrabold ${
              theme === "dark" ? "text-yellow-500" : "text-blue-500"
            }`}
          >
                        การแจ้งเตือน            {" "}
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-yellow-500"
              }`}
            >
                            & ข้อความ            {" "}
            </span>
                     {" "}
          </p>
                           {" "}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 my-5">
                        {/* --- [ฝั่ง 1] รายการเบิกของ (lg:col-span-3) --- */} 
                     {" "}
            <div
              className={`border ${border} col-span-1 lg:col-span-3 rounded-lg ${bg}`}
            >
                                          {/* Card Header & Search */}         
                 {" "}
              <div
                className={`flex flex-col sm:flex-row justify-between items-center p-4 border-b ${border}`}
              >
                               {" "}
                <p className="text-lg font-semibold mb-2 sm:mb-0">
                                    รายการเบิกของ                  {" "}
                  <span
                    className={`text-sm font-normal ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } ml-2`}
                  >
                                        ({filteredItems.length} รายการ)        
                             {" "}
                  </span>
                                 {" "}
                </p>
                               {" "}
                <div className="flex items-center gap-2">
                                   {" "}
                  <div className="relative">
                                       {" "}
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                                       {" "}
                    <input
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="ค้นหา..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 
                      ${
                        theme === "dark"
                          ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                          : "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-300" // *** แก้ไข: ลบ 'e' ที่เป็นตัวอักษรแปลกๆ ออก ***
                      }
                      ${Focused ? "w-72" : "w-60"}`}
                    />
                                     {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </div>
                            {/* Tabs */}             {" "}
              <div
                className={`flex h-15 items-center border-b ${border} overflow-x-auto`}
              >
                               {" "}
                {tabs.map((tabName) => {
                  const isActive = activeTab === tabName;
                  const activeClasses =
                    theme === "dark"
                      ? "border-yellow-500 text-yellow-500"
                      : "border-blue-600 text-blue-600";
                  const inactiveClasses =
                    theme === "dark"
                      ? "border-transparent text-gray-400 hover:text-gray-200"
                      : "border-transparent text-gray-500 hover:text-gray-800";

                  return (
                    <button
                      // *** แก้ไข: เพิ่ม type="button" ***
                      type="button" 
                      key={tabName}
                      onClick={() => handleTabClick(tabName)}
                      className={`py-3 px-4 -mb-px text-sm font-medium border-b-2 whitespace-nowrap ${
                        isActive ? activeClasses : inactiveClasses
                      }`}
                    >
                      {tabName}
                    </button>
                  );
                })}
              </div>

              {/* Table Content "รายการเบิกของ" */}
              <div 
                className={`block w-full overflow-x-auto transition-opacity duration-300 ${
                  tabFade ? "opacity-100" : "opacity-0"
                }`}
              >
                <table className="w-full text-left">
                  <thead
                    className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
                  >
                    <tr>
                      <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>
                        ผู้ขอเบิก
                      </th>
                      <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>
                        ประเภทงาน
                      {/* *** แก้ไข: ลบ 'A' ที่เป็นตัวอักษรแปลกๆ ออก *** */}
                      </th>
                      <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>
                        รายละเอียด
                      </th>
                      <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>
                        วันที่
                      </th>
                      <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}></th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${border}`}>
                    {filteredItems.map((event, index) => (
                      <tr
                        key={index}
                        className={`transition-colors ${hoverBg} cursor-pointer`}
                        onClick={() => openMessAdmin(event)} // *** คลิกเพื่อเปิด Modal ***
                      >
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar name={event.name} Lname={event.Lname} />
                            <div>
                              <p className="font-medium">
                                {event.name} {event.Lname}
                              </p>
                              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                {event.Description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <Badge color={getJobColor(event.job)}>{event.job}</Badge>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {/* *** แก้ไข: ลบ 's' และ 'M' ที่เป็นตัวอักษรแปลกๆ ออก *** */}
                          <p className="font-medium truncate max-w-xs">
                            {event.title}
                          </p>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            {event.time}
                        </p>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {/* *** แก้ไข: ลบ 's' ที่เป็นตัวอักษรแปลกๆ ออก *** */}
                          <button 
                            // *** แก้ไข: เพิ่ม type="button" ***
                            type="button"
                            onClick={(e) => { e.stopPropagation(); console.log("More clicked"); }}
                            className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                          >
                            <MoreHorizontal size={20} />
                          </button>
                      </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* *** แก้ไข: ลบ 's' ที่เป็นตัวอักษรแปลกๆ ออก *** */}
                </table>

                {/* No Data Message */}
                {filteredItems.length === 0 && (
                  <div className="p-10 text-center text-gray-500">
                    <p>
                      {/* *** แก้ไข: ลบ 's' ที่เป็นตัวอักษรแปลกๆ ออก *** */}
                      {search 
                        ? `ไม่พบผลลัพธ์สำหรับ "${search}"` 
                        : `ไม่มีข้อมูลในหมวดหมู่ "${activeTab}"`}
                    </p>
                  </div>
                )}
              </div>
              {/* *** แก้ไข: ลบ 's' ที่เป็นตัวอักษรแปลกๆ ออก *** */}
            </div>

            {/* --- [ฝั่ง 2] รายงาน/ข้อความจากช่าง (lg:col-span-2) --- */}
            <div className={`border ${border} col-span-1 lg:col-span-2 rounded-lg ${bg}`}>
              {/* Card Header */}
              <div className={`flex flex-col sm:flex-row justify-between items-center p-4 border-b ${border}`}>
                <p className="text-lg font-semibold mb-2 sm:mb-0">
                  รายงานจากช่าง
                  <span className={`text-sm font-normal ${theme === "dark" ? "text-gray-400" : "text-gray-600"} ml-2`}>
                    {/* *** แก้ไข: ลบ 'section' ที่เป็นตัวอักษรแปลกๆ ออก *** */}
                    ({technicianMessages.length} ข้อความ) 
                  </span>
                </p>
                {/*
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <Plus size={16} /> เขียนข้อความ
                </button>
                */}
                             {" "}
              </div>
                            {/* Table Container "ข้อความจากช่าง" */}           
               {" "}
              <div className="block w-full overflow-x-auto">
                               {" "}
                <table className="w-full text-left">
                                   {" "}
                  <thead
                    className={`${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                                       {" "}
                    <tr>
                                           {" "}
                      <th
                        className={`p-4 text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } uppercase`}
                      >
                        ช่างเทคนิค
                      </th>
                                           {" "}
                      <th
                        className={`p-4 text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } uppercase`}
                      >
                        เรื่อง / ข้อความ
                      </th>
                                           {" "}
                      <th
                        className={`p-4 text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } uppercase`}
                      >
                        วันที่
                      </th>
                                         {" "}
                    </tr>
                                     {" "}
                  </thead>
                                   {" "}
                  <tbody className={`divide-y ${border}`}>
                                       {" "}
                    {technicianMessages.map((msg, index) => (
                      <tr
                        key={index}
                        className={`transition-colors ${hoverBg} cursor-pointer`}
                        onClick={() => handleMessageClick(msg)} // *** คลิกเพื่อเปิด Modal ***
                      >
                                               {" "}
                        <td className="p-4 whitespace-nowrap">
                                                   {" "}
                          <div className="flex items-center gap-3">
                                                       {" "}
                            <Avatar
                              name={msg.name.split(" ")[0]}
                              Lname={msg.name.split(" ")[1] || ""}
                            />
                                                       {" "}
                            <div>
                                                           {" "}
                              <p className="font-medium">{msg.name}</p>         
                                               {" "}
                            </div>
                                                     {" "}
                          </div>
                                                 {" "}
                        </td>
                                               {" "}
                        <td className="p-4">
                                                   {" "}
                          <p className="font-medium truncate max-w-xs">
                            {msg.report}
                          </p>
                                                   {" "}
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            } truncate max-w-xs`}
                          >
                            {msg.detail}
                          </p>
                                                 {" "}
                        </td>
                                               {" "}
                        <td className="p-4 whitespace-nowrap">
                                                   {" "}
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {msg.date}
                          </p>
                                                 {" "}
                        </td>
                                             {" "}
                      </tr>
                    ))}
                                     {" "}
                  </tbody>
                                   {" "}
                  {/* *** แก้ไข: ลบ 's' ที่เป็นตัวอักษรแปลกๆ ออก *** */}       
                       {" "}
                </table>
                             {" "}
              </div>
                         {" "}
            </div>
                                 {" "}
          </div>{" "}
          {/* --- สิ้นสุด Grid Layout Wrapper --- */}       {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}

import { useTheme } from "@/components/theme-provider";
import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";

import { Search, Users, Briefcase, HardHat } from "lucide-react";

// --- Types (เหมือนเดิม) ---
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Online" | "Offline" | "On-Site";
  imageUrl: string;
  dateAdded: string;
  lastActive: string;
};
type ColorName =
  | "green"
  | "blue"
  | "purple"
  | "gray"
  | "yellow"
  | "red"
  | "indigo"
  | "pink";
type DepartmentSummary = {
  department: string;
  totalMembers: number;
};

// --- Mock Data (เหมือนเดิม) ---
const initialTeamMembers: TeamMember[] = [
  {
    id: "T001",
    name: "Olivia Rhye",
    email: "olivia@untitledui.com",
    role: "Manager",
    department: "หัวหน้าช่าง",
    status: "Online",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "Feb 22, 2022",
    lastActive: "Mar 14, 2022",
  },
  {
    id: "T002",
    name: "Phoenix Baker",
    email: "phoenix@untitledui.com",
    role: "Admin",
    department: "หัวหน้าช่าง",
    status: "Online",
    imageUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2861&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "Feb 22, 2022",
    lastActive: "Mar 12, 2022",
  },
  {
    id: "T003",
    name: "Lana Steiner",
    email: "lana@untitledui.com",
    role: "Technician",
    department: "ช่าง",
    status: "On-Site",
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2876&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "Feb 22, 2022",
    lastActive: "Mar 14, 2022",
  },
  {
    id: "T004",
    name: "Demi Wilkinson",
    email: "demi@untitledui.com",
    role: "Technician",
    department: "ช่าง",
    status: "Online",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=2861&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "Feb 22, 2022",
    lastActive: "Mar 14, 2022",
  },
  {
    id: "T005",
    name: "Candice Wu",
    email: "candice@untitledui.com",
    role: "Trainee",
    department: "ช่าง",
    status: "Offline",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2874&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "Feb 22, 2022",
    lastActive: "Mar 13, 2022",
  },
  {
    id: "T006",
    name: "Drew Cano",
    email: "drew@untitledui.com",
    role: "Accountant",
    department: "หัวหน้าช่าง",
    status: "Online",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "Feb 22, 2022",
    lastActive: "Mar 12, 2022",
  },
  {
    id: "T007",
    name: "Orlando Diggs",
    email: "orlando@untitledui.com",
    role: "Junior Technician",
    department: "ช่าง",
    status: "On-Site",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-e6955a6d0ad2?q=80&w=2787&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "Feb 22, 2022",
    lastActive: "Mar 12, 2022",
  },
  {
    id: "T008",
    name: "Natali Craig",
    email: "natali@untitledui.com",
    role: "Senior Technician",
    department: "ช่าง",
    status: "Offline",
    imageUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469e046c?q=80&w=2787&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "Feb 22, 2022",
    lastActive: "Mar 14, 2022",
  },
  {
    id: "T009",
    name: "kdkvd",
    email: "natali@untitledui.com",
    role: "แอดมิน",
    department: "แอดมิน",
    status: "Offline",
    imageUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469e046c?q=80&w=2787&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "Feb 22, 2022",
    lastActive: "Mar 14, 2022",
  },
];

// --- Helper Components (Badge, colorMap, TeamProportionBar, StatCard - เหมือนเดิม) ---
// (ใช้โค้ด 4 components นี้จากคำตอบก่อนหน้าได้เลย ไม่มีการเปลี่ยนแปลง)

// 1. Badge
type BadgeProps = { children: ReactNode; color?: ColorName };
const Badge = ({ children, color = "gray" }: BadgeProps) => {
  const { theme } = useTheme();
  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    purple:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    yellow:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    indigo:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  }[color];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}
    >
      {children}
    </span>
  );
};

// 2. colorMap
const colorMap: Record<ColorName, { light: string; dark: string }> = {
  blue: { light: "bg-blue-600", dark: "bg-blue-500" },
  green: { light: "bg-green-600", dark: "bg-green-500" },
  purple: { light: "bg-purple-600", dark: "bg-purple-500" },
  yellow: { light: "bg-yellow-500", dark: "bg-yellow-400" },
  red: { light: "bg-red-600", dark: "bg-red-500" },
  indigo: { light: "bg-indigo-600", dark: "bg-indigo-500" },
  pink: { light: "bg-pink-600", dark: "bg-pink-500" },
  gray: { light: "bg-gray-600", dark: "bg-gray-500" },
};

// 3. TeamProportionBar
type TeamProportionBarProps = {
  summaryData: DepartmentSummary[];
  getDepartmentColor: (department: string) => ColorName;
  theme: string | undefined;
};
const TeamProportionBar = ({
  summaryData,
  getDepartmentColor,
  theme,
}: TeamProportionBarProps) => {
  const grandTotalMembers = summaryData.reduce(
    (sum, dep) => sum + dep.totalMembers,
    0
  );
  const departmentCount = summaryData.length;
  if (grandTotalMembers === 0 || departmentCount === 0) return null;

  return (
    <div>
      <h3 className="text-md font-semibold mb-2">ภาพรวมสัดส่วนทีม</h3>
      <div className=" items-center gap-4 mb-3">
        <span
          className={`text-sm flex-shrink-0 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {departmentCount} แผนก
        </span>
        <div className="flex w-full h-3 rounded-full overflow-hidden">
          {summaryData.map((summary, index) => {
            const percentage = (summary.totalMembers / grandTotalMembers) * 100;
            const colorName = getDepartmentColor(summary.department);
            const bgColor =
              theme === "dark"
                ? colorMap[colorName].dark
                : colorMap[colorName].light;
            return (
              <div
                key={index}
                className={`${bgColor} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
                title={`${summary.department}: ${
                  summary.totalMembers
                } คน (${percentage.toFixed(1)}%)`}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1 gap-x-4 gap-y-2 text-sm">
        {summaryData.map((summary, index) => {
          const colorName = getDepartmentColor(summary.department);
          const bgColor =
            theme === "dark"
              ? colorMap[colorName].dark
              : colorMap[colorName].light;
          const percentage = (summary.totalMembers / grandTotalMembers) * 100;
          return (
            <div key={index} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${bgColor}`}></span>
              <span className="font-medium">{summary.department}</span>
              <span
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. StatCard
type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorClass: string;
  theme: string | undefined;
};
const StatCard = ({ title, value, icon, colorClass, theme }: StatCardProps) => {
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <div
      className={`flex items-center w-full p-4 rounded-lg shadow-sm border ${bg} ${border}`}
    >
      <div
        className={`p-3 rounded-full ${colorClass} bg-opacity-10 ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        {icon}
      </div>
      <div className="ml-4">
        <p
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-2xl font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

// *** 5. (ปรับปรุง) Component TeamSection ***
type TeamSectionProps = {
  title: string;
  description: string;
  members: TeamMember[];
  theme: string | undefined;
};
const TeamSection = ({
  members,
  theme,
}: TeamSectionProps) => {
  if (members.length === 0) return null;

  const textMuted = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const headerBg = theme === "dark" ? "bg-white" : "bg-white";
  const rowHoverBg =
    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50";

  const gridColsClass = "grid-cols-[0.8fr_3fr_1.5fr_1.5fr]";

  return (
    <div className="mb-10">
      {/* 1. หัวข้อกลุ่ม (อยู่นิ่ง) */}
      {/* 2. Wrapper สำหรับเลื่อน (scroll) แนวนอน */}
      <div className="overflow-x-auto rounded-md">
        {/* 3. Inner Wrapper (บังคับความกว้างขั้นต่ำ) */}
        <div className="min-w-[640px]">
          {/* 4. Header ของลิสต์ (อยู่นิ่ง - ไม่ scroll แนวตั้ง) */}
          <div
            className={`grid ${gridColsClass} gap-4 py-3 px-4 border rounded-2xl   mb-2`}
          >
            <div className={`text-xs font-medium ${textMuted} uppercase`}>
              ID
            </div>
            <div className={`text-xs font-medium ${textMuted} uppercase`}>
              ชื่อ
            </div>
            <div className={`text-xs font-medium ${textMuted} uppercase`}>
              วันที่สมัคร
            </div>
            <div className={`text-xs font-medium ${textMuted} uppercase`}>
              สถานะ
            </div>
          </div>

          {/* *** START: การเปลี่ยนแปลง *** */}
          {/* 5. Wrapper สำหรับ "ข้อมูล" ที่จะ scroll แนวตั้ง */}
          <div className={`flex flex-col h-145 overflow-y-auto border p-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-2xl `}>
            {members.map((member) => (
              <div
                key={member.id}
                className={`grid ${gridColsClass} gap-4 py-3 px-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-md border-b   my-1  transition-colors`}
              >
                {/* Col 1: ID */}
                <div
                  className={`flex  items-center text-sm ${textMuted} font-mono`}
                >
                  {member.id}
                </div>

                {/* Col 2: Name */}
                <div className="flex items-center gap-3">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 text-sm font-semibold">
                      {member.name.charAt(0)}
                      {member.name.split(" ")[1]?.charAt(0) || ""}
                    </div>
                  )}

                  <div>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {member.name}
                    </p>
                    <p className={`text-sm ${textMuted}`}>{member.email}</p>
                  </div>
                </div>

                {/* Col 3: Date Added */}
                <div className={`flex items-center text-sm ${textMuted}`}>
                  {member.dateAdded}
                </div>

                {/* Col 4: Last Active */}
                <div className={`flex items-center text-sm ${textMuted}`}>
                  {member.lastActive}
                </div>
              </div>
            ))}
          </div>
          {/* *** END: การเปลี่ยนแปลง *** */}
        </div>
      </div>
    </div>
  );
};

// --- Main Component (Team) ---
// (Component หลัก `Team` ไม่มีการเปลี่ยนแปลงจากโค้ดก่อนหน้า
//  เพราะ Logic การ scroll ถูกจัดการใน `TeamSection` แล้ว)

export default function Team() {
  // --- Hooks, State, Effects ---
  const { theme } = useTheme();
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [fade, setFade] = useState(false);
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [Focused, setFocused] = useState(false);
  const [tabFade, setTabFade] = useState(true);
  const tabAnimationTimeout = useRef<number | null>(null);

  const pageBg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textMuted = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputBorder = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const inputBg = theme === "dark" ? "bg-gray-700" : "bg-white";
  const inputPlaceholder =
    theme === "dark" ? "placeholder-gray-400" : "placeholder-gray-500";
  const inputFocusRing =
    theme === "dark" ? "focus:ring-yellow-500" : "focus:ring-blue-500";

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => {
      clearTimeout(timer);
      if (tabAnimationTimeout.current) {
        clearTimeout(tabAnimationTimeout.current);
      }
    };
  }, []);

  // --- Logic ---
  const departments = [
    ...new Set(members.map((item) => item.department)),
  ].sort();
  const tabs = ["ทั้งหมด", ...departments];

  const departmentSummary: DepartmentSummary[] = departments.map(
    (department) => {
      const membersInDep = members.filter(
        (item) => item.department === department
      );
      return { department, totalMembers: membersInDep.length };
    }
  );

  const searchedMembers = members.filter((member) => {
    if (search === "") return true;
    const searchTerm = search.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm) ||
      member.role.toLowerCase().includes(searchTerm) ||
      member.department.toLowerCase().includes(searchTerm) ||
      member.id.toLowerCase().includes(searchTerm) // <- เพิ่มการค้นหา ID
    );
  });

  const totalMembers = members.length;
  const departmentCount = departments.length;
  const onSiteMembers = members.filter((m) => m.status === "On-Site").length;
  const stats = [
    {
      title: "สมาชิกทั้งหมด",
      value: totalMembers,
      icon: <Users size={24} />,
      colorClass: theme === "dark" ? "text-blue-400" : "text-blue-600",
    },
    {
      title: "จำนวนแผนก",
      value: departmentCount,
      icon: <Briefcase size={24} />,
      colorClass: theme === "dark" ? "text-purple-400" : "text-purple-600",
    },
    {
      title: "กำลังปฏิบัติงาน (On-Site)",
      value: onSiteMembers,
      icon: <HardHat size={24} />,
      colorClass: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
    },
  ];

  const departmentDescriptions: Record<string, string> = {
    บริหาร:
      "Admins can add and remove users and manage organization-level settings.",
    ช่างเทคนิค:
      "Technicians can assess risks, questionnaires, data leaks and identify breaches.",
  };

  // --- Handlers ---
  const getDepartmentColor = (department: string): ColorName => {
    switch (department) {
      case "ช่าง":
        return "blue";
      
      case "แอดมิน":
        return "red";
 case "หัวหน้าช่าง":
        return "purple";
      default:
        return "gray";
    }
  };
  const getStatusColor = (status: string): ColorName => {
    switch (status) {
      case "Online":
        return "green";
      case "On-Site":
        return "yellow";
      case "Offline":
        return "gray";
      default:
        return "gray";
    }
  };
  const handleTabClick = (tabName: string) => {
    if (tabName === activeTab || !fade) return;
    if (tabAnimationTimeout.current) clearTimeout(tabAnimationTimeout.current);
    setTabFade(false);
    tabAnimationTimeout.current = setTimeout(() => {
      setActiveTab(tabName);
      setTabFade(true);
    }, 300);
  };

  // --- JSX Return (เหมือนเดิม) ---
  return (
    <div
      className={`transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }  min-h-screen`}
    >
      <div
        className={`max-w-380 h-screen transition-opacity duration-300 p-5 mx-auto container`}
      >
        {/* Header Section */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-yellow-500' :'text-blue-500'}`}>ทีมงานของ<span className={`${theme === 'dark' ? 'text-white' : 'text-yellow-500'}`}>เรา</span></h1>
          <p className={`text-sm ${textMuted} mt-1`}>
            ภาพรวมและข้อมูลติดต่อสมาชิกในทีม
          </p>
        </div>

        {/* Stat Cards (KPIs) */}
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

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main List Area) */}
          <div className="lg:col-span-2">
            {/* Toolbar (Tabs + Search) */}
            <div
              className={`p-4 mb-6 ${cardBg} border ${border} rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-4`}
            >
              <div className={`flex items-center overflow-x-auto pb-2 md:pb-0`}>
                {tabs.map((tabName) => {
                  const isActive = activeTab === tabName;
                  const activeClasses =
                    theme === "dark"
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-blue-600 text-white";
                  const inactiveClasses =
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300";
                  return (
                    <button
                      type="button"
                      key={tabName}
                      onClick={() => handleTabClick(tabName)}
                      className={`py-1.5 px-4 text-sm font-medium rounded-full whitespace-nowrowrap transition-colors duration-200 ${
                        isActive ? activeClasses : inactiveClasses
                      } ml-2 first:ml-0`}
                    >
                      {tabName}
                    </button>
                  );
                })}
              </div>
              <div className="relative w-full md:w-64 border rounded-2xl">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${textMuted}`}
                />
                <input
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="ค้นหา (ID, ชื่อ, อีเมล)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                               className={`border rounded-xl pl-10 pr-3 duration-300 transition-all focus:outline-none focus:ring-2 py-1 
                w-full ${inputBg} ${inputBorder} ${inputPlaceholder} ${
                    Focused ? inputFocusRing : ""
                  }`}
                />
              </div>
             
            </div>

            {/* List Container for Team Sections */}
            <div
              className={`transition-opacity duration-300  ${
                tabFade ? "opacity-100" : "opacity-0"
              }`}
            >
              {searchedMembers.length > 0 ? (
                activeTab === "ทั้งหมด" ? (
                  <TeamSection
                    key="all-members"
                    title="All Members"
                    description={`Showing ${searchedMembers.length} members found across all departments`}
                    members={searchedMembers}
                    theme={theme}
                  />
                ) : (
                  (() => {
                    const membersInDep = searchedMembers.filter(
                      (m) => m.department === activeTab
                    );
                    if (membersInDep.length === 0) {
                      return (
                        <div
                          className={`p-10 text-center ${cardBg} border ${border} rounded-lg shadow-sm`}
                        >
                          <p className={`${textMuted}`}>
                            {search
                              ? `No results for "${search}" in "${activeTab}"`
                              : `No members in "${activeTab}"`}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <TeamSection
                        key={activeTab}
                        title={activeTab}
                        description={
                          departmentDescriptions[activeTab] ||
                          `Members in ${activeTab}`
                        }
                        members={membersInDep}
                        theme={theme}
                      />
                    );
                  })()
                )
              ) : (
                <div
                  className={`p-10 text-center ${cardBg} border ${border} rounded-lg shadow-sm`}
                >
                  <p className={`${textMuted}`}>
                    {search
                      ? `No results for "${search}"`
                      : `No members in this team`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div
              className={`${cardBg} border ${border} rounded-lg shadow-sm p-4`}
            >
              <TeamProportionBar
                summaryData={departmentSummary}
                getDepartmentColor={getDepartmentColor}
                theme={theme}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

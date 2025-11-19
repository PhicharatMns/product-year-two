import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { useTheme } from "@/components/theme-provider";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import ThemeSwitcher from "./ThemeSwitcher";
import { AiOutlineTeam } from "react-icons/ai";
import { RiFilePaper2Line } from "react-icons/ri";
import axios from "axios";
import { LuMessageSquareText } from "react-icons/lu";
interface SidebarItem {
  text: string;
  icon: React.ComponentType<{ size?: number }>;
  link?: string;
  onClick?: () => void;
}

export default function SidebarChief() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- State ให้ตรงกับ ProfileChief ---
  const [name, setName] = useState("Chief"); // Default
  const [profileSuffix, setProfileSuffix] = useState(""); // เก็บค่า Profile string จาก API

  // --- State สำหรับเมนูย่อย ---
  const [showManu, setShowManu] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [openManage, setManage] = useState(false);
  const [slideManage, setslideManage] = useState(false);

  // Functions
  const openManu = () => {
    setShowManu(true);
    setTimeout(() => setSlideIn(true), 10);
  };

  const closeManu = () => {
    setSlideIn(false);
    setTimeout(() => setShowManu(false), 500);
  };

  const openManageMenu = () => {
    setManage(true);
    setTimeout(() => setslideManage(true), 10);
  };

  const closeManageMenu = () => {
    setslideManage(false);
    setTimeout(() => setManage(false), 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/logins");
  };

  const items: SidebarItem[] = [
    {
      text: "Dashboard",
      icon: MdDashboard,
      link: "/chief/DashboardChief",
    },
    {
      text: "รายงาน",
      icon: RiFilePaper2Line,
      link: "/chief/GetPaper",
    },
    {
      text: "ปฎิทิน",
      icon: RiFilePaper2Line,
      link: "/chief/CalendarChief",
    },
    {
      text: "ข้อความ",
      icon: LuMessageSquareText,
      link: "/chief/messeger",
    },

    { text: "รายการเบิกของ", icon: AiOutlineTeam, link: "/chief/ItemChief" },

    // { text: "กล่องข้อความ", icon: FaInbox, onClick: () => openManu() },
    { text: "ออกจากระบบ", icon: IoIosLogOut, onClick: handleLogout },
  ];

  // --- ดึงข้อมูลเหมือนหน้า ProfileChief ---
  useEffect(() => {
    if (!token) {
      navigate("/logins");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/login/dashboardUser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Map ข้อมูลให้เหมือนกับหน้า ProfileChief
        setName(response.data.Name || "ไม่ระบุชื่อ");
        setProfileSuffix(response.data.Profile || ""); // เก็บ path รูปถ้ามี

      } catch (err) {
        console.error("Sidebar fetch error:", err);
      }
    };

    fetchData();
  }, [navigate, token]);

  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : "bg-blue-500";
  const linkTextColor = "text-white";

  // Theme สำหรับ Slide Panel
  const bgside = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textPanel = theme === "dark" ? "text-white" : "text-black";

  // URL รูปภาพหลัก (ใช้ Link เดียวกับหน้า Profile)
  const baseImage = "https://i.pinimg.com/1200x/3c/7f/94/3c7f94cd27f95fb70e0855429176dc34.jpg";

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-30 text-3xl  p-2 text-white rounded-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <IoClose /> : <GiHamburgerMenu />}
      </button>

      <div
        className={`${bg} fixed z-20 flex flex-col justify-between h-screen w-64 ${linkTextColor} font-bold border-r transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex flex-col">
          <div className="flex items-center py-3 p-4">
            <Link to="/chief/DashboardChief" className="mx-auto">
              <div className="uppercase text-2xl font-black text-white dark:text-white whitespace-nowrap mt-5 transition-all duration-300">
                Tech<span className="text-yellow-500">Job</span>
                <div className="text-xs text-white dark:text-gray-200 mt-1 transition-all duration-300">
                  Chief
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-4 flex flex-col">
            {items.map((item, index) => {
              const Icon = item.icon;
              if (item.link) {
                return (
                  <NavLink
                    to={item.link}
                    key={index}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer overflow-hidden rounded-md hover:bg-yellow-500 px-6 font-medium ${linkTextColor} transition duration-300 ${isActive ? "bg-yellow-500" : ""
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                      <div className="relative h-full w-8 bg-white/50"></div>
                    </div>
                    <Icon size={24} className="relative z-10" />
                    <span className="relative z-10">{item.text}</span>
                  </NavLink>
                );
              }
              return (
                <button
                  key={index}
                  onClick={() => {
                    setOpen(false);
                    item.onClick?.();
                  }}
                  className={`group relative flex items-center gap-2 my-2 pl-5 py-3 w-full text-left cursor-pointer overflow-hidden rounded-md hover:bg-yellow-500 px-6 font-medium ${linkTextColor} transition duration-300`}
                >
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                    <div className="relative h-full w-8 bg-white/50"></div>
                  </div>
                  <Icon size={24} className="relative z-10" />
                  <span className="relative z-10">{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Profile Section ตรงกับ ProfileChief --- */}
        <div>
          <ThemeSwitcher />
          <Link to="/chief/ProfileChief" className="mt-auto">
            <div className="border-t border-blue-700 dark:border-gray-700 bg-blue-900 dark:bg-gray-800 duration-300 hover:bg-blue-700 dark:hover:bg-gray-700 h-20 flex items-center gap-4 cursor-pointer px-2">
              {/* ใช้ Logic รูปภาพเดียวกับ ProfileChief */}
              <img
                src={`${baseImage}${profileSuffix}`}
                className="object-cover w-10 h-10 rounded-full duration-300 border border-gray-300"
                alt="profile"
              />
              <div className="text-lg font-semibold text-white dark:text-white">
                {/* แสดงชื่อที่ดึงมาจาก API */}
                คุณ <span className="text-yellow-400">{name}</span>
                <div className="text-sm text-yellow-400">หัวหน้าช่าง</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-40 md:hidden z-10"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Slide Menu กล่องข้อความ */}
      {showManu && (
        <div
          className={`
            fixed left-0 bottom-0 
            rounded-t-xl h-180 w-80 p-2 ${bgside}
            transition-all transform duration-500
            z-15 shadow-2xl border-t border-r border-gray-200 dark:border-gray-700
            ${slideIn ? "translate-x-67 scale-100 opacity-100" : "-translate-x-full opacity-0"}
          `}
        >
          <div className={`flex justify-between items-center mb-4 border-b-2 border-blue-100 pb-2 ${textPanel}`}>
            <h2 className="text-xl font-semibold text-blue-500">กล่องข้อความ</h2>
            <button onClick={closeManu} className={`text-2xl hover:text-red-500 pr-2 cursor-pointer ${textPanel}`}>✕</button>
          </div>
          <div className="h-100">
            <div onClick={openManageMenu} className="border-black p-2 shadow-md rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <img className="w-12 h-12 rounded-full object-cover" src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg" alt="พิชรัตน์" />
              <div><p className={`font-semibold ${textPanel}`}>พิชรัตน์</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Slide Menu รายละเอียด */}
      {openManage && (
        <div
          className={`fixed left-4 lg:left-150 bottom-0 rounded-t-xl h-150 w-80 p-2 ${bgside} z-20 transition-all transform duration-500 shadow-2xl border-t border-gray-200 dark:border-gray-700 ${slideManage ? "-translate-x-0 scale-100 opacity-100" : "-translate-x-20 scale-100 opacity-0"}`}
        >
          <div className="border-black p-2 rounded-xl flex items-center gap-3">
            <img className="w-12 h-12 rounded-full object-cover" src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg" alt="พิชรัตน์" />
            <div><p className={`font-semibold ${textPanel}`}>{name}</p></div> {/* ใช้ name ที่ดึงมา */}
            <div className="ml-auto">
              <button onClick={closeManageMenu} className={`hover:text-red-500 text-2xl p-1 cursor-pointer ${textPanel}`}>✕</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

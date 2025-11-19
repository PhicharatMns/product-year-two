import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { useTheme } from "@/components/theme-provider";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import ThemeSwitcher from "./ThemeSwitcher";
import { AiOutlineTeam } from "react-icons/ai";
import { FaMapMarkedAlt } from "react-icons/fa";
import { RiFilePaper2Line } from "react-icons/ri";
import { FaInbox } from "react-icons/fa6"; // เพิ่ม Icon Inbox
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

interface SidebarItem {
  text: string;
  icon: React.ComponentType<{ size?: number }>;
  link?: string;
  onClick?: () => void;
}

export default function Sidebarexecutive() {
  const [open, setOpen] = useState(false); // sidebar มือถือ
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [Message, setMessage] = useState("ผู้บริหาร");

  // State สำหรับกล่องข้อความ
  const [showManu, setShowManu] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [openManage, setManage] = useState(false);
  const [slideManage, setslideManage] = useState(false);

  // Functions สำหรับเปิด-ปิด กล่องข้อความ
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

  // ออกระบบ
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
      text: "ปฏิทิน",
      icon: FaCalendarAlt,
      link: "/chief/CalendarChief",
    },
    { text: "ทีมงาน", icon: AiOutlineTeam, link: "/chief/EditUser" },
    { text: "กล่องข้อความ", icon: FaInbox, onClick: () => openManu() }, // เพิ่มปุ่มกล่องข้อความ
    { text: "ออกจากระบบ", icon: IoIosLogOut, onClick: handleLogout },
  ];

  // ดึงข้อมูลมาเเสดงใน sidebar user
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

        console.log("Sidebar response:", response.data);
        if (response.data.Name) {
          setMessage(response.data.Name);
        } else if (response.data.username) {
          setMessage(response.data.username);
        }
      } catch (err) {
        console.error("Fetch sidebar message error:", err);
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

  return (
    <>
      {/* ปุ่มเปิดเมนูมือถือ */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 text-3xl bg-blue-500 p-2 text-white rounded-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <IoClose /> : <GiHamburgerMenu />}
      </button>

      {/* Sidebar หลัก */}
      <div
        className={`${bg} fixed z-20 flex flex-col justify-between h-screen w-64 ${linkTextColor} font-bold border-r transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex flex-col">
          <div className="flex items-center py-3 p-4">
            <Link to="/executive/DashboardExecutive" className="mx-auto">
              <div className="uppercase text-2xl font-black text-white dark:text-white whitespace-nowrap mt-5 transition-all duration-300">
                Tech<span className="text-yellow-500">Job</span>
                <div className="text-xs text-white dark:text-white mt-1 transition-all duration-300">
                  Chief
                </div>
              </div>
            </Link>
          </div>

          {/* Sidebar Items */}
          <div className="mt-4 flex flex-col">
            {items.map((item, index) => {
              const Icon = item.icon;

              if (item.link) {
                return (
                  <NavLink
                    to={item.link}
                    key={index}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer overflow-hidden rounded-md hover:bg-yellow-500 px-6 font-medium ${linkTextColor} transition duration-300 ${
                        isActive ? "bg-yellow-500" : ""
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

        {/* Profile + Theme */}
        <div>
          <ThemeSwitcher />
          <Link to="/chief/ProfileChief" className="mt-auto">
            <div className="border-t border-blue-700 dark:border-gray-700 bg-blue-900 dark:bg-gray-800 duration-300 hover:bg-blue-700 dark:hover:bg-gray-700 h-20 flex items-center gap-4 cursor-pointer px-2">
              <img
                src="https://i.pinimg.com/736x/f7/94/54/f79454c439ea58e65d2bb675a1faf77b.jpg"
                className="object-cover w-10 rounded-full duration-300"
                alt="profile"
              />
              <div className="text-lg font-semibold text-white dark:text-white">
                คุณ <span className="text-yellow-400">{Message}</span>
                <div className="text-sm text-yellow-400">Chief</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Overlay มือถือ */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-40 md:hidden z-10"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* ---- ส่วน Slide Menu กล่องข้อความ ---- */}
      {showManu && (
        <div
          className={`
            fixed left-0 bottom-0 
            rounded-t-xl h-180 w-80 p-2 ${bgside}
            transition-all transform duration-500
            z-15 shadow-2xl border-t border-r border-gray-200 dark:border-gray-700
            ${
              slideIn
                ? "translate-x-67 scale-100 opacity-100" // เลื่อนเข้ามาหลัง sidebar (64 + gap)
                : "-translate-x-full opacity-0"
            }
          `}
          style={{ marginLeft: "0px" }} // ปรับตำแหน่งตามต้องการหาก Sidebar กว้าง 64 (16rem) อาจต้องปรับ translate-x
        >
          <div
            className={`flex justify-between items-center mb-4 border-b-2 border-blue-100 pb-2 ${textPanel}`}
          >
            <h2 className="text-xl font-semibold text-blue-500">
              กล่องข้อความ
            </h2>
            <button
              onClick={closeManu}
              className={`text-2xl hover:text-red-500 pr-2 cursor-pointer ${textPanel}`}
            >
              ✕
            </button>
          </div>
          <div className="h-100">
            <div
              onClick={openManageMenu}
              className="border-black p-2 shadow-md rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <img
                className="w-12 h-12 rounded-full object-cover"
                src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
                alt="พิชรัตน์"
              />
              <div>
                <p className={`font-semibold ${textPanel}`}>พิชรัตน์</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- ส่วน Slide Menu รายละเอียด (Chat Detail) ---- */}
      {openManage && (
        <div
          className={`fixed left-4 lg:left-150 bottom-0 rounded-t-xl h-150 w-80 p-2 ${bgside} z-15 transition-all transform duration-500 shadow-2xl border-t border-gray-200 dark:border-gray-700 ${
            slideManage
              ? "-translate-x-0 scale-100 opacity-100"
              : "-translate-x-20 scale-100 opacity-0"
          }`}
        >
          <div className="border-black p-2 rounded-xl flex items-center gap-3">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
              alt="พิชรัตน์"
            />
            <div>
              <p className={`font-semibold ${textPanel}`}>{Message}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={closeManageMenu}
                className={`hover:text-red-500 text-2xl p-1 cursor-pointer ${textPanel}`}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

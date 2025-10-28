import { useEffect, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { RiFilePaper2Line } from "react-icons/ri";
import { FaInbox } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import ThemeSwitcher from "./ThemeSwitcher";
import { SiGooglemaps } from "react-icons/si";
import { useTheme } from "@/components/theme-provider";
import { FaTools } from "react-icons/fa";
import axios from "axios";
import { AiTwotoneCalendar } from "react-icons/ai";

interface SidebarItem {
  text: string;
  icon: React.ComponentType<{ size?: number }>;
  link?: string;
  onClick?: () => void;
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [showManu, setShowManu] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [openManage, setManage] = useState(false);
  const [slideManage, setslideManage] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [Message, setMessage] = useState("");
  const [fade, setFade] = useState(false);
  const [fadeModal, setFadeModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (window.innerWidth >= 768) {
      setOpen(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/logins");
  };

  const items: SidebarItem[] = [
    { text: "Dashboard", icon: MdDashboard, link: "/user/DashboardUser" },
    { text: "รับใบงาน", icon: RiFilePaper2Line, link: "/user/getpaper" },
    { text: "ปฏิทินงาน", icon: AiTwotoneCalendar, link: "/user/Calendar" },
    { text: "กล่องข้อความ", icon: FaInbox, onClick: () => openManu() },
    { text: "แผนที่", icon: SiGooglemaps, link: "/user/Maps" },
    { text: "วัสดุอุปกรณ์", icon: FaTools, link: "/user/Supplies" },
    { text: "ออกจากระบบ", icon: IoLogOutOutline, onClick: handleLogout },
  ];

  useEffect(() => {
    if (!token) {
      navigate("/logins");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/login/dashboardUser",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(response.data.Name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [navigate, token]);

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

  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : "bg-blue-100";
  const text = theme === "dark" ? "text-black" : "text-gray-500";

  return (

    <div className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"}`}>

      <>
        <button
          className="md:hidden fixed top-4 left-4 z-30 text-3xl bg-blue-500 p-2 text-white rounded-lg"
          onClick={() => setOpen(!open)}
        >

          {open ? <IoClose /> : <GiHamburgerMenu />}
        </button>

        <div
          className={`  ${text} ${bg}  fixed z-20 flex flex-col justify-between h-screen w-64 bg-blue-500 text-white font-bold border-r transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
        >
          <div className="flex flex-col">
            <div className="flex items-center  py-3 p-4 mt-5">
              <Link
                to="/user/dashboard"
                className={`max-w-380 mx-auto text-3xl `}
              >
                Tech
                <span
                  className={` ${theme === "dark" ? "text-yellow-500" : "text-yellow-500"
                    }`}
                >
                  Job
                </span>
              </Link>
            </div>

            <div className="flex flex-col mt-5">
              {items.map((item, index) => {
                const Icon = item.icon;
                if (item.link) {
                  return (
                    <NavLink
                      to={item.link}
                      key={index}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer overflow-hidden rounded-md hover:bg-yellow-500 px-6 font-medium text-neutral-0 transition duration-300 ${isActive ? "bg-yellow-500" : ""
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      {/* แถบ animation */}
                      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                        <div className="relative h-full w-8 bg-white/50"></div>
                      </div>

                      {/* เนื้อหาภายใน NavLink */}
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
                    className={`flex items-center gap-2 my-2 pl-5 py-3 w-full text-left cursor-pointer  duration-300 hover `}
                  >
                    <Icon size={24} />
                    <span>{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <ThemeSwitcher />
            <Link to="Profile" className="mt-auto">
              <div className="border-t border-blue-600 bg-blue-900 h-20 flex items-center gap-4 cursor-pointer px-2 hover:bg-blue-700 duration-300">
                <img
                  src="https://i.pinimg.com/736x/f7/94/54/f79454c439ea58e65d2bb675a1faf77b.jpg"
                  className="object-cover w-10 rounded-full"
                  alt="profile"
                />
                <div className="text-lg font-semibold">
                  คุณ <span className="text-yellow-500">{Message}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        {open && (
          <div
            className="fixed inset-0 bg-black opacity-40 md:hidden z-10"
            onClick={() => setOpen(false)}
          ></div>
        )}
        {showManu && (
          <div
            className={` ml-2 fixed lg:left-64 left-4 bottom-0 rounded-t-xl h-120 w-80 p-2 bg-white lg:z-50 transition-all transform duration-500 ${slideIn
              ? "-translate-y-0 scale-100 opacity-100"
              : "translate-y-full opacity-0"
              }`}
          >
            <div className="flex justify-between items-center mb-4 border-b-2 border-blue-100 pb-2">
              <h2 className="text-xl font-semibold text-blue-500">กล่องข้อความ</h2>
              <button
                onClick={closeManu}
                className={`text-2xl hover:text-red-500 pr-2 cursor-pointer ${text}`}
              >
                ✕
              </button>
            </div>
            <div className="h-100">
              <div
                onClick={openManageMenu}
                className="border-black p-2 shadow-xl rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-100"
              >
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
                  alt="พิชรัตน์"
                />
                <div>
                  <p className={`font-semibold ${text}`}>พิชรัตน์</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {openManage && (
          <div
            className={` ml-1 fixed lg:left-150  left-4 bottom-0 rounded-t-xl h-100 w-80 p-2 bg-white lg:z-50 transition-all transform duration-500 ${slideManage
              ? "-translate-x-4 scale-100 opacity-100"
              : "-translate-x-10 scale-100 opacity-0"
              }`}
          >
            <div className="border-black p-2 rounded-xl flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
                alt="พิชรัตน์"
              />
              <div>
                <p className={`font-semibold ${text}`}>{Message}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={closeManageMenu}
                  className={` hover:text-red-500 text-2xl p-1 cursor-pointer ${text}`}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

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

  // --- State สำหรับเก็บข้อมูล User ---
  const [Message, setMessage] = useState("ผู้บริหาร");
  const [userProfile, setUserProfile] = useState<string | null>(null);

  // รูป Default กรณีไม่มีรูปหรือโหลดไม่ขึ้น
  const defaultProfileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  // --- ออกจากระบบ ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/logins");
  };

  const items: SidebarItem[] = [
    {
      text: "Dashboard",
      icon: MdDashboard,
      link: "/executive/DashboardExecutive",
    },
    {
      text: "รายงาน",
      icon: RiFilePaper2Line,
      link: "/executive/Getpaperexecutive",
    },
    { text: "ทีมงาน", icon: AiOutlineTeam, link: "/executive/Team" },
    { text: "ออกจากระบบ", icon: IoIosLogOut, onClick: handleLogout },
  ];

  // --- ดึงข้อมูลมาเเสดงใน sidebar ---
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

        // เซ็ตชื่อ
        if (response.data.Name) {
          setMessage(response.data.Name);
        } else if (response.data.username) {
          setMessage(response.data.username);
        }

        // เซ็ตโปรไฟล์
        setUserProfile(response.data.Profile);

      } catch (err) {
        console.error("Fetch sidebar message error:", err);
        // กรณี Token หมดอายุอาจจะให้เด้งออก (Optional)
        // handleLogout();
      }
    };

    fetchData();
  }, [navigate, token]);

  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : "bg-blue-500";

  // ปรับปรุงการใช้สีพื้นหลังและสีข้อความ
  const linkTextColor = "text-white";

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
        className={`${bg} fixed z-20 flex flex-col justify-between h-screen w-64 ${linkTextColor} font-bold border-r transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex flex-col">
          <div className="flex items-center py-3 p-4">
            <Link to="/executive/DashboardExecutive" className="mx-auto">
              <div className="uppercase text-2xl font-black text-white dark:text-white whitespace-nowrap mt-5 transition-all duration-300">
                Tech<span className="text-yellow-500">Job</span>
                <div className="text-xs text-white dark:text-gray-400 mt-1 transition-all duration-300">
                  Executive
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
                      `group relative flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer overflow-hidden rounded-md hover:bg-yellow-500 px-6 font-medium ${linkTextColor} transition duration-300 ${isActive ? "bg-yellow-500" : ""
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    {/* แถบ animation */}
                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                      <div className="relative h-full w-8 bg-white/50"></div>
                    </div>

                    {/* เนื้อหาภายใน NavLink */}
                    <Icon size={24} />
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
                  {/* แถบ animation */}
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                    <div className="relative h-full w-8 bg-white/50"></div>
                  </div>
                  <Icon size={24} />
                  <span className="relative z-10">{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile + Theme */}
        <div>
          <ThemeSwitcher />
          <Link to="/executive/ProfileExecutive" className="mt-auto">
            <div className="border-t border-blue-700 dark:border-gray-700 bg-blue-900 dark:bg-gray-800 duration-300 hover:bg-blue-700 dark:hover:bg-gray-700 h-20 flex items-center gap-4 cursor-pointer px-2">
              {/* ส่วนที่เเก้ไขรูปภาพ */}
              <img
                src={
                  userProfile
                    ? `http://localhost:5000/uploads/Profile/${userProfile}`
                    : defaultProfileImage
                }
                onError={(e) => {
                  e.currentTarget.src = defaultProfileImage;
                }}
                className="object-cover w-10 h-10 rounded-full duration-300 bg-gray-400"
                alt="profile"
              />

              <div className="text-lg font-semibold text-white dark:text-white">
                คุณ <span className="text-yellow-400">{Message}</span>
                <div className="text-sm text-yellow-400">Executive</div>
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
    </>
  );
}
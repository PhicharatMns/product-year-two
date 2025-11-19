import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { TbBellPlus } from "react-icons/tb";
import { useTheme } from "@/components/theme-provider";
import { LiaUserEditSolid } from "react-icons/lia";
import { VscNewFile } from "react-icons/vsc";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import ThemeSwitcher from "./ThemeSwitcher";
import { FaTools } from "react-icons/fa";
import axios from "axios";

interface SidebarItem {
  text: string;
  icons: React.ComponentType<{ size?: number }>;
  Link?: string;
  onClick?: () => void;
}

export default function Sidebaradmin() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // --- State สำหรับข้อมูล Admin ---
  const [adminName, setAdminName] = useState("");
  const [adminProfile, setAdminProfile] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  // รูป Default (ใช้เมื่อไม่มีรูป หรือโหลดไม่ขึ้น)
  const defaultProfileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  // --- ดึงข้อมูล Admin ---
  useEffect(() => {
    if (!token) {
      navigate("/logins");
      return;
    }
    const fetchData = async () => {
      try {
        // ดึงข้อมูลจาก API
        const res = await axios.get("http://localhost:5000/api/login/dashboardUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // เซ็ตค่าลง State
        setAdminName(res.data.Name);
        setAdminProfile(res.data.Profile);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        // กรณี Token หมดอายุหรือ Error อื่นๆ อาจจะให้เด้งออก (Optional)
        // navigate("/logins"); 
      }
    };
    fetchData();
  }, [token, navigate]);

  // --- ฟังก์ชันออกจากระบบ ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/logins");
  };

  // --- รายการเมนู ---
  const datasizebar: SidebarItem[] = [
    { text: "Dashboard", icons: MdDashboard, Link: "/Dashboard" },
    { text: "สร้างใบงานใหม่", icons: VscNewFile, Link: "/Searchpastjobs" },
    { text: "ส่งการแจ้งเตือน", icons: TbBellPlus, Link: "/Notification" },
    { text: "จัดการวัสดุอุปกรณ์", icons: FaTools, Link: "/SuppliesAdmin" },
    { text: "จัดการบัญชีช่าง", icons: LiaUserEditSolid, Link: "/Editacc" },
    { text: "ออกจากระบบ", icons: IoIosLogOut, onClick: handleLogout },
  ];

  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : "bg-blue-100";

  return (
    <>
      {/* ปุ่มเปิดเมนูบนมือถือ */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 text-3xl bg-blue-500 p-2  text-white rounded-lg "
        onClick={() => setOpen(!open)}
      >
        {open ? <IoClose /> : <GiHamburgerMenu />}
      </button>

      {/* Container Sidebar */}
      <div
        className={`${bg} fixed z-20 flex flex-col justify-between h-screen w-64 bg-blue-500 text-white dark:text-gray-200 font-bold border-r transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* ส่วนบน: Logo และ Menu */}
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex items-center py-3 p-4">
            <Link to="/Dashboard" className="mx-auto">
              <div className="uppercase text-2xl font-black text-white dark:text-white whitespace-nowrap mt-5 transition-all duration-300">
                Tech<span className="text-yellow-500">Job</span>
                <div className="text-xs text-white dark:text-white mt-1 transition-all duration-300">
                  Admin
                </div>
              </div>
            </Link>
          </div>

          {/* Menu Items */}
          <div className="mt-4 flex flex-col">
            {datasizebar.map((event, index) => {
              const Icons = event.icons;

              // กรณีเป็น Link (NavLink)
              if (event.Link) {
                return (
                  <NavLink
                    to={event.Link}
                    key={index}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer overflow-hidden rounded-md hover:bg-yellow-500 px-6 font-medium text-neutral-0 transition duration-300 ${
                        isActive ? "bg-yellow-500" : ""
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    {/* Animation Background */}
                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                      <div className="relative h-full w-8 bg-white/50"></div>
                    </div>

                    {/* Icon & Text */}
                    <Icons size={24} />
                    <span className="relative z-10">{event.text}</span>
                  </NavLink>
                );
              }

              // กรณีเป็นปุ่ม (Button) เช่น Logout
              return (
                <button
                  key={index}
                  onClick={() => {
                    setOpen(false);
                    event.onClick?.();
                  }}
                  className={`flex items-center gap-2 my-2 pl-5 py-3 w-full text-left cursor-pointer  duration-300 hover `}
                >
                  <Icons size={24} />
                  <span>{event.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ส่วนล่าง: Theme Switcher และ Profile */}
        <div>
          <ThemeSwitcher />
          
          <Link to="/ProfileAdmin" className="mt-auto">
            <div className="border-t border-blue-600 dark:border-gray-700 bg-blue-900 dark:bg-gray-800 duration-300 hover:bg-blue-700 dark:hover:bg-gray-700 h-20 flex items-center gap-4 cursor-pointer px-2">
              
              {/* รูป Profile */}
              <img
                src={
                  adminProfile
                    ? `http://localhost:5000/uploads/Profile/${adminProfile}`
                    : defaultProfileImage
                }
                onError={(e) => {
                  // ถ้าโหลดรูปไม่ขึ้น ให้เปลี่ยนเป็นรูป default ทันที
                  e.currentTarget.src = defaultProfileImage;
                }}
                className="object-cover w-10 h-10 rounded-full duration-300 border-2 border-white/30 bg-gray-500"
                alt="admin profile"
              />

              {/* ชื่อ Admin */}
              <div className="text-lg font-semibold text-white dark:text-white">
                คุณ {adminName}
                <div className="text-sm text-yellow-400">Admin</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Overlay สำหรับ Mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-40 md:hidden z-10"
          onClick={() => setOpen(false)}
        ></div> 
      )}
    </>
  );
}
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdOutlineCategory } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { TbBellPlus } from "react-icons/tb";
import { GoGraph } from "react-icons/go";
import { LiaUserEditSolid } from "react-icons/lia";
import { VscNewFile } from "react-icons/vsc";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

export default function Sidebaradmin() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: MdDashboard, path: "/Dashboard" },
    { text: "สร้างใบงานใหม่", icon: VscNewFile, path: "/Searchpastjobs" },
    { text: "ส่งแจ้งการเตือน", icon: TbBellPlus, path: "/Details" },
    { text: "สถิติ", icon: GoGraph, path: "/graph" },
    { text: "กำหนดประเภท/หมวด", icon: MdOutlineCategory, path: "/setwork" },
    { text: "จัดการบัญชีช่าง", icon: LiaUserEditSolid, path: "/Editacc" },
    { text: "ออกจากระบบ", icon: IoIosLogOut, path: "/Logins" },
  ];

  return (
    <>
      {/* ====== ปุ่ม Toggle บนมือถือ ====== */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 bg-white text-blue-600 p-3 rounded-xl shadow-lg md:hidden hover:bg-blue-50 transition"
      >
        {open ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
      </button>

      {/* ====== Sidebar หลัก ====== */}
<aside
   className={`
    fixed top-0 left-0 
    bg-blue-500 backdrop-blur-md border-r 
    text-white flex flex-col justify-between 
    shadow-lg z-50 transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:relative md:h-auto
  `}

>
  {/* เนื้อหาของ Sidebar */}


        {/* โลโก้ */}
        <div className="p-5 border-b border-gray-100">
          <Link to="/Dashboard" onClick={() => setOpen(false)}>
            <h1 className="text-2xl font-extrabold text-white tracking-wide">
              Tech<span className="text-yellow-500">Job</span>
            </h1>
            <p className="text-xs text-yellow-400 mt-1">Admin Panel</p>
          </Link>
        </div>

        {/* เมนูหลัก */}
        <nav className="flex-1 overflow-y-auto py-5">
          <ul className="space-y-1">
            {menuItems.map(({ text, icon: Icon, path }, i) => {
              const active = location.pathname === path;
              return (
                <li key={i}>
                  <Link
                    to={path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-6 py-3 text-base font-medium rounded-lg mx-3 transition-all duration-200 ${
                      active
                        ? "bg-yellow-500 text-white shadow-sm"
                        : "hover:bg-blue-400 "
                    }`}
                  >
                    <Icon size={20} />
                    <span>{text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* โปรไฟล์ด้านล่าง */}
        <Link
          to="/Profile"
          onClick={() => setOpen(false)}
          className="border-t border-gray-200 p-4 flex items-center gap-3 hover:bg-blue-400 transition duration-300"
        >
          <img
            src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-white">คุณ จักรยาน สีแดง</p>
            <p className="text-sm text-yellow-500 font-medium">Admin</p>
          </div>
        </Link>
      </aside>

      {/* ====== Overlay บนมือถือ ====== */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 md:hidden"
        ></div>
      )}
    </>
  );
}

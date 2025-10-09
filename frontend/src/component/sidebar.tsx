import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { RiFilePaper2Line } from "react-icons/ri";
import { FaInbox } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import ThemeSwitcher from "./ThemeSwitcher";

interface SidebarItem {
  text: string;
  icon: React.ComponentType<{ size?: number }>;
  link?: string;
  onClick?: () => void;
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [showManu, setShowManu] = useState(false); // สำหรับ render
  const [slideIn, setSlideIn] = useState(false);   // สำหรับ animation  
  const [, setopenManu] = useState(false) // openManu Manage

  const items: SidebarItem[] = [
    { text: "Dashboard", icon: MdDashboard, link: "/user/dashboard" },
    { text: "รับใบงาน", icon: RiFilePaper2Line, link: "/user/getpaper" },
    { text: "กล่องข้อความ", icon: FaInbox, onClick: () => openManu() },
    { text: "ออกจากระบบ", icon: IoLogOutOutline, link: "/logins" },
  ];

  const openManu = () => {
    setShowManu(true);            // render กล่อง
    setTimeout(() => setSlideIn(true), 10); // ให้เวลา render ก่อนเริ่ม slide-in
  };

  const closeManu = () => {
    setSlideIn(false);            // เริ่ม slide-out
    setTimeout(() => setShowManu(false), 500); // รอ animation จบก่อนซ่อนจริง
  };

  return (
    <>
      {/* ปุ่มเปิดเมนูบนมือถือ */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 text-3xl bg-blue-500 p-2 text-white rounded-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <IoClose /> : <GiHamburgerMenu />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed z-20 flex flex-col justify-between h-screen w-64 bg-blue-500 text-white font-bold border-r transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex flex-col">
          <div className="flex items-center py-3 p-4 mt-5">
            <Link
              to="/user/dashboard"
              className="max-w-380 mx-auto text-3xl font-black"
            >
              Tech<span className="text-yellow-500">Job</span>
            </Link>
          </div>

          {/* Sidebar Items */}
          <div className="flex flex-col mt-5">
            {items.map((item, index) => {
              const Icon = item.icon;

              if (item.link) {
                return (
                  <NavLink
                    to={item.link}
                    key={index}
                    className={({ isActive }) =>
                      `flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer hover:bg-yellow-500 dark:hover:bg-yellow-600 duration-300 ${isActive ? "bg-yellow-500" : ""
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={24} />
                    <span>{item.text}</span>
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
                  className="flex items-center gap-2 my-2 pl-5 py-3 w-full text-left cursor-pointer hover:bg-yellow-500 dark:hover:bg-yellow-600 duration-300 "
                >
                  <Icon size={24} />
                  <span>{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile + Theme */}
        <div>
          <ThemeSwitcher />
          <Link to="Profile" className="mt-auto">
            <div className="border-t border-blue-600 bg-blue-900 h-20 flex items-center gap-4 cursor-pointer px-2 hover:bg-blue-700 duration-300">
              <img
                src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
                className="object-cover w-10 rounded-full"
                alt="profile"
              />
              <div className="text-lg font-semibold">คุณ ใบไผ่ สองทอง</div>
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


      {showManu && (
        <div
          className={` fixed top-0 left-64  w-80 p-2 h-full bg-white z-50  transition-all transform   ${slideIn ? "-translate-x-4 scale-100 opacity-100" : " -translate-x-4 scale-100 opacity-0"
            }`}
        >
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-100 pb-2">
            <h2 className="text-xl font-semibold text-blue-500">กล่องข้อความ</h2>
            <button onClick={closeManu} className="text-2xl hover:text-red-500 pr-2">✕</button>
          </div>

          <div>
            {/* ตัวอย่างชื่อผู้ส่ง */}
            <div
              onClick={() => setopenManu((prev) => !prev)}
              className="border-black p-2 shadow-xl rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-100"
            >
              <img
                className="w-12 h-12 rounded-full object-cover"
                src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
                alt="พิชรัตน์"
              />
              <div>
                <p className="font-semibold">พิชรัตน์</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

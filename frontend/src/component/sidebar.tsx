import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { RiFilePaper2Line } from "react-icons/ri";
import { FaInbox } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { MdOutlineCategory } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import ThemeSwitcher from "./ThemeSwitcher";
import { IoLogOutOutline } from "react-icons/io5";

interface SidebarItem {
  text: string;
  icon: React.ComponentType<{ size?: number }>;
  link: string;
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const items: SidebarItem[] = [
    { text: "Dashboard", icon: MdDashboard, link: "/user/dashboard" },
    { text: "รับใบงาน", icon: RiFilePaper2Line, link: "/user/getpaper" },
    { text: "กล่องข้อความ", icon: FaInbox, link: "/user/box" },
     { text: "ออกจากระบบ", icon:  IoLogOutOutline, link: "/logins" },
     ];

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
        className={`fixed z-20 flex flex-col justify-between h-screen w-64 bg-blue-500 text-white font-bold border-r transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex flex-col">
          <div className="flex items-center py-3 p-4 mt-5">
            <Link to="/user/dashboard" className=" max-w-380 mx-auto text-3xl font-black">
              Tech<span className="text-yellow-500">Job</span>
            
            </Link>
          </div>

          {/* Sidebar Items */}
          <div className=" flex flex-col">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  to={item.link}
                  key={idx}
                  className={({ isActive }) =>
                    `flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer hover:bg-yellow-500 dark:hover:bg-yellow-600 duration-300 ${
                      isActive ? "bg-yellow-500 " : ""
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <Icon size={24} />
                  <span>{item.text}</span>
                </NavLink>
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
    </>
  );
}

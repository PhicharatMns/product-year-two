import { useState } from "react";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { TbBellPlus } from "react-icons/tb";
import { GoGraph } from "react-icons/go";
import { MdOutlineCategory } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { VscNewFile } from "react-icons/vsc";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

interface SidebarItem {
  text: string;
  icons: React.ComponentType<{ size?: number }>;
  Link: string;
}

export default function Sidebaradmin() {
  const [open, setOpen] = useState(false);

  const datasizebar: SidebarItem[] = [
    { text: "Dashboard", icons: MdDashboard, Link: "Dashboard" },
    { text: "สร้างใบงานใหม่", icons: VscNewFile, Link: "Searchpastjobs" },
    { text: "ส่งแจ้งการเตือน", icons: TbBellPlus, Link: "Details" },
    { text: "สถิติ", icons: GoGraph, Link: "graph" },
    { text: "กำหนดประเภท/หมวด", icons: MdOutlineCategory, Link: "setwork" },
    { text: "จัดการบัญชีช่าง", icons: LiaUserEditSolid, Link: "Editacc" },
    { text: "ออกจากระบบ", icons: IoIosLogOut, Link: "Logins" },
  ];

  return (
    <div className="z-20">
      {/* ====== Mobile Toggle Button ====== */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setOpen(!open)}
          className="text-white bg-blue-500 p-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          {open ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      </div>

      {/* ====== Sidebar ====== */}
      <div
        className={`fixed flex flex-col justify-between h-screen lg:w-64 sm:10 bg-blue-500 text-white font-bold border-r border-blue-600 transition-transform duration-300 z-20
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex flex-col">
          <div className="flex items-center py-3 p-4">
            <Link to="/Home" className="mx-auto">
              <div className="uppercase text-2xl font-black text-white mt-5">
                Tech<span className="text-yellow-500">Job</span>
                <div className="text-xs text-white mt-1">Admin</div>
              </div>
            </Link>
          </div>

          {/* Menu Items */}
          <div className="mt-4 flex flex-col">
            {datasizebar.map((event, index) => {
              const Icons = event.icons;
              return (
                <Link
                  to={`/${event.Link}`}
                  key={index}
                  onClick={() => setOpen(false)} // ปิด Sidebar เมื่อคลิกลิงก์ในมือถือ
                >
                  <div className="flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer hover:bg-yellow-500 duration-300">
                    <Icons size={24} />
                    <span className="whitespace-nowrap inline-block">
                      {event.text}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Profile Section */}
        <Link to="/Profile" className="mt-auto">
          <div className="bg-blue-900 hover:bg-blue-700 h-20 flex items-center gap-4 cursor-pointer px-2">
            <img
              src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
              className="object-cover w-10 rounded-full"
              alt="profile"
            />
            <div className="text-lg font-semibold text-white">
              คุณ จักรยาน สีแดง
              <div className="text-sm text-yellow-400">Admin</div>
            </div>
          </div>
        </Link>
      </div>

      {/* ====== Overlay (Mobile) ====== */}
      {open && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm  z-10"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </div>
  );
}

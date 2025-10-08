import { useState } from "react";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { TbBellPlus } from "react-icons/tb";
import { GoGraph } from "react-icons/go";
import { LiaUserEditSolid } from "react-icons/lia";
import { VscNewFile } from "react-icons/vsc";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsEnvelopePaper } from "react-icons/bs";
import { FaInbox } from "react-icons/fa6";


interface SidebarItem {
  text: string;
  icons: React.ComponentType<{ size?: number }>;
  Link: string;
}

export default function SidebarUser() {
  const [open, setOpen] = useState(false);

  const datasizebar: SidebarItem[] = [
    { text: "Dashboard", icons: MdDashboard, Link: "DashboardUser" },
    { text: "รับใบงาน", icons: BsEnvelopePaper, Link: "GetPaper" },
    { text: "กล่องข้อความ", icons: FaInbox, Link: "Box" },
    { text: "สถิติ", icons: GoGraph, Link: "graph" },
    // { text: "กำหนดประเภท/หมวด", icons: MdOutlineCategory, Link: "setwork" },
    { text: "จัดการบัญชีช่าง", icons: LiaUserEditSolid, Link: "Editacc" },
    { text: "ออกจากระบบ", icons: IoIosLogOut, Link: "Logins" },
  ];

  return (
    <div className="relative">
    
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 p-2 rounded-lg text-white shadow-lg focus:outline-none"
        >
          {open ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      </div>

     
      {open && (
        <div
          className="fixed inset-0 w-0 z-10 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

     
      <div
        className={`fixed z-20  flex flex-col justify-between h-screen bg-blue-500 text-white font-bold border-r transition-all duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:w-64 w-64`}
      >
        {/* Logo */}
        <div className="flex flex-col">
          <div className="flex items-center py-3 p-4">
            <Link to="/Profile" className="mx-auto">
              <div className="uppercase text-2xl font-black text-white whitespace-nowrap mt-5">
                Tech<span className="text-yellow-500">Job</span>
       
              </div>
            </Link>
          </div>

          {/* เมนู */}
          <div className="mt-4 flex flex-col">
            {datasizebar.map((event, index) => {
              const Icons = event.icons;
              return (
                <Link
                  to={`/${event.Link}`}
                  key={index}
                  onClick={() => setOpen(false)} // ปิดเมนูเมื่อคลิกในมือถือ
                >
                  <div className="flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer hover:bg-yellow-500 duration-300">
                    <Icons size={24} />
                    <span>{event.text}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <Link to="/Profile" className="mt-auto">
          <div className="border-blue-900 bg-blue-900 hover:bg-blue-700 h-20 flex items-center gap-4 cursor-pointer px-2 duration-300">
            <img
              src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
              className="object-cover w-10 rounded-full"
              alt="pic"
            />
            <div className="text-lg font-semibold text-white">
              คุณ ลำไย ลายย้อน
             
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

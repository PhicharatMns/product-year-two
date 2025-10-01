import { useState } from "react";
import { AiOutlineCaretRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { TbBellPlus } from "react-icons/tb";
import { GoGraph } from "react-icons/go";
import { MdOutlineCategory } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { VscNewFile } from "react-icons/vsc";

interface SidebarItem {
  text: string;
  icons: React.ComponentType<{ size?: number }>;
  Link: string;
}

export default function Sidebaradmin() {
  const datasizebar: SidebarItem[] = [
    { text: "Dashboard", icons: MdDashboard, Link: "Dashboard" },
    { text: "สร้างใบงานใหม่", icons: VscNewFile, Link: "Searchpastjobs" },
    { text: "ส่งแจ้งการเตือน", icons: TbBellPlus, Link: "newalert" },
    { text: "สถิติ", icons: GoGraph, Link: "graph" },
    { text: "กำหนดประเภท/หมวด", icons: MdOutlineCategory, Link: "setwork" },
    { text: "จัดการบัญชีช่าง", icons: LiaUserEditSolid, Link: "Editacc" },
    { text: "ออกจากระบบ", icons: IoIosLogOut, Link: "Logins" },
  ];

  const [onClickSizebar, setOnClickSizebar] = useState(true);

  return (
    <div className={`fixed top-0 z-1 left-0 h-screen font-bold border-r transition-all duration-300 bg-blue-500 text-white flex flex-col justify-between ${onClickSizebar ? "w-16" : "w-64"}`}>
      
      {/* ส่วนบน: Header + Menu */}
      <div className="flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center py-3 p-4">
          <Link to="/Home" className="mx-auto">
            <div className={`uppercase text-2xl font-black text-white whitespace-nowrap mt-5 transition-all duration-300 ${onClickSizebar ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
              Tech<span className="text-yellow-500">Job</span>
              <div className={`text-xs text-white mt-1 transition-all duration-300 ${onClickSizebar ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
                Admin
              </div>
            </div>
          </Link>

          <button className="relative mt-5 cursor-pointer text-white">
            <AiOutlineCaretRight
              onClick={() => setOnClickSizebar(!onClickSizebar)}
              size={30}
            />
          </button>
        </div>

        {/* Sidebar Items */}
        <div className="mt-4 flex flex-col">
          {datasizebar.map((event, index) => {
            const Icons = event.icons;
            return (
              <Link to={`/${event.Link}`} key={index}>
                <div className={`flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer hover:bg-yellow-500 duration-300`}>
                  <Icons size={24} />
                  <span className={`whitespace-nowrap inline-block transition-all duration-300 ${onClickSizebar ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
                    {event.text}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ส่วนล่าง: Profile */}
      <div className="">
        <Link to="/Profile_woker">
          <div className={`border-blue-900 bg-blue-900 duration-300 hover:bg-blue-700 h-20 flex items-center gap-4 cursor-pointer px-2 ${onClickSizebar ? "justify-center" : "justify-start px-5"}`}>
            <img
              src="https://i.pinimg.com/1200x/f6/47/f8/f647f891a4677ab11c9ae7c1769555a5.jpg"
              className={`object-cover rounded-full duration-300 ${onClickSizebar ? "w-10 h-10" : "w-14 h-14"}`}
              alt="pic"
            />
            {!onClickSizebar && (
              <div className="text-lg font-semibold text-white">
                คุณ จักรยาน สีแดง
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}

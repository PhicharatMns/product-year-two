import { useState } from "react";
import { AiOutlineCaretRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { MdFindInPage } from "react-icons/md";
import { TbBellPlus } from "react-icons/tb";
import { GoGraph } from "react-icons/go";
import { MdOutlineCategory } from "react-icons/md";
import {  LiaUserEditSolid } from "react-icons/lia";
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
    { text: "ค้นหางานย้อนหลัง", icons: MdFindInPage, Link: "findfile" },
    { text: "ส่งแจ้งการเตือน", icons: TbBellPlus, Link: "newalert" },
    { text: "สถิติ", icons: GoGraph, Link: "graph" },
    { text: "กำหนดประเภท/หมวด", icons: MdOutlineCategory, Link: "setwork" },
    { text: "จัดการบัญชีช่าง", icons: LiaUserEditSolid, Link: "Editacc" },
    { text: "ออกจากระบบ", icons: IoIosLogOut, Link: "login" },
  ];

  const [onClickSizebar, setOnClickSizebar] = useState(true);

  return (
    <div
      className={`h-screen  font-bold border-r transition-all duration-300 bg-blue-500 text-white  ${onClickSizebar ? "w-16" : "w-64"
        }`}
    >
      {/* headerSizebar */}
      <div className="flex items-center py-3 p-4">
        <span
          className={`uppercase mx-auto text-2xl font-black text-white  whitespace-nowrap mt-5 ${onClickSizebar ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
        >
          Tech
          <span className="text-yellow-500">Job</span>
          <span
            className={`text-xs text-white mt-1 ${onClickSizebar ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
          >
            Admin
          </span>
        </span>
        <button className=" relative mt-5 cursor-pointer text-white">
          <AiOutlineCaretRight
            onClick={() => setOnClickSizebar(!onClickSizebar)}
            size={30}
          />
        </button>
      </div>

      <div className="mt-4">
        {datasizebar.map((event, index) => {
          const Icons = event.icons;
          return (
            <Link to={`/${event.Link}`}>
              <div
                key={index}
                className={`flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer  hover:bg-yellow-500 duration-300`}
              >
                {/* Icon */}
                <div className="flex justify-center">
                  <Icons size={24} />
                </div>

                {/* Text */}
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${onClickSizebar ? "w-0 overflow-hidden" : "w-auto opacity-100"
                    }`}
                >
                  {event.text}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

    </div >
  );
}

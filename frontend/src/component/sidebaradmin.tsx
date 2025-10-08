
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
    { text: "ส่งแจ้งการเตือน", icons: TbBellPlus, Link: "Notification" },
    { text: "สถิติ", icons: GoGraph, Link: "graph" },
    { text: "กำหนดประเภท/หมวด", icons: MdOutlineCategory, Link: "setwork" },
    { text: "จัดการบัญชีช่าง", icons: LiaUserEditSolid, Link: "Editacc" },
    { text: "ออกจากระบบ", icons: IoIosLogOut, Link: "Logins" },
  ];

  return (
    <div className="fixed z-20 flex h-screen">
      <div
        className={`flex relative flex-col justify-between w-64 bg-blue-500 text-white  dark:text-gray-200 font-bold border-r  transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex flex-col">
          <div className="flex items-center py-3 p-4">
            <Link to="/Home" className="mx-auto">
              <div className="uppercase text-2xl font-black text-white dark:text-white whitespace-nowrap mt-5 transition-all duration-300">
                Tech<span className="text-yellow-500">Job</span>
                <div className="text-xs text-white dark:text-gray-300 mt-1 transition-all duration-300">
                  Admin
                </div>
              </div>
            </Link>
          </div>

          {/* Sidebar Items */}
          <div className="mt-4 flex flex-col">
            {datasizebar.map((event, index) => {
              const Icons = event.icons;
              return (
                <Link to={`/${event.Link}`} key={index}>
                  <div className="flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer hover:bg-yellow-500 dark:hover:bg-yellow-600 duration-300">
                    <Icons size={24} />
                    <span className="whitespace-nowrap inline-block transition-all duration-300">
                      {event.text}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex justify-center my-4">
           
          </div>

          {/* Profile */}
          <Link to="/Profile" className="mt-auto">
            <div className="border-t border-blue-600 dark:border-gray-700 bg-blue-900 dark:bg-gray-800 duration-300 hover:bg-blue-700 dark:hover:bg-gray-700 h-20 flex items-center gap-4 cursor-pointer px-2">
              <img
                src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
                className="object-cover w-10 rounded-full duration-300  "
                alt="pic"
              />
              <div className="text-lg font-semibold text-white dark:text-white">
                คุณ จักรยาน สีแดง
                <div className="text-sm text-yellow-400">Admin</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

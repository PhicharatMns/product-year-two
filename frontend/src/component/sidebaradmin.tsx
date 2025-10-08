import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { TbBellPlus } from "react-icons/tb";
import { GoGraph } from "react-icons/go";
import { MdOutlineCategory } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { VscNewFile } from "react-icons/vsc";
import { ModeToggle } from "@/components/ModeToggle";

interface SidebarItem {
  text: string;
  icons: React.ComponentType<{ size?: number }>;
  Link: string;
}

export default function Sidebaradmin() {
  const datasizebar: SidebarItem[] = [
    { text: "Dashboard", icons: MdDashboard, Link: "dashboard" },
    { text: "สร้างใบงานใหม่", icons: VscNewFile, Link: "searchpastjobs" },
    { text: "ส่งแจ้งการเตือน", icons: TbBellPlus, Link: "details" },
    { text: "สถิติ", icons: GoGraph, Link: "graph" },
    { text: "กำหนดประเภท/หมวด", icons: MdOutlineCategory, Link: "setwork" },
    { text: "จัดการบัญชีช่าง", icons: LiaUserEditSolid, Link: "editacc" },
    { text: "ออกจากระบบ", icons: IoIosLogOut, Link: "logins" },
  ];

  return (
    <div className="fixed z-20 flex h-screen">
      <div className="flex flex-col justify-between w-64 bg-blue-500 text-white font-bold border-r">
        <div className="flex flex-col">
          <div className="flex items-center py-3 p-4">
            <Link to="/home" className="mx-auto text-2xl font-black uppercase">
              Tech<span className="text-yellow-500">Job</span>
            </Link>
          </div>

          <div className="mt-4 flex flex-col">
            {datasizebar.map((item, index) => {
              const Icons = item.icons;
              return (
                <Link to={`/${item.Link}`} key={index}>
                  <div className="flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer hover:bg-yellow-500 duration-300">
                    <Icons size={24} />
                    <span>{item.text}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 mb-4">
          <ModeToggle />
          <Link to="/profile" className="mt-auto w-full">
            <div className="border-t border-blue-600 bg-blue-900 flex items-center gap-4 cursor-pointer px-2 py-3 hover:bg-blue-700">
              <img
                src="https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg"
                className="w-10 rounded-full"
                alt="pic"
              />
              <div>
                <p className="text-white font-semibold">คุณ จักรยาน สีแดง</p>
                <p className="text-yellow-400 text-sm">Admin</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

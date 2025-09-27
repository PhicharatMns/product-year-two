import { useState } from "react";
import { AiOutlineCaretRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BsEnvelopePaper } from "react-icons/bs";
import { MdOutlineMoreTime } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";


interface SidebarItem {
  text: string;
  icons: React.ComponentType<{ size?: number }>;
  Link: string;
}

export default function Sidebar() {
  const datasizebar: SidebarItem[] = [
    { text: "Dashboard", icons: MdDashboard, Link: "Dashboard" },
    { text: "รับใบงาน", icons: BsEnvelopePaper, Link: "paper" },
    { text: "บันทึกเวลา", icons: MdOutlineMoreTime, Link: "Time" },
    { text: "ลงนาม2", icons: BsPencilSquare, Link: "Name" },
  ];

  const [onClickSizebar, setOnClickSizebar] = useState(true);

  return (
    <div
      className={`h-screen border-r transition-all duration-300 bg-blue-500 text-white  ${onClickSizebar ? "w-16" : "w-64"
        }`}
    >
      {/* headerSizebar */}
      <div className="flex items-center py-3 p-4">
        <span
          className={`uppercase mx-auto text-2xl font-black text-white whitespace-nowrap mt-5 ${onClickSizebar ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
        >
          Tech
          <span className="text-yellow-500">
            Job
          </span>
        </span>
        <button className=" relative mt-5 text-blue-400" >
          <AiOutlineCaretRight
            onClick={() => setOnClickSizebar(!onClickSizebar)}
            size={30}
          />
        </button>
      </div>
      {/* menuSizeBar */}
      <div className="mt-4">
        {datasizebar.map((event, index) => {
          const Icons = event.icons;
          return (
            <div
              key={index}
              className="flex items-center py-3 p-4 text-lg gap-5"
            >
              {/* Icon */}
              <div className="min-w-[30px] flex justify-center mt-4">
                <Icons size={24} />
              </div>
              {/* text */}
              <span
                className={`whitespace-nowrap mt-4 ${onClickSizebar ? "opacity-0 w-0" : "opacity-100 w-auto"
                  }`}
              >
                <Link to={`/${event.Link}`}>{event.text}</Link>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

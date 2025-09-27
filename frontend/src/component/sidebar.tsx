import { useState } from "react";
import { AiOutlineCaretRight } from "react-icons/ai";
import { AiOutlineAreaChart } from "react-icons/ai";
import { AiOutlineControl } from "react-icons/ai";
import { AiOutlineSketch } from "react-icons/ai";
import { Link } from "react-router-dom";

interface SidebarItem {
  text: string;
  icons: React.ComponentType<{ size?: number }>;
  Link: string;
}

export default function Sidebar() {
  const datasizebar: SidebarItem[] = [
    { text: "หุ้นในพอต", icons: AiOutlineSketch, Link: "Dashboard" },
    {
      text: "กราฟเเละกําไร",
      icons: AiOutlineAreaChart,
      Link: "Pageกราฟเเละกําไร",
    },
    { text: "จัดพอตใหม่", icons: AiOutlineControl, Link: "Pageจัดพอตnew" },
  ];

  const [onClickSizebar, setOnClickSizebar] = useState(true);

  return (
    <div
      className={`h-screen border-r border-purple-500 bg-blue-500 text-white transition-all duration-300  ${
        onClickSizebar ? "w-64" : "w-16"
      }`}
    >
      {/* headerSizebar */}
      <div className="flex items-center py-3 p-4">
        <span
          className={`uppercase mx-auto text-2xl font-black border-b whitespace-nowrap ${
            onClickSizebar ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}
        >
          Size bar
        </span>
        <button className=" relative">
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
              <div className="min-w-[30px] flex justify-center">
                <Icons size={24} />
              </div>
              {/* text */}
              <span
                className={`whitespace-nowrap ${
                  onClickSizebar ? "opacity-100 w-auto" : "opacity-0 w-0"
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

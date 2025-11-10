import { useTheme } from "@/components/theme-provider";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";

export default function Followtheprogress() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [focused, setfocused] = useState(false);

  const headText = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const headerBg = theme === "dark" ? "bg-gray-900 " : "bg-blue-50/40 border";

  return (
    <div className="max-w-380 p-5 mx-auto container">
      {/* ตรงหัวข้อ */}
      <div className="flex items-center justify-between">
        <h1
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-blue-700"
          }`}
        >
          รายการการเบิกของ
        </h1>
        {/* ค้นหา */}
        <div className="relative">
          <CiSearch
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300`}
          />
          <input
            placeholder="ค้นหาใบงาน..."
            onFocus={() => setfocused(true)}
            onBlur={() => setfocused(false)}
            type="text"
            className={`border rounded-xl pl-10 pr-3 duration-300 transition-all focus:outline-none focus:ring-2 py-1 
                      ${focused ? "w-72 shadow-lg" : "w-60 border-gray-300"}  
                      ${
                        theme === "dark"
                          ? "border-gray-600 focus:ring-yellow-500 bg-gray-700 text-white"
                          : "border-b-purple-300 focus:ring-blue-400 bg-white text-gray-800"
                      }`}
          />
        </div>
      </div>

      {/* ตาราง */}
      <div>
        {/* กรอบข้างบน */}
        <div
          className={`grid grid-cols-5 gap-5 mt-5 border-b-2 px-5 text-lg font-semibold ${headText}`}
        >
          <div>ชื่องาน</div>
          <div>หัวหน้า</div>
          <div>สถานะ</div>
          <div>วันที่ส่งเรื่อง</div>
          <div>รายละเอียด</div>
        </div>
      </div>
      <div
        className={`grid grid-cols-5 gap-5 mt-2 rounded-lg  py-1 px-5 ${headerBg}`}
      >
        <p>1</p>
        <p>2</p>
        <p>3</p>
        <p>4</p>
        <button
          className={` relative w-fit overflow-hidden cursor-pointer rounded-md  px-3 py-1 text-white text-sm duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             active:translate-y-1 active:scale-x-110 active:scale-y-90 ${
               theme === "dark"
                 ? "bg-yellow-500 hover:bg-yellow-600"
                 : "bg-blue-500 hover:bg-blue-600"
             }`}
        >
          รายละเอียด
        </button>
      </div>
    </div>
  );
}

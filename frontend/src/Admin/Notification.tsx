import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

// *** แก้ไข: เพิ่ม MoreHorizontal กลับเข้ามา ***
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Notification() {
  // --- Hooks & Context ---
  const { theme } = useTheme();

  const [fade, setFade] = useState(false);
  const [search] = useState("");
  const [Focused, setFocused] = useState(false);

  const bg = theme === "dark" ? "bg-gray-900" : " shadow-sm bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-800";
  const texthead = theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const bgborder = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
  
  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`transition-opacity p-5 mx-auto container duration-700 w-380 ${fade ? "opacity-100" : "opacity-0"
        }`}
    >
      {" "}
      <div className={` ${text}`}>
        {" "}
        <div className="mb-5">
          {/* --- Header --- */}
          <p
            className={`text-3xl font-bold ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
              }`}
          >
            การแจ้งเตือน
            <span
              className={`${theme === "dark" ? "text-white" : "text-yellow-500"
                }`}
            >
              & ข้อความ
            </span>{" "}
          </p>{" "}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 my-5">
            {/* --- [ฝั่ง 1] รายการเบิกของ (lg:col-span-3) --- */}{" "}
            <div
              className={` ${border} col-span-1 h-205 lg:col-span-3 rounded-lg ${bg}`}
            >
              {/* Card Header & Search */}{" "}
              <div
                className={`flex flex-col sm:flex-row justify-between items-center p-4 border-b ${border}`}
              >
                {" "}
                <p className={`text-lg font-semibold mb-2 sm:mb-0 ${texthead} `}>
                  รายการเบิกของ
                  <span
                    className={`text-sm font-normal ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } ml-2`}
                  >
                    {/* ({filteredItems.length} รายการ){" "} */}
                    รายการ
                  </span>{" "}
                </p>{" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <div className="relative">
                    {" "}
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                    />{" "}
                    <input
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="ค้นหา..."
                      value={search}
                      // onChange={(e) => setSearch(e.target.value)}
                      className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 
 ${theme === "dark"
                          ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                          : "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-300" // *** แก้ไข: ลบ 'e' ที่เป็นตัวอักษรแปลกๆ ออก ***
                        }
 ${Focused ? "w-72" : "w-60"}`}
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </div>
              <div
                className={`flex h-15 items-center border-b ${border} overflow-x-auto`}
              >
                <div className="grid grid-cols-6 gap-5">
                  {['ท้งหมด', 'ซ่อมไฟฟ้า', 'ซ่อมระบบ', 'ติดตั้ง', 'ตรวจสอบ', 'ซ่อมเครื่องใช้'].map((e, i) => {
                    return (
                      <div key={i}>
                        <p className="pl-5 text-sm">{e}</p>
                      </div>
                    )
                  })}
                </div>
                {" "}
              </div>
              <div className="border">
                {/* Table Content "รายการเบิกของ" */}
                <div className="grid grid-cols-4 p-2 pl-10  m-2">
                  {["ผู้ขอเบิก", "ประเภทงาน", "รายละเอียดงาน", "วันที่"].map(
                    (event, index) => {
                      return <div key={index}>{event}</div>;
                    }
                  )}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                className={`grid grid-cols-4 items-center text-sm p-2 pl-10 border rounded-xl m-2 ${bgborder}`}
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-4xl bg-yellow-500"
                    src=""
                    alt=""
                  />
                  <div className="flex-col">
                    <p>5</p>
                    <p>5</p>
                  </div>
                </div>
                <div className="bg-yellow-500 w-fit rounded-xl p-1 text-white px-1">
                  <p className="text-xs">ซื้อไฟฟ้าใหม่</p>
                </div>
                <div>รายละเอียด</div>
                <div>วันที่</div>
              </motion.div>
            </div>
            {/* รอเเก้ */}
            <div className={`border col-span-2 rounded-lg ${bg}`}>
              <div
                className={`flex flex-col sm:flex-row justify-between items-center p-5 border-b ${border}`}
              >
                <p className={`text-lg font-semibold mb-2 sm:mb-0 ${texthead  }`}>
                  รายงานจากช่าง
                  <span
                    className={`text-sm font-normal ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } ml-2`}
                  >
                    {/* ({filteredItems.length} รายการ){" "} */}
                    รายการ
                  </span>{" "}
                </p>
              </div>
              <div className="border">
                {/* Table Content "รายการเบิกของ" */}
                <div className="grid grid-cols-4 gap-5 p-2 m-2 pl-5 text-sm">
                  {["ประเภทงาน", "งาน", "ข้อความ", "วันที่"].map(
                    (event, index) => {
                      return (
                        <div
                          className={index === 3 ? "text-center" : ""} // วันที่ เป็น text-center key={index}>
                        >
                          {event}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                className={`border p-2 mt-2 m-2 pl-5 text-sm rounded-xl ${bgborder}`}
              >
                <div className="grid grid-cols-4 gap-5 items-center">
                  <div className="flex items-center gap-2">
                    <img
                      className="bg-black rounded-4xl w-10 h-10"
                      src=""
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p>5</p>
                      <p>5</p>
                    </div>
                  </div>
                  <div>งาน</div>
                  <div>ข้อความ</div>
                  <div className="text-center">วันที่</div>
                </div>
              </motion.div>
            </div>{" "}
          </div>{" "}
          {/* --- สิ้นสุด Grid Layout Wrapper --- */}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

// *** แก้ไข: เพิ่มไอคอนสำหรับ Stat Cards ***
import { Warehouse, Shapes, TriangleAlert, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";

const AddItemForm = () => {
  const { theme } = useTheme();
  const texthead = theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'
  const bg = theme === "dark" ? "bg-gray-900" : " shadow-sm bg-white";

  const menuList = [
    { id: 1, icon: Warehouse, name: "รายการทั้งหมด", color: "text-blue-500" },
    { id: 2, icon: Shapes, name: "หมวดหมู่ ", color: "text-violet-500" },
    { id: 3, icon: TriangleAlert, name: "ใกล้หมด", color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-3 gap-5 mt-5">
      {menuList.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-2 p-4 border rounded-xl shadow  transition ${bg}`}
        >
          {/*  เรียกใช้ component icon */}
          <item.icon
            className={`w-10 h-10 bg-gray-200  border p-2 rounded-4xl ${item.color}`}
          />
          <div className="flex flex-col  text-lg">
            <p className={` text-sm font-semibold ${texthead} `}>{item.name}</p>
            <p>5</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const datalist = [
  "ทั้งหมด",
  "ไฟฟ้า",
  "ประปา",
  "เครื่องมือ",
  "สี/เคมี",
  "สี/เคมี",
];

const data = [
  {
    item: "1",
    list: "สายไฟ",
    Inventory: "15",
    unit: "ม้วน",
    update: "12 พ.ย. 2568",
  },
  {
    item: "2",
    list: "หลอดไฟ",
    Inventory: "30",
    unit: "ดวง",
    update: "10 พ.ย. 2568",
  },
  {
    item: "3",
    list: "ปลั๊กไฟ",
    Inventory: "50",
    unit: "ชิ้น",
    update: "8 พ.ย. 2568",
  },
  {
    item: "4",
    list: "สวิตช์ไฟ",
    Inventory: "20",
    unit: "ตัว",
    update: "5 พ.ย. 2568",
  },
  {
    item: "5",
    list: "ท่อร้อยสาย",
    Inventory: "40",
    unit: "ท่อน",
    update: "2 พ.ย. 2568",
  },
];

const Showlist = () => {
  const [Focused, setFocused] = useState(false);
  const { theme } = useTheme();
  const texthead = theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'
  const bg = theme === "dark" ? "bg-gray-900" : " shadow-sm bg-white";
  const bgborder = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'

  return (
    <div className={`border rounded-lg h-175 ${bg}`}>
      <div className="grid grid-cols-9 items-center gap-5 p-4">
        {datalist.map((e, i) => {
          return (
            <div key={i} className="">
              <p className={`pl-2 ${texthead} `}> {e}</p>
            </div>
          );
        })}
        <div className="flex items-center justify-end gap-2 col-span-3">
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
      {/* item */}
      <div className="border">
        <div className="grid grid-cols-7 pl-5 text-sm py-1 m-2 ">
          {["วัสดุ / รหัส", "หมวดหมู่", "คงคลัง", "หน่วย", "อัปเดตล่าสุด"].map(
            (e, i) => {
              return (
                <div
                  key={i}
                  className={`${i === 0 || i === 1 ? "col-span-2" : "col-span-1"
                    }`}
                >
                  <p>{e}</p>
                </div>
              );
            }
          )}
        </div>
      </div>
      <div className="overflow-auto h-145 scrollbar-hide">
        {data.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: "easeOut",
            }}
            className={`grid grid-cols-7 pl-5 text-sm py-4 m-2 border rounded-lg  ${bgborder} `}
          >
            <p className="col-span-2">{e.item}</p>
            <p className="col-span-2">{e.list}</p>
            <p>{e.Inventory}</p>
            <p>{e.unit}</p>
            <p>{e.update}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

interface ButtonAddItemProps {
  setOpenShowProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonaddItem: React.FC<ButtonAddItemProps> = ({ setOpenShowProgress }) => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : " shadow-sm bg-white";

  return (
    <div className={` h-fit border p-5 rounded-lg ${bg} `}>
      <p className={`${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'} text-lg font-semibold`}>เพิ่มวัสดุใหม่</p>
      <button
        onClick={() => setOpenShowProgress(true)}
        className={`relative overflow-hidden rounded-md cursor-pointer px-2 w-f py-1 text-white text-sm duration-300 w-full mt-2
               [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
               active:translate-y-1 active:scale-x-110 active:scale-y-90  ${theme === "dark"
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-blue-700 hover:bg-blue-800"
          }`}
      >
        รายละเอียด
      </button>
    </div>
  )
}

const ShowProgress = () => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : " shadow-sm bg-white";
  const texthead = theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'

  return (
    <div className={`border h-143 rounded-lg p-4 ${bg}`}>
      <p className={`text-lg font-semibold ${texthead}`}>ภาพรวมสัดส่วนสต็อก</p>
      <div className="my-2">
        <p className="text-sm">หมวดหมู่</p>
      </div>
      <div className="w-full border p-2 rounded-lg ">Progress</div>
      <div className="mt-2 text-sm">
        {[
          { name: 'ไฟ้า', num: 14 },
          { name: 'ไฟ้า', num: 14 },
          { name: 'ไฟ้า', num: 14 },
        ].map((event, index) => {
          return (
            <div className="my-2 flex gap-2" key={index}>
              <p>{event.name}</p>
              <p>{event.num} %</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ShowaletProgress = () => {
  const { theme } = useTheme();

  return (
    <div className={`fixed inset-0 z-50 flex justify-center duration-300 items-center backdrop-blur-sm bg-black/40 transition-opacity `}
    >
      <div className="w-220 h-110 rounded-2xl p-8 border">
        <p className="text-2xl font-bold mb-6 border-b pb-3">เพิ่มวัสดุใหม่</p>
        <div className="grid grid-cols-2 gap-5">
          {['รหัสวัสดุ', 'ชื่อวัสดุ', 'หมวดหมู้', 'จํานวน', 'หน่วยนับ'].map((e, i) => {
            return (
              <div key={i} className={`${i === 4 ? 'col-span-2' : 'col-span-1'}`}>
                <p className="mb-1">{e}</p>
                <input
                  type="text"
                  className={`border w-full p-2 rounded-lg focus:ring-2 focus:outline-none ${i === 4 ? 'col-span-2' : ''}`}
                />
              </div>
            )
          })}
        </div>
        <div className="flex justify-end gap-4 border-t pt-4 mt-4">
          <button
            // onClick={closeModal}
            className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-white px-4  text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
          >
            <span className="relative z-10">ยกเลิก</span>
            <span className="absolute inset-0 overflow-hidden  pointer-events-none">
              <span className="absolute left-0 top-0 w-0 h-full bg-gray-200  transition-all duration-500 group-hover:w-full"></span>
            </span>
          </button>

          <button
            className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4  text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
              }`}
          >
            <span className="relative z-10">ยืนยัน</span>
            <span className="absolute inset-0 overflow-hidden  pointer-events-none">
              <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20  transition-all duration-500 group-hover:w-full"></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SuppliesAdmin() {
  const [OpenShowProgress, setOpenShowProgress] = useState(false)
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const item = setTimeout(() => setFade(true), 100)
    return () => clearTimeout(item)
  }, []);

  return (
    <div className={`max-w-380 p-5 container mx-auto duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <div>
        <p className="text-3xl font-bold">
          {" "}
          คลังวัสดุและ <span>อุปกรณ์</span>
        </p>
        <p>ภาพรวมสัดส่วนสต็อก</p>
      </div>
      <AddItemForm />
      <div className="my-5 grid gap-5 grid-cols-6">
        <div className="col-span-4">
          <Showlist />
        </div>
        <div className="col-span-2">
          <ButtonaddItem setOpenShowProgress={setOpenShowProgress} />
          <div className="mt-5">
            <ShowProgress />
          </div>
        </div>
      </div>
      {OpenShowProgress && (
        <ShowaletProgress />
      )}

    </div>
  );
}

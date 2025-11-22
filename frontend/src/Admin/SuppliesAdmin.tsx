// *** แก้ไข: เพิ่มไอคอนสำหรับ Stat Cards ***
import { Warehouse, Shapes, TriangleAlert, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

type CountingType = {
  value: number; // จำนวน
  timestamp: string; // วันที่เวลาที่เพิ่ม/แก้ไข
};
type ItemType = {
  _id: string;
  name: string;
  category: string;
  number: string;
  counting: CountingType;
  createdAt: string;
};

const AddItemForm = ({ items }: { items: ItemType[] }) => {
  const { theme } = useTheme();
  const texthead = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm bg-white";

  //นับเลข
  const countAllMV = useMotionValue(0);
  const countAll = useTransform(countAllMV, Math.round);

  const countCategoryMV = useMotionValue(0);
  const countCategory = useTransform(countCategoryMV, Math.round);

  const countLowStockMV = useMotionValue(0);
  const countLowStock = useTransform(countLowStockMV, Math.round);

  useEffect(() => {
    const c1 = animate(countAllMV, items.length, { duration: 1.5 });
    const c2 = animate(
      countCategoryMV,
      new Set(items.map((i) => i.category)).size,
      { duration: 1.5 }
    );
    const c3 = animate(
      countLowStockMV,
      items.filter((i) => i.counting?.value < 5).length,
      { duration: 1.5 }
    );

    return () => {
      c1.stop();
      c2.stop();
      c3.stop();
    };
  }, [items]);

  const menuList = [
    {
      id: 1,
      icon: Warehouse,
      name: "รายการทั้งหมด",
      color: "text-blue-500",
      value: countAll,
    },
    {
      id: 2,
      icon: Shapes,
      name: "หมวดหมู่",
      color: "text-violet-500",
      value: countCategory,
    },
    {
      id: 3,
      icon: TriangleAlert,
      name: "ใกล้หมด",
      color: "text-red-500",
      value: countLowStock,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-5 mt-5">
      {menuList.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-2 p-4 border rounded-xl shadow transition ${bg}`}
        >
          <item.icon
            className={`w-10 h-10  ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            } border p-2 rounded-4xl ${item.color}`}
          />
          <div className="flex flex-col text-lg">
            <p className={`text-sm font-semibold ${texthead}`}>{item.name}</p>
            <motion.p>{item.value}</motion.p>
          </div>
        </div>
      ))}
    </div>
  );
};

type ShowlistProps = {
  items: ItemType[];
  onOpen: (item: ItemType) => void;
  onOpenPopupDelete: () => void;
  fetchItems: () => void;
  setEditItem: (item: ItemType | null) => void; // <-- ตัวนี้ REQUIRED
};

const Showlist: React.FC<ShowlistProps> = ({
  items,
  onOpen,
  setEditItem,
  onOpenPopupDelete,
}) => {
  const [Focused, setFocused] = useState(false);
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด");

  // นับจำนวนแต่ละ category จาก items
  const categoryCounts: Record<string, number> = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // เอา category จาก items ที่ไม่ซ้ำกับ defaultCategories และเรียงจากมากไปน้อย
  const extraCategories: string[] = Object.keys(categoryCounts).sort(
    (a, b) => categoryCounts[b] - categoryCounts[a]
  );

  // รวมทั้งหมด พร้อมปุ่ม "ทั้งหมด" ด้านหน้า
  const categoryList = ["ทั้งหมด", ...extraCategories];

  // Filter data ตาม search + category
  const filteredData = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.number.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "ทั้งหมด" || item.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm bg-white";
  const bgborder = theme === "dark" ? "bg-gray-800" : "bg-gray-50";

  return (
    <div className={`border rounded-lg h-175 ${bg}`}>
      <div className="grid grid-cols-9 items-center gap-5 p-3">
        {/* Category buttons */}
        <div className="col-span-6 grid grid-cols-6 gap-2">
          {categoryList.slice(0, 6).map((e, i) => (
            <p
              key={i}
              onClick={() => setSelectedCategory(e)}
              className={`relative overflow-hidden truncate text-center cursor-pointer rounded-md px-4 py-1 text-white text-sm shadow-md transition-all duration-300
          [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)]
          active:-translate-y-1 active:scale-x-90 active:scale-y-110
          ${selectedCategory === e ? "bg-yellow-500" : "bg-blue-500"}`}
            >
              {e}
            </p>
          ))}
        </div>

        {/* Search bar */}
        <div className="col-span-3 flex items-center justify-end">
          <div className="relative w-full">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="ค้นหา..."
              className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 w-full
          ${
            theme === "dark"
              ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-600"
              : "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-300"
          }
          ${Focused ? "w-72" : "w-60"}`}
            />
          </div>
        </div>
      </div>

      {/* header */}
      <div className="border">
        <div className="grid grid-cols-9 font-semibold pl-5 text-sm py-1 m-2 ">
          {["ชื่ออุปกรณ์", "หมวดหมู่", "คงคลัง", "อัปเดตล่าสุด", "รายการ"].map(
            (e, i) => (
              <div
                key={i}
                className={`${
                  i === 0 || i === 1 ? "col-span-2" : "col-span-1"
                } ${i === 4 ? "text-center col-span-2 " : ""} ${
                  i === 3 ? "col-span-2  text-center" : ""
                }`}
              >
                <p>{e}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* list */}
      <div className="overflow-auto h-145 scrollbar-hide">
        {filteredData.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: "easeOut",
            }}
            className={`grid grid-cols-9 pl-5 text-sm py-4 m-2 border rounded-lg items-center ${bgborder}`}
          >
            <p className="col-span-2">{e.name}</p>
            <p className="col-span-2">{e.category}</p>
            <p className="text-sm">
              {e.counting?.value ?? 0}
              {e.counting?.value < 10 && (
                <span className="ml-2 text-red-500 font-semibold">
                  (ใกล้หมด)
                </span>
              )}
            </p>

            <p className="col-span-2 text-center">
              {e.counting?.timestamp
                ? new Date(e.counting.timestamp).toLocaleString("th-TH")
                : new Date(e.createdAt).toLocaleString("th-TH")}
            </p>
            <div className="mx-auto flex gap-1 col-span-2">
              <button
                onClick={() => {
                  setEditItem(e); // บอกเลยว่าต้องลบชิ้นนี้
                  onOpenPopupDelete();
                }}
                className="relative overflow-hidden cursor-pointer w-fit rounded-md bg-red-500 px-3 py-1 text-white text-sm shadow-md transition-all duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             hover:bg-red-600 active:-translate-y-1 active:scale-x-90 active:scale-y-110"
              >
                ลบ
              </button>
              <button
                onClick={() => onOpen(e)} // ส่ง item ปัจจุบันกลับไป parent
                className={`relative overflow-hidden cursor-pointer rounded-md px-2 py-1 text-white text-sm shadow-md transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
                  theme === "dark"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-blue-600 hover:bg-blue-600"
                }`}
              >
                เพิ่มจํานวน
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

type ButtonaddItemType = {
  onOpen: () => void;
};

const ButtonaddItem: React.FC<ButtonaddItemType> = ({ onOpen }) => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm bg-white";

  return (
    <div className={`h-fit border p-5 rounded-lg ${bg}`}>
      <p
        className={`  ${
          theme === "dark" ? "text-yellow-500" : "text-blue-500"
        } text-lg font-semibold`}
      >
        เพิ่มวัสดุใหม่
      </p>
      <button
        onClick={onOpen}
        className={`relative overflow-hidden w-full cursor-pointer rounded-md  px-3 py-1 text-white text-sm shadow-md transition-all duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
              active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
                theme === "dark"
                  ? "bg-yellow-500 hover:bg-amber-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
      >
        เพิ่มอุปกรณ์
      </button>
    </div>
  );
};
type ShowaletProgressProps = {
  onClose: () => void;
  fetchItems: () => void;
};

const ShowaletProgress: React.FC<ShowaletProgressProps> = ({
  onClose,
  fetchItems,
}) => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm bg-white";

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    number: "",
    counting: "",
  });

  const handleSubmit = async () => {
    try {
      // สร้าง object ใหม่สำหรับส่ง
      const dataToSend = {
        ...formData,
        counting: {
          value: Number(formData.number), // จำนวนจริง
          timestamp: new Date().toISOString(), // วันที่-เวลา
        },
      };

      await fetch("http://localhost:5000/api/item/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      fetchItems(); // อัปเดต list ทันที
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const bgborder = theme === "dark" ? "bg-gray-800" : "bg-gray-50";
  const texthead = theme === "dark" ? "text-yellow-500" : "text-blue-500";

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className={`w-220 h-88 rounded-2xl p-8 border ${bg}`}>
        <p
          className={`text-2xl font-bold mb-6 border-b pb-3 ${
            theme === "dark" ? "text-yellow-500" : "text-blue-500"
          }`}
        >
          เพิ่มวัสดุ{" "}
          <span
            className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}
          >
            ใหม่
          </span>
        </p>

        <div className="grid grid-cols-2 gap-5">
          {["ชื่ออุปกรณ์", "หมวดหมู่", "จำนวน/คงเหลือ"].map((e, i) => (
            <div key={i} className={`${i === 2 ? "col-span-2" : ""}`}>
              <p className={`mb-1 ${texthead}`}>{e}</p>
              <input
                type={i === 2 ? "number" : "text"}
                value={
                  i === 0
                    ? formData.name
                    : i === 1
                    ? formData.category
                    : formData.number
                }
                onChange={(ev) => {
                  const value = ev.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name: i === 0 ? value : prev.name,
                    category: i === 1 ? value : prev.category,
                    number: i === 2 ? value : prev.number,
                  }));
                }}
                className={`border focus:ring-2 outline-none duration-300 w-full p-2 rounded-lg ${bgborder} ${
                  theme === "dark"
                    ? "text-white border-gray-600 focus:ring-yellow-400"
                    : "text-gray-800 focus:ring-blue-400"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 border-t pt-4 mt-4">
          <button
            onClick={handleClose}
            className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
          >
            <span className="relative z-10">ยกเลิก</span>
            <span className="absolute inset-0 overflow-hidden pointer-events-none">
              <span className="absolute left-0 top-0 w-0 h-full bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
            </span>
          </button>

          <button
            onClick={handleSubmit}
            className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4  text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${
              theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
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
  );
};

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

type ShowProgressProps = {
  items: ItemType[];
};

const ShowProgress: React.FC<ShowProgressProps> = ({ items }) => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm bg-white";
  const texthead = theme === "dark" ? "text-yellow-500" : "text-blue-500";

  // นับจำนวนแต่ละหมวดหมู่
  const categoryCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const colors = [
    "#3B82F6",
    "#FACC15",
    "#EF4444",
    "#10B981",
    "#8B5CF6",
    "#F97316",
    "#06B6D4",
    "#EC4899",
    "#84CC16",
    "#6366F1",
    "#D946EF",
    "#F43F5E",
    "#0EA5E9",
    "#22D3EE",
    "#14B8A6",
    "#F59E0B",
    "#EAB308",
    "#8B5CF6",
    "#DB2777",
    "#F87171",
  ];

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { percent, index } = props;

    const pct = (percent as number) || 0; // cast เป็น number เผื่อ undefined

    // สมมติคุณมี array data อยู่ด้านบน
    const itemName = data[index].name;

    return `${itemName} ${(pct * 100).toFixed(0)}%`;
  };
  return (
    <div className={`border rounded-lg p-4 ${bg}`}>
      <p className={`text-lg font-semibold ${texthead}`}>ภาพรวมสัดส่วนสต็อก</p>
      <div className="my-2 text-sm">หมวดหมู่</div>

      <div className="flex h-121 justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value} ชิ้น`, "จำนวน"]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

type AddItemProps = {
  item: ItemType;
  onClose: () => void;
  fetchItems: () => void;
};

const AddItem: React.FC<AddItemProps> = ({ onClose, item, fetchItems }) => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm bg-white";
  const bgborder = theme === "dark" ? "bg-gray-800" : "bg-gray-50";
  const texthead = theme === "dark" ? "text-yellow-500" : "text-blue-500";

  // ถ้ามี item ให้ prefill, ถ้าไม่มีก็เป็น empty
  const [formData, setFormData] = useState({
    code: item?.number || "",
    name: item?.name || "",
    category: item?.category || "",
    number: item?.number || "",
    counting: item?.counting || "",
  });

  const handleSubmit = async () => {
    try {
      if (item) {
        // ถ้า item มีค่า → update
        await fetch(`http://localhost:5000/api/item/update-item/${item._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // ถ้าไม่มี item → add ใหม่
        await fetch("http://localhost:5000/api/item/add-item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      fetchItems(); // อัปเดต list
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const [animtion, setanimtion] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setanimtion(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setanimtion(false);
    setTimeout(onClose, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 duration-300 backdrop-blur-sm ${
        animtion ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className={`w-220 h-88 rounded-2xl p-8 border ${bg}`}>
        <p className={`text-2xl font-bold mb-6 border-b pb-3 ${texthead}`}>
          {item ? "แก้ไขวัสดุ" : "เพิ่มวัสดุใหม่"}
        </p>

        <div className="grid grid-cols-2 gap-5">
          {["ชื่ออุปกรณ์", "หมวดหมู่", "จำนวน/คงเหลือ"].map((e, i) => (
            <div key={i} className={`${i === 2 ? "col-span-2" : ""}`}>
              <p className={`mb-1 ${texthead}`}>{e}</p>
              <input
                type="text"
                value={
                  i === 0
                    ? formData.name
                    : i === 1
                    ? formData.category
                    : formData.number
                }
                onChange={(ev) => {
                  const value = ev.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name: i === 0 ? value : prev.name,
                    category: i === 1 ? value : prev.category,
                    number: i === 2 ? value : prev.number,
                  }));
                }}
                className={`border focus:ring-2 outline-none duration-300 w-full p-2 rounded-lg ${bgborder} ${
                  theme === "dark"
                    ? "text-white border-gray-600 focus:ring-yellow-400"
                    : "text-gray-800 focus:ring-blue-400"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 border-t pt-4 mt-4">
          <button
            onClick={handleClose}
            className="group relative py-1  overflow-hidden rounded-lg cursor-pointer border bg-white px-4  text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
          >
            <span className="relative z-10">ยกเลิก</span>
            <span className="absolute inset-0 overflow-hidden  pointer-events-none">
              <span className="absolute left-0 top-0 w-0 h-full bg-gray-200  transition-all duration-500 group-hover:w-full"></span>
            </span>
          </button>
          <button
            onClick={handleSubmit}
            className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4  text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${
              theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
            }`}
          >
            <span className="relative z-10">
              {" "}
              {item ? "บันทึกการแก้ไข" : "เพิ่มวัสดุ"}
            </span>
            <span className="absolute inset-0 overflow-hidden  pointer-events-none">
              <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20  transition-all duration-500 group-hover:w-full"></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

type ShowPopupDeteleProps = {
  onClose: () => void;
  fetchItems: () => void;
  item: ItemType;
};

const ShowPopupDetele: React.FC<ShowPopupDeteleProps> = ({
  onClose,
  fetchItems,
  item,
}) => {
  const { theme } = useTheme();
  const [animtion, setAnimtion] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimtion(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseShowPopupDetele = () => {
    setAnimtion(false);
    setTimeout(onClose, 500);
  };

  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm bg-white";

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/item/delete-item/${item._id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      fetchItems();
      handleCloseShowPopupDetele();
    } catch {
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  return (
    <div
      className={`fixed z-50 inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
        animtion ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`w-120 rounded-2xl shadow-2xl p-5 ${bg} ${
          animtion ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <p
          className={`font-semibold mb-4 text-lg ${
            theme === "dark" ? "text-yellow-500" : "text-blue-500"
          }`}
        >
          ลบอุปกรณ์{" "}
          <span
            className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}
          >
            {item.name}
          </span>
        </p>

        <div
          className={`p-3 rounded-lg text-sm ${
            theme === "dark"
              ? "bg-red-900/30 text-red-300"
              : "bg-red-100 text-red-600"
          }`}
        >
          การลบภาวะนี้จะทำให้ข้อมูลหายไปทันที และไม่สามารถกู้คืนได้
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleCloseShowPopupDetele}
            className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
          >
            <span className="relative z-10">ยกเลิก</span>
            <span className="absolute inset-0 overflow-hidden pointer-events-none">
              <span className="absolute left-0 top-0 w-0 h-full bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
            </span>
          </button>
          <button
            onClick={handleDelete}
            className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-red-500 text-white px-4 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
          >
            <span className="relative z-10">ลบ</span>
            <span className="absolute inset-0 overflow-hidden pointer-events-none">
              <span className="absolute left-0 top-0 w-0 h-full bg-red-600 transition-all duration-500 group-hover:w-full"></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SuppliesAdmin() {
  const [fade, setFade] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);
  const [showaddItem, setshowaddItem] = useState(false);
  const [editItem, setEditItem] = useState<ItemType | null>(null);
  const [showpopupdatele, setshowpopupdatele] = useState(false);

  const { theme } = useTheme();

  const fetchItems = () => {
    fetch("http://localhost:5000/api/item/all-items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const item = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(item);
  }, []);

  return (
    <div
      className={`max-w-380 p-5 container mx-auto duration-300 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div>
        <p
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-yellow-500" : "text-blue-500"
          }`}
        >
          คลังวัสดุและ{" "}
          <span
            className={` ${
              theme === "dark" ? "text-white" : "text-yellow-500"
            }`}
          >
            อุปกรณ์
          </span>
        </p>
        <p>ภาพรวมสัดส่วนสต็อก</p>
      </div>
      {/* ส่ง items */}
      <AddItemForm items={items} />
      <div className="my-5 grid gap-5 grid-cols-6">
        <div className="col-span-4">
          <Showlist
            items={items}
            onOpen={(item: ItemType) => {
              setEditItem(item);
              setshowaddItem(true);
            }}
            onOpenPopupDelete={() => setshowpopupdatele(true)} // ← แก้จาก Datele → Delete
            fetchItems={fetchItems}
            setEditItem={setEditItem} // ⭐ ต้องใส่นี่!!!!
          />
        </div>

        <div className="col-span-2">
          <ButtonaddItem onOpen={() => setShowModal(true)} />
          <div className="mt-5">
            <ShowProgress items={items} />
          </div>
        </div>
      </div>
      {/* เปิดเพิ่มอุปกรณ์ */}
      {showModal && (
        <ShowaletProgress
          onClose={() => setShowModal(false)}
          fetchItems={fetchItems}
        />
      )}
      {/* //เปิดเเก้ไขจํานวน */}
      {showaddItem && editItem && (
        <AddItem
          item={editItem}
          onClose={() => {
            setshowaddItem(false);
            setEditItem(null);
          }}
          fetchItems={fetchItems}
        />
      )}

      {/* เตือนก่อนลบ */}
      {showpopupdatele && editItem && (
        <ShowPopupDetele
          onClose={() => setshowpopupdatele(false)}
          fetchItems={fetchItems}
          item={editItem} // ต้องส่ง item ที่จะลบ
        />
      )}
    </div>
  );
}

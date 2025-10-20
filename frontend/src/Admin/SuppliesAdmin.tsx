import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Search } from "lucide-react";

export default function SuppliesAdmin() {
  const { theme } = useTheme();

  // ✅ เก็บข้อมูลวัสดุใน state
  const [materials, setMaterials] = useState([
    { name: "สกรู", qty: 0, used: 0, left: 0 },
    { name: "ตะปู", qty: 0, used: 0, left: 0 },
    { name: "ปูนซีเมนต์", qty: 0, used: 0, left: 0 },
    { name: "ท่อ PVC", qty: 0, used: 0, left: 0 },
    { name: "สายไฟ", qty: 0, used: 0, left: 0 },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [newQty, setNewQty] = useState<number>(0); // ✅ เก็บค่าที่แก้ไขใหม่

  // 🎨 Theme style
  const bg = theme === "dark" ? "bg-yellow-500" : "bg-blue-500";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-900/70" : "bg-white";
  const titleColor = theme === "dark" ? "text-yellow-500" : "text-blue-600";
  const bgdrop = theme === "dark" ? "bg-gray-800 border-white/20" : "bg-gray-100 border-gray-300";

  // 🔹 เปิด popup พร้อมชื่อวัสดุ
  const openPopup = (name: string, currentQty: number) => {
    setSelectedItem(name);
    setNewQty(currentQty);
    setShowPopup(true);
  };

  // 🔹 กดบันทึกเพื่ออัปเดตจำนวนวัสดุ
  const handleSave = () => {
    setMaterials((prev) =>
      prev.map((item) =>
        item.name === selectedItem ? { ...item, qty: newQty } : item
      )
    );
    setShowPopup(false);
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl">
      <p className={`text-5xl font-bold mb-4 ${titleColor}`}>วัสดุอุปกรณ์</p>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-end sm:items-center gap-3 p-2">
        <div className="flex items-center w-full sm:w-auto gap-2">
          <button className={`p-2 rounded-2xl transition border ${bg} text-white hover:opacity-80`}>
            <Search size={20} />
          </button>
          <input
            type="text"
            className={`border rounded-2xl w-full sm:w-56 p-2 ${text} ${bgdrop}`}
            placeholder="ค้นหาวัสดุอุปกรณ์"
          />
        </div>

        <select className={`border rounded-2xl w-full sm:w-52 p-2 ${bgdrop} ${text}`}>
          <option value="all">ทั้งหมด</option>
          <option value="wood">งานไม้</option>
          <option value="electric">งานไฟฟ้า</option>
          <option value="plumbing">งานประปา</option>
          <option value="paint">งานทาสี</option>
        </select>
      </div>

      {/* 📋 ตารางวัสดุ */}
      <div
        className={`overflow-x-auto mt-5 rounded-2xl border ${
          theme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <table className={`min-w-full text-left border-collapse ${text}`}>
          <thead>
            <tr className={`${bg} text-white`}>
              <th className="py-2 px-4 border-b">ชื่อวัสดุ</th>
              <th className="py-2 px-4 border-b">จำนวน</th>
              <th className="py-2 px-4 border-b">ใช้ไป</th>
              <th className="py-2 px-4 border-b">คงเหลือ</th>
              <th className="py-2 px-4 border-b text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className={`${cardBg}`}>
            {materials.map((item, index) => (
              <tr
                key={index}
                className={`transition duration-200 ${
                  theme === "dark"
                    ? "hover:bg-gray-700 bg-gray-900/50"
                    : "hover:bg-gray-200 bg-white"
                }`}
              >
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.qty}</td>
                <td className="py-2 px-4 border-b">{item.used}</td>
                <td className="py-2 px-4 border-b">{item.left}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className={`h-9 px-4 rounded-2xl font-medium transition transform hover:scale-105 ${
                      theme === "dark"
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => openPopup(item.name, item.qty)}
                  >
                    แก้ไข
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🪟 Popup */}
      {showPopup && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowPopup(false)}
          ></div>

          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-80 text-center">
            <h2
              className={`text-xl font-bold mb-3 ${
                theme === "dark" ? "text-yellow-400" : "text-blue-600"
              }`}
            >
              แก้ไขข้อมูลวัสดุ
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-5">
              คุณกำลังแก้ไข: <b>{selectedItem}</b>
            </p>

            <input
              type="number"
              value={newQty}
              onChange={(e) => setNewQty(Number(e.target.value))}
              className="w-full mb-4 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />

            <div className="flex justify-center gap-3">
              <button
                className={`px-4 py-2 rounded-lg font-medium ${
                  theme === "dark"
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                onClick={handleSave}
              >
                บันทึก
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white"
                onClick={() => setShowPopup(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

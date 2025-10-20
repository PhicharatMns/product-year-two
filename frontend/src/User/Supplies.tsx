import { useTheme } from "@/components/theme-provider";
import { Search } from "lucide-react";

export default function Supplies() {
  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-yellow-500" : "bg-blue-500";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-900/70" : "bg-white";
  const titleColor = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const bgdrop = theme === "dark" ? "bg-gray-800 border-white/20" : "bg-gray-100 border-gray-300";

  return (
    <div className={`p-4 sm:p-6  rounded-2xl `}>
      <p className={`text-5xl font-bold mb-4 ${titleColor}`}>วัสดุอุปกรณ์ <span className={`${theme === 'dark' ?'text-white' : 'text-yellow-500'}`} >ช่าง</span></p>

      <div className="flex flex-col sm:flex-row justify-end sm:items-center gap-3 p-2">
        <div className="flex items-center w-full sm:w-auto gap-2">
          <input
            type="text"
            className={`border rounded-2xl w-full sm:w-56 p-2 ${text} ${bgdrop}`}
            placeholder="ค้นหาวัสดุอุปกรณ์"
          />
        </div>

        <select
          className={`border rounded-2xl w-full sm:w-52 p-2 ${bgdrop} ${text}`}
        >
          <option value="all">ทั้งหมด</option>
          <option value="wood">งานไม้</option>
          <option value="electric">งานไฟฟ้า</option>
          <option value="plumbing">งานประปา</option>
          <option value="paint">งานทาสี</option>
        </select>
      </div>


      <div className="overflow-x-auto mt-5 rounded-2xl border-gray-300">
        <table className={`min-w-full text-left border-collapse ${text}`}>
          <thead >
            <tr className={`${bg} text-white ${text}`}>
              <th className="py-2 px-4 border-b">ชื่อวัสดุ</th>
              <th className="py-2 px-4 border-b">จำนวน</th>
              <th className="py-2 px-4 border-b">ใช้ไป</th>
              <th className="py-2 px-4 border-b">คงเหลือ</th>
            </tr>
          </thead>
          <tbody className={`${cardBg}`}>
            {[
              { name: "สกรู", qty: 0, used: 0, left: 0 },
              { name: "ตะปู", qty: 0, used: 0, left: 0 },
              { name: "ปูนซีเมนต์", qty: 0, used: 0, left: 0 },
              { name: "ท่อ PVC", qty: 0, used: 0, left: 0 },
              { name: "สายไฟ", qty: 0, used: 0, left: 0 },

            ].map((item, index) => (
              <tr
                key={index}
                className={`transition duration-200 ${theme === "dark"
                  ? "hover:bg-gray-700 bg-gray-900/50"
                  : "hover:bg-gray-200 bg-white"
                  }`}
              >
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.qty}</td>
                <td className="py-2 px-4 border-b">{item.used}</td>
                <td className="py-2 px-4 border-b">{item.left}</td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

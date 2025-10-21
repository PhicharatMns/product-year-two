import { Search, MoreVertical } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import type { Link } from "react-router-dom";
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastActive: string;
  dateAdded: string;
}

const users: User[] = [
  {
    id: 1,
    name: "สร้างสะพานข้างถนน",
    email: "nobody@gmail.com",
    phone: "081-111-1111",
    lastActive: "SEP 01, 2024",
    dateAdded: "NOV 01, 2025",
  },
  {
    id: 2,
    name: "สร้างหมู่บ้านจัดสรร",
    email: "nobody@gmail.com",
    phone: "081-222-2222",
    lastActive: "SEP 01, 2024",
    dateAdded: "NOV 01, 2025",
  },
  {
    id: 3,
    name: "โครงการรักบ้านรักโลก",
    email: "nobody@gmail.com",
    phone: "081-333-3333",
    lastActive: "SEP 01, 2024",
    dateAdded: "NOV 01, 2025",
  },
  {
    id: 4,
    name: "ทำถนนทางหลวง",
    email: "nobody@gmail.com",
    phone: "081-444-4444",
    lastActive: "SEP 01, 2024",
    dateAdded: "NOV 01, 2025",
  },
];

export default function GetPaper() {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-900/70" : "bg-white";
  const borderSoft = theme === "dark" ? "border-gray-800" : "border-gray-300  ";
  const titleColor = theme === "dark" ? "text-yellow-400" : "text-blue-600";
  const accentColor = theme === "dark" ? "text-yellow-300" : "text-blue-500";
  const bgborder = theme === "dark" ? "bg-yellow-500" : "bg-blue-600 ";
  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-3xl font-bold ${Text} `}>
          Profile users
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className={`pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400  ${text}`}
            />
          </div>
        </div>
      </div>


      <div className="shadow-sm rounded-lg overflow-hidden border ">
        <table className="w-full text-sm">
          <thead>
            <tr className={`text-left text-white ${bgborder}`}>
              <th className="py-3 px-4 font-medium">ชื่องาน</th>
              <th className="py-3 px-4 font-medium">อีเมลผู้จ้าง</th>
              <th className="py-3 px-4 font-medium">เบอร์โทรติดต่อ</th>
              <th className="py-3 px-4 font-medium">วันที่เพิ่ม</th>
              <th className="py-3 px-4 font-mediumr">เพิ่มเติม</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-b last:border-none ${borderSoft} ${bg} transition`}
              >
                <td className="py-3 px-4">
                  <p className={`font-medium ${text}`}>{user.name}</p>
                </td>
                <td className="py-3 px-4">
                  {user.email}
                </td>

                <td className={`py-3 px-4  ${text}`}>{user.lastActive}</td>
                <td className={`py-3 px-4 ${text}`}>{user.dateAdded}</td>
                <td className="py-3 px-4 text-center">
                  <a href="Detailwork" target="_blank" rel="noopener noreferrer">
                    <button
                      className={`h-9 w-24 rounded-xl font-semibold tracking-wide shadow-md transition-all duration-300 ease-in-out 
      ${theme === "dark"
                          ? "bg-yellow-500 hover:bg-yellow-400 text-black hover:shadow-yellow-500/40"
                          : "bg-blue-500 hover:bg-blue-400 text-white hover:shadow-blue-400/40"
                        } 
      active:scale-95
    `}
                    >
                      รายละเอียด
                    </button>
                  </a>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

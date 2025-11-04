import { Search } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

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
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const bg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const borderSoft = theme === "dark" ? "border-gray-800" : "border-gray-300";
  const bgborder = theme === "dark" ? "bg-yellow-500" : "bg-blue-600";

  return (
    <div
      className={`transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-max-380 p-5 mx-auto container ">
        {/* Header */}

        <div className="flex items-center justify-between mb-5">
          <p
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-yellow-500" : "text-blue-500"
            }`}
          >
            ใบ
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-yellow-500"
              }`}
            >
              งาน
            </span>
          </p>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className={`pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 `}
              />
            </div>
          </div>
        </div>

        <div className="shadow-sm rounded-lg overflow-hidden border">
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left text-white ${bgborder}`}>
                <th className="py-3 px-4 font-medium">ชื่องาน</th>
                <th className="py-3 px-4 font-medium">อีเมลผู้จ้าง</th>
                <th className="py-3 px-4 font-medium">เบอร์โทรติดต่อ</th>
                <th className="py-3 px-4 font-medium">วันที่เพิ่ม</th>
                <th className="py-3 px-4 font-medium pl-9">เพิ่มเติม</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b last:border-none ${borderSoft} ${bg} transition`}
                >
                  <td className="py-3 px-4">
                    <p className={`font-medium `}>{user.name}</p>
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className={`py-3 px-4 `}>{user.lastActive}</td>
                  <td className={`py-3 px-4 `}>{user.dateAdded}</td>
                  <td className="py-3 px-4">
                    <a
                      href="Detailwork"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        className={` relative overflow-hidden rounded-md px-3 py-0.5 font-semibold tracking-wide shadow-md transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-yellow-500 hover:bg-yellow-400 text-white"
                            : "bg-blue-500 hover:bg-blue-400 text-white"
                        }
                           [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)]
                           active:-translate-y-1 active:scale-x-90 active:scale-y-110`}
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
    </div>
  );
}

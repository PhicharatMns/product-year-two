import { Search, MoreVertical, Plus } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  access: string[];
  lastActive: string;
  dateAdded: string;
}

const users: User[] = [
  {
    id: 1,
    name: "นาย สมชาย ใจดี",
    email: "nobody@gmail.com",
    avatar: "https://png.pngtree.com/png-vector/20250709/ourlarge/pngtree-mechanic-isolated-on-transparent-background-png-image_16620520.webp",
    access: ["ช่างไฟ"],
    lastActive: "SEP 01, 2024",
    dateAdded: "NOV 01, 2025",
  },
  {
    id: 2,
    name: "นาย สมศรี ดีใจ",
    email: "nobody@gmail.com",
    avatar: "https://png.pngtree.com/png-vector/20250615/ourlarge/pngtree-electrician-isolated-on-transparent-background-png-image_16539103.png",
    access: ["ช่างไม้"],
    lastActive: "SEP 01, 2024",
    dateAdded: "NOV 01, 2025",
  },
  {
    id: 3,
    name: "นาย สมปอง มีสุข",
    email: "nobody@gmail.com",
    avatar: "https://png.pngtree.com/png-vector/20250610/ourlarge/pngtree-electrician-isolated-on-transparent-background-png-image_16509817.png",
    access: ["ช่างประปา"],
    lastActive: "SEP 01, 2024",
    dateAdded: "NOV 01, 2025",
  },
  {
    id: 4,
    name: "นาย สมบูรณ์ แฮปปี้",
    email: "nobody@gmail.com",
    avatar: "https://png.pngtree.com/png-vector/20250624/ourlarge/pngtree-electrician-isolated-on-transparent-background-png-image_16585440.png",
    access: ["ช่างปูน"],
    lastActive: "SEP 01, 2024",
    dateAdded: "NOV 01, 2025",
  },
];

export default function UserList() {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-700  " : "bg-gray-100";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-900/70" : "bg-white";
  const borderSoft = theme === "dark" ? "border-gray-800" : "border-gray-300  ";
  const titleColor = theme === "dark" ? "text-yellow-400" : "text-blue-600";
  const accentColor = theme === "dark" ? "text-yellow-300" : "text-blue-500";
  const bgborder = theme === "dark" ? "bg-yellow-500" : "bg-blue-600 ";
  return (
    <div className="p-6  min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-3xl font-bold ${Text} `}>
          Profile users
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className={`pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400  ${text}`}
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={16} />
            Add user
          </button>
        </div>
      </div>

      {/* ส่วนหัว */}
      <div className=" shadow-sm rounded-lg overflow-hidden    ">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b  text-left text-white bg-blue-500 ${bgborder}`}>
              <th className="py-3 px-4 font-medium">ชื่อช่าง</th>
              <th className="py-3 px-4 font-medium">ตำแหน่ง</th>
              <th className="py-3 px-4 font-medium">วันที่เริ่ม</th>
              <th className="py-3 px-4 font-medium">สิ้นสุดงาน</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody >
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-b last:border-none  transition ${borderSoft}  ${bg}`}
              >
                <td className="py-3 px-2 flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className={`font-medium ${text}`}>{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex gap-2 flex-wrap">
                    {user.access.map((role, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          role === "Admin"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-600 text-white"
                            
                        }`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </td>

                <td className={`py-3 px-4  ${text}`}>{user.lastActive}</td>
                <td className={`py-3 px-4 ${text}`}>{user.dateAdded}</td>

                <td className="py-3 px-4 text-right">
                  <MoreVertical className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

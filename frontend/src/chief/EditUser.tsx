import { useTheme } from "@/components/theme-provider";

export default function EditUser() {
  const { theme } = useTheme();
  

  const users = [
    { name: "สมชาย ใจเย็น", email: "User@email.com", avatar: "" },
    { name: "สมศรี ใจดี", email: "User@email.com", avatar: "" },
    { name: "สายฝน สุขใจ", email: "User@email.com", avatar: "" },
    { name: "มานพ ใจตรง", email: "User@email.com", avatar: "" },
    { name: "สุขใจ มีสุข", email: "User@email.com", avatar: "" },
  ];

  return (
    <div className="max-w-380 mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex gap-2">
        <span className="text-blue-600">ทีมงาน</span><span className="text-yellow-400">ช่าง</span>
      </h2>

      <div className="overflow-hidden rounded-xl shadow-md border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-50 text-blue-700 font-semibold">
              <th className="p-4">ชื่อ-นามสกุล</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-right">จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 flex items-center gap-3">
                  <img src={u.avatar} className="w-10 h-10 rounded-full shadow" />
                  <span className="font-medium">{u.name}</span>
                </td>

                <td className="p-4 text-gray-700">{u.email}</td>

                <td className="p-4 flex justify-end gap-3">
                  <button  className={`relative overflow-hidden cursor-pointer rounded-md px-2 py-1 text-white text-sm shadow-md transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
                          theme === "dark"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      > รายละเอียด
                  </button>
                  <button  className={`relative overflow-hidden cursor-pointer rounded-md px-2 py-1 text-white text-sm shadow-md transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
                          theme === "dark"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >  ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

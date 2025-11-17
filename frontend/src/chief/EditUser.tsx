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
        <span className="text-blue-600">จัดการ</span>
        <span className="text-yellow-400">บัญชี</span>
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
                  <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition">
                    รายละเอียด
                  </button>
                  <button className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition">
                    ลบ
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

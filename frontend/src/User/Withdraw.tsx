import { useTheme } from "@/components/theme-provider";
export default function Withdraw() {
      const { theme } = useTheme();
      const bg = theme === "dark" ? "bg-gray-800" : "bg-gray-100";
      const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
      const cardBg = theme === "dark" ? "bg-gray-900/80" : "bg-white";
      const borderSoft = theme === "dark" ? "border-gray-700" : "border-gray-300";
      const titleColor = theme === "dark" ? "text-yellow-400" : "text-blue-600";
  return (
    <div className="max-w-380 mx-auto p-6  rounded-2xl  ">
      {/* หัวข้อใหญ่ */}
      <p className={`text-3xl font-extrabold   mb-8 ${titleColor}`} >
        เบิกของ
      </p>

      {/* ปุ่มวันที่ / เวลา */}
      <div className="flex justify-start mb-6">
        <p className="border border-gray-300 rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 shadow-sm transition">
          วันที่ / เวลา
        </p>
      </div>

      {/* ตารางแนวนอน */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border-4 border-gray-500 rounded-lg overflow-hidden shadow-sm">
          <thead className="">
            <tr>
              <th className="border-b border-r border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-900">
                รายการ
              </th>
              <th className="border-b border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-900">
                จำนวนเงิน
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr
                key={i}
                className="even:bg-gray-50 hover:bg-gray-100 transition"
              >
                <td className="border-b border-r border-gray-300 px-6 py-4">
                  <input
                    type="text"
                    placeholder={`รายการ ${i + 1}`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </td>
                <td className="border-b border-gray-300 px-6 py-4">
                  <input
                    type="number"
                    
                    placeholder="จำนวนของ"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 font-medium  focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ข้อความ */}
      <div className="mb-2 font-medium text-gray-800">
        ข้อความ : <span className="text-red-600">*</span>
      </div>
      <textarea
        className="border border-gray-300 w-full h-32 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        placeholder="พิมพ์ข้อความ..."
      ></textarea>

      {/* ปุ่มส่งข้อความ */}
      <div className="flex justify-start mt-6">
        <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition">
          ส่งข้อความ
        </button>
      </div>
    </div>
  );
}

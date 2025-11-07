import { useTheme } from "@/components/theme-provider";
import { SiHellofresh } from "react-icons/si";

export default function Followtheprogress() {
  const data = [
    { name: "สะพานลอย", status: "กำลังดำเนิน", start: "01/02/2024", end: "01/02/2025" },
    { name: "ไฟรั่ว", status: "กำลังดำเนิน", start: "02/02/2024", end: "02/02/2025" },
    { name: "ท่อแตก", status: "ยังไม่ดำเนินการ", start: "03/01/2024", end: "03/01/2025" },
    { name: "สายไฟขาด", status: "ยังไม่ดำเนินการ", start: "04/05/2024", end: "04/05/2025" },
    { name: "กระเบื้องชำรุด", status: "รับพัสดุแล้ว", start: "07/06/2024", end: "03/05/2025" },
    { name: "หลอดไฟเสีย", status: "รอรับพัสดุ", start: "05/06/2024", end: "04/02/2025" },
  ];

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
        ติดตามความคืบหน้า
      </h1>

      <div
        className={`overflow-x-auto rounded-2xl shadow-lg ${
          isDark ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <table className="w-full text-left border-collapse">
          <thead className={`${isDark ? "bg-gray-700" : "bg-blue-100"}`}>
            <tr>
              {["ชื่องาน", "สถานะ", "วันที่รับ", "วันที่ต้องปิดงาน", "รายละเอียด"].map(
                (header, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-gray-800 text-lg font-semibold border-b border-gray-300 text-center"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => {
              // สีสถานะ
              let statusColor = "";
              switch (item.status) {
                case "กำลังดำเนิน":
                  statusColor = "bg-yellow-500 hover:bg-yellow-600";
                  break;
                case "ยังไม่ดำเนินการ":
                  statusColor = "bg-red-500 hover:bg-red-600";
                  break;
                case "รับพัสดุแล้ว":
                  statusColor = "bg-green-500 hover:bg-green-600";
                  break;
                case "รอรับพัสดุ":
                  statusColor = "bg-orange-500 hover:bg-orange-600";
                  break;
                default:
                  statusColor = "bg-gray-500 hover:bg-gray-600";
              }

              return (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? isDark
                        ? "bg-gray-900"
                        : "bg-white"
                      : isDark
                      ? "bg-gray-800"
                      : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="px-6 py-3 text-lg border-b border-gray-200 text-center">
                    {item.name}
                  </td>

                  {/* ปุ่ม */}
                  <td className="px-6 py-3 text-lg border-b border-gray-200 text-center">
                    <button
                      className={`rounded-md px-3 py-1 text-white text-sm font-medium duration-300 
                      cursor-default ${statusColor}`}
                    >
                      {item.status}
                    </button>
                  </td>

                  <td className="px-6 py-3 text-lg border-b border-gray-200 text-center">
                    {item.start}
                  </td>
                  <td className="px-6 py-3 text-lg border-b border-gray-200 text-center">
                    {item.end}
                  </td>

                  <td className="px-6 py-3 border-b border-gray-200 text-center">
                    <button
                      className={`rounded-md px-3 py-1 text-white text-sm font-medium duration-300
                      ${
                        isDark
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      รายละเอียด
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


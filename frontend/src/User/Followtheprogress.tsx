import { useTheme } from "@/components/theme-provider";
import { SiHellofresh } from "react-icons/si";

export default function Followtheprogress() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const data = [
    { name: "สะพานลอย", status: "กำลังดำเนิน", start: "01/02/2024", end: "01/02/2025", reporter: "-", contact: "-" },
    { name: "ไฟรั่ว", status: "กำลังดำเนิน", start: "02/02/2024", end: "02/02/2025", reporter: "-", contact: "-" },
    { name: "ท่อแตก", status: "ยังไม่ดำเนินการ", start: "03/01/2024", end: "03/01/2025", reporter: "-", contact: "-" },
    { name: "สายไฟขาด", status: "ยังไม่ดำเนินการ", start: "04/05/2024", end: "04/05/2025", reporter: "-", contact: "-" },
    { name: "กระเบื้องชำรุด", status: "รับพัสดุแล้ว", start: "07/06/2024", end: "03/05/2025", reporter: "-", contact: "-" },
    { name: "หลอดไฟเสีย", status: "รอรับพัสดุ", start: "05/06/2024", end: "04/02/2025", reporter: "-", contact: "-" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* ตรงหัวข้อ */}
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-4xl font-extrabold ${isDark ? "text-white" : "text-blue-700"}`}>
          ใบงาน
        </h1>

        <div className="flex items-center space-x-4">
          <button
            className={`${
              isDark
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300`}
          >
            เพิ่มช่าง
          </button>

          {/* ล็อคค้นหา */}
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหา..."
              className={`${
                isDark
                  ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-yellow-500"
                  : "bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500"
              } py-2 px-4 pl-10 rounded-lg focus:outline-none focus:ring-2 w-48 border`}
            />
            <svg
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <hr className={`mb-8 ${isDark ? "border-gray-700" : "border-gray-300"}`} />

      {/* ตาราง */}
      <div
        className={`overflow-hidden rounded-2xl shadow-2xl border ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        {/* กรอบข้างบน */}
        <div
          className={`grid grid-cols-7 gap-2 py-3 px-4 font-semibold text-center text-sm uppercase ${
            isDark ? "bg-gray-800 text-gray-300" : "bg-blue-100 text-gray-700"
          }`}
        >
          <div>ชื่องาน</div>
          <div>รายชื่อผู้แจ้ง</div>
          <div>เบอร์ติดต่อ</div>
          <div>สถานะ</div>
          <div>วันที่รับ</div>
          <div>วันที่ต้องปิดงาน</div>
          <div>จัดการ</div>
        </div>

        {/* สถานะ */}
        <div className="divide-y divide-gray-200">
          {data.map((item, index) => {
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
              <div
                key={index}
                className={`grid grid-cols-7 gap-2 items-center text-sm text-center py-3 px-4 rounded-md transition duration-300 ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-50 hover:bg-blue-50 text-gray-700"
                }`}
              >
                <div className="font-medium">{item.name}</div>
                <div>{item.reporter}</div>
                <div>{item.contact}</div>

                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-white text-xs font-medium ${statusColor}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div>{item.start}</div>
                <div>{item.end}</div>

                <div className="space-x-2">
                  <button className="rounded-md px-2 py-1 text-white text-xs font-medium bg-red-600 hover:bg-red-700">
                    ลบ
                  </button>
                  <button className="rounded-md px-2 py-1 text-white text-xs font-medium bg-yellow-500 hover:bg-yellow-600">
                    แก้ไข
                  </button>
                  <button
                    className={`rounded-md px-2 py-1 text-white text-xs font-medium ${
                      isDark
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    รายละเอียด
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

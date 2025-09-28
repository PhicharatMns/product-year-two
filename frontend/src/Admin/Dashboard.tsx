import Sidebar from "../component/sidebaradmin";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function Dashboard() {
  // ข้อมูลสำหรับกราฟ
  const pieData = [
    { name: "งานสำเร็จ", value: 45 },
    { name: "กำลังทำ", value: 30 },
    { name: "รอดำเนินการ", value: 25 },
  ];

  const barData = [
    { name: "ม.ค.", งาน: 12 },
    { name: "ก.พ.", งาน: 18 },
    { name: "มี.ค.", งาน: 9 },
    { name: "เม.ย.", งาน: 15 },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#FBBF24"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dash <span className="text-3xl font-bold text-yellow-500">Board</span></h1>
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">
              + สร้างใบงาน
            </button>
            <div className="w-10 h-10 bg-gray-300 rounded-full shadow-inner"></div>
          </div>
        </div>

        {/* สรุปการ์ด */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="งานสำเร็จ" value="120" color="bg-green-500" />
          <SummaryCard title="กำลังทำ" value="35" color="bg-blue-500" />
          <SummaryCard title="รอดำเนินการ" value="20" color="bg-yellow-500" />
          <SummaryCard title="ทั้งหมด" value="175" color="bg-purple-500" />
        </div>

        {/* กราฟ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              สถานะงาน
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                  isAnimationActive={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              จำนวนงานรายเดือน
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Legend />
                <Bar dataKey="งาน" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Summary Card */
function SummaryCard({ title, value, color }) {
  return (
    <div
      className={`${color} text-white p-6 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition duration-300`}
    >
      <h3 className="text-lg">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

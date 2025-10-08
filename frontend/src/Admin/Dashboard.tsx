import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const materialData = [
    { name: "งานไม้", quantity: 57 },
    { name: "งานไฟฟ้า", quantity: 54 },
    { name: "งานประปา", quantity: 25 },
    { name: "งานปูน", quantity: 89 },
    { name: "งานสี", quantity: 45 },
    { name: "งานกระเบื้อง", quantity: 24 },
    { name: "งานเชื่อม", quantity: 23 },
  ];

  const WorkMountData = [
    { name: "ม.ค.", quantity: 40 },
    { name: "ก.พ.", quantity: 65 },
    { name: "มี.ค.", quantity: 50 },
    { name: "เม.ย.", quantity: 70 },
    { name: "พ.ค.", quantity: 90 },
    { name: "มิ.ย.", quantity: 80 },
    { name: "ก.ค.", quantity: 110 },
    { name: "ส.ค.", quantity: 25 },
    { name: "ต.ค.", quantity: 75 },
    { name: "พ.ย.", quantity: 25 },
    { name: "ธ.ค.", quantity: 10 },
  ];

  return (
    <div className="min-h-screen  p-4 sm:p-6 md:p-10">
      <div className="max-w-full mx-auto space-y-10">
        
       
        <header>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 drop-shadow-sm">
            Dashboard ช่าง
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">
            ภาพรวมการทำงานทั้งหมดในระบบ
          </p>
        </header>

     
        <section className="">
          <div className="flex flex-col lg:flex-row gap-10">

            
            <div className="lg:w-1/3 grid grid-cols-1 gap-6">
              {[
                {
                  title: "จำนวนช่าง",
                  value: "7,850",
                  unit: "คน",
                  color: "bg-gray-700",
                },
                {
                  title: "งานทั้งหมด",
                  value: "500",
                  unit: "งาน",
                  color: "bg-blue-600",
                },
                {
                  title: "กำลังดำเนิน",
                  value: "85",
                  unit: "งาน",
                  color: "bg-yellow-500",
                },
                {
                  title: "งานที่เสร็จแล้ว",
                  value: "26",
                  unit: "งาน",
                  color: "bg-green-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${item.color} text-white p-7 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1`}
                >
                  <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                  <p className="my-5 text-6xl font-extrabold tracking-wide">
                    {item.value}{" "}
                    <span className="text-lg font-semibold align-top">
                      {item.unit}
                    </span>
                  </p>
                  <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-md">
                    รายละเอียด
                  </button>
                </div>
              ))}
            </div>

            {/* ===== กราฟ ===== */}
            <div className="lg:w-2/3 flex flex-col gap-8">
             
              <div className="bg-gray-50 rounded-3xl shadow-inner p-6">
                <h2 className="text-2xl font-extrabold text-gray-700 mb-4 text-center">
                  งานทั้งหมด
                </h2>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={materialData} barSize={35}>
                      <XAxis
                        dataKey="name"
                        stroke="#555"
                        tick={{ fontSize: 14, fill: "#555" }}
                      />
                      <YAxis stroke="#555" tick={{ fontSize: 14, fill: "#555" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "14px" }} />
                      <Bar
                        dataKey="quantity"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl shadow-inner p-6">
                <h2 className="text-2xl font-extrabold text-gray-700 mb-4 text-center">
                  จำนวนงานแต่ละเดือน
                </h2>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WorkMountData} barSize={35}>
                      <XAxis
                        dataKey="name"
                        stroke="#555"
                        tick={{ fontSize: 14, fill: "#555" }}
                      />
                      <YAxis stroke="#555" tick={{ fontSize: 14, fill: "#555" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "14px" }} />
                      <Bar
                        dataKey="quantity"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}

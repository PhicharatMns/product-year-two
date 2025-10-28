import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/components/theme-provider";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

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

  // #endregion
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    const controls = animate(count, 100, { duration: 5 });
    return () => controls.stop();
  }, []);

  const { theme } = useTheme();
  const text = theme === "dark" ? "text-yellow-500" : "text-gray-800";
  const descrtiption = theme === "dark" ? "text-white" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-700" : "bg-blue-50/40";
  const barColor1 = theme === "dark" ? "#60a5fa" : "#3b82f6";
  const barColor2 = theme === "dark" ? "#34d399" : "#10b981";
  const axisColor = theme === "dark" ? "#ddd" : "#555";
  const tooltipBg = theme === "dark" ? "#1f2937" : "white";
  const tooltipBorder = theme === "dark" ? "#374151" : "#e5e7eb";
  const tooltipText = theme === "dark" ? "#f9fafb" : "#111827";

  return (
    <div className="w-max-380 p-6 mx-auto container pt-10">
      <div className="">
        <header className="p-5">
          <h1
            className={`text-3xl sm:text-3xl md:text-3xl font-extrabold drop-shadow-sm  ${
              theme === "dark" ? "text-yellow-500" : "text-blue-500"
            }`}
          >
            Dashboard{" "}
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-yellow-500"
              }`}
            >
              Admin
            </span>
          </h1>
          <p className={`  text-lg font-medium ${descrtiption}`}>
            ภาพรวมการทำงานทั้งหมดในระบบ
          </p>
        </header>

        <section>
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
                  <p className="my-5 text-6xl font-extrabold tracking-wide flex gap-2">
                    <motion.pre>{rounded}</motion.pre>
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

            <div className="lg:w-2/3 flex flex-col gap-8">
              <div className={`rounded-3xl shadow-inner p-6 ${cardBg}`}>
                <h2
                  className={`text-2xl font-extrabold mb-4 text-center ${text}`}
                >
                  งานทั้งหมด
                </h2>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={materialData} barSize={35}>
                      <XAxis
                        dataKey="name"
                        stroke={axisColor}
                        tick={{ fontSize: 14, fill: axisColor }}
                      />
                      <YAxis
                        stroke={axisColor}
                        tick={{ fontSize: 14, fill: axisColor }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: tooltipBg,
                          borderRadius: "12px",
                          border: `1px solid ${tooltipBorder}`,
                          color: tooltipText,
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "14px", color: tooltipText }}
                      />
                      <Bar
                        dataKey="quantity"
                        fill={barColor1}
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`rounded-3xl shadow-inner p-6 ${cardBg}`}>
                <h2
                  className={`text-2xl font-extrabold mb-4 text-center ${text}`}
                >
                  จำนวนงานแต่ละเดือน
                </h2>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WorkMountData} barSize={35}>
                      <XAxis
                        dataKey="name"
                        stroke={axisColor}
                        tick={{ fontSize: 14, fill: axisColor }}
                      />
                      <YAxis
                        stroke={axisColor}
                        tick={{ fontSize: 14, fill: axisColor }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: tooltipBg,
                          borderRadius: "12px",
                          border: `1px solid ${tooltipBorder}`,
                          color: tooltipText,
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "14px", color: tooltipText }}
                      />
                      <Bar
                        dataKey="quantity"
                        fill={barColor2}
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

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "@/components/theme-provider";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import type { PieLabelRenderProps } from "recharts";

// #region Sample data
const data = [
  { name: "งาน A", value: 25 },
  { name: "งาน B", value: 25 },
  { name: "งาน C", value: 25 },
  { name: "งาน D", value: 25 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderCustomizedLabel = (
  props: PieLabelRenderProps & { name?: string; value?: number }
) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;
  if (
    cx == null ||
    cy == null ||
    midAngle == null ||
    innerRadius == null ||
    outerRadius == null
  )
    return null;

  const RADIAN = Math.PI / 180;
  const radius =
    Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
  const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);

  const entry = data[index!]; // ดึงข้อมูลจาก array
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const percent = Math.min((entry.value / total) * 100, 100); // ไม่เกิน 100%

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${entry.name}: ${percent.toFixed(0)}%`} {/* แสดงชื่อและค่า */}
    </text>
  );
};

export default function Dashboard({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) {
  // ข้อมูลงานแต่ละเดือน
  const monthlyData = [
    {
      เดือน: "ม.ค.",
      ทั้งหมด: 100,
      เสร็จสิ้น: 60,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "ก.พ.",
      ทั้งหมด: 110,
      เสร็จสิ้น: 70,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "มี.ค.",
      ทั้งหมด: 120,
      เสร็จสิ้น: 80,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "เม.ย.",
      ทั้งหมด: 130,
      เสร็จสิ้น: 90,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "พ.ค.",
      ทั้งหมด: 140,
      เสร็จสิ้น: 100,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "มิ.ย.",
      ทั้งหมด: 150,
      เสร็จสิ้น: 110,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "ก.ค.",
      ทั้งหมด: 160,
      เสร็จสิ้น: 120,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "ส.ค.",
      ทั้งหมด: 170,
      เสร็จสิ้น: 130,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "ก.ย.",
      ทั้งหมด: 180,
      เสร็จสิ้น: 140,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "ต.ค.",
      ทั้งหมด: 190,
      เสร็จสิ้น: 150,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "พ.ย.",
      ทั้งหมด: 200,
      เสร็จสิ้น: 160,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
    {
      เดือน: "ธ.ค.",
      ทั้งหมด: 210,
      เสร็จสิ้น: 170,
      กำลังดำเนินการ: 30,
      ล่าช้า: 10,
    },
  ];

  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));
  const [Faev, setFaev] = useState(false);

  useEffect(() => {
    const controls = animate(count, 100, { duration: 5 });
    const timer = setTimeout(() => setFaev(true), 10);
    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, []);

  const { theme } = useTheme();
  const descrtiption = theme === "dark" ? "text-white" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-white";

  return (
    <div
      className={`w-max-380 p-5 mx-auto container duration-300  ${
        Faev ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <header className="mb-5">
        <h1
          className={`text-3xl font-extrabold drop-shadow-sm ${
            theme === "dark" ? "text-yellow-500" : "text-blue-500"
          }`}
        >
          Dashboard{" "}
          <span
            className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}
          >
            Admin
          </span>
        </h1>
        <p className={`text-lg font-medium ${descrtiption}`}>
          ภาพรวมการทำงานทั้งหมดในระบบ
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid w-full grid-cols-4 gap-5">
        {[
          {
            title: "จำนวนช่าง",
            color: "bg-blue-400",
            color_bark: "bg-yellow-500",
          },
          {
            title: "ช่างที่ได้งาน",
            color: "bg-blue-500",
            color_bark: "bg-yellow-600",
          },
          {
            title: "ช่างที่ยังไม่มีงาน",
            color: "bg-blue-700",
            color_bark: "bg-yellow-700",
          },
          {
            title: "รายการขอเบิกของ",
            color: "bg-blue-800",
            color_bark: "bg-yellow-900",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`text-white rounded-2xl p-4 flex pl-5 justify-center flex-col shadow-lg ${
              theme === "dark" ? item.color_bark : item.color
            }`}
          >
            <h2 className="text-2xl mb-3 font-extrabold">{item.title}</h2>
            <p className="mb-3 font-extrabold text-xl">
              <motion.pre>{rounded}</motion.pre>
            </p>
            <div className="text-sm text-white">
              <button
                role="link"
                className={`relative cursor-pointer bg-[length:100%_2px,0_2px] bg-[position:100%_100%,0_100%] 
                 bg-no-repeat transition-[background-size,color] duration-500 hover:bg-[0_2px,100%_2px] 
                 rounded-md ${
                   theme === "dark"
                     ? "hover:text-purple-600 bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#7c3aed,#7c3aed)]"
                     : "hover:text-yellow-500 bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#facc15,#facc15)]"
                 }`}
              >
                รายละเอียด
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8">
          <div
            className={`rounded-xl w-full col-span-6 mt-4 shadow-xl p-3  ${cardBg}`}
          >
            <h2
              className={`text-2xl font-extrabold mb-4 text-center ${
                theme === "dark" ? "text-yellow-500" : "text-blue-500"
              }`}
            >
              ประเภทงาน
            </h2>
            <div className="h-135">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === "dark" ? "#facc15" : "#3b82f6"}
                  />
                  <XAxis dataKey="เดือน" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke={theme === "dark" ? "#eab308" : "#3b82f6"}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke={theme === "dark" ? "#eab308" : "#3b82f6"}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="ทั้งหมด" fill="#3b82f6" />
                  <Bar yAxisId="right" dataKey="เสร็จสิ้น" fill="#10b981" />
                  <Bar
                    yAxisId="right"
                    dataKey="กำลังดำเนินการ"
                    fill="#ef4444"
                  />
                  <Bar yAxisId="right" dataKey="ล่าช้า" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className={`rounded-xl w-full mt-4 shadow-xl p-3  ${cardBg}`}>
            <h2
              className={`text-2xl font-extrabold mb-4 text-center ${
                theme === "dark" ? "text-yellow-500" : "text-blue-500"
              }`}
            >
              จำนวนช่างที่ได้รับงาน
            </h2>
            <div className="h-135">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    label={renderCustomizedLabel}
                    labelLine={false}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={isAnimationActive}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="w-full flex flex-col gap-3">
           
            <div className={`rounded-xl shadow-xl p-6 ${cardBg}`}>
              <h2
                className={`text-2xl font-extrabold mb-4 text-center ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                จำนวนช่างที่ได้รับงาน
              </h2>
              <div className="w-full h-70">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={techniciansData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === "dark" ? "#facc15" : "#3b82f6"}
                    />
                    <XAxis dataKey="เดือน" />
                    <YAxis yAxisId="left" orientation="left" stroke={theme === "dark" ? "#eab308" : "#3b82f6"} />
                    <YAxis yAxisId="right" orientation="right" stroke={theme === "dark" ? "#eab308" : "#3b82f6"} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="จำนวนช่าง" fill="#3b82f6" />
                    <Bar yAxisId="right" dataKey="ช่างที่ได้งาน" fill="#10b981" />
                    <Bar yAxisId="right" dataKey="ช่างที่ยังไม่มีงาน" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

       
            <div className={`rounded-xl shadow-xl p-6 ${cardBg}`}>
              <h2
                className={`text-2xl font-extrabold mb-4 text-center ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                จำนวนงานแต่ละเดือน
              </h2>
              <div className="w-full h-70">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === "dark" ? "#facc15" : "#3b82f6"}
                    />
                    <XAxis dataKey="เดือน" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ทั้งหมด" fill="#3b82f6" />
                    <Bar dataKey="เสร็จสิ้น" fill="#10b981" />
                    <Bar dataKey="กำลังดำเนินการ" fill="#fb923c" />
                    <Bar dataKey="ล่าช้า" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div> */}
    </div>
  );
}

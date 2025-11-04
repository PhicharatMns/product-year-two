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
import { useEffect } from "react";

export default function Dashboard() {
  const techniciansData = [
    {
      เดือน: "มกราคม",
      จำนวนช่าง: 50,
      ช่างที่ได้งาน: 35,
      ช่างที่ยังไม่มีงาน: 15,
    },
    {
      เดือน: "กุมภาพันธ์",
      จำนวนช่าง: 60,
      ช่างที่ได้งาน: 40,
      ช่างที่ยังไม่มีงาน: 20,
    },
    {
      เดือน: "มีนาคม",
      จำนวนช่าง: 55,
      ช่างที่ได้งาน: 45,
      ช่างที่ยังไม่มีงาน: 10,
    },
    {
      เดือน: "เมษายน",
      จำนวนช่าง: 65,
      ช่างที่ได้งาน: 50,
      ช่างที่ยังไม่มีงาน: 15,
    },
    {
      เดือน: "พฤษภาคม",
      จำนวนช่าง: 70,
      ช่างที่ได้งาน: 60,
      ช่างที่ยังไม่มีงาน: 10,
    },
    {
      เดือน: "มิถุนายน",
      จำนวนช่าง: 60,
      ช่างที่ได้งาน: 40,
      ช่างที่ยังไม่มีงาน: 20,
    },
    {
      เดือน: "กรกฎาคม",
      จำนวนช่าง: 75,
      ช่างที่ได้งาน: 55,
      ช่างที่ยังไม่มีงาน: 20,
    },
    {
      เดือน: "สิงหาคม",
      จำนวนช่าง: 80,
      ช่างที่ได้งาน: 65,
      ช่างที่ยังไม่มีงาน: 15,
    },
    {
      เดือน: "กันยายน",
      จำนวนช่าง: 85,
      ช่างที่ได้งาน: 70,
      ช่างที่ยังไม่มีงาน: 15,
    },
    {
      เดือน: "ตุลาคม",
      จำนวนช่าง: 90,
      ช่างที่ได้งาน: 75,
      ช่างที่ยังไม่มีงาน: 15,
    },
    {
      เดือน: "พฤศจิกายน",
      จำนวนช่าง: 95,
      ช่างที่ได้งาน: 80,
      ช่างที่ยังไม่มีงาน: 15,
    },
    {
      เดือน: "ธันวาคม",
      จำนวนช่าง: 100,
      ช่างที่ได้งาน: 85,
      ช่างที่ยังไม่มีงาน: 15,
    },
  ];

  // #region Sample data
  const monthlyData = [
    { เดือน: "มกราคม", ทั้งหมด: 50, เสร็จสิ้น: 20, กำลังดำเนินการ: 30 },
    { เดือน: "กุมภาพันธ์", ทั้งหมด: 60, เสร็จสิ้น: 35, กำลังดำเนินการ: 25 },
    { เดือน: "มีนาคม", ทั้งหมด: 45, เสร็จสิ้น: 30, กำลังดำเนินการ: 15 },
    { เดือน: "เมษายน", ทั้งหมด: 70, เสร็จสิ้น: 50, กำลังดำเนินการ: 20 },
    { เดือน: "พฤษภาคม", ทั้งหมด: 55, เสร็จสิ้น: 25, กำลังดำเนินการ: 30 },
    { เดือน: "มิถุนายน", ทั้งหมด: 65, เสร็จสิ้น: 40, กำลังดำเนินการ: 25 },
    { เดือน: "กรกฎาคม", ทั้งหมด: 60, เสร็จสิ้น: 45, กำลังดำเนินการ: 15 },
    { เดือน: "สิงหาคม", ทั้งหมด: 75, เสร็จสิ้น: 50, กำลังดำเนินการ: 25 },
    { เดือน: "กันยายน", ทั้งหมด: 80, เสร็จสิ้น: 60, กำลังดำเนินการ: 20 },
    { เดือน: "ตุลาคม", ทั้งหมด: 70, เสร็จสิ้น: 45, กำลังดำเนินการ: 25 },
    { เดือน: "พฤศจิกายน", ทั้งหมด: 90, เสร็จสิ้น: 70, กำลังดำเนินการ: 20 },
    { เดือน: "ธันวาคม", ทั้งหมด: 100, เสร็จสิ้น: 80, กำลังดำเนินการ: 20 },
  ];

  // #endregion
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    const controls = animate(count, 100, { duration: 5 });
    return () => controls.stop();
  }, []);

  const { theme } = useTheme();
  const descrtiption = theme === "dark" ? "text-white" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-900  " : "";

  return (
    <div className="w-max-380 p-5 mx-auto container ">
      <header className="mb-5">
        <h1
          className={`text-3xl sm:text-3xl md:text-3xl font-extrabold drop-shadow-sm  ${
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
        <p className={`  text-lg font-medium ${descrtiption}`}>
          ภาพรวมการทำงานทั้งหมดในระบบ
        </p>
      </header>

      <section>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="grid grid-cols-1 w-90 gap-5">
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
                className={`  text-white rounded-2xl flex  pl-5 justify-center flex-col shadow-lg ${
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
                     ? "hover:text-purple-600 bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#7c3aed,#7c3aed)]" // ม่วงเข้มตัดเหลือง
                     : "hover:text-yellow-500 bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#facc15,#facc15)]" // น้ำเงินเข้มตัดเหลือง
                 }`}
                  >
                    รายละเอียด
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className={`rounded-xl shadow-xl p-6 ${cardBg}`}>
              <h2
                className={`text-2xl font-extrabold mb-4 text-center ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                จํานวนกราฟที่ได่รับงาน
              </h2>
              <div className="w-full h-70 ">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={techniciansData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === "dark" ? "#facc15" : "#3b82f6"}
                    />{" "}
                    <XAxis dataKey="เดือน" />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke={`${theme === "dark" ? "#eab308" : "#3b82f6"}`}
                      width="auto"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke={`${theme === "dark" ? "#eab308" : "#3b82f6"}`}
                      width="auto"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="จำนวนช่าง"
                      fill={` ${theme === "dark" ? "#3b82f6" : "#3b82f6"}`}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="ช่างที่ได้งาน"
                      fill={` ${theme === "dark" ? "#10b981" : "#10b981"}`}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="ช่างที่ยังไม่มีงาน"
                      fill={` ${theme === "dark" ? "#ef4444" : "#ef4444"}`}
                    />
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
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke={`${theme === "dark" ? "#eab308" : "#3b82f6"}`}
                      width="auto"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke={`${theme === "dark" ? "#eab308" : "#3b82f6"}`}
                      width="auto"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="ทั้งหมด"
                      fill={` ${theme === "dark" ? "#3b82f6" : "#3b82f6"}`}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="เสร็จสิ้น"
                      fill={` ${theme === "dark" ? "#10b981" : "#10b981"}`}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="กำลังดำเนินการ"
                      fill={` ${theme === "dark" ? "#fb923c" : "#fb923c"}`}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

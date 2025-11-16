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

export default function DashboardUser() {
  // #region Sample data
  const monthlyData = [
    {
      เดือน: "มกราคม",
      งานทั้งหมด: 50,
      เสร็จสิ้น: 20,
      กำลังดำเนินการ: 30,
      ล่าช้า: 1,
    },
    {
      เดือน: "กุมภาพันธ์",
      งานทั้งหมด: 60,
      เสร็จสิ้น: 35,
      กำลังดำเนินการ: 25,
      ล่าช้า: 3,
    },
    {
      เดือน: "มีนาคม",
      งานทั้งหมด: 45,
      เสร็จสิ้น: 30,
      กำลังดำเนินการ: 15,
      ล่าช้า: 4,
    },
    {
      เดือน: "เมษายน",
      งานทั้งหมด: 70,
      เสร็จสิ้น: 50,
      กำลังดำเนินการ: 20,
      ล่าช้า: 2,
    },
    {
      เดือน: "พฤษภาคม",
      งานทั้งหมด: 55,
      เสร็จสิ้น: 25,
      กำลังดำเนินการ: 30,
      ล่าช้า: 1,
    },
    {
      เดือน: "มิถุนายน",
      งานทั้งหมด: 65,
      เสร็จสิ้น: 40,
      กำลังดำเนินการ: 25,
      ล่าช้า: 2,
    },
    {
      เดือน: "กรกฎาคม",
      งานทั้งหมด: 60,
      เสร็จสิ้น: 45,
      กำลังดำเนินการ: 15,
      ล่าช้า: 2,
    },
    {
      เดือน: "สิงหาคม",
      งานทั้งหมด: 75,
      เสร็จสิ้น: 50,
      กำลังดำเนินการ: 25,
      ล่าช้า: 1,
    },
    {
      เดือน: "กันยายน",
      งานทั้งหมด: 80,
      เสร็จสิ้น: 60,
      กำลังดำเนินการ: 20,
      ล่าช้า: 1,
    },
    {
      เดือน: "ตุลาคม",
      งานทั้งหมด: 70,
      เสร็จสิ้น: 45,
      กำลังดำเนินการ: 25,
      ล่าช้า: 1,
    },
    {
      เดือน: "พฤศจิกายน",
      งานทั้งหมด: 90,
      เสร็จสิ้น: 70,
      กำลังดำเนินการ: 20,
      ล่าช้า: 5,
    },
    {
      เดือน: "ธันวาคม",
      งานทั้งหมด: 100,
      เสร็จสิ้น: 80,
      กำลังดำเนินการ: 20,
      ล่าช้า: 3,
    },
  ];

  // #endregion
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));
  const [Faev, setFaev] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFaev(true), 10);
    const controls = animate(count, 100, { duration: 5 });
    return () => {
      controls.stop();
      clearTimeout(timer); // ล้าง timer
    };
  }, []);

  const { theme } = useTheme();
  const descrtiption = theme === "dark" ? "text-white" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-900  " : "";

  return (
    <div
      className={` w-max-380 p-5 mx-auto container duration-300 ${
        Faev ? "opacity-100" : "opacity-0"
      }`}
    >
      {" "}
      <div className="">
        <header className="mb-5">
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
              User
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
                  title: "งานทั้งหมด",
                  color: "bg-blue-400",
                  color_bark: "bg-yellow-500",
                },
                {
                  title: "เสร็จสิ้น",
                  color: "bg-blue-500",
                  color_bark: "bg-yellow-500",
                },
                {
                  title: "กำลังดำเนินการ",
                  color: "bg-blue-600",
                  color_bark: "bg-yellow-600",
                },
                {
                  title: "ล่าช้า",
                  color: "bg-blue-700",
                  color_bark: "bg-yellow-700",
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
                      className={`relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:translate-y-1  after:opacity-0 after:transition after:duration-150 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-100 
                    ${theme === "dark" ? "after:bg-white" : "after:bg-white"}`}
                    >
                      รายละเอียด
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full flex flex-col gap-3">
              {/* <div className={`rounded-xl shadow-xl p-6 ${cardBg}`}>
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
              </div> */}

              <div className={`rounded-xl shadow-sm p-6 ${cardBg}`}>
                <h2
                  className={`text-2xl font-extrabold mb-4 text-center ${
                    theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  }`}
                >
                  จำนวนงานแต่ละเดือน
                </h2>
                <div className="w-full h-160">
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
                        dataKey="งานทั้งหมด"
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
                      <Bar
                        yAxisId="right"
                        dataKey="ล่าช้า"
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
    </div>
  );
}

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
import { useEffect, useState, useCallback, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

// ... [Interface definitions remain the same] ...
interface Employee {
  _id: string;
  Worksheet?: string;
  Supervisor?: string;
  PhoneNumber?: string;
  Date_of_acceptance_of_work?: string;
  Closing_date?: string;
  Details?: string;
  description?: string;
  Status?: "Finish" | "กำลังดำเนินการ" | "ล่าช้า" | "Active" | "เสร็จสิ้น";
}
interface Tradesman {
  _id: string;
  Name: string;
  employeeId: string; // ID ของงานที่ผูกด้วย (ถ้ามี)
  role?: string; // เช่น "chief", "staff"
  id: string; // user id
}
interface JwtPayload {
  id: string;
}
interface MonthlyData {
  เดือน: string;
  งานทั้งหมด: number;
  เสร็จสิ้น: number;
  กำลังดำเนินการ: number;
  ล่าช้า: number;
}
interface DashboardStats {
  totalTradesmen: number;
  tradesmenWithJobs: number;
  tradesmenWithoutJobs: number;
  materialRequests: number;
}

interface typeUser {
  Name: string;
  role: string;
  Position: string;
}

export default function Dashboardchief() {
  const { theme } = useTheme();

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalTradesmen: 0,
    tradesmenWithJobs: 0,
    tradesmenWithoutJobs: 0,
    materialRequests: 0,
  });

  // State ที่จำเป็น
  const [, setfinish] = useState(false);
  const [, setanim] = useState(false);
  const [, setInProgress] = useState(false);
  const [, setAnimInProgress] = useState(false);
  const [, setpopupdelayed] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const opensetpopupdelayed = () => {
    setpopupdelayed(true);
    setTimeout(() => setanim(true), 10);
  };

  const OpenInProgressPopup = () => {
    setInProgress(true);
    setTimeout(() => setAnimInProgress(true), 50);
  };
  const OpenModadShowfinishpopup = () => {
    setfinish(true);
    setTimeout(() => setanim(true), 50);
  };

  const token = localStorage.getItem("token");
  const decoded: JwtPayload | null = token
    ? jwtDecode<JwtPayload>(token)
    : null;
  const currentUserId = decoded?.id;

  // --- ฟังก์ชันดึงข้อมูลงานของช่าง ---
  const fetchData = useCallback(async () => {
    if (!token || !currentUserId) return;

    try {
      const [resEmp, resTrades] = await Promise.all([
        fetch("http://localhost:5000/api/employees"),
        fetch("http://localhost:5000/api/otherTradesman", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const allEmployees: Employee[] = await resEmp.json();
      const tradesmen: Tradesman[] = await resTrades.json();

      // หางานของช่างคนนั้น (ใช้ tradesmen ที่ได้จากการ fetch)
      const myJobIds = tradesmen
        .filter((t) => t.id === currentUserId)
        .map((t) => t.employeeId);

      const myJobs = allEmployees.filter((emp) => myJobIds.includes(emp._id));

      // --- คำนวณสถิติใหม่ (ใช้ tradesmen ที่ได้จากการ fetch) ---
      const totalTradesmenReal = tradesmen.length;

      const uniqueTradesmenWithJobs = new Set(
        tradesmen.filter((t) => t.employeeId).map((t) => t.id)
      ).size;

      setDashboardStats({
        totalTradesmen: totalTradesmenReal,
        tradesmenWithJobs: uniqueTradesmenWithJobs,
        tradesmenWithoutJobs: totalTradesmenReal - uniqueTradesmenWithJobs,
        materialRequests: 5,
      });

      // --- แปลงเป็น monthlyData ---
      const months = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];

      const dataPerMonth = months.map((month) => {
        const jobsInMonth = myJobs.filter((emp) => {
          if (!emp.Date_of_acceptance_of_work) return false;
          const date = new Date(emp.Date_of_acceptance_of_work);
          return date.getMonth() === months.indexOf(month);
        });

        return {
          เดือน: month,
          งานทั้งหมด: jobsInMonth.length,
          เสร็จสิ้น: jobsInMonth.filter((j) => j.Status === "Finish").length,
          กำลังดำเนินการ: jobsInMonth.filter(
            (j) => j.Status === "กำลังดำเนินการ" || j.Status === "Active"
          ).length,
          ล่าช้า: jobsInMonth.filter((j) => j.Status === "ล่าช้า").length,
        };
      });

      setMonthlyData(dataPerMonth);
    } catch (err) {
      console.error(err);
    }
  }, [token, currentUserId]);

  const [user, setuser] = useState<typeUser[]>([]);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login/all-tradesman");
      const data = await res.json();
      setuser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const numberOfUsers = user.length;

  // motion value (ตัวเลขจริง)
  const count = useMotionValue(0);

  // เอาค่ามาปัดเป็นจำนวนเต็ม
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    const controls = animate(count, numberOfUsers, {
      duration: 1.5,
    });

    return () => controls.stop();
  }, [numberOfUsers]);

  // เริ่ม fade-in + animate ตัวเลข
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 10);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    fetchData();
    fetchUser();
  }, [fetchData]);

  const descrtiption = theme === "dark" ? "text-white" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-gray-100 shadow-sm";

  const statsItems = useMemo(
    () => [
      {
        title: "จำนวนช่างทั้งหมด",
        value: dashboardStats.totalTradesmen,
        color: "bg-blue-400",
        color_bark: "bg-yellow-500",
        link: "user/getpaper",
        valueFn: () => {},
      },
      {
        title: "ช่างที่ได้งาน",
        value: dashboardStats.tradesmenWithJobs,
        color: "bg-blue-500",
        color_bark: "bg-yellow-500",
        valueFn: OpenModadShowfinishpopup,
        link: "chief/edituser",
      },
      {
        title: "ช่างที่ยังไม่มีงาน",
        value: numberOfUsers - dashboardStats.totalTradesmen,
        color: "bg-blue-600",
        color_bark: "bg-yellow-600",
        valueFn: OpenInProgressPopup,
        link: "chief/edituser",
      },
      {
        title: "รายการขอเบิกของ",
        value: dashboardStats.materialRequests,
        color: "bg-blue-700",
        color_bark: "bg-yellow-700",
        link: "chief/ItemChief",
        valueFn: opensetpopupdelayed,
      },
    ],
    [dashboardStats]
  );

  return (
    <div
      className={`w-max-380 p-5 mx-auto container duration-300 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div>
        <header className="mb-5">
          <h1
            className={`text-3xl font-extrabold drop-shadow-sm ${
              theme === "dark" ? "text-yellow-500" : "text-blue-500"
            }`}
          >
            Dashboard{" "}
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-yellow-500"
              }`}
            >
              หัวหน้าช่าง
            </span>
          </h1>
          <p className={`text-lg font-medium ${descrtiption}`}>
            ภาพรวมการทำงานของช่างคนนี้
          </p>
        </header>

        <section>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 w-90 gap-5">
              {statsItems.map((item, index) => (
                <div
                  key={index}
                  className={`text-white rounded-2xl flex pl-5 justify-center flex-col shadow-lg ${
                    theme === "dark" ? item.color_bark : item.color
                  }`}
                >
                  <h2 className="text-2xl mb-3 font-extrabold">{item.title}</h2>
                  <p className="mb-3 font-extrabold text-xl">
                    {item.title === "จำนวนช่างทั้งหมด" ? (
                      <motion.pre>{rounded}</motion.pre>
                    ) : (
                      <motion.pre>{item.value}</motion.pre>
                    )}
                  </p>
                  <div>
                    <Link
                      to={`/${item.link}`}
                      className={`relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:translate-y-1  after:opacity-0 after:transition after:duration-150 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-100 ${
                        theme === "dark" ? "after:bg-white" : "after:bg-white"
                      }`}
                    >
                      รายละเอียด
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* ส่วนแสดงกราฟสถานะช่าง */}
            <div className="w-full  flex  flex-col gap-3">
              {/* กราฟ Bar Chart เดิม */}
              <div className={`rounded-xl shadow-sm h-200 p-6 ${cardBg}`}>
                <h2
                  className={`text-2xl font-extrabold mb-4 text-center ${
                    theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  }`}
                >
                  จำนวนงานแต่ละเดือน
                </h2>
                <div className="w-full h-180 ">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid
                        stroke={theme === "dark" ? "#facc15" : "#3b82f6"}
                      />
                      <XAxis dataKey="เดือน" />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke={theme === "dark" ? "#eab308" : "#3b82f6"}
                        width="auto"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={theme === "dark" ? "#eab308" : "#3b82f6"}
                        width="auto"
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="งานทั้งหมด"
                        fill={theme === "dark" ? "#3b82f6" : "#3b82f6"}
                      />
                      <Bar yAxisId="right" dataKey="เสร็จสิ้น" fill="#10b981" />
                      <Bar
                        yAxisId="right"
                        dataKey="กำลังดำเนินการ"
                        fill="#fb923c"
                      />
                      <Bar yAxisId="right" dataKey="ล่าช้า" fill="#f87171" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Popups */}
      {/* {finish && (
        <div
          className={`z-50 duration-300 inset-0 fixed justify-center items-center flex backdrop-blur-sm bg-black/40 ${
            anim ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl ${bgpopup} w-[900px] h-200 shadow-2xl border `}
          >
            <button onClick={closeModalfinish}>ปิด</button>
            <h3 className="text-xl p-4">รายละเอียด: ช่างที่ได้งาน</h3>
          </div>
        </div>
      )}

      {inProgress && (
        <div
          className={`z-50 duration-300 inset-0 fixed justify-center items-center flex backdrop-blur-sm bg-black/40 ${
            animInProgress ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl ${bgpopup} w-[900px] h-200 shadow-2xl border `}
          >
            <button onClick={closeModalinProgress}>ปิด</button>
            <h3 className="text-xl p-4">รายละเอียด: ช่างที่ยังไม่มีงาน</h3>
          </div>
        </div>
      )}

      {popupdelayed && (
        <div
          className={`z-50 duration-300 inset-0 fixed justify-center items-center flex backdrop-blur-sm bg-black/40 ${
            anim ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl w-[900px] h-200 shadow-2xl border ${bgpopup}`}
          >
            <button onClick={closepopupdelayed}>ปิด</button>
            <h3 className="text-xl p-4">รายละเอียด: รายการขอเบิกของ</h3>
          </div>
        </div>
      )} */}
    </div>
  );
}

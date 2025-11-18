"use client";

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
import { motion, animate, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";

/* ---------------- Interfaces ---------------- */
interface Employee {
  _id: string;
  Name: string;
  Nickname: string;
  ID: string;
  Birthday: string;
  Address: string;
  Phone_Number: string;
  Email: string;
  Profile: string;
  Position: string;
  Start_data: string;
  role: string;
  Jobs: number; // จำนวนงานที่มี
}

interface TradesmanJob {
  _id: string;
  Worksheet: string;
  Employer: string;
  Contact_number: string;
  address: { type: "Point"; coordinates: [number, number] };
  responsible: string;
  Date_of_acceptance_of_work: string;
  Closing_date: string;
  description: string;
  Status?: string;
  image: File | null;
}

interface MonthlyData {
  เดือน: string;
  ทั้งหมด: number;
  เสร็จสิ้น: number;
  กำลังดำเนินการ: number;
  ล่าช้า: number;
}

export default function Dashboardchief() {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-white" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-white";

  /* ---------- State ---------- */
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobs, setJobs] = useState<TradesmanJob[]>([]);
  const [jobCounts, setJobCounts] = useState<{ [key: string]: number }>({});
  const [techniciansData, setTechniciansData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loaded, setLoaded] = useState(false);

  /* ---------- Motion Values ---------- */
  const countTotal = useMotionValue(0);
  const countHasJob = useMotionValue(0);
  const countNoJob = useMotionValue(0);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayHasJob, setDisplayHasJob] = useState(0);
  const [displayNoJob, setDisplayNoJob] = useState(0);

  /* ---------- Fetch Data ---------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const [employeesRes, jobsRes, jobCountsRes] = await Promise.all([
          fetch("http://localhost:5000/api/login/all-tradesman", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/employees", { headers }),
          fetch("http://localhost:5000/api/otherTradesman/count/all", {
            headers,
          }),
        ]);

        const employeesData: Employee[] = await employeesRes.json();
        const jobsData: TradesmanJob[] = await jobsRes.json();
        const jobCountsData: { _id: string; count: number }[] =
          await jobCountsRes.json();

        setEmployees(employeesData);
        setJobs(jobsData);
        setJobCounts(
          jobCountsData.reduce(
            (acc, cur) => ({ ...acc, [cur._id]: cur.count }),
            {}
          )
        );
      } catch (err) {
        console.error("Fetch all error:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchAll();
  }, []);

  /* ---------- Process Data ---------- */
  useEffect(() => {
    if (!employees.length || !jobs.length || !Object.keys(jobCounts).length)
      return;

    const months = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];

    // ----- Technicians Data -----
    const techData = months.map((m) => ({
      เดือน: m,
      จำนวนช่าง: 0,
      ช่างที่ได้งาน: 0,
      ช่างที่ยังไม่มีงาน: 0,
    }));

    employees.forEach((emp) => {
      let monthIndex = 0;
      if (emp.Start_data) {
        const d = new Date(emp.Start_data);
        if (!isNaN(d.getTime())) monthIndex = d.getMonth();
      }
      const hasJob = jobCounts[emp._id] > 0;
      techData[monthIndex].จำนวนช่าง += 1;
      if (hasJob) techData[monthIndex].ช่างที่ได้งาน += 1;
      else techData[monthIndex].ช่างที่ยังไม่มีงาน += 1;
    });

    setTechniciansData(techData);

    // ----- Monthly Jobs Data -----
    const monthData = months.map((m, idx) => {
      const jobsInMonth = jobs.filter((job) => {
        if (!job.Date_of_acceptance_of_work) return false;
        const d = new Date(job.Date_of_acceptance_of_work);
        return !isNaN(d.getTime()) && d.getMonth() === idx;
      });

      const finished = jobsInMonth.filter(
        (j) => j.Status === "เสร็จสิ้น"
      ).length;
      const delayed = jobsInMonth.filter((j) => j.Status === "ล่าช้า").length;
      const inProgress = jobsInMonth.filter(
        (j) => j.Status !== "เสร็จสิ้น" && j.Status !== "ล่าช้า"
      ).length;

      return {
        เดือน: m,
        ทั้งหมด: jobsInMonth.length,
        เสร็จสิ้น: finished,
        กำลังดำเนินการ: inProgress,
        ล่าช้า: delayed,
      };
    });

    setMonthlyData(monthData);

    // ----- KPI Motion -----
    const total = employees.length;
    const hasJobCount = employees.filter((e) => jobCounts[e._id] > 0).length;
    const noJobCount = total - hasJobCount;

    const controlsTotal = animate(countTotal, total, { duration: 1.5 });
    const controlsHasJob = animate(countHasJob, hasJobCount, { duration: 1.5 });
    const controlsNoJob = animate(countNoJob, noJobCount, { duration: 1.5 });

    const unsubTotal = countTotal.on("change", (v) =>
      setDisplayTotal(Math.round(v))
    );
    const unsubHasJob = countHasJob.on("change", (v) =>
      setDisplayHasJob(Math.round(v))
    );
    const unsubNoJob = countNoJob.on("change", (v) =>
      setDisplayNoJob(Math.round(v))
    );

    return () => {
      controlsTotal.stop();
      controlsHasJob.stop();
      controlsNoJob.stop();
      unsubTotal();
      unsubHasJob();
      unsubNoJob();
    };
  }, [employees, jobs, jobCounts]);

  /* ---------- Render ---------- */
  return (
    <div
      className={`w-max-380 p-5 mx-auto container duration-300 ${
        loaded ? "opacity-100" : "opacity-0"
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
          <span className={theme === "dark" ? "text-white" : "text-yellow-500"}>
            หัวหน้า
          </span>
        </h1>
        <p className={`text-lg font-medium ${textColor}`}>
          ภาพรวมการทำงานทั้งหมดในระบบ
        </p>
      </header>

      {/* KPI Cards */}
      <section>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="grid grid-cols-1 w-90 gap-5">
            {[
              {
                title: "จำนวนช่าง",
                value: displayTotal,
                color: "bg-blue-400",
                color_bark: "bg-yellow-500",
              },
              {
                title: "ช่างที่ได้งาน",
                value: displayHasJob,
                color: "bg-blue-500",
                color_bark: "bg-yellow-600",
              },
              {
                title: "ช่างที่ยังไม่มีงาน",
                value: displayNoJob,
                color: "bg-blue-700",
                color_bark: "bg-yellow-700",
              },
              {
                title: "รายการขอเบิกของ",
                value: 0,
                color: "bg-blue-800",
                color_bark: "bg-yellow-900",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`text-white rounded-2xl flex pl-5 justify-center flex-col shadow-lg ${
                  theme === "dark" ? item.color_bark : item.color
                }`}
              >
                <h2 className="text-2xl mb-3 font-extrabold">{item.title}</h2>
                <p className="mb-3 font-extrabold text-xl">
                  <motion.span>{item.value}</motion.span>
                </p>
                <div className="text-sm text-white">
                  <button className="relative cursor-pointer rounded-md p-1">
                    รายละเอียด
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="w-full flex flex-col gap-3">
            <div className={`rounded-xl shadow-xl p-6 ${cardBg}`}>
              <h2
                className={`text-2xl font-extrabold mb-4 text-center ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                ช่างที่ได้งาน / ยังไม่มีงาน
              </h2>
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={techniciansData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === "dark" ? "#facc15" : "#3b82f6"}
                    />
                    <XAxis dataKey="เดือน" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="จำนวนช่าง" fill="#3b82f6" />
                    <Bar dataKey="ช่างที่ได้งาน" fill="#10b981" />
                    <Bar dataKey="ช่างที่ยังไม่มีงาน" fill="#ef4444" />
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
          </div>
        </div>
      </section>
    </div>
  );
}

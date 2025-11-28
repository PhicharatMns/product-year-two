import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
} from "recharts";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";

type typeJob = {
  kind: "job";
  id: string;
  title: string;
  status: string;
};

interface typeEmployee {
  Date_of_acceptance_of_work?: string;
  Status: string;
  address?: string;
}

const DashboardExecutive = () => {
  const [job, setJob] = useState<typeEmployee[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const { theme } = useTheme();


  const [jobs, setjobs] = useState<typeJob[]>([]);
  const fetchJob = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/additem');
      const data = await res.json()
      setjobs(data)
    } catch (err) {
      console.error(err)
    }
  }

  // fetch ข้อมูล
  const fetchJobAdd = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const data = await res.json();
      setJob(data);
    } catch (err) {
      console.error(err);
    }
  };

  // motion values
  const countTotal = useMotionValue(0);
  const roundedTotal = useTransform(countTotal, Math.round);

  const countWorking = useMotionValue(0);
  const roundedWorking = useTransform(countWorking, Math.round);

  const countDelayed = useMotionValue(0);
  const roundedDelayed = useTransform(countDelayed, Math.round);

  // สรุปข้อมูล
  const Jobtotal = job.length;
  const JobWorking = job.filter(
    (item) => item.Status === "กำลังดำเนินการ"
  ).length;
  const JobDelayedLength = job.filter(
    (item) => item.Status === "ล่าช้า"
  ).length;

  // Animate ตัวเลข
  useEffect(() => {
    const controlsTotal = animate(countTotal, Jobtotal, {
      duration: 2,
      ease: "easeOut",
    });
    const controlsWorking = animate(countWorking, JobWorking, {
      duration: 2,
      ease: "easeOut",
    });
    const controlsDelayed = animate(countDelayed, JobDelayedLength, {
      duration: 2,
      ease: "easeInOut",
    });

    return () => {
      controlsTotal.stop();
      controlsWorking.stop();
      controlsDelayed.stop();
    };
  }, [Jobtotal, JobWorking, JobDelayedLength]);

  // สร้าง chart data per month
  useEffect(() => {
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

    const data = months.map((month) => ({
      name: month,
      งาน: 0,
      เหลือ: 0,
    }));

    job.forEach((item) => {
      if (!item.Date_of_acceptance_of_work) return;
      const date = new Date(item.Date_of_acceptance_of_work);
      const monthIndex = date.getMonth(); // 0-11
      data[monthIndex].งาน += 1;
      if (item.Status === "กำลังดำเนินการ" || item.Status === "ล่าช้า") {
        data[monthIndex].เหลือ += 1;
      }
    });

    setChartData(data);
  }, [job]);

  // โหลดข้อมูลครั้งแรก
  useEffect(() => {
    fetchJob()
    fetchJobAdd();
  }, []);


  const [fade, setFade] = useState(false);
  useEffect(() => {
    const timser = setTimeout(() => setFade(true), 100)
    return () => clearTimeout(timser);
  }, [])

  return (
    <div className={`container duration-500 mx-auto w-380 p-5 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <p
        className={`text-3xl font-extrabold mb-5 ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
          }`}
      >
        Dashboard{" "}
        <span
          className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}
        >
          ผู้บริหาร
        </span>
      </p>
      {/* ตัวเลขสรุป */}
      <div className="grid grid-cols-4 gap-5 my-5">
        <div className="border rounded-xl h-30 text-white bg-blue-300 p-4 text-xl">
          <p>งานทั้งหมด</p>
          <p className="mt-5 text-2xl flex gap-2 font-extrabold">
            <motion.pre>{roundedTotal}</motion.pre> งาน
          </p>
        </div>

        <div className="border rounded-xl h-30 text-white bg-blue-500 p-4 text-xl">
          <p>งานที่กำลังดำเนินการ</p>
          <p className="mt-5 text-2xl flex gap-2 font-extrabold">
            <motion.pre>{roundedWorking}</motion.pre> งาน
          </p>
        </div>

        <div className="border rounded-xl h-30 text-white bg-blue-600 p-4 text-xl">
          <p>งานที่ล่าช้า</p>
          <p className="mt-5 text-2xl flex gap-2 font-extrabold">
            <motion.pre>{roundedDelayed}</motion.pre> งาน
          </p>
        </div>

        <div className="border rounded-xl h-30 text-white bg-blue-700 p-4 text-xl">
          <p>รายการขอเบิกวัสดุ</p>
          <p className="mt-5 text-2xl flex gap-2 font-extrabold">
            {/* ตัวอย่าง static */}
            <motion.pre>{jobs.length}</motion.pre> งาน
          </p>
        </div>
      </div>
      {/* กราฟ */}
      {/* <div>
          <p className="my-2 text-xl font-extrabold">งานทั้งหมดต่อเดือน</p>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" scale="band" />
              <YAxis width={40} />
              <Tooltip />
              <Legend />
              <Bar dataKey="งาน" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="งาน" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div> */}
      <div
        className={` p-2 rounded-lg ${theme === "dark" ? "bg-gray-900" : "bg-gray-50 shadow"
          } `}
      >
        <p className="my-2 text-xl  font-extrabold">
          งานทั้งหมดต่อเดือน (แยกเหลือ)
        </p>
        <ResponsiveContainer width="100%" height={600}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#05339C"
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#FCB53B"
              width={40}
            />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="งาน" fill="#05339C" />
            <Bar yAxisId="right" dataKey="เหลือ" fill="#FCB53B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardExecutive;

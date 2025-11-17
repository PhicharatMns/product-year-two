import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
} from "recharts";
import { useTheme } from "@/components/theme-provider";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { PieLabelRenderProps } from "recharts";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdPerson } from "react-icons/md";
import { FaPersonDigging } from "react-icons/fa6";
import { LuMessageCircle } from "react-icons/lu";

export default function Dashboard({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) {
  interface Employees {
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
    id: string;
    role: string;
  }

  interface GeoPoint {
    type: "Point";
    coordinates: [number, number];
  }

  interface Tradesmen {
    _id: string;
    Worksheet: string;
    Employer: string;
    Contact_number: string;
    address: GeoPoint;
    responsible: string;
    Date_of_acceptance_of_work: string;
    Closing_date: string;
    description: string;
    Status?: string;
    image: File | null;
  }

  const { theme } = useTheme();

  const [SelectedTradesmen, setSelectedTradesmen] = useState<Employees[]>([]);
  const [jobCounts, setJobCounts] = useState<{ [key: string]: number }>({});
  const [data, setData] = useState<Tradesmen[]>([]);
  const [openpopup, setopenpopup] = useState(false);
  const [focused, setFocused] = useState(false);
  const [Search, setSearch] = useState<string>("");
  const [anim, setanim] = useState(false);
  const [Faev, setFaev] = useState(false);

  // Fetch Tradesmen + JobCounts + Jobs (รวมใน useEffect เดียว)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tradesRes, jobRes, jobsRes] = await Promise.all([
          fetch("http://localhost:5000/api/login/all-tradesman", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/otherTradesman/count/all"),
          fetch("http://localhost:5000/api/employees"),
        ]);

        const tradesData: Employees[] = await tradesRes.json();
        const jobData: { _id: string; count: number }[] = await jobRes.json();
        const jobs: Tradesmen[] = await jobsRes.json();

        setSelectedTradesmen(tradesData);
        setJobCounts(
          jobData.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {})
        );
        setData(Array.isArray(jobs) ? jobs : []);
      } catch (err) {
        console.error(err);
      } finally {
        setFaev(true);
      }
    };
    fetchAll();
  }, []);

  // Count summary
  const roleSummary = useMemo(() => {
    return SelectedTradesmen.reduce(
      (acc, cur) => {
        if (cur.role === "user") acc.user++;
        if (cur.role === "chief") acc.chief++;
        return acc;
      },
      { user: 0, chief: 0 }
    );
  }, [SelectedTradesmen]);

  const totalTechnicians = roleSummary.user + roleSummary.chief;
  const workingCount = useMemo(
    () => Object.values(jobCounts).reduce((acc, c) => acc + (c > 0 ? 1 : 0), 0),
    [jobCounts]
  );

  // Motion Values
  const countAll = useMotionValue(0);
  const roundedAll = useTransform(countAll, Math.round);
  const countHasJob = useMotionValue(0);
  const roundedHasJob = useTransform(countHasJob, Math.round);
  const countNoJob = useMotionValue(0);
  const roundedNoJob = useTransform(countNoJob, Math.round);

  useEffect(() => {
    const controlsAll = animate(countAll, totalTechnicians, { duration: 2 });
    const controlsHasJob = animate(countHasJob, workingCount, { duration: 2 });
    const controlsNoJob = animate(countNoJob, totalTechnicians - workingCount, {
      duration: 2,
    });
    return () => {
      controlsAll.stop();
      controlsHasJob.stop();
      controlsNoJob.stop();
    };
  }, [totalTechnicians, workingCount]);

  // PieChart Data
  const pieData = useMemo(
    () =>
      [
        { name: "ช่างที่ได้งาน", value: workingCount },
        { name: "ช่างที่ยังไม่ได้งาน", value: totalTechnicians - workingCount },
      ].filter((item) => item.value > 0),
    [workingCount, totalTechnicians]
  );

  const COLORS = ["#FF0000", theme === "dark" ? "#FFD700" : "#0088FE"];

  const monthlyData = useMemo(() => {
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
    const monthlyCount = months.map((month) => ({
      เดือน: month,
      ทั้งหมด: 0,
      เสร็จสิ้น: 0,
      กำลังดำเนินการ: 0,
      ล่าช้า: 0,
    }));
    data.forEach((job) => {
      if (!job.Date_of_acceptance_of_work) return;
      const monthIndex = new Date(job.Date_of_acceptance_of_work).getMonth();
      monthlyCount[monthIndex].ทั้งหมด += 1;
      if (job.Status === "Closed" || job.Status === "เสร็จสิ้น")
        monthlyCount[monthIndex].เสร็จสิ้น += 1;
      else if (job.Status === "Active" || job.Status === "กำลังดำเนินการ")
        monthlyCount[monthIndex].กำลังดำเนินการ += 1;
      else if (job.Status === "Late" || job.Status === "ล่าช้า")
        monthlyCount[monthIndex].ล่าช้า += 1;
    });
    return monthlyCount;
  }, [data]);

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
    const entry = pieData[index!];
    const total = pieData.reduce((sum, d) => sum + d.value, 0);
    const percent = total > 0 ? Math.min((entry.value / total) * 100, 100) : 0;
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
        {`${entry.name}: ${percent.toFixed(0)}%`}
      </text>
    );
  };

  const closeModal = () => {
    setanim(false);
    setTimeout(() => setopenpopup(false), 300);
  };
  const openModal = () => {
    setopenpopup(true);
    setTimeout(() => setanim(true), 10);
  };

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
            value: roundedAll, // motion value
            link: "Editacc",
            icon: <MdPerson size={24} />,
            
          },
          {
            title: "ช่างที่ได้งาน",
            color: "bg-blue-500",
            color_bark: "bg-yellow-600",
            value: roundedHasJob,
            icon: <FaPersonDigging size={24} />,
          },
          {
            title: "ช่างที่ยังไม่มีงาน",
            color: "bg-blue-700",
            color_bark: "bg-yellow-700",
            value: roundedNoJob,
            icon: <LuMessageCircle size={24} />,
          },
          {
            title: "รายการขอเบิกของ",
            color: "bg-blue-800",
            color_bark: "bg-yellow-900",
            icon: <CiSearch size={24} />,
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`text-white rounded-2xl p-4 flex pl-5 justify-center flex-col shadow-lg ${
              theme === "dark" ? item.color_bark : item.color
            }`}
          >
            <h2 className="text-2xl mb-3 font-extrabold">{item.title}</h2>
            <p className="mb-3 font-extrabold text-xl flex gap-2 items-center ">
              {item.icon} <motion.span>{item.value}</motion.span>
              <div className="border-b pb-3"></div>
            </p>
            <div className="text-sm text-white">
              {item.title === "จำนวนช่าง" ? (
                <Link
                  to={`/${item.link}`}
                  className={`relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:translate-y-1  after:opacity-0 after:transition after:duration-150 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-100 
                    ${theme === "dark" ? "after:bg-white" : "after:bg-white"}`}
                >
                  รายละเอียด
                </Link>
              ) : (
                <button
                  onClick={openModal}
                  className={`relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:translate-y-1  after:opacity-0 after:transition after:duration-150 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-100 
                    ${theme === "dark" ? "after:bg-white" : "after:bg-white"}`}
                >
                  รายละเอียด
                </button>
              )}
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
              การดําเนินงาน
            </h2>
            <div className="h-135">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  {" "}
                  {/* <-- ส่ง data เข้าไป */}
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
                    data={pieData}
                    label={renderCustomizedLabel}
                    labelLine={false}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={isAnimationActive}
                  >
                    {pieData.map((entry, index) => (
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

      {openpopup && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center 
    transition-opacity duration-200
    ${anim ? "opacity-100" : "opacity-0"}`}
        >
          {" "}
          <div className="rounded-2xl bg-white w-[900px] h-200 shadow-2xl border ">
            <div className="flex items-center justify-between border-b px-6 py-4 ">
              <p
                className={` text-2xl  font-semibold  ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                รายละเอียดงาน
                <span
                  className={`${
                    theme === "dark" ? "text-white" : "text-yellow-500"
                  }`}
                >
                  ของช่าง
                </span>
              </p>

              <div className="relative ite">
                <CiSearch
                  className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300`}
                />
                <input
                  placeholder="ค้นหาใบงาน..."
                  onChange={(e) => setSearch(e.target.value)}
                  value={Search}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  type="text"
                  className={`border rounded-xl pl-10 pr-3 duration-300 transition-all focus:outline-none focus:ring-2 py-1 
                                          ${
                                            focused
                                              ? "w-72 shadow-lg"
                                              : "w-60 border-gray-300"
                                          }  
                                          ${
                                            theme === "dark"
                                              ? "border-gray-600 focus:ring-yellow-500 bg-gray-700 text-white"
                                              : " focus:ring-blue-400 bg-white text-gray-800"
                                          }`}
                />
              </div>
            </div>
            <div className="grid grid-cols-8 py-3 border-b mb-3 gap-5 px-6">
              {[
                { name: "ทั้งหมด" },
                { name: "IT Support" },
                { name: "Helpdesk" },
                { name: "Network" },
                { name: "System Admin" },
                { name: "ยังไม่คิด" },
                { name: "Technical" },
                { name: "Customer" },
              ].map((dept) => (
                <div key={dept.name}>
                  <div
                    // onClick={() => setSelectedPosition(dept.name)}
                    className="relative cursor-pointer"
                  >
                    <p
                      className={`truncate relative w-fit mx-auto after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full
          after:origin-bottom after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-500
          after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100
       `}
                    >
                      {dept.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 h-150 border-b overflow-y-auto scrollber-hide">
              {SelectedTradesmen.filter(
                (e) =>
                  (e.role === "user" || e.role === "chief") &&
                  (e.Name.toLowerCase().includes(Search.toLowerCase()) ||
                    e.Nickname.toLowerCase().includes(Search.toLowerCase()) ||
                    e.Email.toLowerCase().includes(Search.toLowerCase()))
              ).map((e, i) => {
                return (
                  <motion.div
                    key={e._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    <div
                      key={i}
                      className={`flex my-2 py-1 justify-between shadow-sm  px-5 rounded-xl ${
                        theme === "dark" ? "bg-gray-900" : "bg-white"
                      }`}
                    >
                      <div className="flex  gap-5 items-center">
                        <img
                          src={`http://localhost:5000/uploads/Profile/${e.Profile}`}
                          alt=""
                          className="w-12 h-12 object-cover  rounded-full bg-blue-700 shadow-md"
                        />
                        <div className="flex-col">
                          <h2
                            className={`text-lg font-extrabold ${
                              theme === "dark"
                                ? "text-yellow-500"
                                : "text-blue-500"
                            }`}
                          >
                            {e.Name}
                          </h2>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-white" : "text-black"
                            }`}
                          >
                            <span
                              className={` font-extrabold ${
                                theme === "dark"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                              }`}
                            >
                              ตำแหน่ง :
                            </span>{" "}
                            {e.Address}
                          </p>{" "}
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-white" : "text-black"
                            }`}
                          >
                            {" "}
                            <span
                              className={` font-extrabold ${
                                theme === "dark"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                              }`}
                            >
                              เบอร์โทร :
                            </span>{" "}
                            {e.Phone_Number}
                          </p>
                          <p>
                            <p
                              className={`text-sm ${
                                theme === "dark" ? "text-white" : "text-black"
                              }`}
                            >
                              <span
                                className={`font-extrabold ${
                                  theme === "dark"
                                    ? "text-yellow-500"
                                    : "text-blue-500"
                                }`}
                              >
                                งานที่ได้รับในเดือนนี่ :
                              </span>{" "}
                              {jobCounts[e._id] ?? 0} งาน
                            </p>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-end gap-4 pr-4 mt-4">
              <button
                onClick={closeModal}
                className="group relative py-1  overflow-hidden rounded-lg cursor-pointer border bg-white px-4  text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
              >
                <span className="relative z-10">ยกเลิก</span>
                <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                  <span className="absolute left-0 top-0 w-0 h-full bg-gray-200  transition-all duration-500 group-hover:w-full"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

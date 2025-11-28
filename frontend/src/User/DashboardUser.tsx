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
import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

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
  employeeId: string;
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

export default function DashboardUser() {
  const { theme } = useTheme();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [finish, setfinish] = useState(false);
  const [anim, setanim] = useState(false);
  const [focused, setFocused] = useState(false);
  const [Search, setSearch] = useState<string>("");
  const [inProgress, setInProgress] = useState(false);
  const [animInProgress, setAnimInProgress] = useState(false);
  const [popupdelayed, setpopupdelayed] = useState(false);

  const opensetpopupdelayed = () => {
    setpopupdelayed(true);
    setTimeout(() => setanim(true), 10);
  };

  const closepopupdelayed = () => {
    setanim(false);
    setTimeout(() => setpopupdelayed(false), 300);
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

  const count = useMotionValue(0);
  const [Faev, setFaev] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFaev(true), 10);
    const controls = animate(count, 100, { duration: 5 });
    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, []);

  const closeModalinProgress = () => {
    setAnimInProgress(false);
    setTimeout(() => setInProgress(false), 300);
  };

  const closeModalfinish = () => {
    setanim(false);
    setTimeout(() => setfinish(false), 300);
  };

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

      // หางานของช่างคนนั้น
      const myJobIds = tradesmen
        .filter((t) => t.id === currentUserId)
        .map((t) => t.employeeId);

      const myJobs = allEmployees.filter((emp) => myJobIds.includes(emp._id));

      setEmployees(myJobs);

      // --- แปลงเป็น monthlyData สรุปจำนวนงานต่อเดือนและสถานะ ---
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
          เสร็จสิ้น: jobsInMonth.filter((j) => j.Status === "เสร็จสิ้น").length,
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //เเปลงเวลา
  function formatDate(dateString?: string | { $date: string }) {
    if (!dateString) return "-";

    let date: Date;
    if (typeof dateString === "string") {
      date = new Date(dateString);
    } else if ("$date" in dateString) {
      date = new Date(dateString.$date);
    } else {
      return "-";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // dd/mm/yyyy
  }

  const descrtiption = theme === "dark" ? "text-white" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-gray-100 shadow-sm";
  const bgpopup = theme === "dark" ? "bg-gray-800" : " shadow-sm bg-white";
  return (
    <div
      className={`w-max-380 lg:p-5 p-3 mx-auto container duration-300 ${
        Faev ? "opacity-100" : "opacity-0"
      }`}
    >
      <div>
        <header className="mb-5">
          <h1
            className={`text-3xl lg:text-left text-center font-extrabold drop-shadow-sm ${
              theme === "dark" ? "text-yellow-500" : "text-blue-500"
            }`}
          >
            Dashboard{" "}
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-yellow-500"
              }`}
            >
              ช่าง
            </span>
          </h1>
          <p className={`text-lg mt-3 lg:mt-0 font-medium ${descrtiption}`}>
            ภาพรวมการทำงานของช่างคนนี้
          </p>
        </header>

        <section>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="grid lg:grid-cols-1  grid-cols-2 w-90 gap-5">
              {[
                {
                  title: "งานทั้งหมด",
                  key: "งานทั้งหมด",
                  color: "bg-blue-400",
                  color_bark: "bg-yellow-500",
                  link: "user/getpaper",
                },
                {
                  title: "เสร็จสิ้น",
                  key: "เสร็จสิ้น",
                  color: "bg-blue-500",
                  color_bark: "bg-yellow-500",
                  value: OpenModadShowfinishpopup,
                },
                {
                  title: "กำลังดำเนินการ",
                  key: "กำลังดำเนินการ",
                  color: "bg-blue-600",
                  color_bark: "bg-yellow-600",
                  value: OpenInProgressPopup, // <-- เรียก popup
                },
                {
                  title: "ล่าช้า",
                  key: "ล่าช้า",
                  color: "bg-blue-700",
                  color_bark: "bg-yellow-700",
                  value: opensetpopupdelayed,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`text-white rounded-2xl flex pl-5 lg:p p-5 justify-center flex-col shadow-lg ${
                    theme === "dark" ? item.color_bark : item.color
                  }`}
                >
                  <h2 className="text-2xl mb-3 font-extrabold">{item.title}</h2>
                  <p className="mb-3 font-extrabold text-xl">
                    <motion.pre>
                      {
                        employees.filter((j) => {
                          let statusMapped:
                            | "เสร็จสิ้น"
                            | "กำลังดำเนินการ"
                            | "ล่าช้า"
                            | undefined;

                          if (j.Status === "กำลังดำเนินการ") {
                            statusMapped = "กำลังดำเนินการ";
                          } else if (j.Status === "เสร็จสิ้น") {
                            statusMapped = "เสร็จสิ้น";
                          } else if (j.Status === "ล่าช้า") {
                            statusMapped = "ล่าช้า";
                          }

                          return item.key === "งานทั้งหมด"
                            ? true
                            : statusMapped === item.key;
                        }).length
                      }
                    </motion.pre>
                  </p>
                  <div>
                    {item.title === "งานทั้งหมด" ? (
                      <Link
                        to={`/${item.link}`}
                        className={`relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:translate-y-1  after:opacity-0 after:transition after:duration-150 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-100 
                                       ${
                                         theme === "dark"
                                           ? "after:bg-white"
                                           : "after:bg-white"
                                       }`}
                      >
                        รายละเอียด
                      </Link>
                    ) : (
                      <button
                        onClick={item.value}
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

            <div className="w-full flex flex-col gap-3">
              <div className={`rounded-xl shadow-sm p-6 ${cardBg}`}>
                <h2
                  className={`text-2xl font-extrabold mb-4 text-center ${
                    theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  }`}
                >
                  จำนวนงานแต่ละเดือน
                </h2>
                <div className="w-full lg:h-160 h-120">
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
      {finish && (
        <div
          className={`z-50 lg:p-0 p-2 duration-300 inset-0 fixed justify-center items-center flex backdrop-blur-sm bg-black/40 ${
            anim ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl ${bgpopup} w-[900px] lg:h-200 h-180 shadow-2xl border$`}
          >
            <div className="flex items-center justify-between border-b px-6 py-4 ">
              <p
                className={` text-2xl  font-semibold  ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                งาน
                <span
                  className={`${
                    theme === "dark" ? "text-white" : "text-yellow-500"
                  }`}
                >
                  เสร็จ
                </span>
              </p>

              <div className="relative">
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
                                                       ? "lg:w-72 w-50 shadow-lg"
                                                       : "lg:w-60 w-40 border-gray-300"
                                                   }  
                                                   ${
                                                     theme === "dark"
                                                       ? "border-gray-600 focus:ring-yellow-500 bg-gray-700 text-white"
                                                       : " focus:ring-blue-400 bg-white text-gray-800"
                                                   }`}
                />
              </div>
            </div>
            <div className="lg:grid grid-cols-7 py-3 border-b mb-3 gap-5 px-6 hidden">
              {[
                { name: "ใบงาน" },
                { name: "รายละเอียดงาน" },
                { name: "วันเริ่มงาน" },
                { name: "วันปิดงาน" },
                { name: "รายละเอียด" },
              ].map((e, i) => {
                return (
                  <div
                    className={` ${i === 4 ? "text-center" : ""} ${
                      i === 4 || i === 1 ? "col-span-2 " : "col-span-1"
                    }`}
                    key={i}
                  >
                    <p className="">{e.name}</p>
                  </div>
                );
              })}
            </div>
            <div className="h-150 border-b overflow-y-auto scrollber-hide px-6">
              {employees
                .filter((emp) => emp.Status === "เสร็จสิ้น") // เฉพาะงานเสร็จ
                .filter((emp) =>
                  emp.Worksheet?.toLowerCase().includes(Search.toLowerCase())
                ) // ค้นหาใบงาน
                .map((emp) => (
                  <div
                    key={emp._id}
                    className="grid grid-cols-7 py-3 border-b gap-5 items-center"
                  >
                    <div className="col-span-1 truncate">
                      {emp.Worksheet || "-"}
                    </div>
                    <div className="col-span-2 truncate">
                      {emp.description || "-"}
                    </div>
                    <div className="col-span-1">
                      {formatDate(emp.Date_of_acceptance_of_work)}
                    </div>
                    <div className="col-span-1">
                      {formatDate(emp.Closing_date)}
                    </div>
                    <div className="col-span-2 text-center">
                      {/* {emp.Details || emp.description || "-"} */}
                      <Link to={`/user/Detailwork/${emp._id}`}>
                        {" "}
                        <button
                          className={`relative overflow-hidden cursor-pointer rounded-md  px-2 py-1 text-white text-sm shadow-md transition-all duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
              active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
                theme === "dark"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
                        >
                          รายละเอียด
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-end gap-4 lg:pr-4 lg:mt-4 pr-3 my-2">
              <button
                onClick={closeModalfinish}
                className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-white px-4  text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
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

      {inProgress && (
        <div
          className={`z-50 duration-300 lg:p-0 p-2 inset-0 fixed justify-center items-center flex backdrop-blur-sm bg-black/40 ${
            animInProgress ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl ${bgpopup} lg:w-[900px]  lg:h-200 h-180 shadow-2xl border `}
          >
            <div className="flex items-center justify-between border-b px-6 py-4 ">
              <p
                className={` text-2xl  font-semibold lg:w-full w-30  ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                งาน
                <span
                  className={`${
                    theme === "dark" ? "text-white" : "text-yellow-500"
                  }`}
                >
                  กำลังดำเนินการ
                </span>
              </p>

              <div className="relative">
                <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300" />
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
                  ? "lg:w-72 w-50 shadow-lg"
                  : "lg:w-60 w-40 border-gray-300"
              }  
              ${
                theme === "dark"
                  ? "border-gray-600 focus:ring-yellow-500 bg-gray-700 text-white"
                  : " focus:ring-blue-400 bg-white text-gray-800"
              }`}
                />
              </div>
            </div>

            <div className="lg:grid hidden  grid-cols-7 py-3 border-b gap-5 px-6">
              {[
                "ใบงาน",
                "รายละเอียดงาน",
                "วันเริ่มงาน",
                "วันปิดงาน",
                "รายละเอียด",
              ].map((e, i) => (
                <div
                  className={` ${i === 4 ? "text-center" : ""} ${
                    i === 4 || i === 1 ? "col-span-2 " : "col-span-1"
                  }`}
                  key={i}
                >
                  <p>{e}</p>
                </div>
              ))}
            </div>

            <div className="lg:h-155 h-140 border-b overflow-y-auto scrollber-hide px-6">
              {employees
                .filter(
                  (emp) =>
                    emp.Status === "Active" || emp.Status === "กำลังดำเนินการ"
                )
                .filter((emp) =>
                  (emp.Worksheet || "")
                    .toLowerCase()
                    .includes(Search.toLowerCase())
                )
                .map((emp) => (
                  <div
                    key={emp._id}
                    className="grid lg:grid-cols-7 grid-cols-5 py-3 border-b gap-5 items-center"
                  >
                    <div className="col-span-1 truncate">
                      {emp.Worksheet || "-"}
                    </div>
                    <div className="col-span-2 truncate">
                      {emp.description || "-"}
                    </div>
                    <div className="col-span-1 hidden lg:block">
                      {formatDate(emp.Date_of_acceptance_of_work)}
                    </div>
                    <div className="col-span-1 hidden lg:block">
                      {formatDate(emp.Closing_date)}
                    </div>

                    <div className="col-span-2 text-center">
                      <Link to={`/user/Detailwork/${emp._id}`}>
                        <button
                          className={`relative overflow-hidden cursor-pointer rounded-md px-2 py-1 text-white text-sm shadow-md transition-all duration-300 
            [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
            active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
              theme === "dark"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
                        >
                          รายละเอียด
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-end gap-4 lg:pr-4 lg:mt-4 pr-3 mt-3">
              <button
                onClick={closeModalinProgress}
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

      {popupdelayed && (
        <div
          className={`z-50 duration-300 inset-0 fixed justify-center items-center flex backdrop-blur-sm bg-black/40 ${
            anim ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl ${bgpopup} lg:w-[900px]  lg:h-200  shadow-2xl borde`}
          >
            <div className="flex items-center justify-between border-b px-6 py-4 ">
              <p
                className={` text-2xl  font-semibold  ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                งาน
                <span
                  className={`${
                    theme === "dark" ? "text-white" : "text-yellow-500"
                  }`}
                >
                  ล่าช้า
                </span>
              </p>

              <div className="relative">
                <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300" />
                <input
                  placeholder="ค้นหาใบงาน..."
                  onChange={(e) => setSearch(e.target.value)}
                  value={Search}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  type="text"
                  className={`border rounded-xl pl-10 pr-3 duration-300 transition-all focus:outline-none focus:ring-2 py-1 
              ${focused ? "w-72 shadow-lg" : "w-60 border-gray-300"}  
              ${
                theme === "dark"
                  ? "border-gray-600 focus:ring-yellow-500 bg-gray-700 text-white"
                  : " focus:ring-blue-400 bg-white text-gray-800"
              }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-7 py-3 border-b gap-5 px-6">
              {[
                "ใบงาน",
                "รายละเอียดงาน",
                "วันเริ่มงาน",
                "วันปิดงาน",
                "รายละเอียด",
              ].map((e, i) => (
                <div
                  className={` ${i === 4 ? "text-center" : ""} ${
                    i === 4 || i === 1 ? "col-span-2 " : "col-span-1"
                  }`}
                  key={i}
                >
                  <p>{e}</p>
                </div>
              ))}
            </div>

            <div className="h-150 border-b overflow-y-auto scrollber-hide px-6">
              {employees
                .filter(
                  (emp) => emp.Status === "Active" || emp.Status === "ล่าช้า"
                )
                .filter((emp) =>
                  (emp.Worksheet || "")
                    .toLowerCase()
                    .includes(Search.toLowerCase())
                )
                .map((emp) => (
                  <div
                    key={emp._id}
                    className="grid grid-cols-7 py-3 border-b gap-5 items-center"
                  >
                    <div className="col-span-1 truncate">
                      {emp.Worksheet || "-"}
                    </div>
                    <div className="col-span-2 truncate">
                      {emp.description || "-"}
                    </div>
                    <div className="col-span-1">
                      {formatDate(emp.Date_of_acceptance_of_work)}
                    </div>
                    <div className="col-span-1">
                      {formatDate(emp.Closing_date)}
                    </div>
                    <div className="col-span-2 text-center">
                      <Link to={`/user/Detailwork/${emp._id}`}>
                        <button
                          className={`relative overflow-hidden cursor-pointer rounded-md px-2 py-1 text-white text-sm shadow-md transition-all duration-300 
            [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
            active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
              theme === "dark"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
                        >
                          รายละเอียด
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-end gap-4 lg:pr-4 lg:mt-4">
              <button
                onClick={closepopupdelayed}
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

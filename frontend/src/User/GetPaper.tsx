import { useTheme } from "@/components/theme-provider";
import { useEffect, useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";

interface Employee {
  _id: string;
  Worksheet?: string;
  Supervisor?: string;
  PhoneNumber?: string;
  Date_of_acceptance_of_work?: string;
  Closing_date?: string;
  Details?: string;
  description?: string;
}

interface Tradesman {
  _id: string;
  Name: string;
  employeeId: string;
  id: string;
}

interface JwtPayload {
  id: string;
}

export default function GetPaper() {
  const { theme } = useTheme();
  const [fade, setFade] = useState(false);
  const [focused, setFocused] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [opendateJob, setopendateJob] = useState(false);
  const [FadedataJob, setFadedataJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Employee | null>(null);

  const token = localStorage.getItem("token");
  const decoded: JwtPayload | null = token
    ? jwtDecode<JwtPayload>(token)
    : null;
  const currentUserId = decoded?.id;

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      const [resEmp, resTrades] = await Promise.all([
        fetch("http://localhost:5000/api/employees"),
        fetch("http://localhost:5000/api/otherTradesman", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const employees: Employee[] = await resEmp.json();
      const tradesmen: Tradesman[] = await resTrades.json();

      // หา employeeId ที่ user ปัจจุบันอยู่ในนั้น
      const myJobIds = tradesmen
        .filter((t) => t.id === currentUserId)
        .map((t) => t.employeeId);

      // กรองเฉพาะงานที่อยู่ใน myJobIds
      const myJobs = employees.filter((emp) => myJobIds.includes(emp._id));

      setEmployees(myJobs);
      setFiltered(myJobs);
    } catch (err) {
      console.error(err);
    }
  }, [token, currentUserId]);

  //Fad

  const OpneFadDataJob = (job: Employee) => {
    setSelectedJob(job); // 👈 เก็บงานที่คลิกไว้
    setFadedataJob(false); // เริ่มจาก false ก่อน
    setopendateJob(true); // เปิด modal ก่อน
    setTimeout(() => setFadedataJob(true), 50); // แล้วค่อย fade-in
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ค้นหาใบงาน
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(employees);
    } else {
      setFiltered(
        employees.filter((e) =>
          (e.Worksheet || "").toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, employees]);

  const border_b_2_data =
    theme === "dark"
      ? "text-yellow-500 border-yellow-500"
      : "text-blue-500 border-blue-500";

  const headerBg =
    theme === "dark"
      ? "bg-gray-900 border-gray-700"
      : "bg-gray-100 border-gray-300";

  const bg = theme ? "bg-gray-800" : "";

  return (
    <div
      className={`transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-max-380 p-5 mx-auto container">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <p
            className={`text-3xl font-extrabold ${
              theme === "dark" ? "text-yellow-500" : "text-blue-500"
            }`}
          >
            ใบ
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-yellow-500"
              }`}
            >
              งาน
            </span>
          </p>

          <div className="relative">
            <CiSearch
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300`}
            />
            <input
              placeholder="ค้นหาใบงาน..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              type="text"
              className={`border rounded-xl pl-10 pr-3 duration-300 transition-all focus:outline-none focus:ring-2 py-1 
              ${focused ? "w-72 shadow-lg" : "w-60 border-gray-300"}  
              ${
                theme === "dark"
                  ? "border-gray-600 focus:ring-yellow-500 bg-gray-700 text-white"
                  : "border-b-purple-300 focus:ring-blue-400 bg-white text-gray-800"
              }`}
            />
          </div>
        </div>

        {/* Header Row */}
        <div
          className={`grid grid-cols-6 gap-5 border-b-2 px-5 text-lg items-center font-semibold mb-3 ${border_b_2_data}`}
        >
          <div>ใบงาน</div>
          <div>หัวหน้างาน</div>
          <div>เบอร์ติดต่อ</div>
          <div>วันเริ่มงาน</div>
          <div>วันปิดงาน</div>
          <div>รายละเอียด</div>
        </div>

        {/* ข้อมูลใบงาน */}
        {filtered.length > 0 ? (
          filtered.map((job) => (
            <div
              key={job._id}
              className={`grid grid-cols-6 items-center gap-5 px-5 mb-1 border rounded-lg mt-2 py-1 text-sm ${headerBg}`}
            >
              <p>{job.Worksheet || "-"}</p>
              <p>{job.Supervisor || "-"}</p>
              <p>{job.PhoneNumber || "-"}</p>
              <p>
                {job.Date_of_acceptance_of_work
                  ? new Date(job.Date_of_acceptance_of_work).toLocaleDateString(
                      "th-TH"
                    )
                  : "-"}
              </p>
              <p>
                {job.Closing_date
                  ? new Date(job.Closing_date).toLocaleDateString("th-TH")
                  : "-"}
              </p>
              {/* <p>{job.description || "-"}</p> */}
              <button
                onClick={() => OpneFadDataJob(job)}
                className={`relative w-fit overflow-hidden cursor-pointer rounded-md  px-3 py-1 text-white text-sm shadow-md transition-all duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
              active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
                theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
              }`}
              >
                รายละเอียดงาน
              </button>
            </div>
          ))
        ) : (
          <div
            className={`text-center py-5 font-semibold ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            ไม่พบใบงานของคุณ ในเวลานี่
          </div>
        )}
      </div>

      {/* opendateJob */}

      {opendateJob && selectedJob && (
        <div
          className={`inset-0 fixed z-50 items-center flex justify-center backdrop-blur-sm duration-300 bg-black/40 ${
            FadedataJob ? " opacity-100" : "opacity-0"
          }`}
        >
          <div className={`w-220 h-180 p-8 ${bg}`}>
            <p>รายละเอียดงาน {selectedJob.Worksheet}</p>
          </div>
        </div>
      )}
    </div>
  );
}

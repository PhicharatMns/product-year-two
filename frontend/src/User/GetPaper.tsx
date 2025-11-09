import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
// ❌ import { CiSearch } from "react-icons/ci"; // Removed due to import error
import jwtDecode from "https://unpkg.com/jwt-decode@3.1.2/build/jwt-decode.esm.js"; // ✅ Using CDN

import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "framer-motion"; // ✨ 1. เพิ่ม Import สำหรับอนิเมชั่น

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
  // --- ⬇️ 1. เปิดใช้งาน State สำหรับ Modal "รายละเอียดงาน" ---
  const [opendateJob, setopendateJob] = useState(false);
  const [FadedataJob, setFadedataJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Employee | null>(null);

  // --- State สำหรับ Modal "เบิกของ" (จากปุ่มที่ 2) ---
  const [OpendateItem, setOpendateItem] = useState(false);
  // const [opendateJob, setopendateJob] = useState(false);
  // const [FadedataJob, setFadedataJob] = useState(false);
  // const [selectedJob, setSelectedJob] = useState<Employee | null>(null);

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

  // const OpneFadDataJob = (job: Employee) => {
  //   setSelectedJob(job); // 👈 เก็บงานที่คลิกไว้
  //   setFadedataJob(false); // เริ่มจาก false ก่อน
  //   setopendateJob(true); // เปิด modal ก่อน
  //   setTimeout(() => setFadedataJob(true), 50); // แล้วค่อย fade-in
  // };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  // const text_color = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  // const haedtext = theme === "dark" ? "text-white" : "text-yellow-500";

  return (
    <div
      className={`transition-opacity duration-700   ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-380 p-5 mx-auto container">
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
            {/* ❌ Replaced CiSearch with inline SVG due to import error */}
            {/* <CiSearch
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300`}
            /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
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
          <div className="text-center">รายละเอียด</div>
        </div>

        {/* ข้อมูลใบงาน */}
        {filtered.length > 0 ? (
          filtered.map((job) => (
            <div
              key={job._id}
              className={`grid grid-cols-6 items-center gap-5 px-5 mb-1 border rounded-lg mt-2 py-1  ${headerBg}`}
            >
              <p className="truncate">{job.Worksheet || "-"}</p>
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
              <div className="flex gap-2 mx-auto">
                <Link
                  to={`/user/Detailwork/${job._id}`}
                  className={` relative w-fit overflow-hidden cursor-pointer rounded-md  px-3 py-1 text-white text-sm duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             active:translate-y-1 active:scale-x-110 active:scale-y-90 ${
               theme === "dark"
                 ? "bg-yellow-500 hover:bg-yellow-600"
                 : "bg-blue-500 hover:bg-blue-600"
             }`}
                >
                  รายละเอียดงาน
                </Link>
                <button
                  onClick={() => setOpendateItem(true)}
                  className={` relative w-fit overflow-hidden cursor-pointer rounded-md  px-3 py-1 text-white text-sm duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             active:translate-y-1 active:scale-x-110 active:scale-y-90 ${
               theme === "dark"
                 ? "bg-yellow-500 hover:bg-yellow-600"
                 : "bg-blue-500 hover:bg-blue-600"
             }`}
                >
                  เบิกของ
                </button>
              </div>
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

      {/* =========================================================
            MODAL 1: รายละเอียดงาน (โค้ดที่คุณเพิ่งส่งมา)
            =========================================================
      */}
      {opendateJob && selectedJob && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 duration-300 ${
            FadedataJob ? "opacity-100" : "opacity-0"
          } transition-opacity`}
          onClick={handleCloseJob} // 👈 6. ใช้ฟังก์ชันปิดที่ถูกต้อง
        >
          <div
            className={`w-full max-w-2xl h-auto p-8 rounded-xl ${bg} relative`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseJob} // 👈 6. ใช้ฟังก์ชันปิดที่ถูกต้อง
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <div className="border-b pb-2">
              <p className={`text-2xl font-extrabold ${text_color}`}>
                รายละเอียดงาน
                <span className={` ${haedtext}`}> {selectedJob.Worksheet}</span>
              </p>
            </div>

            {/* --- ⬇️ 7. แก้ไขการแสดงข้อมูลให้ตรงกับ Interface --- */}
            <div className={`mt-5 space-y-2 ${text_color}`}>
              <p className="font-semibold">
                หัวหน้างาน:
                <span className="font-normal ml-2">
                  {selectedJob.Supervisor || "-"}
                </span>
              </p>
              <p className="font-semibold">
                ตําเเหน่งงาน:
                {/* 'Position' ไม่มีใน Interface 'Employee' */}
                <span className="font-normal ml-2"> - </span>
              </p>
              <p className="font-semibold">
                เบอร์ติดต่อ:
                <span className="font-normal ml-2">
                  {selectedJob.PhoneNumber || "-"}
                </span>
              </p>

              {/* ⬇️ FIX: เพิ่ม <p> ที่หายไปสำหรับ "เมล" และ "รายละเอียด" */}
              <p className="font-semibold">
                เมล:
                {/* 'Email' ไม่มีใน Interface 'Employee' */}
                <span className="font-normal ml-2"> - </span>
              </p>
              <p className="font-semibold">
                รายละเอียด:
                <span className="font-normal ml-2">
                  {selectedJob.Details || "-"}
                </span>
              </p>
            </div>
            {/* ⬆️ FIX: เพิ่ม </div> ปิดสำหรับ 'mt-5' */}
          </div>
          {/* ⬆️ FIX: เพิ่ม </div> ปิดสำหรับ 'w-full max-w-2xl' */}
        </div>
      )} */}

      {OpendateItem && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">
          <div className="w-[900px] h-180 bg-gray-800 rounded-2xl"></div>
        </div>
      )}
      {/* --- ✨ สิ้นสุดส่วนที่แทนที่ --- */}

      {/* =========================================================
           ✨ ADD: 3. เพิ่ม POP-UP 3 "เสร็จสิ้น"
           =========================================================
      */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-60 flex items-center justify-center   p-4"
            // 💡 ใช้ z-[60] ให้อยู่เหนือ modal อื่น (z-50)
            onClick={() => setShowSuccessPopup(false)} // 👈 คลิกพื้นหลังเพื่อปิด
          >
            <div
              className={`
                w-full max-w-xs p-6 rounded-2xl shadow-xl
                flex flex-col items-center gap-4
                ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                }
              `}
              onClick={(e) => e.stopPropagation()} // 👈 ป้องกันการคลิกทะลุ
            >
              {/* ไอคอน Check (SVG) */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 0 }} // (แก้ rotate เป็น 0 หรือลบออกก็ได้ครับ)
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center 
                  ${
                    theme === "dark"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-green-100 text-green-600"
                  }
                `}
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5" // (เพิ่มความหนาเส้น)
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </motion.div>

              <h3 className="text-xl font-bold">ส่งคำขอเสร็จสิ้น!</h3>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                ระบบได้บันทึกคำขอของคุณแล้ว
              </p>

              <button
                onClick={() => setShowSuccessPopup(false)}
                className={`
                  mt-2 w-full px-4 py-2 rounded-lg text-sm font-medium 
                  transition-all duration-200
                  ${
                    theme === "dark"
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }
                `}
              >
                ตกลง
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- ✨ สิ้นสุด Pop-up 3 --- */}
    </div>
  );
}

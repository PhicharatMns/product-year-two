import { useTheme } from "@/components/theme-provider";
import { useEffect, useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

interface RequisitionItem {
  id: string;
  name: string;
  quantity: string;
}

export default function GetPaper() {
  const { theme } = useTheme();
  const [fade, setFade] = useState(false);
  const [focused, setFocused] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [selectedJob, setSelectedJob] = useState<Employee | null>(null);

  const [OpendateItem, setOpendateItem] = useState(false);
  const [fadeItem, setFadeItem] = useState(false);
  const [items, setItems] = useState<RequisitionItem[]>([]);

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

      const myJobIds = tradesmen
        .filter((t) => t.id === currentUserId)
        .map((t) => t.employeeId);

      const myJobs = employees.filter((emp) => myJobIds.includes(emp._id));

      setEmployees(myJobs);
      setFiltered(myJobs);
    } catch (err) {
      console.error(err);
    }
  }, [token, currentUserId]);

  // =========================================================
  // ===  1. อัปเดต: ให้มี 5 รายการคงที่เมื่อเปิด Modal ===
  // =========================================================
  const openItemModal = (job: Employee) => {
    setSelectedJob(job);

    // ---  สร้าง 5 รายการคงที่ ---
    const initialItems = Array.from({ length: 5 }, (_, i) => ({
      id: `${Date.now()}-${i}`, // สร้าง ID ที่ไม่ซ้ำกัน
      name: "",
      quantity: "",
    }));
    setItems(initialItems);

    setOpendateItem(true);
    setFadeItem(false);
    setTimeout(() => setFadeItem(true), 50);
  };

  const closeopenItemModal = () => {
    setFadeItem(false);
    setTimeout(() => {
      setOpendateItem(false);
      setSelectedJob(null);
      setItems([]); // ล้างค่า items เมื่อปิด
    }, 300);
  };

  // ---  2. อัปเดต: จัดการ state `items` (ลบ handleAddItem, handleDeleteItem) ---
  const handleItemChange = (
    id: string,
    field: "name" | "quantity",
    value: string
  ) => {
    if (field === "quantity" && Number(value) < 0) {
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
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

  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";

  return (
    <div
      className={`transition-opacity duration-700 ${
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
          <div className="text-center">รายละเอียด</div>
        </div>

        {/* ข้อมูลใบงาน */}
        {filtered.length > 0 ? (
          filtered.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className={`grid grid-cols-6 items-center gap-5 px-5 mb-1 border rounded-lg mt-2 py-1 ${headerBg}`}
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
                  onClick={() => openItemModal(job)}
                  className={` relative w-fit overflow-hidden cursor-pointer rounded-md px-3 py-1 text-white text-sm duration-300 
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
            </motion.div>
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
      {OpendateItem && selectedJob && (
        <div
          className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50 
  transition-opacity duration-500 ${fadeItem ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className={`w-[900px] h-200 rounded-2xl ${bg} flex flex-col shadow-xl overflow-hidden`}
          >
            {/* Modal Header */}
            <div
              className={`flex gap-2  px-6 py-4 text-2xl font-semibold ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <p
                className={
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }
              >
                ฟอร์มเบิกของ
              </p>
              <span className={` ${theme === "dark" ? "" : "text-yellow-500"}`}>
                (งาน{selectedJob.Worksheet})
              </span>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {/* ========================================================= */}
              {/* === ⭐️ 3. อัปเดต: ปรับ Layout (หัวตาราง) === */}
              {/* ========================================================= */}
              <div
                className={`grid grid-cols-3 text-center p-2 rounded-t-lg font-semibold shadow-sm 
  ${
    theme === "dark"
      ? "bg-gray-900 text-yellow-400 border-b border-gray-700"
      : "bg-blue-50 text-blue-600 border-b border-blue-200"
  }`}
              >
                <div className="col-span-2">รายชื่อ</div>
                <div>จำนวน</div>
                {/* (ลบ "ลบ" ออก) */}
              </div>

              {/* --- map รายการ 5 รายการ --- */}
              <div
                className={`transition-all duration-300 h-90 overflow-auto rounded-lg ${
                  theme === "dark" ? "border-gray-700" : "border-gray-300"
                }`}
              >
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    // --- ⭐️ 3. อัปเดต: ปรับ Layout (รายการ) ---
                    className={`grid grid-cols-3 gap-4 items-center py-3 px-4  ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }
                    ${index === items.length - 1 ? "border-b-0" : ""} 
                    `}
                  >
                    {/* รายชื่อ */}
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="ชื่ออุปกรณ์..."
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(item.id, "name", e.target.value)
                        }
                        className={`w-full p-2 rounded-lg border focus:ring-2 outline-none transition-all duration-200 
          ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 focus:ring-yellow-400 text-white placeholder-gray-400"
              : "bg-gray-50 border-gray-300 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
          }`}
                      />
                    </div>

                    {/* จำนวน */}
                    <div>
                      <input
                        type="number"
                        min="0"
                        placeholder="จำนวน"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(item.id, "quantity", e.target.value)
                        }
                        className={`w-full p-2 rounded-lg border focus:ring-2 outline-none transition-all duration-200 
          ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 focus:ring-yellow-400 text-white placeholder-gray-400"
              : "bg-gray-50 border-gray-300 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
          }`}
                      />
                    </div>

                    {/* --- ⭐️ 3. (ลบปุ่ม "ลบ" ออก) --- */}
                  </div>
                ))}
              </div>

              {/* --- ⭐️ 4. (ลบปุ่ม "เพิ่มรายการ" ออก) --- */}

              {/* หมายเหตุ */}
              <div className=" px-4 -mt-10 ">
                <p
                  className={`text-lg  mb-1 font-semibold ${
                    theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  }`}
                >
                  หมายเหตุ
                </p>
                <textarea
                  className={`border w-full px-2 py-2 rounded-lg h-24 resize-none focus:ring-2 outline-none duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-yellow-400 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            <div
              className={`flex justify-end gap-4 border-t p-4 ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={closeopenItemModal}
                className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
              >
                <span className="relative z-10">ยกเลิก</span>
                <span className="absolute inset-0 overflow-hidden pointer-events-none">
                  <span className="absolute left-0 top-0 w-0 h-full bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
                </span>
              </button>
              <button
                className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4 text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${
                  theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                }`}
              >
                <span className="relative z-10">ยืนยัน</span>
                <span className="absolute inset-0 overflow-hidden pointer-events-none">
                  <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20 transition-all duration-500 group-hover:w-full"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

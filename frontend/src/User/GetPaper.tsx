import { useTheme } from "@/components/theme-provider";
import { useEffect, useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
// ✨ FIX 1: 'jwt-decode' (v3+) ใช้ default import
// ✅ ใช้อันนี้แทน (ลิงก์ CDN ที่เคยเวิร์ก)
import jwtDecode from "https://unpkg.com/jwt-decode@3.1.2/build/jwt-decode.esm.js";import { Link } from "react-router-dom";
// ✨ FIX 2: เพิ่ม import ที่ขาดไป
import { motion, AnimatePresence } from "framer-motion";

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
  
  // --- State สำหรับ Modal "เบิกของ" ---
  const [OpendateItem, setOpendateItem] = useState(false);
  
  // ✨ FIX 3: คืนค่า State ที่จำเป็นสำหรับ Modal
  const [selectedJob, setSelectedJob] = useState<Employee | null>(null);
  const [itemRequests, setItemRequests] = useState([
    { id: 1, name: "", quantity: 1 },
  ]);
  const [requestNotes, setRequestNotes] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // (State ของ Modal 1 (รายละเอียด) ที่คุณ comment ออก)
  // const [opendateJob, setopendateJob] = useState(false);
  // const [FadedataJob, setFadedataJob] = useState(false);


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

  // (ฟังก์ชัน Modal 1 ที่คุณ comment ออก)
  // const OpneFadDataJob = (job: Employee) => {
  //   setSelectedJob(job);
  //   setFadedataJob(false);
  //   setopendateJob(true);
  //   setTimeout(() => setFadedataJob(true), 50);
  // };

  // ✨ FIX 4: คืนค่าฟังก์ชันที่จำเป็นสำหรับ Modal 2 (เบิกของ)
  
  // ฟังก์ชันปิดสำหรับ Modal "เบิกของ"
  const handleCloseItem = () => {
    setOpendateItem(false);
    setSelectedJob(null); 
    setItemRequests([{ id: 1, name: "", quantity: 1 }]);
    setRequestNotes("");
  };

  // ฟังก์ชันเปิดสำหรับ Modal "เบิกของ"
  const handleOpenItemModal = (job: Employee) => {
    setSelectedJob(job); // 👈 ต้องเก็บ job ที่เลือก
    setOpendateItem(true);
  };

  // ฟังก์ชันจัดการฟอร์ม "เบิกของ"
  const handleItemChange = (
    id: number,
    field: "name" | "quantity",
    value: string
  ) => {
    setItemRequests((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (field === "name") {
            return { ...item, name: value };
          }
          if (field === "quantity") {
            const numQuantity = Math.max(1, parseInt(value) || 1);
            return { ...item, quantity: numQuantity };
          }
        }
        return item;
      })
    );
  };

  // เพิ่มแถวใหม่
  const addNewItemRow = () => {
    const newId = Date.now();
    setItemRequests((prevItems) => [
      ...prevItems,
      { id: newId, name: "", quantity: 1 },
    ]);
  };

  // ลบแถว
  const removeItemRow = (id: number) => {
    setItemRequests((prevItems) =>
      prevItems.length > 1
        ? prevItems.filter((item) => item.id !== id)
        : prevItems
    );
  };

  // ส่งฟอร์ม
  const handleSubmitItemRequest = () => {
    const requestedItems = itemRequests.filter(
      (item) => item.name.trim() !== "" && item.quantity > 0
    );

    if (requestedItems.length === 0) {
      console.log("กรุณากรอกรายการอย่างน้อย 1 รายการ");
      return;
    }

    console.log("ส่งข้อมูลเบิกของสำหรับใบงาน:", selectedJob?.Worksheet);
    console.log("รายการที่ขอ:", requestedItems);
    console.log("หมายเหตุ:", requestNotes);
    
    handleCloseItem();
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 2500);
  };
  // (สิ้นสุดฟังก์ชัน Fix 4)


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

  // ✨ FIX 5: คืนค่าตัวแปร Theme ที่ Modals ต้องใช้
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const text_color = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const haedtext = theme === "dark" ? "text-white" : "text-black"; // (ปรับ text-yellow-500 เป็น text-black)


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
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
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
          filtered.map((job) => (
            <div
              key={job._id}
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
                  className={` relative w-fit overflow-hidden cursor-pointer rounded-md px-3 py-1 text-white text-sm duration-300 
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
                  onClick={() => handleOpenItemModal(job)} // ✨ FIX 6: เรียกใช้ฟังก์ชันที่ถูกต้อง
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

      {/* (Modal 1 ที่คุณ comment ออก) */}
      {/* {opendateJob && selectedJob && ( ... )} */}

      {/* ✨ FIX 7: แก้ไขโครงสร้าง JSX ของ Modal 2 ที่ซ้อนกันผิดพลาด */}
      {OpendateItem && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50 p-4"
          onClick={handleCloseItem}
        >
          <div
            className={`w-full max-w-150 h-auto ${bg} rounded-2xl p-6 relative overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseItem}
              className={`absolute top-4 right-4 rounded-full p-1
                 ${
                   theme === "dark"
                     ? "text-gray-400 hover:text-white hover:bg-gray-700"
                     : "text-gray-500 hover:text-black hover:bg-gray-100"
                 } 
                 transition-colors duration-200`}
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

            <h2
              className={`text-2xl ${text_color} font-bold ${haedtext} mb-4 pb-4 
                   border-b ${
                     theme === "dark" ? "border-gray-700" : "border-gray-200"
                   }`}
            >
              ฟอร์มเบิกของ
              <span
                className={`text-lg font-normal ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } ml-2`}
              >
                (ใบงานของ : {selectedJob?.Worksheet})
              </span>
            </h2>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                <div className="grid grid-cols-12 gap-4 px-2">
                  <label
                    className={`col-span-7 block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    ชื่อวัสดุ
                  </label>
                  <label
                    className={`col-span-2 block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    จำนวน
                  </label>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {itemRequests.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="grid grid-cols-12 gap-4 items-center"
                      >
                        <input
                          type="text"
                          placeholder="กรอกชื่อวัสดุ..."
                          value={item.name}
                          onChange={(e) =>
                            handleItemChange(item.id, "name", e.target.value)
                          }
                          className={`col-span-7 rounded-lg border shadow-sm px-3 py-2 
                               focus:outline-none transition duration-200
                               ${
                                 theme === "dark"
                                   ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
                                   : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                               }`}
                        />

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "quantity",
                              e.target.value
                            )
                          }
                          className={`col-span-2 w- rounded-lg border text-center shadow-sm px-3 py-2
                               focus:outline-none transition duration-200
                               ${
                                 theme === "dark"
                                   ? "bg-gray-700 border-gray-600 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
                                   : "bg-white border-gray-300 text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                               }`}
                        />

                        <div className="col-span-3 text-center">
                          {itemRequests.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItemRow(item.id)}
                              aria-label="Remove item"
                              className={`
                                  group 
                                  w-20 h-10 rounded-2xl 
                                  flex items-center justify-center
                                  bg-red-500 
                                  focus:outline-none focus:ring-2 focus:ring-red-500
                                  transition-all duration-200 ease-in-out
                                  ${
                                    theme === "dark"
                                      ? "text-white hover:text-red-400 hover:bg-red-900/50"
                                      : "text-white hover:text-red-500 hover:bg-red-100"
                                  }
                                `}
                            >
                              <svg
                                className="group-hover:hidden"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line
                                  x1="10"
                                  y1="11"
                                  x2="10"
                                  y2="17"
                                ></line>
                                <line
                                  x1="14"
                                  y1="11"
                                  x2="14"
                                  y2="17"
                                ></line>
                              </svg>

                              <span className="hidden group-hover:block font-semibold">
                                ลบ
                              </span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={addNewItemRow}
                  className={`w-full px-3 py-2 rounded-lg 
                       border-2 border-dashed 
                       font-medium 
                       transition-all duration-200
                       ${
                         theme === "dark"
                           ? "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                           : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
                       }`}
                >
                  + เพิ่มรายการ
                </button>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="notes"
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  หมายเหตุ
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="เขียนบันทึกหรือข้อสังเกตของคุณที่นี่..."
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  className={`
                           mt-1 block w-full rounded-lg shadow-sm border 
                           px-3 py-2 
                           resize-y 
                           focus:outline-none
                           transition-all duration-200 ease-in-out
                           ${
                             theme === "dark"
                               ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
                               : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                           }
                         `}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseItem}
                  className={`px-4 py-2 rounded-lg text-sm font-medium 
                       transition-all duration-200
                       ${
                         theme === "dark"
                           ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                           : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                       }`}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  onClick={handleSubmitItemRequest}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white 
                       transition-all duration-200
                       ${
                         theme === "dark"
                           ? "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700"
                           : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
                       }`}
                >
                  ส่งคำขอเบิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* ✨ FIX 8: ย้าย Modal 3 (Success) ออกมาอยู่นอก Modal 2 */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4"
            onClick={() => setShowSuccessPopup(false)}
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
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 0 }}
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
                  strokeWidth="2.5"
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
      
    </div>
  );
}
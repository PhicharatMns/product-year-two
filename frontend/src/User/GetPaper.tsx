import { useTheme } from "@/components/theme-provider";
import { useEffect, useState, useCallback } from "react";
// ❌ import { CiSearch } from "react-icons/ci"; // Removed due to import error
import jwtDecode from "https://unpkg.com/jwt-decode@3.1.2/build/jwt-decode.esm.js"; // ✅ Using CDN
// ❌ ลบ Link ออก เพราะเราจะใช้ปุ่มเปิด Modal แทน
// import { Link } from "react-router-dom";
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

  // --- ⬇️ State สำหรับฟอร์มเบิกของ (เปลี่ยนเป็นแบบกรอกข้อมูล) ---
  const [itemRequests, setItemRequests] = useState([
    { id: 1, name: "", quantity: 1 }, // 1. เริ่มต้นด้วยแถวว่าง 1 แถว
  ]);
  const [requestNotes, setRequestNotes] = useState("");
  // ------------------------------------

  // ✨ ADD: 1. เพิ่ม State สำหรับ Pop-up "เสร็จสิ้น"
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

  // --- ⬇️ 2. เปิดใช้งานฟังก์ชันเปิด Modal "รายละเอียดงาน" ---
  const OpneFadDataJob = (job: Employee) => {
    setSelectedJob(job); // 👈 เก็บงานที่คลิกไว้
    setFadedataJob(false); // เริ่มจาก false ก่อน
    setopendateJob(true); // เปิด modal ก่อน
    setTimeout(() => setFadedataJob(true), 50); // แล้วค่อย fade-in
  };

  // --- ⬇️ 3. เพิ่มฟังก์ชันสำหรับ "ปิด" Modal ---

  // ฟังก์ชันปิดสำหรับ Modal "รายละเอียดงาน" (แบบมี Fade-out)
  const handleCloseJob = () => {
    setFadedataJob(false); // 1. สั่งให้จาง
    setTimeout(() => {
      setopendateJob(false); // 2. ปิด Modal หลังจากจางเสร็จ
      setSelectedJob(null); // 3. (แนะนำ) ล้างข้อมูลที่เลือกไว้
    }, 300); // 300ms = duration-300
  };

  // ฟังก์ชันปิดสำหรับ Modal "เบิกของ" (แบบธรรมดา)
  const handleCloseItem = () => {
    setOpendateItem(false);
    setSelectedJob(null); // (แนะนำ) ล้างข้อมูลที่เลือกไว้
    // (แนะนำ) รีเซ็ตฟอร์ม
    setItemRequests([{ id: 1, name: "", quantity: 1 }]); // 👈 อัปเดต State เริ่มต้น
    setRequestNotes("");
  };

  // --- ⬇️ 3. เพิ่มฟังก์ชันสำหรับ "เปิด" Modal เบิกของ ---
  const handleOpenItemModal = (job: Employee) => {
    setSelectedJob(job); // 1. ตั้งค่า job ที่เลือก
    setOpendateItem(true); // 2. เปิด Modal
  };

  // --- ⬇️ 3. เปลี่ยนฟังก์ชันสำหรับ "จัดการ" ฟอร์มเบิกของ ---
  // (ลบ handleItemCheck)

  // (อัปเดต) อัปเดตข้อมูลในแถว (ชื่อ หรือ จำนวน)
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
            // อนุญาตให้เป็น 1 หรือค่าบวก
            const numQuantity = Math.max(1, parseInt(value) || 1);
            return { ...item, quantity: numQuantity };
          }
        }
        return item;
      })
    );
  };

  // (เพิ่ม) เพิ่มแถวใหม่
  const addNewItemRow = () => {
    const newId = Date.now(); // ใช้วันที่/เวลา เพื่อให้ id ไม่ซ้ำกัน
    setItemRequests((prevItems) => [
      ...prevItems,
      { id: newId, name: "", quantity: 1 },
    ]);
  };

  // (เพิ่ม) ลบแถว (เฉพาะเมื่อมีมากกว่า 1 แถว)
  const removeItemRow = (id: number) => {
    setItemRequests((prevItems) =>
      prevItems.length > 1
        ? prevItems.filter((item) => item.id !== id)
        : prevItems
    );
  };

  // ✨ UPDATE: 2. อัปเดตฟังก์ชันส่งข้อมูล ให้เปิด Pop-up
  const handleSubmitItemRequest = () => {
    console.log("ส่งข้อมูลเบิกของสำหรับใบงาน:", selectedJob?.Worksheet);

    // กรองแถวที่กรอกข้อมูลครบถ้วน
    const requestedItems = itemRequests.filter(
      (item) => item.name.trim() !== "" && item.quantity > 0
    );

    if (requestedItems.length === 0) {
      console.log("กรุณากรอกรายการอย่างน้อย 1 รายการ");
      // (สามารถแสดง alert หรือข้อความเตือนผู้ใช้)
      return;
    }

    console.log("รายการที่ขอ:", requestedItems);
    console.log("หมายเหตุ:", requestNotes);
    // ... ที่นี่ คุณสามารถส่งข้อมูล (POST request) ไปยัง API ของคุณ ...

    // 1. ปิด Modal "เบิกของ" หลังจากส่ง
    handleCloseItem();

    // 2. เปิด Pop-up "เสร็จสิ้น"
    setShowSuccessPopup(true);

    // 3. ตั้งเวลาปิด Pop-up "เสร็จสิ้น" อัตโนมัติ (เช่น 2.5 วินาที)
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 2500);
  };

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

  // --- ⬇️ 4. เปิดใช้งานตัวแปร Theme ที่ Modal ต้องใช้ ---
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const text_color = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const haedtext = theme === "dark" ? "text-white" : "text-black"; // (ปรับจาก text-yellow-500 เป็น text-black ใน light mode ให้อ่านง่ายขึ้น)

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
                {/* --- ⬇️ 5. เปลี่ยนจาก Link เป็น Button ที่เรียก Modal --- */}
                <button
                  onClick={() => OpneFadDataJob(job)} // 👈 เรียกฟังก์ชันเปิด
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
                  onClick={() => handleOpenItemModal(job)} // 👈 ปุ่มนี้เปิด Modal "เบิกของ"
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
      )}

      {/* =========================================================
            ✨✨ MODAL 2: เบิกของ (อัปเกรดแล้ว) ✨✨
            (นี่คือโค้ดส่วนที่ถูกแทนที่ทั้งหมด)
            =========================================================
      */}
      {OpendateItem && selectedJob && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50 p-4" // ✨ เพิ่ม p-4
          onClick={handleCloseItem}
        >
          <div
            className={`w-full max-w-150 h-auto ${bg} rounded-2xl p-6 relative overflow-hidden`} // ✨ เปลี่ยน w-[900px] เป็น max-w-4xl
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
              {/* ... (SVG X Icon) ... */}
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

            {/* ✨ (ปรับปรุง) Header: เพิ่มเส้นขอบล่าง (border-b) */}
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
              {/* ✨ (ปรับปรุง) Layout: เปลี่ยนเป็น grid-cols-12 */}
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                {/* --- ส่วนหัวตาราง --- */}
                <div className="grid grid-cols-12 gap-4 px-2">
                  <label
                    className={`col-span-7 block text-sm font-medium ${
                      // 👈 1. ปรับความกว้าง Label "ชื่อวัสดุ"
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    ชื่อวัสดุ
                  </label>
                  <label
                    className={`col-span-2 block text-sm font-medium ${
                      // 👈 2. ปรับความกว้าง Label "จำนวน"
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    จำนวน
                  </label>
                </div>

                {/* --- ✨ (อนิเมชั่น) ลูปสร้างแถว --- */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {" "}
                    {/* 👈 1. หุ้ม list ด้วย AnimatePresence */}
                    {itemRequests.map((item) => (
                      <motion.div // 👈 2. เปลี่ยน div เป็น motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -10, height: 0 }} // 👈 3. อนิเมชั่น "เริ่ม"
                        animate={{ opacity: 1, y: 0, height: "auto" }} // 👈 4. อนิเมชั่น "เด้งเข้า"
                        exit={{ opacity: 0, x: -100, height: 0 }} // 👈 5. อนิเมชั่น "ลบ"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="grid grid-cols-12 gap-4 items-center"
                      >
                        {/* Input ชื่อวัสดุ */}
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
                                 // 👈 1. ยืด Input "ชื่อวัสดุ"
                                 theme === "dark"
                                   ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
                                   : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                               }`}
                        />

                        {/* Input จำนวน */}
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
                                 // 👈 2. ปรับขนาด Input "จำนวน" และแก้ w-50
                                 theme === "dark"
                                   ? "bg-gray-700 border-gray-600 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
                                   : "bg-white border-gray-300 text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                               }`}
                        />

                        {/* ✨ (ปรับปรุง) ปุ่มลบ: ตามสไตล์ที่คุณต้องการ */}
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
                                    // 👈 3. ลบ 'mt-2' ออกจากปุ่ม
                                    theme === "dark"
                                      ? "text-white hover:text-red-400 hover:bg-red-900/50"
                                      : "text-white hover:text-red-500 hover:bg-red-100"
                                  }
                                `}
                            >
                              {/* 4. Icon: ซ่อนเมื่อ hover */}
                              <svg
                                className="group-hover:hidden"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                /* ... svg path ... */
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

                              {/* 5. Text: แสดงเมื่อ hover */}
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

              {/* --- ✨ (ปรับปรุง) ปุ่มเพิ่มแถว --- */}
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

              {/* --- ✨ (ปรับปรุง) Textarea: ใช้สไตล์ที่สวยขึ้น --- */}
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

              {/* --- ส่วนปุ่ม Submit --- */}
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

import { useTheme } from "@/components/theme-provider";
import { useEffect, useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom"; // --- 3. เราจะใช้ปุ่มเปิด Modal แทน Link ---
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
  Status?: string;
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

// --- Interface สำหรับรายการเบิกของ ---
interface RequisitionItem {
  jobId?: string;
  id: string;
  name: string;
  quantity: string;
  description?: string;
  requesterName?: string; // ชื่อคนขอเบิก
  requesterProfile?: string; // รูปโปรไฟล์
  section?: string;
  role?: string;
  status?: string;
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
  const [PopupupDate, setPopupupDate] = useState(false);
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

  // --- ฟังก์ชันสำหรับ Modal "เบิกของ" (อัปเดต) ---
  const openItemModal = (job: Employee) => {
    setSelectedJob(job);
    //  ตั้งค่าเริ่มต้นให้มี  รายการ ---
    setItems(
      Array.from({ length: 4 }, (_, i) => ({
        id: (Date.now() + i).toString(),
        name: "",
        quantity: "",
      }))
    );
    setOpendateItem(true);
    setFadeItem(false);
    setTimeout(() => setFadeItem(true), 50);
  };

  const closeopenItemModal = () => {
    setFadeItem(false);
    setTimeout(() => {
      setOpendateItem(false);
      setSelectedJob(null);
      setItems([]); // ล้างค่า items เมื่อปิด ---
    }, 300);
  };

  const openUpdatePopup = (job: Employee) => {
    setSelectedJob(job);
    setPopupupDate(true);
  };

  //  เพิ่มฟังก์ชันสำหรับจัดการรายการเบิกของ ---
  const handleItemChange = (
    id: string,
    field: "name" | "quantity" | "description",
    value: string
  ) => {
    // ป้องกันการใส่ค่าน้อยกว่า 0 สำหรับจำนวน
    if (field === "quantity" && Number(value) < 0) {
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddItem = () => {
    setItems([...items, { id: "temp-" + Date.now(), name: "", quantity: "" }]);
  };

  const handleDeleteItem = (id: string) => {
    // ไม่ต้องทำอะไรถ้าเหลือรายการเดียว (ปุ่มจะถูก disabled อยู่แล้ว)
    if (items.length <= 1) return;
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
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

  const API_URL = "http://localhost:5000/api/additem"; // เปลี่ยนตาม backend ของคุณ

  const [note, setNote] = useState("");

  // บันทึกรายการเบิกทั้งหมดเป็นรายการใหม่ (POST ทุกอัน)
  const submitItems = async () => {
    if (!selectedJob) return;

    // สมมติคุณมี API /api/user/:id เพื่อดึงชื่อและโปรไฟล์
    let requesterName = "ไม่ทราบ";
    let requesterProfile = "/default-profile.png";

    if (currentUserId) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/user/${currentUserId}`
        );
        const data = await res.json();
        requesterName = data.Name;
        requesterProfile = data.Profile || "/default-profile.png";
      } catch (err) {
        console.error("ไม่สามารถดึงข้อมูลผู้ใช้", err);
      }
    }

    try {
      await Promise.all(
        items.map((item) =>
          fetch(`${API_URL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              jobId: selectedJob._id,
              name: item.name,
              quantity: Number(item.quantity),
              description: note,
              requesterName,
              requesterProfile,
              section: "เบิกของ",
              role: "ช่าง",
              status: "รอดําเนินการ",
              additemecomfam: "รอดําเนินการ",
            }),
          })
        )
      );
      setNote("");
      closeopenItemModal();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  // ฟังก์ชันอัปเดตสถานะงาน และ บันทึก Log ลง additem
  const updateJobStatus = async (jobId: string) => {
    if (!token) return;

    // 1. เตรียมข้อมูลผู้ใช้ (Requester) เหมือนกับตอนเบิกของ
    let requesterName = "ไม่ทราบ";
    let requesterProfile = "/default-profile.png";

    if (currentUserId) {
      try {
        const resUser = await fetch(
          `http://localhost:5000/api/user/${currentUserId}`
        );
        const dataUser = await resUser.json();
        requesterName = dataUser.Name;
        requesterProfile = dataUser.Profile || "/default-profile.png";
      } catch (err) {
        console.error("ไม่สามารถดึงข้อมูลผู้ใช้", err);
      }
    }

    try {
      // 2. ยิง API 2 ตัวพร้อมกัน (Parallel Requests) เพื่อความรวดเร็ว
      const [resUpdate, resAddItem] = await Promise.all([
        // Request 1: อัปเดตสถานะงาน (PUT)
        fetch(`http://localhost:5000/api/employees/${jobId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Status: "เสร็จสิ้น",
            section: "เสร็จสิ้นงาน", // อัปเดต section ใน employee
          }),
        }),

        // Request 2: เพิ่ม Log ลงใน additems (POST)
        fetch("http://localhost:5000/api/additem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobId: jobId,
            name: "ปิดงาน (Finished)", // ชื่อรายการ
            quantity: 1,
            description: "ดำเนินการปิดงานเสร็จสิ้น", // รายละเอียด
            requesterName,
            requesterProfile,
            section: "ปิดงาน", // แยก section ให้ชัดเจน
            role: "ช่าง",
            status: "เสร็จสิ้น",
            additemecomfam: "เสร็จสิ้น",
          }),
        }),
      ]);

      // 3. ตรวจสอบผลลัพธ์
      if (!resUpdate.ok) {
        const errorData = await resUpdate.json();
        throw new Error(errorData.error || "อัปเดตสถานะงานไม่สำเร็จ");
      }

      if (!resAddItem.ok) {
        console.warn("บันทึก Log ลง additem ไม่สำเร็จ แต่อัปเดตสถานะงานแล้ว");
        // อาจจะไม่ต้อง throw error ถ้ามองว่าการ update สำคัญกว่า
      }

      // 4. อัปเดต State หน้าเว็บทันที (ไม่ต้อง Reload)
      setEmployees((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? { ...job, Status: "เสร็จสิ้น", section: "เสร็จสิ้นงาน" }
            : job
        )
      );

      alert("อัปเดตสถานะและบันทึกข้อมูลเรียบร้อย!");
      setPopupupDate(false); // ปิด Popup
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด: " + err);
    }
  };
  const border_b_2_data =
    theme === "dark"
      ? "text-yellow-500 border-yellow-500"
      : "text-blue-500 border-blue-500";

  const headerBg =
    theme === "dark"
      ? "bg-gray-900 border-gray-700"
      : "bg-gray-100 border-gray-300";

  const texthaed = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";

  return (
    <div
      className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"
        }`}
    >
      <div className="max-w-380 p-5 mx-auto container">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <p
            className={`text-3xl font-extrabold ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
              }`}
          >
            ใบ
            <span
              className={`${theme === "dark" ? "text-white" : "text-yellow-500"
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
              ${theme === "dark"
                  ? "border-gray-600 focus:ring-yellow-500 bg-gray-700 text-white"
                  : "border-b-purple-300 focus:ring-blue-400 bg-white text-gray-800"
                }`}
            />
          </div>
        </div>

        {/* Header Row */}
        <div
          className={`grid grid-cols-8 gap-5 border-b-2 px-5 text-lg items-center font-semibold mb-3 ${border_b_2_data}`}
        >
          <div>ชื่องาน</div>
          <div className="col-span-2">รายละเอียดงาน</div>
          <div>สถานะ</div>
          <div>วันเริ่มงาน</div>
          <div>วันปิดงาน</div>
          <div className="text-center col-span-2">รายละเอียด</div>
        </div>

        {/* ข้อมูลใบงาน */}
        {filtered.filter(
          (job) =>
            job.Status === "ล่าช้า" ||
            job.Status === "กำลังดำเนินการ" ||
            job.Status === "Active" ||
            job.Status === "เสร็จสิ้น"
        ).length > 0 ? (
          filtered
            .filter(
              (job) =>
                job.Status === "ล่าช้า" ||
                job.Status === "กำลังดำเนินการ" ||
                job.Status === "เสร็จสิ้น"
            )
            .sort((a, b) => {
              const statusOrder = ["ล่าช้า", "กำลังดำเนินการ", "เสร็จสิ้น"];

              //  เรียงตาม Status ตามลำดับที่กำหนด
              const statusA = a.Status ?? "";
              const statusB = b.Status ?? "";
              const statusDiff =
                statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
              if (statusDiff !== 0) return statusDiff;

              //  ถ้า Status เหมือนกัน เรียงตาม Closing_date ใกล้สุด → ไกลสุด
              const dateA = a.Closing_date
                ? new Date(a.Closing_date).getTime()
                : Infinity;
              const dateB = b.Closing_date
                ? new Date(b.Closing_date).getTime()
                : Infinity;
              return dateA - dateB;
            })
            .map((job, index) => (
              <motion.div
                key={job._id} // ใช้ job._id เป็น key
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.05 * index,
                  ease: "easeOut",
                }}
              >
                <div
                  className={`grid grid-cols-8 items-center gap-5 px-5 mb-1 border rounded-lg mt-2 py-1  ${headerBg}`}
                >
                  <p className="truncate">{job.Worksheet || "-"}</p>
                  <p className="col-span-2 truncate">
                    {job.description || "-"}
                  </p>
                  <p
                    className={`${job.Status === "กำลังดำเนินการ" ? texthaed : ""
                      } ${job.Status === "เสร็จสิ้น" ? "text-green-500" : ""} ${job.Status === "ล่าช้า" ? "text-red-500" : ""
                      }`}
                  >
                    {job.Status || "-"}
                  </p>
                  <p>
                    {job.Date_of_acceptance_of_work
                      ? new Date(
                        job.Date_of_acceptance_of_work
                      ).toLocaleDateString("th-TH")
                      : "-"}
                  </p>
                  <p>
                    {job.Closing_date
                      ? new Date(job.Closing_date).toLocaleDateString("th-TH")
                      : "-"}
                  </p>
                  <div className="flex gap-2 col-span-2 mx-auto">
                    <button
                      onClick={() => openUpdatePopup(job)}
                      className={`relative w-fit overflow-hidden cursor-pointer rounded-md px-3 py-1 text-white text-sm duration-300 
              [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
              active:translate-y-1 active:scale-x-110 active:scale-y-90 ${theme === "dark"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                      อัปเดตงาน
                    </button>
                    <button
                      onClick={() => openItemModal(job)}
                      className={`relative w-fit overflow-hidden cursor-pointer rounded-md px-3 py-1 text-white text-sm duration-300 
              [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
              active:translate-y-1 active:scale-x-110 active:scale-y-90 ${theme === "dark"
                          ? "bg-orange-500 hover:bg-orange-500"
                          : "bg-orange-500 hover:bg-orange-600"
                        }`}
                    >
                      เบิกของ
                    </button>
                    <Link
                      to={`/chief/DetailworkChief/${job._id}`}
                      className={`relative w-fit overflow-hidden cursor-pointer rounded-md px-3 py-1 text-white text-sm duration-300 
              [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
              active:translate-y-1 active:scale-x-110 active:scale-y-90 ${theme === "dark"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                      รายละเอียดงาน
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
        ) : (
          <div
            className={`text-center py-5 font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-600"
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
              className={`flex gap-2 border-b px-6 py-4 text-2xl font-semibold ${theme === "dark" ? "border-gray-700" : "border-gray-200"
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
              {/* หัวตาราง */}
              <div
                className={`grid grid-cols-4 text-center p-2 rounded-t-lg font-semibold shadow-sm 
  ${theme === "dark"
                    ? "bg-gray-900 text-yellow-500 border-b border-gray-700"
                    : "bg-blue-50/50 text-blue-500 border-b border-blue-200"
                  }`}
              >
                <div className="col-span-2">รายชื่อ</div>
                <div>จำนวน</div>
                <div className="pl-6"> ลบ</div>
              </div>

              {/* --- 5. เปลี่ยนมา map จาก state `items` --- */}
              <div className="transition-all h-67 overflow-auto  duration-300">
                {items.map((item, index) => (
                  <div
                    key={index} // --- ใช้ id ที่ไม่ซ้ำกันเป็น key ---
                    className={`grid grid-cols-4 gap-4 items-center py-3 border-b 
                    ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                  >
                    {/* รายชื่อ */}
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="ชื่ออุปกรณ์..."
                        value={item.name} // --- เชื่อม value ---
                        onChange={(e) =>
                          handleItemChange(item.id, "name", e.target.value)
                        } // --- เชื่อม onChange ---
                        className={`w-full p-2 rounded-lg border focus:ring-2 outline-none transition-all duration-200 
          ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 focus:ring-yellow-400 text-white placeholder-gray-400"
                            : "bg-gray-50 border-gray-300 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
                          }`}
                      />
                    </div>

                    {/* จำนวน */}
                    <div>
                      <input
                        type="number"
                        min="0" // --- ใส่ min เพื่อไม่ให้ติดลบ ---
                        placeholder="จำนวน"
                        value={item.quantity} // --- เชื่อม value ---
                        onChange={(e) =>
                          handleItemChange(item.id, "quantity", e.target.value)
                        } // --- เชื่อม onChange ---
                        className={`w-full p-2 rounded-lg border focus:ring-2 outline-none transition-all duration-200 
          ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 focus:ring-yellow-400 text-white placeholder-gray-400"
                            : "bg-gray-50 border-gray-300 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
                          }`}
                      />
                    </div>

                    {/* ปุ่มลบ */}
                    <div className="text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className={` relative w-fit overflow-hidden cursor-pointer rounded-md px-5 py-2 text-white text-sm duration-300 
                  [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
                  active:translate-y-1 active:scale-x-110 active:scale-y-90 ${items.length <= 1
                            ? "opacity-50 cursor-not-allowed" // --- สไตล์ตอน disable ---
                            : theme === "dark"
                              ? "hover:text-white"
                              : "hover:text-white"
                          } ${theme === "dark"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-red-500 hover:bg-red-600"
                          }`}
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- 5. ปุ่มเพิ่มรายการ --- */}
              <div className="flex justify-start">
                <button
                  onClick={handleAddItem}
                  className={`py-1 px-3 rounded-lg hover:scale-110 text-sm font-medium transition-all duration-200 ${theme === "dark"
                    ? "text-yellow-500 hover:bg-yellow-500 hover:text-gray-900"
                    : "text-blue-500 hover:bg-blue-500 hover:text-white"
                    } border ${theme === "dark" ? "border-yellow-500" : "border-blue-500"
                    }`}
                >
                  + เพิ่มรายการ
                </button>
              </div>

              {/* หมายเหตุ */}
              {/* หมายเหตุรวม */}
              <div>
                <p
                  className={`text-lg mb-1 font-semibold ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
                    }`}
                >
                  หมายเหตุ
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={`border w-full px-2 py-2 rounded-lg h-48 resize-none focus:ring-2 outline-none duration-200 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:ring-yellow-400 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
                    }`}
                />
              </div>
            </div>

            <div
              className={`flex justify-end gap-4 border-t p-4 ${theme === "dark" ? "border-gray-700" : "border-gray-200"
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
                onClick={submitItems}
                className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4 text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
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
      {/* //อัปเดตงาน */}
      {PopupupDate && selectedJob && (
        <div>
          <button
            onClick={() => updateJobStatus(selectedJob._id)}
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
          >
            อัปเดตงาน
          </button>
        </div>
      )}
    </div>
  );
}

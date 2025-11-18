import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/components/theme-provider";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

interface Employee {
  _id: string;
  Worksheet?: string;
  Date_of_acceptance_of_work?: string;
  Closing_date?: string;
}

interface Tradesman {
  _id: string;
  Name: string;
  employeeId: string;
  id: string;
}

interface Event {
  date: string;
  title: string;
  jobId?: string;
}

interface JwtPayload {
  id: string;
}

export default function CalendarChief() {
  const { theme } = useTheme();
  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [anim, setanim] = useState(false);
  const [fade, setFade] = useState(true);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");
  const [mounted, setMounted] = useState(false);

  const openSelectedDate = (date: string) => {
    setanim(false); // รีเซ็ตก่อน
    setSelectedDate(date); // ตั้งวันที่
    setTimeout(() => setanim(true), 50); // ให้ anim ทำงาน
  };

  const closeSelectedDate = () => {
    setanim(false); // เริ่ม fade-out
    setTimeout(() => setSelectedDate(null), 200); // ปิด modal หลัง animation
  };

  // ดึง current user id
  const token = localStorage.getItem("token");
  const decoded: JwtPayload | null = token
    ? jwtDecode<JwtPayload>(token)
    : null;
  const currentUserId = decoded?.id;

//   // ฟังก์ชันดูรายละเอียดงาน
//   const checkJob = async (jobId: string) => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/employees/check/${jobId}`
//       );
//       const data = await res.json();
//       if (!res.ok) return alert(data.message);
//       alert(`งาน: ${data.job.Worksheet}\nเจ้าของงาน: ${data.owner.Name}`);
//     } catch (err) {
//       console.error(err);
//     }
//   };

  // ดึงงานของช่างที่ล็อกอิน
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

      const calendarEvents: Event[] = employees
        .filter((emp) => myJobIds.includes(emp._id))
        .flatMap((emp) => {
          const start = emp.Date_of_acceptance_of_work?.split("T")[0];
          const end = emp.Closing_date?.split("T")[0];
          return [
            start && {
              date: start,
              title: emp.Worksheet || "งานเริ่ม",
              jobId: emp._id,
            },
            end && {
              date: end,
              title: emp.Worksheet ? `${emp.Worksheet} (จบงาน)` : "งานจบ",
              jobId: emp._id,
            },
          ].filter(Boolean) as Event[];
        });

      setEvents(calendarEvents);
    } catch (err) {
      console.error(err);
    }
  }, [token, currentUserId]);

  useEffect(() => {
    fetchData();
  }, [month, fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // เปลี่ยนเดือน
  const changeMonth = (offset: number) => {
    setSlideDir(offset > 0 ? "right" : "left"); // กำหนดทิศทาง
    setFade(false); // เริ่ม fade-out
    setTimeout(() => {
      setMonth((prev) => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + offset);
        return newMonth;
      });
      setFade(true); // fade-in หลังเปลี่ยนเดือน
    }, 300);
  };

  // วันแรกของเดือน
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  // วันสุดท้ายของเดือน
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  // JS: 0 = อาทิตย์, 1 = จันทร์ ... 6 = เสาร์
  // ต้องเปลี่ยนเป็น 0 = จันทร์ ... 6 = อาทิตย์
  const startDay = (start.getDay() + 6) % 7; // shift ให้วันจันทร์ = 0

  // สร้าง array ของวัน
  const days: (Date | null)[] = [
    ...Array(startDay).fill(null), // เติมช่องว่างก่อนวันแรก
    ...Array.from(
      { length: end.getDate() },
      (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)
    ),
  ];

  const daysOfWeek = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

  return (
    <div
      className={`w-max-380 my-5 p-5 mx-auto container
    transition-all duration-500 ease-out
    ${mounted ? "opacity-100 " : "opacity-0 "}
    ${
      theme === "dark"
        ? "bg-gray-900 shadow-2xl border border-gray-700"
        : "bg-white shadow-2xl border border-gray-200"
    }
    rounded-3xl
  `}
    >
      {/* Header */}
      <div className="flex justify-between mb-5 items-center">
        <p
          className={`text-3xl font-extrabold ${
            theme === "dark" ? "text-yellow-500" : "text-blue-500"
          }`}
        >
          ปฏิทิน{" "}
          <span
            className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}
          >
            งานของฉัน
          </span>
        </p>
        <div className="flex gap-5 items-center text-xl font-semibold">
          <button onClick={() => changeMonth(-1)}>
            <AiOutlineLeft className="text-2xl cursor-pointer" />
          </button>
          <h2 className="flex gap-2 w-60 pl-8 items-center">
            {month.toLocaleString("th-TH", { month: "long" })}
            <p>{month.toLocaleString("th-TH", { year: "numeric" })}</p>
          </h2>
          <button onClick={() => changeMonth(1)}>
            <AiOutlineRight className="text-2xl cursor-pointer" />
          </button>
        </div>
      </div>

      {/* ตารางวันที่ */}
      <div
        className={`border rounded-xl h-full p-3 ${
          theme === "dark" ? "bg-gray-900" : "shadow-xl"
        }`}
      >
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map((day, i) => (
            <div
              key={i}
              className={`text-center font-bold py-1 rounded-lg ${
                theme === "dark" ? "text-yellow-300" : "text-blue-700"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div
          className={`
    grid grid-cols-7 gap-2
    transition-all duration-300 ease-in-out
    ${
      fade
        ? "translate-x-0 opacity-100"
        : slideDir === "right"
        ? "translate-x-15 opacity-0"
        : "-translate-x-15 opacity-0"
    }
  `}
        >
          {days.map((day, i) => {
            const dayStr = day
              ? `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(
                  2,
                  "0"
                )}-${String(day.getDate()).padStart(2, "0")}`
              : null;

            const dayEvents = dayStr
              ? events.filter((e) => e.date === dayStr)
              : [];

            return (
              <div
                key={i}
                onClick={() => dayStr && openSelectedDate(dayStr)}
                className={`relative overflow-y-auto scrollbar-hide border-t h-35 rounded-lg border cursor-pointer transition-all duration-200
          ${
            theme === "dark"
              ? "hover:bg-gray-700 bg-gray-800"
              : "hover:bg-blue-50 shadow-4xl"
          }`}
              >
                {/* วันที่ */}
                {day && (
                  <p
                    className={`sticky top-0 z-10 text-sm font-bold pl-2 py-1 ${
                      theme === "dark" ? "bg-gray-800" : "bg-blue-50 text-black"
                    }`}
                  >
                    {day.getDate()}
                  </p>
                )}

                {/* รายการงานในวันนั้น */}
                {dayEvents.map((e, idx) => (
                  <div
                    key={idx}
                    className={`text-xs mt-1 px-2 transition-all duration-200 ${
                      theme === "dark" ? "text-yellow-300" : "text-blue-600"
                    }`}
                  >
                    <p
                      className={`rounded-sm pl-1 py-[2px] ${
                        theme === "dark"
                          ? "bg-yellow-500 text-white "
                          : "bg-blue-500 text-white "
                      }`}
                      //  ไม่ stopPropagation เพราะอยากให้คลิกได้ทุกส่วน
                      onClick={() => dayStr && openSelectedDate(dayStr)}
                    >
                      {e.title}
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal รายละเอียดวันที่ */}
      {selectedDate && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm duration-300 ${
            anim ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl w-[600px] h-200  shadow-2xl border ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between border-b px-6 py-4 ">
              <p
                className={` text-2xl  font-semibold  ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                งานวันที่{" "}
                <span
                  className={`${
                    theme === "dark" ? "text-white" : "text-yellow-500"
                  }`}
                >
                  {new Date(selectedDate).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
            <div className="px-6 border-b h-165 mb-2">
              {events.filter((e) => e.date === selectedDate).length > 0 ? (
                events
                  .filter((e) => e.date === selectedDate)
                  .map((e, i) => (
                    <motion.div
                      key={i}
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
                        className={`border p-3 my-4 rounded-xl ${
                          theme === "dark"
                            ? "bg-gray-900"
                            : "bg-gray-50 border shadow-sm"
                        }`}
                      >
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-yellow-500"
                              : "text-blue-500"
                          }`}
                        >
                          {e.title}
                        </span>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div
                  className={` p-3 my-4 rounded-xl text-center ${
                    theme === "dark"
                      ? " text-yellow-500"
                      : " text-blue-500 "
                  }`}
                >
                  วันนี่ ยังไม่มีงาน
                </div>
              )}
            </div>
            <div className="flex w-full px-6 justify-end">
              <button
                onClick={closeSelectedDate}
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

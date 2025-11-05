import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/components/theme-provider";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { BsXLg } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";

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

export default function Calendar() {
  const { theme } = useTheme();
  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [fade, setFade] = useState(true);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");

  // ดึง current user id
  const token = localStorage.getItem("token");
  const decoded: JwtPayload | null = token
    ? jwtDecode<JwtPayload>(token)
    : null;
  const currentUserId = decoded?.id;

  // ฟังก์ชันดูรายละเอียดงาน
  const checkJob = async (jobId: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/employees/check/${jobId}`
      );
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert(`งาน: ${data.job.Worksheet}\nเจ้าของงาน: ${data.owner.Name}`);
    } catch (err) {
      console.error(err);
    }
  };

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
              title: emp.Worksheet ? `${emp.Worksheet} (จบ)` : "งานจบ",
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

  // เปลี่ยนเดือน
  const changeMonth = (offset: number) => {
    setSlideDir(offset > 0 ? "right" : "left");
    setFade(false);
    setTimeout(() => {
      setMonth((prev) => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + offset);
        return newMonth;
      });
      setFade(true);
    }, 200);
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
      className={`w-max-380 p-5 mx-auto container
      ${fade ? "opacity-100" : "opacity-0"}
      ${!fade && slideDir === "right" ? "-translate-x-10" : ""}
      ${!fade && slideDir === "left" ? "translate-x-10" : ""}`}
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
        <div className="grid grid-cols-7 gap-2">
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
                onClick={() => dayStr && setSelectedDate(dayStr)}
                className={`relative overflow-y-auto scrollbar-hide border-t h-27 rounded-lg border cursor-pointer transition-all duration-200
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
                      onClick={() => dayStr && setSelectedDate(dayStr)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div
            className={`p-5 rounded-4xl ite ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className=" flex items-center w-80">
              <p className="text-lg font-semibold mb-2 gap-2 flex items-center">
                งานวันที่{" "}
                <span
                  className={`${
                    theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  }`}
                >
                  {new Date(selectedDate).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
              <div className="ml-auto ">
                <button className="cursor-pointer" onClick={() => setSelectedDate(null)}>
                  <BsXLg />
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full gap-2 mb-3 max-h-80 overflow-y-auto scrollbar-hide">
              {events
                .filter((e) => e.date === selectedDate)
                .map((e, idx) => (
                  <div
                    key={idx}
                    onClick={() => e.jobId && checkJob(e.jobId)}
                    className={`flex justify-between p-1 rounded cursor-pointer ${
                      theme === "dark"
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <span className="px-2">{e.title}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

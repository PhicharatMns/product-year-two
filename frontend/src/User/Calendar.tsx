import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/components/theme-provider";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { BsXLg } from "react-icons/bs";

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
}

interface Event {
  date: string;
  title: string;
}

export default function Calendar() {
  const { theme } = useTheme();
  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [fade, setFade] = useState(true);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");

  const fetchData = useCallback(async () => {
    try {
      const [resEmp, resTrades] = await Promise.all([
        fetch("http://localhost:5000/api/employees"),
        fetch("http://localhost:5000/api/otherTradesman")
      ]);

      const employees: Employee[] = await resEmp.json();
      const tradesmen: Tradesman[] = await resTrades.json();

      const calendarEvents: Event[] = [];

      employees.forEach(emp => {
        const startDate = emp.Date_of_acceptance_of_work?.split("T")[0];
        const endDate = emp.Closing_date?.split("T")[0];

        const tradesForJob = tradesmen.filter(t => t.employeeId === emp._id);

        if (tradesForJob.length > 0) {
          if (startDate) calendarEvents.push({ date: startDate, title: emp.Worksheet || "งานเริ่ม" });
          tradesForJob.forEach(t => {
            if (startDate) calendarEvents.push({ date: startDate, title: `${t.Name} (เริ่มทำงาน)` });
          });
          if (endDate) calendarEvents.push({ date: endDate, title: emp.Worksheet ? emp.Worksheet + " (จบ)" : "งานจบ" });
        }
      });

      setEvents(calendarEvents);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, []);

  const changeMonth = (offset: number) => {
    setSlideDir(offset > 0 ? "right" : "left");
    setFade(false); // fade-out ก่อน
    setTimeout(() => {
      setMonth(prev => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + offset);
        return newMonth;
      });
      setFade(true); // fade-in หลังเปลี่ยนเดือน
    }, 200);
  };

  // แล้วใน useEffect คอยเปิด fade-in หลัง month เปลี่ยน
  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setFade(true), 100); // รอ 50ms ก็พอ
    return () => clearTimeout(timer);
  }, [month, fetchData]);




  const start = new Date(month.getFullYear(), month.getMonth(), 0);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const days: (Date | null)[] = [
    ...Array(start.getDay()).fill(null),
    ...Array.from({ length: end.getDate() }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  const daysOfWeek = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

  return (
    <div
      className={`w-max-380 p-7 mx-auto container transition-all duration-500 ease-in-out
    ${fade ? "opacity-100" : "opacity-0"}
    ${fade && slideDir === "right" ? "translate-x-0" : ""}
    ${fade && slideDir === "left" ? "translate-x-0" : ""}
    ${!fade && slideDir === "right" ? "-translate-x-10" : ""}
    ${!fade && slideDir === "left" ? "translate-x-10" : ""}`}
    >       {/* Header */}
      <div className="flex justify-between mb-5 items-center">
        <p className={`text-3xl font-extrabold ${theme === "dark" ? "text-yellow-500" : "text-blue-500"}`}>
          ปฏิทิน <span className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}>งาน</span>
        </p>
        <div className="flex gap-5 items-center text-xl font-semibold">
          <button onClick={() => changeMonth(-1)}><AiOutlineLeft className="text-2xl cursor-pointer" /></button>
          <h2 className="flex gap-2 w-60 pl-8 items-center">
            {month.toLocaleString("th-TH", { month: "long" })}
            <p >{month.toLocaleString("th-TH", { year: "numeric" })}</p>
          </h2>
          <button onClick={() => changeMonth(1)}><AiOutlineRight className="text-2xl cursor-pointer" /></button>
        </div>
      </div>

      {/* ตารางวันที่ */}
      <div className={`border rounded-xl h-full p-3 ${theme === "dark" ? "bg-gray-900" : "shadow-xl"}`}>
        <div className="grid grid-cols-7 text-lg font-extrabold gap-2 my-2">
          {daysOfWeek.map((day, i) => <div key={i} className="pl-2">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            const dayStr = day?.toISOString().split("T")[0];
            const dayEvents = dayStr ? events.filter(e => e.date === dayStr) : [];
            return (
              <div key={i} onClick={() => dayStr && setSelectedDate(dayStr)}
                className={`relative border-t h-27 rounded-lg border pl-2 cursor-pointer transition-all duration-200 ${theme === "dark" ? "hover:bg-gray-700 bg-gray-800" : "hover:bg-blue-50 shadow-4xl"}`}>
                <p>{day?.getDate()}</p>
                {dayEvents.length > 0 && (
                  <div className="text-xs max-h-20 overflow-y-auto scrollbar-hide text-white rounded px-1">
                    {dayEvents.map((e, idx) => (
                      <p key={idx} className={`rounded-sm h-5 mt-1 pl-2 ${theme === "dark" ? "bg-yellow-500" : "bg-blue-500"}`}>
                        {e.title}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal รายละเอียดวันที่ */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className={`p-5 rounded-4xl ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
            <p className="text-lg font-semibold mb-2 flex items-center">
              งานวันที่{" "}
              <span className={`${theme === "dark" ? "text-yellow-500" : "text-blue-500"}`}>
                {new Date(selectedDate).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <div className="ml-auto">
                <button className="cursor-pointer" onClick={() => setSelectedDate(null)}><BsXLg /></button>
              </div>
            </p>
            <div className="flex flex-col w-full gap-2 mb-3 max-h-40 overflow-y-auto">
              {events.filter(e => e.date === selectedDate).map((e, idx) => (
                <div key={idx} className={`flex justify-between p-1 rounded ${theme === "dark" ? "bg-yellow-500 text-white" : "bg-blue-500 text-white"}`}>
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

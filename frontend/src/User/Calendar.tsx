import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { BsXLg } from "react-icons/bs";
import { BsTrash } from "react-icons/bs";

// กําหนด type
type Event = {
  date: string;
  title: string;
};

export default function Calendar() {
  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState("");

  // โหลด event จาก localStorage
  useEffect(() => {
    const saved = localStorage.getItem("calendarEvent");
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  //เก็บลง local
  const saveEvents = (updated: Event[]) => {
    setEvents(updated);
    localStorage.setItem("calendarEvent", JSON.stringify(updated));
  };

  // หาวันเริ่มต้นและสิ้นสุดของเดือน
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const days: (Date | null)[] = [
    ...Array(start.getDay()).fill(null),
    ...Array.from(
      { length: end.getDate() },
      (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)
    ),
  ];

  // สร้าง array ของวันที่ทั้งหมดในเดือน
  const addEvent = () => {
    if (!selectedDate || !newEvent.trim()) return;
    const updated = [...events, { date: selectedDate, title: newEvent }];
    saveEvents(updated);
    setNewEvent("");
    setSelectedDate(null);
  };

  // ฟังก์ชันลบงาน
  const deleteEvent = (index: number) => {
    const updated = [...events];
    updated.splice(index, 1); // ลบแค่ตัวที่เลือก
    saveEvents(updated);
  };

  // เปลี่ยนเดือน
  const changeMonth = (offset: number) => {
    const newMonth = new Date(month);
    newMonth.setMonth(month.getMonth() + offset);
    setMonth(newMonth);
  };

  const { theme } = useTheme();

  const daysOfWeek = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
  return (
    <div className="w-max-380 p-9 mx-auto container">
      <div className="flex justify-between mb-5 items-centeritems-center">
        <p className={`text-3xl font-extrabold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>
          ปฏิทิน <span className={`${theme === 'dark' ? 'text-white' : 'text-yellow-500'}`}>งาน</span>
        </p>

        {/* เปลี่ยนเดือน */}

        <div className="flex gap-5 items-center text-xl font-semibold">
          <button
            className={`text-2xl cursor-pointer  duration-200 ${
              theme === "dark" ? "hover:bg-gray-500" : "hover:bg-blue-100"
            }`}
            onClick={() => changeMonth(-1)}
          >
            <AiOutlineLeft className="text-2xl cursor-pointer" />
          </button>

          <h2 className="flex gap-2 items-center ">
            {month.toLocaleString("th-TH", { month: "long" })}
            <p>{month.toLocaleString("th-TH", { year: "numeric" })}</p>
          </h2>

          <button onClick={() => changeMonth(1)}>
            <AiOutlineRight
              className={`text-2xl cursor-pointer  duration-200 ${
                theme === "dark" ? "hover:bg-gray-500" : "hover:bg-blue-100"
              }`}
            />
          </button>
        </div>
      </div>

      {/* วันที่ */}
      <div
        className={`border rounded-4xl h-192 p-3 ${
          theme === "dark" ? "bg-gray-900" : "shadow-xl"
        }`}
      >
        <div className="grid grid-cols-7 text-lg font-extrabold gap-2 my-2 ">
          {daysOfWeek.map((event, index) => (
            <div className="pl-2" key={index}>
              <p>{event}</p>
            </div>
          ))}
        </div>

        {/* //ตาตราง วันที่ */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            return (
              <div
                key={i}
                onClick={() =>
                  day && setSelectedDate(day.toISOString().split("T")[0])
                }
                className={`relative border-t h-27 rounded-lg border pl-2 cursor-pointer transition-all duration-200 ${
                  theme === "dark"
                    ? "hover:bg-gray-700 bg-gray-800"
                    : "hover:bg-blue-50 shadow-4xl"
                }
               `}
              >
                <p>{day?.getDate()}</p>
                {/* เเสดงข้อมูล */}
                {day &&
                  events.some(
                    (e) => e.date === day.toISOString().split("T")[0]
                  ) && (
                    <div
                      className={` text-xs max-h-20 overflow-y-auto scrollbar-hide text-white rounded px-1
                      }`}
                    >
                      {events
                        .filter(
                          (e) => e.date === day.toISOString().split("T")[0]
                        )
                        .map((e, idx) => (
                          <p
                            className={` rounded-sm h-5  mt-1 pl-2 ${
                              theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                            }`}
                            key={idx}
                          >
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

      {selectedDate && (
        <div
          className={`fixed inset-0 z-50  flex items-center justify-center bg-black/20 backdrop-blur-sm`}
        >
          <div
            className={`p-5 rounded-4xl  h-fit ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}
          >
            <p className="text-lg font-semibold mb-2 flex items-center">
              งานวันที่{" "}
              <span className="text-blue-400">
                {new Date(selectedDate).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <div className="ml-auto ">
                <button
                  className="cursor-pointer"
                  onClick={() => setSelectedDate(null)}
                >
                  {" "}
                  <BsXLg />
                </button>
              </div>
            </p>

            {/* รายการงาน */}
            <div className="flex flex-col w-100v gap-2 mb-3 max-h-40 scrollbar-hide overflow-y-auto">
              {events
                .filter((e) => e.date === selectedDate)
                .map((e, idx) => (
                  <div
                    key={idx}
                    className={`flex  justify-between  p-1 rounded ${
                      theme === "dark"
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <span className="px-2">{e.title}</span>
                    <button
                      onClick={() =>
                        deleteEvent(events.findIndex((ev) => ev === e))
                      }
                      className="ml-2  cursor-pointer px-2 py-0.5 rounded text-xs "
                    >
                      <BsTrash size={18} className="" />
                    </button>
                  </div>
                ))}
            </div>

            {/* เพิ่มงานใหม่ */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                className={`flex-1 p-2 rounded-lg border border-gray-600 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              />
              <button
                onClick={addEvent}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white cursor-pointer"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

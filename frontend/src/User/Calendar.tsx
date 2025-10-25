

import { useEffect, useState } from "react";

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

  // เปลี่ยนเดือน
  const changeMonth = (offset: number) => {
    const newMonth = new Date(month);
    newMonth.setMonth(month.getMonth() + offset);
    setMonth(newMonth);
  };

  const daysOfWeek = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
  return (
    <div className="w-max-380 p-9 mx-auto container">
      <div className="flex justify-between mb-5 items-centeritems-center">
        <p className="text-3xl font-extrabold">
          ปฏิทิน <span>งาน</span>
        </p>

        {/* เปลี่ยนเดือน */}
        <div className="flex gap-5 items-center">
          <div>
            <button onClick={() => changeMonth(-1)}> กลับ </button>
          </div>
          {/* //เดือน */}
          <h2 className="text-xl font-semibold  flex gap-2 ">
            {month.toLocaleString("th-TH", { month: "long" })}

            <p> {month.toLocaleString("th-TH", { year: "numeric" })}</p>
          </h2>
          <div>
            <button onClick={() => changeMonth(1)}> ไป </button>
          </div>
        </div>
      </div>

      {/* วันที่ */}
      <div className="border rounded-4xl h-full p-3 bg-gray-900">
        <div className="grid grid-cols-7 text-lg font-extrabold gap-2 my-2 ">
          {daysOfWeek.map((event, index) => (
            <div className="pl-2" key={index}>
              <p>{event}</p>
            </div>
          ))}
        </div>

        {/* //ตาตราง วันที่ */}
        <div className="grid grid-cols-7 gap-2 h-175">
          {days.map((day, i) => {
            return (
              <div
                key={i}
                onClick={() =>
                  day && setSelectedDate(day.toISOString().split("T")[0])
                }
                className={`relative border-t bg-gray-800 rounded-lg border pl-2 cursor-pointer transition-all duration-200 ${
                  selectedDate === day?.toISOString().split("T")[0]
                    ? "bg-blue-600 text-white scale-105"
                    : "hover:bg-blue-800"
                }`}
              >
                <p>{day?.getDate()}</p>
                {/* เเสดงข้อมูล */}
                {day &&
                  events.some(
                    (e) => e.date === day.toISOString().split("T")[0]
                  ) && (
                    <div className="mt-1 text-xs bg-blue-500 text-white rounded px-1">
                      {events
                        .filter(
                          (e) => e.date === day.toISOString().split("T")[0]
                        )
                        .map((e, idx) => (
                          <p key={idx}>{e.title}</p>
                        ))}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
      {selectedDate && (
        <div className="mt-6 border-t border-gray-600 pt-4">
          <p className="text-lg font-semibold mb-2">
            เพิ่มงานวันที่{" "}
            <span className="text-blue-400">
              {new Date(selectedDate).toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="พิมพ์ชื่องานที่นี่..."
              className="flex-1 p-2 rounded-lg border border-gray-600 text-black"
            />
            <button
              onClick={addEvent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
            >
              บันทึก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

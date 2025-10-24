// import React, { useState, useEffect } from "react";

import { useEffect, useState } from "react";

// type Event = { date: string; title: string };

// export default function Calendar() {

//   const today = new Date();

//   // โหลดจาก localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("calendarEvents");
//     if (stored) setEvents(JSON.parse(stored));
//   }, []);

//   // บันทึกลง localStorage
//   const saveEvents = (updated: Event[]) => {
//     setEvents(updated);
//     localStorage.setItem("calendarEvents", JSON.stringify(updated));
//   };

//   // สร้าง array วัน
//   const start = new Date(month.getFullYear(), month.getMonth(), 0);
//   const end = new Date(month.getDate(), month.getMonth() + 1, 0);
//   const days: (Date | null)[] = [
//     ...Array(start.getDay()).fill(null),
//     ...Array.from(
//       { length: end.getDate() },
//       (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)
//     ),
//   ];

//   const addEvent = () => {
//     if (!selectedDate || !newEvent) return;
//     saveEvents([...events, { date: selectedDate, title: newEvent }]);
//     setNewEvent("");
//     setSelectedDate(null);
//   };

//   return (
//     <div className="h-full mx-auto p-6 bg-white rounded-2xl shadow-lg">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <button
//           onClick={() =>
//             setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
//           }
//           className="px-3 py-1 bg-gray-300 rounded-full hover:bg-gray-400"
//         >
//           Prev
//         </button>
//         <h2 className="font-bold text-xl">
//           {month.toLocaleDateString("TH", { month: "long" })}
//           {month.getFullYear()}
//         </h2>
//         <button
//           onClick={() =>
//             setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
//           }
//           className="px-3 py-1 bg-gray-300 rounded-full hover:bg-gray-400"
//         >
//           Next
//         </button>
//       </div>

//       {/* Days of Week */}
//       <div className="grid grid-cols-7 text-center font-semibold mb-2">
//         {daysOfWeek.map((d, i) => (
//           <div
//             key={d}
//             className={
//               i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : ""
//             }
//           >
//             {d}
//           </div>
//         ))}
//       </div>

//       {/* Calendar */}
//       <div className="grid grid-cols-7 gap-2 items-center p-2 text-center">
//         {days.map((d, i) => {
//           if (!d) return <div key={i} className="p-1"></div>;
//           const dayStr = d.toISOString().split("T")[0];
//           const dayEvents = events.filter((e) => e.date === dayStr);
//           const isToday = d.toDateString() === today.toDateString();

//           return (
//             <div
//               key={i}
//               className={`p-2 border rounded-lg h-35 flex flex-col items-center justify-start cursor-pointer ${
//                 isToday ? "border-blue-500 shadow-md" : "border-gray-200"
//               } bg-gray-50 hover:bg-gray-100`}
//               onClick={() => setSelectedDate(dayStr)}
//             >
//               <span className={`font-bold ${isToday ? "text-blue-600" : ""}`}>
//                 {d.getDate()}
//               </span>
//               {dayEvents.map((e, idx) => (
//                 <span
//                   key={idx}
//                   className="text-xs mt-1 bg-blue-200 text-blue-800 px-1 rounded-full"
//                 >
//                   {e.title}
//                 </span>
//               ))}
//             </div>
//           );
//         })}
//       </div>

//       {/* เพิ่มงาน */}
//       {selectedDate && (
//         <div className="mt-4 p-4 border rounded-lg bg-gray-50">
//           <h3 className="font-semibold mb-2">เพิ่มงาน: {selectedDate}</h3>
//           <input
//             type="text"
//             value={newEvent}
//             onChange={(e) => setNewEvent(e.target.value)}
//             placeholder="ชื่องาน"
//             className="w-full p-2 border rounded mb-2"
//           />
//           <button
//             onClick={addEvent}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
//           >
//             บันทึก
//           </button>
//           <button
//             onClick={() => setSelectedDate(null)}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//           >
//             ยกเลิก
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

export default function Calendar() {
  type Event = { data: string; title: string };

  //   const [events, setEvents] = useState<Event[]>([]);
  //   const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [delectedDate, setdelectedDate] = useState<string | null>(null);
  const [newEvent, setnewEvent] = useState("");
  const [selectedDate, setselectedDate] = useState("");

  const data = new Date();

  const saveEvents = (updated: Event[]) => {
    setEvents(updated);
    localStorage.setItem("calendarEnevt", JSON.stringify(updated));
  };

  const start = new Date(month.getFullYear(), month.getMonth(), 0);
  const end = new Date(month.getDate(), month.getMonth() + 1, 0);
  const days: (Date | null)[] = [
    ...Array(start.getDay()).fill(null),
    ...Array.from(
      { length: end.getDate() },
      (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)
    ),
  ];

  const addEvent = () => {
    if (!selectedDate || !newEvent) return;
    saveE;
  };

  const daysOfWeek = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อาทิต"];
  return (
    <div className="w-max-380 p-7 mx-auto container pt-10">
      <p className="text-3xl font-extrabold">
        ปฏิทิน <span>งาน</span>
      </p>
      <div className="border h-full my-5">
        <div className="grid grid-cols-7 gap-5 text-center">
          {daysOfWeek.map((event, index) => (
            <div key={index}>
              <p>{event}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

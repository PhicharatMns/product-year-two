// import { CiSearch } from "react-icons/ci";


// const sampleData = [
//   {
//     id: "00001",
//     title: "บางประกงบางเมื่อ",
//     detail: "บางประกงบางเมื่อ สร้างใหม่อยู่สบาย",
//     status: "กําลังทํา",
//     name: "พิชรัตน์",
//     startDate: "14/5/26",
//     endDate: "16/7/26",
//   },
//   {
//     id: "00002",
//     title: "บางเมืองใหม่",
//     detail: "รายละเอียดงานเพิ่มเติม",
//     status: "เสร็จแล้ว",
//     name: "สมชาย",
//     startDate: "01/6/26",
//     endDate: "15/7/26",
//   },
// ];

// export default function Searchpastjobs() {
//   return (
//     <div className="bg-blue-50 min-h-screen py-10">
//       <div className="container mx-auto  bg-white rounded-xl shadow-lg p-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-5">
//           <h2 className="text-2xl font-bold text-blue-700">
//             รับใบ<span className="text-yellow-500">งาน</span>
//           </h2>
//           <div className="flex flex-wrap gap-6 items-center">
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600 transition">
//               + เพิ่มใบงาน
//             </button>
//             <div className="relative">
//               <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="ค้นหา..."
//                 className="border rounded-xl pl-10 pr-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Table Header */}
//         <div className="grid grid-cols-8 gap-4 font-bold text-blue-700 border-b-2 pb-2 text-center">
//           {headerNav.map((item, idx) => (
//             <div key={idx} className={idx === 0 ? "text-left pl-2" : ""}>
//               {item}
//             </div>
//           ))}
//         </div>

//         {/* Table Rows */}
//         {sampleData.map((row, idx) => (
//           <div
//             key={idx}
//             className="grid grid-cols-8 gap-4 text-gray-700 text-sm border-b py-3 items-center hover:bg-blue-50 transition-all rounded-lg"
//           >
//             <p className="text-left pl-2">{row.id}</p>
//             <p className="text-center">{row.title}</p>
//             <p className="text-center">{row.detail}</p>
//             <p className={`text-center font-medium ${row.status === "เสร็จแล้ว" ? "text-green-600" : "text-yellow-600"}`}>
//               {row.status}
//             </p>
//             <p className="text-center">{row.name}</p>
//             <p className="text-center">{row.startDate}</p>
//             <p className="text-center">{row.endDate}</p>
//             <div className="flex justify-center gap-2">
//               <button className="px-3 py-1 text-green-500 border rounded-lg hover:bg-green-100 transition">
//                 รายละเอียด
//               </button>
//               <button className="px-3 py-1 text-red-500 border rounded-lg hover:bg-red-100 transition">
//                 เเก้ไข
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";



const headerNav = [
  "ID",
  "ชื่องาน",
  "รายละเอียด",
  "สถานะ",
  "รายชื่อ",
  "วันที่รับ",
  "วันที่ต้องปิดงาน",
  "จัดการ",
];
interface Employees {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  dateJoined?: string;
  status?: string;
  image?: string;
}

const Searchpastjobs: React.FC = () => {
  const [dataEmployees, setDataEmployees] = useState<Employees[]>([]);

  // ดึงข้อมูลพนักงาน
  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const data: Employees[] = await res.json();
      setDataEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ลบข้อมูล
  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "DELETE",
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen py-10">
      <div className="container mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:fle-row justify-between items-center mb-8 gap-5">
          <h2 className="text-2xl font-bold text-blue-700">รับใบ <span className="text-yellow-500">งาน</span></h2>
          <div className="flex flex-wrap gap-6 items-center">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600 transition">
              + เพิ่มใบงาน
            </button>
            <div className="relative">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหา..."
                className="border rounded-xl pl-10 pr-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-8 gap-8 font-bold text-blue-700 border-b-2 pb-2 text-center">
            {headerNav.map((event, index) => (
              <div key={index}>
                {event}
              </div>
            ))}
          </div>

        </div>
        {dataEmployees.map((event, index) => {
          return (
            <div key={index}>
              <p>{event.email}</p>
              <button onClick={() => handleDelete(event._id)}>delete</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}


export default Searchpastjobs
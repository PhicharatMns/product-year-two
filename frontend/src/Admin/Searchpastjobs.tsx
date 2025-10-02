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
  const [showModal, setShowModal] = useState(false);

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
      <div className="container mx-auto  bg-white rounded-xl shadow-lg p-6 h-20000">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-5">
          <h2 className="text-2xl font-bold text-blue-700">
            รับใบ <span className="text-yellow-500">งาน</span>
          </h2>
          <div className="flex flex-wrap gap-6 items-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600 transition"
            >
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

        {/* Header Table */}
        <div>
          <div className="grid grid-cols-10 gap-8 font-bold text-blue-700 border-b-2 pb-2">
            {headerNav.map((event, index) => (
              <div key={index} className={`${index === 0 ? "col-span-2" : ""}`}>
                {event}
              </div>
            ))}
          </div>
        </div>

        {/* Data Rows */}
        {dataEmployees.map((event, index) => {
          return (
            <div
              className="grid grid-cols-10 gap-8 border-b border-gray-300 pb-5 pt-5"
              key={index}
            >
              <p className="col-span-2">{event._id}</p>
              <p>{event.lastName}</p>
              <p>{event.department}</p>
              <p>{event.department}</p>
              <p>{event.department}</p>
              <p>{event.department}</p>
              <p>{event.department}</p>
              <button
                className="border w-fit px-2 rounded"
                onClick={() => handleDelete(event._id)}
              >
                delete
              </button>
            </div>
          );
        })}

        {/* Modal */}
        {showModal && (
          // <div className="fixed inset-0 flex justify-center items-center">
          //   <div className="bg-white p-6 rounded-xl w-96 shadow-lg ">
          //     <h3 className="text-lg font-bold mb-4">เพิ่มใบงาน</h3>

          //     {/* ฟอร์มเพิ่มงาน */}
          //     <input
          //       type="text"
          //       placeholder="ชื่องาน"
          //       className="border w-full mb-3 px-3 py-2 rounded"
          //     />
          //     <textarea
          //       placeholder="รายละเอียด"
          //       className="border w-full mb-3 px-3 py-2 rounded"
          //     ></textarea>

          //     <div className="flex justify-end gap-3">
          //       <button
          //         onClick={() => setShowModal(false)}
          //         className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          //       >
          //         ยกเลิก
          //       </button>
          //       <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
          //         บันทึก
          //       </button>
          //     </div>

          //     <button
          //       onClick={() => setShowModal(false)}
          //       className="absolute top-2 right-2 text-gray-500 hover:text-black"
          //     >
          //       ✕
          //     </button>
          //   </div>
          // </div>
          <div className="flex fixed inset-0 justify-center items-center">
            <div className='relative border-5'>
              <p>5</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchpastjobs;

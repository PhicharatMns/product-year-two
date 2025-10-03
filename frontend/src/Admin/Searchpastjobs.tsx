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
  JobTitle: string;
  Details: string;
  Status: string;
  List: string;
  DateReceived: string;
  DatetoClose: string;
  dateJoined: string;
  Manage: string;
}

const Searchpastjobs: React.FC = () => {
  const [dataEmployees, setDataEmployees] = useState<Employees[]>([]);
  const [showModal, setShowModal] = useState(false);

  //addDate

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
              <div
                key={index}
                className={`${index === 0 ? "text-center col-span-2" : ""}`}
              >
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
              <p className="col-span-2 text-center">{event._id}</p>
              <p>{event.JobTitle}</p>
              <p>{event.Details}</p>
              <p>{event.Status}</p>
              <p>{event.List}</p>
              <p>{event.DateReceived}</p>
              <p>{event.DatetoClose}</p>
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
          <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[900px]">
              {/* แถวชื่อใบงาน, ชื่อนามสกุล, เบอร์โทร */}
              <div className="grid grid-cols-3 gap-5 mb-4">
                <div>
                  <p className="my-1 font-semibold">ชื่อใบงาน</p>
                  <input type="text" className="border w-full p-2 rounded-lg" />
                </div>
                <div>
                  <p className="my-1 font-semibold">ชื่อนามสกุลผู้จ้างงาน</p>
                  <input type="text" className="border w-full p-2 rounded-lg" />
                </div>
                <div>
                  <p className="my-1 font-semibold">เบอร์โทรติดต่อ</p>
                  <input type="text" className="border w-full p-2 rounded-lg" />
                </div>
              </div>

              {/* แถวที่อยู่ */}
              <div className="mb-4">
                <p className="my-1 font-semibold">ที่อยู่</p>
                <input type="text" className="border w-full p-2 rounded-lg" />
              </div>

              {/* แถววันที่และไฟล์ */}
              <div className="grid grid-cols-2 gap-5 mb-4">
                <div>
                  <p className="my-1 font-semibold">เพิ่มผู้รับผิดชอบ</p>
                  <div className="flex gap-4 mb-2">
                    <div className="flex flex-col">
                      <label className="font-medium">วันที่รับงาน</label>
                      <input type="date" className="border p-2 rounded-lg" />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-medium">วันที่ต้องปิดงาน</label>
                      <input type="date" className="border p-2 rounded-lg" />
                    </div>
                  </div>
                  <p className="my-1 font-semibold">ไฟล์เริ่มงาน</p>
                  <input type="file" className="border p-2 rounded-lg w-full" />
                </div>

                <div className="flex flex-col">
                  <p className="my-1 font-semibold">รายละเอียดงาน</p>
                  <textarea className="border p-2 rounded-lg w-full h-full resize-none" />
                </div>
              </div>

              {/* ปุ่มบันทึก / ยกเลิก */}
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  ยกเลิก
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchpastjobs;

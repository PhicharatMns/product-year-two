import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";

const headerNav = [
  // "ID",
  "ชื่องาน",
  "รายชื่อผู้จ้าง",
  "เบอร์ติดต่อ",
  // "รายละเอียด",
  "สถานะ",
  "รายชื่อ",
  "วันที่รับ",
  "วันที่ต้องปิดงาน",
  "จัดการ",
];

interface Employees {
  _id: string;
  Worksheet: string;
  Employer: string;
  Contact_number: string;
  address: string;
  responsible: string;
  Date_of_acceptance_of_work: string;
  Closing_date: string;
  description: string;
  JobTitle?: string;
  Status?: string;
  image: string;
}

const Searchpastjobs: React.FC = () => {
  const [dataEmployees, setDataEmployees] = useState<Employees[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [Worksheet, setWorksheet] = useState("");
  const [Employer, setEmployer] = useState("");
  const [Contact_number, setContact_number] = useState("");
  const [address, setaddress] = useState("");
  const [responsible, setresponsible] = useState("");
  const [Date_of_acceptance_of_work, setDate_of_acceptance_of_work] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [Closing_date, setClosing_date] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setdescription] = useState("");
  const [image, setimage] = useState<File | null>(null);
  const [Status, setStatus] = useState("Active");

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

  // เพิ่มฟังก์ชันบันทึก
  const handleSave = async () => {
    try {
      const newJob = {
        Worksheet,
        Employer,
        Contact_number,
        address,
        responsible,
        Date_of_acceptance_of_work,
        Closing_date,
        description,
        Status,
      };
      //ข้อมูลรูป
      if (image) {
        const formData = new FormData();
        Object.entries(newJob).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("image", image);

        await fetch("http://localhost:5000/api/employees", {
          method: "POST",
          body: formData,
        });
      } else {
        // ถ้าไม่มีรูป -> ส่งเป็น JSON ปกติ
        await fetch("http://localhost:5000/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newJob),
        });
      }

      // ปิด modal + โหลดข้อมูลใหม่
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen py-10">
      <div className="container mx-auto  bg-white rounded-xl shadow-lg p-6 ">
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
          <div className="grid grid-cols-8 gap-8  font-bold text-blue-700 border-b-2 pb-2">
            {headerNav.map((event, index) => (
              <div
                key={index}
                className={`${index === 0 ? "" : ""} ${
                  index === 7 ? "text-center" : ""
                }`}
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
              className="grid grid-cols-8 gap-8 items-center border-b border-gray-300 pb-5 pt-5"
              key={index}
            >
              <p className="truncate">{event.Worksheet}</p>
              <p className="truncate">{event.Employer}</p>
              <p className="truncate">{event.Contact_number}</p>
              <p className={`truncate ${Status ? "text-red-500" : ""}`}>
                {event.Status}
              </p>
              <p className="truncate">{event.responsible}</p>
              <p className="truncate">
                {event.Date_of_acceptance_of_work.split("T")[0]}
              </p>
              <p className="truncate">{event.Closing_date.split("T")[0]}</p>
              <div className="flex gap-1 mx-auto">
                <button
                  onClick={() => handleDelete(event._id)}
                  className="border  p-1 text-red-500 w-fit px-2 rounded"
                >
                  ลบ
                </button>
                <Link to={`/Details/${event._id}`}>
                  <button className="border p-1 truncate text-green-500 w-fit px-2 rounded">
                    รายละเอียด
                  </button>
                </Link>
              </div>
            </div>
          );
        })}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[900px]">
              {/* แถวชื่อใบงาน, ชื่อนามสกุล, เบอร์โทร */}
              <div className="grid grid-cols-3 gap-5 mb-4">
                <div>
                  <p className="my-1 font-semibold">ชื่อใบงาน</p>
                  <input
                    type="text"
                    value={Worksheet}
                    onChange={(e) => setWorksheet(e.target.value)}
                    className="border w-full p-2 rounded-lg"
                  />
                </div>
                <div>
                  <p className="my-1 font-semibold">ชื่อนามสกุลผู้จ้างงาน</p>
                  <input
                    type="text"
                    value={Employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    className="border w-full p-2 rounded-lg"
                  />
                </div>
                <div>
                  <p className="my-1 font-semibold">เบอร์โทรติดต่อ</p>
                  <input
                    type="text"
                    value={Contact_number}
                    onChange={(e) => setContact_number(e.target.value)}
                    className="border w-full p-2 rounded-lg"
                  />
                </div>
              </div>

              {/* แถวที่อยู่ */}
              <div className="mb-4">
                <p className="my-1 font-semibold">ที่อยู่</p>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  className="border w-full p-2 rounded-lg"
                />
              </div>

              {/* แถววันที่และไฟล์ */}
              <div className="grid grid-cols-2 gap-5 mb-4">
                <div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <p className="my-1 font-semibold">สถานะ</p>

                      <select
                        className="border p-2 rounded-lg w-full "
                        value={Status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="Active">Active</option>
                      </select>
                    </div>
                    <div>
                      <p className="my-1 font-semibold">เพิ่มผู้รับผิดชอบ</p>
                      <input
                        type="text"
                        value={responsible}
                        onChange={(e) => setresponsible(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                        name=""
                        id=""
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mb-2">
                    <div className="flex flex-col">
                      <label className="font-medium">วันที่รับงาน</label>
                      <input
                        type="date"
                        value={Date_of_acceptance_of_work}
                        onChange={(e) =>
                          setDate_of_acceptance_of_work(e.target.value)
                        }
                        className="border p-2 rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-medium">วันที่ต้องปิดงาน</label>
                      <input
                        type="date"
                        value={Closing_date}
                        onChange={(e) => setClosing_date(e.target.value)}
                        className="border p-2 rounded-lg"
                      />
                    </div>
                  </div>
                  <p className="my-1 font-semibold">ไฟล์เริ่มงาน</p>
                  <input
                    type="file"
                    onChange={(e) =>
                      setimage(e.target.files ? e.target.files[0] : null)
                    }
                    className="border p-2 rounded-lg w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="my-1 font-semibold">รายละเอียดงาน</p>
                  <textarea
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                    className="border p-2 rounded-lg w-full h-full resize-none"
                  />
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
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
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

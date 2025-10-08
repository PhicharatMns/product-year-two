import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider"; // import theme hook

const headerNav = ["ชื่องาน", "รายชื่อผู้จ้าง", "เบอร์ติดต่อ", "สถานะ", "วันที่รับ", "วันที่ต้องปิดงาน", "จัดการ"];

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
  const { theme } = useTheme();

  const [dataEmployees, setDataEmployees] = useState<Employees[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [Worksheet, setWorksheet] = useState("");
  const [Employer, setEmployer] = useState("");
  const [Contact_number, setContact_number] = useState("");
  const [address, setaddress] = useState("");
  const [Date_of_acceptance_of_work, setDate_of_acceptance_of_work] = useState(new Date().toISOString().split("T")[0]);
  const [Closing_date, setClosing_date] = useState(new Date().toISOString().split("T")[0]);
  const [description, setdescription] = useState("");
  const [image, setimage] = useState<File | null>(null);
  const [Status, setStatus] = useState("Active");

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

  const handleSave = async () => {
    try {
      const newJob = { Worksheet, Employer, Contact_number, address, Date_of_acceptance_of_work, Closing_date, description, Status };
      if (image) {
        const formData = new FormData();
        Object.entries(newJob).forEach(([key, value]) => formData.append(key, value));
        formData.append("image", image);
        await fetch("http://localhost:5000/api/employees", { method: "POST", body: formData });
      } else {
        await fetch("http://localhost:5000/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newJob),
        });
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  // Theme-based classes
  const bg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-blue-50/40";
  const border = theme === "dark" ? "border-gray-700" : "border-blue-100";
  const labelText = theme === "dark" ? "text-yellow-300" : "text-blue-700";

  return (
    <div className=" w-380 mx-auto py-10 min-h-screen">
      <div className="container mx-auto  rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-5">
          <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-yellow-300" : "text-blue-700"}`}>
            รับใบ<span className={theme === "dark" ? "text-white" : "text-yellow-500"}>งาน</span>
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600 transition"
            >
              + เพิ่มใบงาน
            </button>
            <div className="relative w-full sm:w-auto">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหา..."
                className="border rounded-xl pl-10 pr-3 py-1 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Header Table */}
        <div className={`hidden lg:grid grid-cols-7 gap-8 font-bold ${theme === "dark" ? "text-yellow-300" : "text-blue-700"} border-b-2 pb-2`}>
          {headerNav.map((event, index) => <div key={index}>{event}</div>)}
        </div>

        {/* Data Rows */}
        <div className="space-y-3 mt-5 h-screen">
          {dataEmployees.map((event, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-8 items-center ${border} rounded-xl ${cardBg} hover:bg-blue-200 transition-all duration-200 shadow-sm py-4 px-4`}
            >
              {/* Mobile card */}
              <div className="lg:hidden space-y-1 text-sm">
                <p><span className={`font-semibold ${labelText}`}>ชื่องาน:</span> {event.Worksheet}</p>
                <p><span className={`font-semibold ${labelText}`}>ผู้จ้าง:</span> {event.Employer}</p>
                <p><span className={`font-semibold ${labelText}`}>เบอร์:</span> {event.Contact_number}</p>
                <p><span className={`font-semibold ${labelText}`}>สถานะ:</span> {event.Status}</p>
                <p><span className={`font-semibold ${labelText}`}>วันที่รับ:</span> {event.Date_of_acceptance_of_work.split("T")[0]}</p>
                <p><span className={`font-semibold ${labelText}`}>วันปิดงาน:</span> {event.Closing_date.split("T")[0]}</p>
              </div>

              {/* Desktop table */}
              <p className="hidden lg:block truncate">{event.Worksheet}</p>
              <p className="hidden lg:block truncate">{event.Employer}</p>
              <p className="hidden lg:block truncate">{event.Contact_number}</p>
              <p className="hidden lg:block truncate text-orange-400">{event.Status}</p>
              <p className="hidden lg:block truncate">{event.Date_of_acceptance_of_work.split("T")[0]}</p>
              <p className="hidden lg:block truncate">{event.Closing_date.split("T")[0]}</p>

              {/* Actions */}
              <div className="flex gap-2 justify-end lg:justify-center mt-2 lg:mt-0">
                <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">ลบ</button>
                <Link to={`/Details/${event._id}`}>
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">รายละเอียด</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
            <div className={`rounded-2xl shadow-2xl p-8 w-[95%] md:w-[700px] lg:w-[900px] border max-h-[95vh] overflow-y-auto ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-blue-200 text-gray-800"}`}>
              {/* Header */}
              <div className={`mb-6 border-b pb-3 ${theme === "dark" ? "border-gray-700" : "border-blue-200"}`}>
                <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-yellow-300" : "text-blue-700"}`}>แก้ไขข้อมูลใบงาน</h2>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className={`block mb-1 font-semibold ${labelText}`}>ชื่อใบงาน</label>
                  <input
                    type="text"
                    value={Worksheet}
                    onChange={(e) => setWorksheet(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${theme === "dark" ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"}`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${labelText}`}>ชื่อผู้จ้างงาน</label>
                  <input
                    type="text"
                    value={Employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${theme === "dark" ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"}`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${labelText}`}>เบอร์โทรติดต่อ</label>
                  <input
                    type="text"
                    value={Contact_number}
                    onChange={(e) => setContact_number(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${theme === "dark" ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"}`}
                  />
                </div>
              </div>

              {/* ที่อยู่ + วันที่ + ไฟล์ + รายละเอียด */}
              <div className="mb-6">
                <label className={`block mb-1 font-semibold ${labelText}`}>ที่อยู่</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${theme === "dark" ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-1 font-semibold ${labelText}`}>สถานะ</label>
                    <select
                      className={`border p-2 rounded-lg w-full focus:ring-2 outline-none ${theme === "dark" ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"}`}
                      value={Status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Active">Active</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block mb-1 font-semibold ${labelText}`}>วันที่รับงาน</label>
                      <input
                        type="date"
                        value={Date_of_acceptance_of_work}
                        onChange={(e) => setDate_of_acceptance_of_work(e.target.value)}
                        className={`border p-2 rounded-lg w-full focus:ring-2 outline-none ${theme === "dark" ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"}`}
                      />
                    </div>
                    <div>
                      <label className={`block mb-1 font-semibold ${labelText}`}>วันที่ต้องปิดงาน</label>
                      <input
                        type="date"
                        value={Closing_date}
                        onChange={(e) => setClosing_date(e.target.value)}
                        className={`border p-2 rounded-lg w-full focus:ring-2 outline-none ${theme === "dark" ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block mb-1 font-semibold ${labelText}`}>ไฟล์เริ่มงาน</label>
                    <input
                      type="file"
                      onChange={(e) => setimage(e.target.files ? e.target.files[0] : null)}
                      className={`border p-2 rounded-lg w-full focus:ring-2 outline-none ${theme === "dark" ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${labelText}`}>รายละเอียดงาน</label>
                  <textarea
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                    className={`border p-2 rounded-lg w-full h-48 resize-none focus:ring-2 outline-none ${theme === "dark" ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white" : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"}`}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 border-t pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${theme === "dark" ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
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

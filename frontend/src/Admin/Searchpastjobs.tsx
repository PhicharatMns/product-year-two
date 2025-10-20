import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";

const headerNav = [
  "ชื่องาน",
  "รายชื่อผู้จ้าง",
  "เบอร์ติดต่อ",
  "สถานะ",
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
  const { theme } = useTheme();

  const [dataEmployees, setDataEmployees] = useState<Employees[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [animationshowModal, setAnimationShowModal] = useState(false);
  const [Worksheet, setWorksheet] = useState("");
  const [Employer, setEmployer] = useState("");
  const [Contact_number, setContact_number] = useState("");
  const [address, setAddress] = useState("");
  const [Date_of_acceptance_of_work, setDate_of_acceptance_of_work] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [Closing_date, setClosing_date] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [Status, setStatus] = useState("Active");

  // === Modal Animation Control ===
  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setAnimationShowModal(true), 10);
  };

  const closeModal = () => {
    setAnimationShowModal(false);
    setTimeout(() => setShowModal(false), 400);
  };

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
      const newJob = {
        Worksheet,
        Employer,
        Contact_number,
        address,
        Date_of_acceptance_of_work,
        Closing_date,
        description,
        Status,
      };
      if (image) {
        const formData = new FormData();
        Object.entries(newJob).forEach(([key, value]) =>
          formData.append(key, value)
        );
        formData.append("image", image);
        await fetch("http://localhost:5000/api/employees", {
          method: "POST",
          body: formData,
        });
      } else {
        await fetch("http://localhost:5000/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newJob),
        });
      }
      closeModal();
      fetchEmployees();
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  // === Theme Classes ===
  const text = theme === "dark" ? "text-white" : "text-gray-900";
  const cardBg = theme === "dark" ? "bg-gray-900/80" : "bg-blue-50/50";
  const border = theme === "dark" ? "border-gray-700" : "border-blue-100";
  const labelText = theme === "dark" ? "text-yellow-300" : "text-blue-700";

  return (
    <div className=" w-max-380 p-6 mx-auto container pt-10">
      <div
        className={`container  mx-auto rounded-xl min-h-screen shadow-lg p-5 transition-colors duration-600 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-5">
          <h2
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-yellow-300" : "text-blue-700"
            }`}
          >
            รับใบ
            <span
              className={theme === "dark" ? "text-white" : "text-yellow-500"}
            >
              งาน
            </span>
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={openModal}
              className={`text-white px-4 py-2 rounded-xl shadow transition   ${
                theme === "dark"
                  ? "bg-yellow-500 hover:bg-yellow-400"
                  : "bg-blue-500 hover:bg-blue-400"
              }`}
            >
              + เพิ่มใบงาน
            </button>
            <div className={`relative w-full sm:w-auto ${text}`}>
              <CiSearch
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${labelText}`}
              />
              <input
                type="text"
                placeholder="ค้นหา..."
                className={`border rounded-xl pl-10 pr-3 py-1 w-full sm:w-64 focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "border-gray-700 bg-gray-700 text-white focus:ring-yellow-400"
                    : "border-blue-300 bg-white text-gray-800 focus:ring-blue-400"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div
          className={`hidden lg:grid grid-cols-7 gap-5 items-center pl-5  ${
            theme === "dark" ? "text-yellow-300" : "text-blue-700"
          } border-b-2 pb-2`}
        >
          {headerNav.map((header, i) => (
            <div className={`${i === 6 ? "text-center" : " "}`} key={i}>
              {header}
            </div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="space-y-2 mt-3">
          {dataEmployees.map((event, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-7 gap-5 items-center ${border} rounded-xl ${cardBg} pl-5 hover:scale-[1.01] transition-all  shadow-sm py-1`}
            >
              {/* Mobile view */}
              <div className="lg:hidden space-y-1 text-sm">
                <p>
                  <span className={`font-semibold ${labelText}`}>ชื่องาน:</span>{" "}
                  {event.Worksheet}
                </p>
                <p>
                  <span className={`font-semibold ${labelText}`}>ผู้จ้าง:</span>{" "}
                  {event.Employer}
                </p>
                <p>
                  <span className={`font-semibold ${labelText}`}>เบอร์:</span>{" "}
                  {event.Contact_number}
                </p>
                <p>
                  <span className={`font-semibold ${labelText}`}>สถานะ:</span>{" "}
                  {event.Status}
                </p>
              </div>

              {/* Desktop view */}
              <p className="hidden lg:block truncate">{event.Worksheet}</p>
              {/* <img
                src={`http://localhost:5000/uploads/${event.image}`}
                alt="employee"
                className="h-20 w-20 object-cover rounded"
              /> */}
              <p className="hidden lg:block truncate">{event.Employer}</p>
              <p className="hidden lg:block truncate">{event.Contact_number}</p>
              <p className="hidden lg:block truncate text-orange-400">
                {event.Status}
              </p>
              <p className="hidden lg:block truncate">
                {event.Date_of_acceptance_of_work.split("T")[0]}
              </p>
              <p className="hidden lg:block truncate">
                {event.Closing_date.split("T")[0]}
              </p>

              {/* Buttons */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500 text-white px-2 rounded-lg hover:bg-red-600 transition"
                >
                  ลบ
                </button>
                <Link to={`/Details/${event._id}`}>
                  <button className="bg-green-500 text-white px-3 py-1  rounded-lg hover:bg-green-600 transition">
                    รายละเอียด
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className={`fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm transition-opacity  ${
              animationshowModal ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`rounded-2xl shadow-2xl p-8 w-[95%] md:w-[700px] lg:w-[900px] border max-h-[95vh] overflow-y-auto transform transition-all  ${
                animationshowModal
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-10 opacity-0 scale-95"
              } ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-blue-200 text-gray-800"
              }`}
            >
              <div
                className={`mb-6 border-b pb-3 ${
                  theme === "dark" ? "border-gray-700" : "border-blue-200"
                }`}
              >
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-yellow-300" : "text-blue-700"
                  }`}
                >
                  เพิ่มใบงาน
                </h2>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className={`block mb-1 font-semibold ${labelText}`}>
                    ชื่อใบงาน
                  </label>
                  <input
                    type="text"
                    value={Worksheet}
                    onChange={(e) => setWorksheet(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${
                      theme === "dark"
                        ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
                        : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${labelText}`}>
                    ชื่อผู้จ้างงาน
                  </label>
                  <input
                    type="text"
                    value={Employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${
                      theme === "dark"
                        ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
                        : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${labelText}`}>
                    เบอร์โทรติดต่อ
                  </label>
                  <input
                    type="text"
                    value={Contact_number}
                    onChange={(e) => setContact_number(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${
                      theme === "dark"
                        ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
                        : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"
                    }`}
                  />
                </div>
              </div>

              {/* Address + Dates + Description */}
              <div className="mb-6">
                <label className={`block mb-1 font-semibold ${labelText}`}>
                  ที่อยู่
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${
                    theme === "dark"
                      ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
                      : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-1 font-semibold ${labelText}`}>
                      สถานะ
                    </label>
                    <select
                      className={`border p-2 rounded-lg w-full focus:ring-2 outline-none ${
                        theme === "dark"
                          ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
                          : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"
                      }`}
                      value={Status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Active">Active</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block mb-1 font-semibold ${labelText}`}
                      >
                        วันที่รับงาน
                      </label>
                      <input
                        type="date"
                        value={Date_of_acceptance_of_work}
                        onChange={(e) =>
                          setDate_of_acceptance_of_work(e.target.value)
                        }
                        className={`border p-2 rounded-lg w-full focus:ring-2 outline-none ${
                          theme === "dark"
                            ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
                            : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block mb-1 font-semibold ${labelText}`}
                      >
                        วันที่ต้องปิดงาน
                      </label>
                      <input
                        type="date"
                        value={Closing_date}
                        onChange={(e) => setClosing_date(e.target.value)}
                        className={`border p-2 rounded-lg w-full focus:ring-2 outline-none ${
                          theme === "dark"
                            ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
                            : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block mb-1 font-semibold ${labelText}`}>
                      ไฟล์เริ่มงาน
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setImage(e.target.files ? e.target.files[0] : null)
                      }
                      className={`border p-2 rounded-lg w-full focus:ring-2 outline-none ${
                        theme === "dark"
                          ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
                          : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${labelText}`}>
                    รายละเอียดงาน
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`border p-2 rounded-lg w-full h-48 resize-none focus:ring-2 outline-none ${
                      theme === "dark"
                        ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
                        : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800"
                    }`}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 border-t pt-4">
                <button
                  onClick={closeModal}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    theme === "dark"
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
                    theme === "dark"
                      ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
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

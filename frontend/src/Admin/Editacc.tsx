import { useTheme } from "@/components/theme-provider";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Tradesman {
  _id?: string;
  Profile?: string;
  Name: string;
  Nickname?: string;
  ID?: string;
  Phone_Number: string;
  Email: string;
  Position: string;
  Birthday?: string;
  Start_data?: string;
  username?: string;
  passwork?: string;
  Address?: string;
  role?: string;
  Salary?: string;
}

const defaultForm: Partial<Tradesman> = {
  role: "user",
};

export default function Editacc() {
  const { theme } = useTheme();
  const [tradesmen, setTradesmen] = useState<Tradesman[]>([]);
  const [form, setForm] = useState<Partial<Tradesman>>(defaultForm);
  const [profile, setProfile] = useState<File | null>(null);
  const [selected, setSelected] = useState<Tradesman | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [fade, setFade] = useState(false);
  const [openDelete, setopenDelete] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<Tradesman | null>(null);
  const [Anim, setAmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [Focused, setFocused] = useState(false);
  //ระบบค้นหา
  const filteredTradesmen = tradesmen.filter((t) => {
    const term = (searchTerm ?? "").toLowerCase(); // ป้องกัน searchTerm undefined
    const name = (t.Name ?? "").toLowerCase();
    const position = (t.Position ?? "").toLowerCase();
    const email = (t.Email ?? "").toLowerCase();

    return (
      name.includes(term) || position.includes(term) || email.includes(term)
    );
  });

  const fetchTradesmen = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/login/all-tradesman",
        {
          withCredentials: true,
        }
      );
      setTradesmen(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTradesmen();
    const timer = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (t?: Tradesman) => {
    if (t) {
      setForm({
        ...t,
        Salary: t.Salary ? String(t.Salary) : "",
        Start_data: t.Start_data
          ? new Date(t.Start_data).toISOString().split("T")[0]
          : "",
        Birthday: t.Birthday
          ? new Date(t.Birthday).toISOString().split("T")[0]
          : "",
        role: t.role || "user",
      });
      setEditMode(true);
      setSelected(t);
    } else {
      setForm(defaultForm);
      setEditMode(false);
      setSelected(null);
    }
    setProfile(null);
    setShowModal(true); // render modal

    // เริ่ม animation ให้เด้ง
    setTimeout(() => setAmin(true), 50);
  };

  const handleChange = (key: keyof Tradesman, value: string | File) => {
    if (key === "Profile") setProfile(value as File);
    else setForm((prev) => ({ ...prev, [key]: value as string }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Name || !form.Phone_Number || !form.Email || !form.Position)
      return alert("กรุณากรอกข้อมูลให้ครบ");

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
    if (profile) data.append("Profile", profile);

    try {
      if (editMode && selected?._id) {
        await axios.put(
          `http://localhost:5000/api/login/${selected._id}`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/login/register", data, {
          withCredentials: true,
        });
      }
      fetchTradesmen();
      setAmin(false);
      setTimeout(() => {
        setShowModal(false);
        setForm(defaultForm);
        setProfile(null);
      }, 300);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (t: Tradesman) => {
    if (!t._id) return;
    await axios.delete(`http://localhost:5000/api/login/${t._id}`, {
      withCredentials: true,
    });
    fetchTradesmen();
  };

  // เปิด modal
  const openAddEmployee = () => {
    setShowModal(true); // render modal
    setTimeout(() => setAmin(true), 50); // เริ่ม animation หลัง render
  };

  // ปิด modal
  const closeAddEmployee = () => {
    setAmin(false); // เริ่ม fade-out
    setTimeout(() => {
      setShowModal(false); // ซ่อน modal หลัง fade-out
      setSelectedDelete(null); // ล้างค่า
    }, 300); // ต้องตรงกับ duration ของ CSS transition
  };

  // เปิด modal
  const openDeleteModal = (t: Tradesman) => {
    setSelectedDelete(t);
    setopenDelete(true); // render modal
    setTimeout(() => setAmin(true), 50); // fade-in หลัง render
  };
  //ยืนยันการลบ
  const handleConfirmDelete = async () => {
    if (!selectedDelete) return;

    try {
      await handleDelete(selectedDelete); // ลบข้อมูลจริง
      setAmin(false); // เริ่ม fade-out animation

      setTimeout(() => {
        setopenDelete(false); // ปิด modal หลัง animation
        setSelectedDelete(null); // ล้าง selected
      }, 300); // 300ms ต้องตรงกับ duration ของ CSS transition
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass = `border w-full focus:ring-2 outline-none p-2 rounded-lg  mt-2 ${
    theme === "dark"
      ? "border-gray-600 duration-300 bg-gray-700 focus:ring-yellow-400  text-white"
      : " focus:ring-blue-400 duration-300 text-gray-800 bg-gray-50"
  }`;
  const texthead = theme === "dark" ? "text-yellow-500" : "text-blue-700";

  return (
    <div
      className={`w-max-380  container duration-300 p-5 mx-auto  ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ตาราง */}
      <div className={`  `}>
        <div className="flex  items-center mb-5">
          <p className={`text-3xl font-bold ${texthead}`}>
            จัดการบัญชี{" "}
            <span
              className={theme === "dark" ? "text-white" : "text-yellow-500"}
            >
              ช่าง
            </span>
          </p>
          <div className="flex gap-3 ml-auto">
            <button
              onClick={openAddEmployee}
              className={`border p-1 group relative flex items-center cursor-pointer overflow-hidden rounded-md px-6 font-medium text-neutral-0 transition duration-300  text-white  ${
                theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
              }`}
            >
              เพิ่มช่าง
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                <div className="relative h-full w-8 bg-white/50"></div>
              </div>
            </button>
            <div className="relative">
              <CiSearch
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 
      ${
        searchTerm
          ? "text-blue-500 scale-125"
          : theme === "dark"
          ? "text-white"
          : "text-black"
      }`}
              />
              <input
                placeholder="ค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 ${
                  Focused ? "w-72" : "w-60"
                } ${
                  theme === "dark"
                    ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border"
                    : "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border"
                } ${
                  searchTerm
                    ? "border-blue-500 shadow-lg"
                    : theme === "dark"
                    ? "border-gray-600"
                    : "border-blue-300"
                }`}
              />
            </div>
          </div>
        </div>

        {/* หัวตาราง */}
        <div
          className={`grid grid-cols-9 pl-5 gap-5  font-semibold text-lg mb-3 ${
            theme === "dark"
              ? "text-yellow-500 border-b-4 border-yellow-500"
              : "text-blue-500 border-b-4 border-blue-200"
          }`}
        >
          <p className="col-span-2">ชื่อ</p>
          <p>สายงาน</p>
          <p>ตำแหน่ง</p>
          <p>เบอร์โทรศัพท์</p>
          <p>เมล</p>
          <p>เงินเดือน</p>
          <p>วันที่สมัคร</p>
          <p className="text-center">จัดการ</p>
        </div>

        <div className=" scrollbar-hide h-200 overflow-auto">
          {filteredTradesmen.map((t, idx) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
              className={`grid grid-cols-1  lg:grid-cols-9 rounded-lg gap-5 items-center  pl-5 shadow-sm py-1  mt-2 ${
                theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-gray-100"
              } border`}
            >
              <div className="flex gap-2 col-span-2 items-center">
                <Link to={`/ProfileIDUser/${t._id}`}>
                  <img
                    src={`http://localhost:5000/uploads/Profile/${
                      t.Profile || "default.png"
                    }`}
                    className="w-9 h-9 rounded-full object-cover  border-2"
                  />
                </Link>
                <p
                  className={` font-medium ${
                    theme === "dark" ? "text-yellow-500" : "text-gray-900"
                  }`}
                >
                  {t.Name}
                </p>
              </div>

              <p className="">{t.Position}</p>
              <p className="">
                {t.role === "user"
                  ? "ช่าง"
                  : t.role === "chief"
                  ? "หัวหน้าช่าง"
                  : t.role === "admin"
                  ? "ผู้ดูแล"
                  : t.role === "executive"
                  ? "ผู้บริหาร"
                  : t.role}
              </p>
              <p className="">{t.Phone_Number}</p>
              <p className="">{t.Email}</p>
              <p className="">{t.Salary}</p>
              <p className="">
                {t.Start_data
                  ? new Date(t.Start_data).toLocaleDateString("th-TH")
                  : "-"}
              </p>
              <div className="flex justify-center gap-1">
                <button
                  onClick={() => openDeleteModal(t)}
                  className="relative overflow-hidden cursor-pointer rounded-md bg-red-500 px-3 py-1 text-white text-sm shadow-md transition-all duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             hover:bg-red-600 active:-translate-y-1 active:scale-x-90 active:scale-y-110"
                >
                  ลบ
                </button>

                <button
                  onClick={() => openModal(t)}
                  className={`relative overflow-hidden cursor-pointer rounded-md  px-3 py-1 text-white text-sm shadow-md transition-all duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
              active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
                theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
              }`}
                >
                  แก้ไข
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <form onSubmit={handleSubmit}>
          <div
            className={`fixed inset-0 flex justify-center items-center bg-black/40 z-50 backdrop-blur-sm transition-opacity duration-300 ${
              Anim ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`rounded-2xl shadow-2xl p-8 w-[900px] border transition-transform duration-300 ${
                Anim ? "scale-100" : "scale-90 translate-y-5"
              } ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-yellow-500"
                  : "bg-white border-blue-200 text-blue-500"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 border-b pb-3 ${texthead}`}
              >
                {editMode ? "แก้ไขช่าง" : "เพิ่มช่างเข้าระบบ"}
              </h2>

              {/* ช่องกรอก */}
              <div className="grid grid-cols-2 gap-2">
                {Object.entries({
                  Name: "ชื่อนามสกุล",
                  Nickname: "ชื่อเล่น",
                  ID: "เลขบัตรประชาชน",
                  Phone_Number: "เบอร์โทรศัพท์",
                  Email: "Email",
                  Position: "สายงาน",
                  Salary: "เงินเดือน",
                  role: "ตําเเหน่ง",
                  Birthday: "วันเกิด",
                  Start_data: "วันที่เริ่มงาน",
                  username: "User",
                  passwork: "รหัสผ่าน",
                  Address: "ที่อยู่",
                  Profile: "รูปภาพพนักงาน",
                }).map(([key, label]) => (
                  <div
                    key={key}
                    className={`${
                      key === "Address" || key === "Profile" ? "col-span-2" : ""
                    }`}
                  >
                    <label>{label}</label>
                    {key === "role" ? (
                      <select
                        value={form.role ?? "user"}
                        onChange={(e) => handleChange("role", e.target.value)}
                        className={inputClass}
                      >
                        <option value="user">ช่าง</option>
                        <option value="chief">หัวหน้าช่าง</option>
                        <option value="admin">เเอดมิน</option>
                        {/* <option value="executive">Executive</option> */}
                      </select>
                    ) : (
                      <input
                        type={
                          {
                            Salary: "number",
                            ID: "number",
                            Phone_Number: "number",
                            Birthday: "date",
                            Start_data: "date",
                            Profile: "file",
                          }[key] || "text"
                        }
                        value={
                          key === "Profile"
                            ? undefined
                            : form[key as keyof Tradesman] ?? ""
                        }
                        onChange={(e) => {
                          if (key === "Profile") {
                            const file = e.target.files?.[0];
                            if (file) handleChange("Profile", file);
                          } else {
                            handleChange(
                              key as keyof Tradesman,
                              e.target.value
                            );
                          }
                        }}
                        className={`focus:ring-2 outline-none  ${inputClass}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 border-t pt-4 mt-4">
                <div className="flex gap-4">
                  {/* ปุ่มยกเลิก */}
                  <button
                    type="button"
                    onClick={closeAddEmployee}
                    className="group relative py-1  overflow-hidden rounded-lg cursor-pointer border bg-white px-4  text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                  >
                    <span className="relative z-10">ยกเลิก</span>
                    <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                      <span className="absolute left-0 top-0 w-0 h-full bg-gray-200  transition-all duration-500 group-hover:w-full"></span>
                    </span>
                  </button>

                  {/* ปุ่มยืนยัน */}
                  <button
                    type="submit"
                    className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4  text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${
                      theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                    }`}
                  >
                    <span className="relative z-10">ยืนยัน</span>
                    <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                      <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20  transition-all duration-500 group-hover:w-full"></span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* mode delete  */}
      {openDelete && selectedDelete && (
        <div
          className={`fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center bg-black/40 transition-opacity duration-300 ${
            Anim ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl shadow-2xl p-5 h-100 w-120  items-center gap-4 transition-transform duration-300 ${
              Anim ? "scale-100" : "scale-90"
            } ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
          >
            <p className="text-lg font-semibold text-red-500">ยืนยันการลบ</p>
            {/* <div className="flex gap-2  items-center ">
              <p
                className={`font-semibold ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                ต้องการลบ คุณ{" "}
              </p>
              <span>{selectedDelete.Name}</span>
            </div> */}
            <div className="border-b h-70  mb-5">
              <img
                className="border rounded-full mx-auto object-cover mb-5 bg-yellow-500 w-35 h-35"
                src={`http://localhost:5000/uploads/Profile/${
                  selectedDelete.Profile || "default.png"
                }`}
                alt={selectedDelete.Name || "Profile"}
              />
              <div className=" w-fit text-light mx-auto">
                <p>ID : {selectedDelete._id}</p>
                <p>นาย : {selectedDelete.Name}</p>
                <p>ตําเเหน่ง : {selectedDelete.role}</p>
                <p>สายงาน : {selectedDelete.Profile}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeAddEmployee}
                className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-white px-4  text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
              >
                <span className="relative z-10">ยกเลิก</span>
                <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                  <span className="absolute left-0 top-0 w-0 h-full bg-gray-200  transition-all duration-500 group-hover:w-full"></span>
                </span>
              </button>
              <button
                onClick={handleConfirmDelete}
                className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4  text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${
                  theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                }`}
              >
                <span className="relative z-10">ยืนยัน</span>
                <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                  <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20  transition-all duration-500 group-hover:w-full"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

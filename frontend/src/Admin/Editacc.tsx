import { useTheme } from "@/components/theme-provider";
import React, { useEffect, useState } from "react";
import axios from "axios";

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
  role: "user"
};

export default function Editacc() {
  const { theme } = useTheme();
  const [tradesmen, setTradesmen] = useState<Tradesman[]>([]);
  const [form, setForm] = useState<Partial<Tradesman>>(defaultForm);
  const [profile, setProfile] = useState<File | null>(null);
  const [selected, setSelected] = useState<Tradesman | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchTradesmen = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/login/all-tradesman", {
        withCredentials: true,
      });
      setTradesmen(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTradesmen();
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
    setShowModal(true);
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
        await axios.put(`http://localhost:5000/api/login/${selected._id}`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:5000/api/login/register", data, {
          withCredentials: true,
        });
      }
      fetchTradesmen();
      setShowModal(false);
      setSelected(null);
      setForm(defaultForm);
      setProfile(null);
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

  const inputClass = `border w-full p-2 rounded-lg mt-2 ${theme === "dark" ? "bg-gray-700 text-yellow-300" : "bg-gray-50 text-blue-700"
    }`;
  const texthead = theme === "dark" ? "text-yellow-300" : "text-blue-700";
const text = theme === "dark" ? "text-white" : "text-gray-800";
useEffect(() => {
    // เปิด fade หลัง render
    const timer = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timer);
  }, []);
 const [fade, setFade] = useState(false);
  return (
    <div className="w-max-380 p-4 mx-auto container pt-10">
      <div className={`mx-auto container rounded-2xl shadow-xl p-6 ${bg}`}>
        <div className="flex items-center justify-between mb-6">
          <p className={`text-3xl font-bold ${texthead}`}>
            จัดการบัญชี{" "}
            <span
              className={
                theme === "dark" ? "text-white" : "text-yellow-500"
              }
            >
              ช่าง
            </span>
          </p>
          <button
            onClick={() => setshowModal(true)}
            className={`border p-2 rounded-xl bg-blue-500 text-white cursor-pointer ${Bg_border}`}
          >
            เพิ่มช่าง
          </button>
        </div>

        {/* หัวตาราง */}
        <div
          className={`grid grid-cols-7 gap-5 text-center font-semibold text-lg mb-3 ${theme === "dark"
            ? "text-yellow-500 border-b-4 border-yellow-500"
            : "text-blue-500 border-b-4 border-blue-200"
            }`}
        >
          <p>รูป</p>
          <p>ชื่อ</p>
          <p>ตำแหน่ง</p>
          <p>เบอร์โทรศัพท์</p>
          <p>เมล</p>
          <p>วันที่สมัคร</p>
          <p>จัดการ</p>
        </div>

        {/* Table Rows */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-xl font-semibold text-blue-500">
              กำลังโหลดข้อมูล...
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {dataTradesman.map((event) => (
              <div
                key={event._id}
                className="grid grid-cols-7 gap-5 items-center border rounded-xl bg transition-all duration-200 shadow-sm py-2"
              >
                <img
                  src={`http://localhost:5000/uploads/Profile/${event.Profile || "default.png"
                    }`}
                  alt="profile"
                  className="w-10 h-10 object-cover rounded-full mx-auto border-2 border-blue-300 shadow-sm"
                />
                <p
                  className={`text-center font-medium ${theme === "dark" ? "text-yellow-500" : "text-gray-800"
                    }`}
                >
                  {event.Name}
                </p>
                <p className="text-center">{event.Position}</p>
                <p className="text-center">{event.Phone_Number}</p>
                <p className="text-center">{event.Email}</p>
                <p
                  className={`text-center font-medium ${theme === "dark" ? "text-yellow-500" : "text-gray-800"
                    }`}
                >
                  {new Date(event.Start_data).toLocaleDateString("th-TH")}
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => openDeleteModal(event)}
                    className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all shadow-md"
                  >
                    ลบ
                  </button>
                  <button
                    onClick={() => openEditModal(event)}
                    className="bg-orange-400 text-white px-5 py-2 rounded-full hover:bg-orange-500 transition-all shadow-md"
                  >
                    แก้ไข
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <form onSubmit={handleSubmit}>
          <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
            <div
              className={`rounded-2xl shadow-2xl p-8 w-[900px] border transition-colors duration-500 ${theme === "dark"
                ? "bg-gray-800 border-gray-700 text-yellow-500"
                : "bg-white border-blue-200 text-blue-500"
                }`}
            >
              <div className="mb-6 border-b pb-3">
                <h2 className={`text-2xl font-bold ${texthead}`}>
                  {editMode ? "แก้ไขช่าง" : "เพิ่มช่างเข้าระบบ"}
                </h2>
              </div>

              {/* ช่องกรอก */}
              <div className="grid grid-cols-2 gap-5">
                {Object.entries({
                  Name: "ชื่อนามสกุล",
                  Nickname: "ชื่อเล่น",
                  ID: "เลขบัตรประชาชน",
                  Phone_Number: "เบอร์โทรศัพท์",
                  Email: "Email",
                  Position: "สายงาน",
                  Salary: "เงินเดือน",
                  role: "Role",
                  Birthday: "วันเกิด",
                  Start_data: "วันที่เริ่มงาน",
                  username: "User",
                  passwork: "รหัสผ่าน",
                  Address: "ที่อยู่",
                  Profile: "รูปภาพพนักงาน",
                }).map(([key]) => (
                  <div
                    key={key}
                    className={`${key === 'Address' || key === 'Profile' ? 'col-span-2' : ''}`}
                  >
                    {key === "role" ? (
                      <select
                        value={form.role ?? "user"}
                        onChange={(e) => handleChange("role", e.target.value)}
                        className={inputClass}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="chief">Chief</option>
                        <option value="executive">Executive</option>
                      </select>
                    ) : (
                      <input
                        type={{
                          Salary: "number",
                          Birthday: "date",
                          Start_data: "date",
                          Profile: "file",
                        }[key] || "text"}
                        value={key === "Profile" ? undefined : form[key as keyof Tradesman] ?? ""}
                        onChange={(e) => {
                          if (key === "Profile") {
                            const file = e.target.files?.[0];
                            if (file) handleChange("Profile", file);
                          } else {
                            handleChange(key as keyof Tradesman, e.target.value);
                          }
                        }}
                        className={inputClass}
                      />
                    )}


                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-5 gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border rounded-xl p-2"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="border rounded-xl bg-blue-500 text-white px-4 py-2"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Modal ลบ */}
      {showdeleted && selectedTradesman && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
          <div
            className={`rounded-2xl shadow-2xl p-8 w-[400px] border ${theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
          >
            <p className="text-lg mb-4">
              คุณต้องการลบช่าง{" "}
              <span
                className={`font-bold ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  }`}
              >
                {selectedTradesman.Name}
              </span>{" "}
              ใช่หรือไม่
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setshowdeleted(false)}
                className="border px-4 py-2 cursor-pointer rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

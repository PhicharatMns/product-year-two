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
  const [openDelete, setopenDelete] = useState(false)
  const [selectedDelete, setSelectedDelete] = useState<Tradesman | null>(null);


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
    return () => clearTimeout(timer)
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



  const inputClass = `border w-full p-2 rounded-lg mt-2 ${theme === "dark"
    ? "bg-gray-700 text-yellow-500"
    : "bg-gray-50 text-blue-500"
    }`;
  const texthead = theme === "dark" ? "text-yellow-500" : "text-blue-700";

  return (
    <div className={`w-max-380 transition-opacity duration-700 container p-4 mx-auto pt-10 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {/* ตาราง */}
      <div
        className={`rounded-2xl h-screen shadow-xl p-6 ${theme === "dark" ? "bg-gray-900" : ""
          }`}
      >
        <div className="flex justify-between items-center mb-7">
          <p className={`text-3xl font-bold ${texthead}`}>
            จัดการบัญชี{" "}
            <span
              className={theme === "dark" ? "text-white" : "text-yellow-500"}
            >
              ช่าง
            </span>
          </p>
          <button
            onClick={() => openModal()}
            className={`border p-1 group relative flex items-center cursor-pointer overflow-hidden rounded-md px-6 font-medium text-neutral-0 transition duration-300  text-white ${theme === 'dark' ? 'bg-yellow-500' : 'bg-blue-500'}`}
          >
            เพิ่มช่าง
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
              <div className="relative h-full w-8 bg-white/50"></div>
            </div>

          </button>
        </div>

        {/* หัวตาราง */}
        <div
          className={`grid grid-cols-7 pl-5 gap-5  font-semibold text-lg mb-3 ${theme === "dark"
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
          <p className="text-center">จัดการ</p>
        </div>

        {tradesmen.map((t) => (
          <div
            key={t.Address}
            className={`grid grid-cols-7 my-2 gap-5 pl-5 items-center border rounded-xl shadow-sm ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'shadow-lg bg-gra-50/40'}`}
          >
            <img
              src={`http://localhost:5000/uploads/Profile/${t.Profile || "default.png"
                }`}
              className="w-9 h-9 rounded-full object-cover  border-2"
            />
            <p
              className={` font-medium ${theme === "dark" ? "text-yellow-500" : "text-gray-900"
                }`}
            >
              {t.Nickname}
            </p>
            <p className="">{t.Position}</p>
            <p className="">{t.Phone_Number}</p>
            <p className="">{t.Email}</p>
            <p className="">
              {t.Start_data
                ? new Date(t.Start_data).toLocaleDateString("th-TH")
                : "-"}
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  setSelectedDelete(t);
                  setopenDelete(true);
                }}
                className="relative overflow-hidden rounded-md bg-red-500 px-3 py-0.5 text-white text-sm shadow-md transition-all duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             hover:bg-red-600 active:-translate-y-1 active:scale-x-90 active:scale-y-110"
              >
                ลบ
              </button>

              <button
                onClick={() => openModal(t)}
                className={`relative overflow-hidden rounded-md  px-3 py-0.5 text-white text-sm shadow-md transition-all duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
              active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${theme === 'dark' ? 'bg-yellow-500' : 'bg-blue-500'}`}
              >
                แก้ไข
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <form onSubmit={handleSubmit}>
          <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
            <div
              className={`rounded-2xl shadow-2xl p-8 w-[900px] border ${theme === "dark"
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
                    className={`${key === "Address" || key === "Profile" ? "col-span-2" : ""
                      }`}
                  >
                    <label>{key}</label>
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
                        type={
                          {
                            Salary: "number",
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

              <div className="flex justify-end mt-5 gap-3 ">
                <div className="flex gap-4">
                  {/* ปุ่มยกเลิก */}
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="group relative py-1 overflow-hidden rounded-xl cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                  >
                    <span className="relative z-10">ยกเลิก</span>
                    <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                      <span className="absolute left-0 top-0 w-0 h-full bg-gray-200  transition-all duration-500 group-hover:w-full"></span>
                    </span>
                  </button>

                  {/* ปุ่มยืนยัน */}
                  <button
                    type="submit"
                    className={`group relative py-1 overflow-hidden rounded-xl border cursor-pointer px-4 text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${theme === 'dark' ? 'bg-yellow-500' : 'bg-blue-500'}`}
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
        <div className="fixed inset-0 cursor-pointer z-50 flex justify-center items-center bg-black/40 transition-opacity ">
          <div className={`rounded-2xl shadow-2xl p-8 w-100 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex gap-2">
              <p className={`font-extrabold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>ต้องการลบ คุณ </p>
              <span>{selectedDelete.Name}</span>
            </div>
            {/* ลบและยกเลิก */}
            <div className="flex gap-3 my-1 justify-end">
              <button
                onClick={() => setopenDelete(false)}
                className="relative cursor-pointer overflow-hidden rounded-lg border px-3 py-1 text-black bg-white shadow-lg transition-all duration-300 
                     [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
                     active:-translate-y-1 active:scale-x-90 active:scale-y-110"
              >
                ยกเลิก
              </button>
              <button
                onClick={async () => {
                  if (selectedDelete) {
                    await handleDelete(selectedDelete); // ลบข้อมูล
                    setopenDelete(false); // ปิด modal
                    setSelectedDelete(null); // ล้าง selected
                  }
                }}
                className="relative overflow-hidden rounded-lg border px-3 py-1 text-white bg-red-500 cursor-pointer shadow-lg transition-all duration-300 
                     [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
                     active:-translate-y-1 active:scale-x-90 active:scale-y-110"
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

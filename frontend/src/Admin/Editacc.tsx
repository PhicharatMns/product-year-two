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

  return (
    <div className="w-max-380 p-4 mx-auto pt-10">
      {/* ตาราง */}
      <div
        className={`rounded-2xl shadow-xl p-6 ${theme === "dark" ? "bg-black/10" : ""
          }`}
      >
        <div className="flex justify-between mb-6">
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
            onClick={() => openModal()}
            className="border p-2 rounded-xl bg-blue-500 text-white"
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

        {tradesmen.map((t) => (
          <div
            key={t.Address}
            className="grid grid-cols-7 gap-5 items-center border rounded-xl py-2 shadow-sm"
          >
            <img
              src={`http://localhost:5000/uploads/Profile/${t.Profile || "default.png"
                }`}
              className="w-10 h-10 rounded-full mx-auto border-2"
            />
            <p
              className={`text-center font-medium ${theme === "dark" ? "text-yellow-500" : "text-gray-800"
                }`}
            >
              {t.Nickname}
            </p>
            <p className="text-center">{t.Position}</p>
            <p className="text-center">{t.Phone_Number}</p>
            <p className="text-center">{t.Email}</p>
            <p className="text-center">
              {t.Start_data
                ? new Date(t.Start_data).toLocaleDateString("th-TH")
                : "-"}
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => openModal(t)}
                className="bg-orange-400 text-white px-5 py-2 rounded-full"
              >
                แก้ไข
              </button>
              <button
                onClick={() => handleDelete(t)}
                className="bg-red-600 text-white px-5 py-2 rounded-full"
              >
                ลบ
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
                }).map(([key, label]) => (
                  <div
                    key={key}
                    className={`${key === 'Address' || key === 'Profile' ? 'col-span-2' : ''}`}
                  >
                    <p>{label}</p>
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
      )
      }
    </div >
  );
}

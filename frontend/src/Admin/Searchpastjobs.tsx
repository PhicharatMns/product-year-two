import React, { useEffect, useState, type ChangeEvent } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";

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
  Status?: string;
  image?: string;
}

interface FormState {
  Worksheet: string;
  Employer: string;
  Contact_number: string;
  address: string;
  responsible: string;
  Date_of_acceptance_of_work: string;
  Closing_date: string;
  description: string;
  Status: string;
  image: File | null;
}

export default function Searchpastjobs() {
  const { theme } = useTheme();
  const [dataEmployees, setDataEmployees] = useState<Employees[]>([]);
  const [fade, setFade] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [form, setForm] = useState<FormState>({
    Worksheet: "",
    Employer: "",
    Contact_number: "",
    address: "",
    responsible: "",
    Date_of_acceptance_of_work: new Date().toISOString().split("T")[0],
    Closing_date: new Date().toISOString().split("T")[0],
    description: "",
    Status: "Active",
    image: null,
  });

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const data = await res.json();
      setDataEmployees(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEmployees();
    const t = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (key: keyof FormState, value: string | File | null) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      (Object.keys(form) as Array<keyof FormState>).forEach((key) => {
        const value = form[key];
        if (value !== null && value !== "") {
          // ถ้าเป็น File append ได้เลย, ถ้าเป็น string ต้อง convert เป็น string
          fd.append(key, value instanceof File ? value : String(value));
        }
      });
      await fetch("http://localhost:5000/api/employees", { method: "POST", body: fd });
      await fetchEmployees();
      setShowModal(false);
      setForm({
        Worksheet: "",
        Employer: "",
        Contact_number: "",
        address: "",
        responsible: "",
        Date_of_acceptance_of_work: new Date().toISOString().split("T")[0],
        Closing_date: new Date().toISOString().split("T")[0],
        description: "",
        Status: "Active",
        image: null,
      });
    } catch (e) {
      console.error(e);
    }
  };
  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/api/employees/${id}`, { method: "DELETE" });
    fetchEmployees();
  };

  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setAnimate(true), 10);
  };
  const closeModal = () => {
    setAnimate(false);
    setTimeout(() => setShowModal(false), 300);
  };

  const t = theme === "dark";
  const cls = {
    text: t ? "text-white" : "text-gray-900",
    label: t ? "text-yellow-300" : "text-blue-700",
    input: t
      ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
      : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800",
  };

  return (
    <div className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"}`}>
      <div className="container mx-auto pt-10 p-6">
        <div className={`rounded-xl shadow-lg p-5 min-h-screen ${t ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-5">
            <h2 className={`text-3xl font-bold ${t ? "text-yellow-500" : "text-blue-700"}`}>
              รับใบ<span className={t ? "text-white" : "text-yellow-500"}>งาน</span>
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={openModal}
                className={`px-5 py-2 rounded-md text-white ${t ? "bg-yellow-500" : "bg-blue-500"} hover:scale-105 transition`}
              >
                + เพิ่มใบงาน
              </button>
              <div className="relative">
                <CiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${cls.label}`} />
                <input placeholder="ค้นหา..." className={`border pl-10 pr-3 py-1 rounded-xl ${cls.input}`} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={`hidden lg:grid grid-cols-7 gap-5 border-b-2 pb-2 ${t ? "text-yellow-500" : "text-blue-700"}`}>
            {headerNav.map((h, i) => (
              <div key={i} className={`${i === 6 ? "text-center" : ""}`}>{h}</div>
            ))}
          </div>

          {dataEmployees.map((e, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-7 gap-5 items-center rounded-xl shadow-sm py-1 px-5 mt-2 ${t ? "bg-gray-900/80 border-gray-700" : "bg-blue-50/50 border-blue-100"} border`}
            >
              <p className="hidden lg:block truncate">{e.Worksheet}</p>
              <p className="hidden lg:block truncate">{e.Employer}</p>
              <p className="hidden lg:block truncate">{e.Contact_number}</p>
              <p className="hidden lg:block truncate text-orange-400">{e.Status}</p>
              <p className="hidden lg:block truncate">{e.Date_of_acceptance_of_work?.split("T")[0]}</p>
              <p className="hidden lg:block truncate">{e.Closing_date?.split("T")[0]}</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => handleDelete(e._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">ลบ</button>
                <Link to={`/Details/${e._id}`}>
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">รายละเอียด</button>
                </Link>
              </div>
            </div>
          ))}

          {/* Modal */}
          {showModal && (
            <div
              className={`fixed inset-0 z-50 flex justify-center items-center bg-black/40 transition-opacity ${animate ? "opacity-100" : "opacity-0"}`}
            >
              <div
                className={`rounded-2xl shadow-2xl p-8 w-[95%] md:w-[700px] lg:w-[900px] border max-h-[95vh] overflow-y-auto transform transition-all duration-300 ${animate ? "scale-100 opacity-100" : "scale-95 opacity-0"} ${t ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-blue-200 text-gray-800"}`}
              >
                <h2 className={`text-2xl font-bold mb-6 border-b pb-3 ${cls.label} `}>เพิ่มใบงาน</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["Worksheet", "ชื่อใบงาน"],
                    ["Employer", "ชื่อผู้จ้าง"],
                    ["Contact_number", "เบอร์โทร"],
                    ["responsible", "ผู้รับผิดชอบ"],
                    ["address", "ที่อยู่"],
                  ].map(([k, label]) => (
                    <div key={k} className="flex flex-col">
                      <label className={`mb-1 font-semibold ${cls.label}`}>{label}</label>
                      <input
                        type="text"
                        value={form[k as keyof FormState] as string}
                        onChange={(e) => handleChange(k as keyof FormState, e.target.value)}
                        className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${cls.input}`}
                      />
                    </div>
                  ))}

                  {[
                    ["Date_of_acceptance_of_work", "วันที่รับงาน"],
                    ["Closing_date", "วันที่ปิดงาน"],
                  ].map(([k, label]) => (
                    <div key={k} className="flex flex-col">
                      <label className={`mb-1 font-semibold ${cls.label}`}>{label}</label>
                      <input
                        type="date"
                        value={form[k as keyof FormState] as string}
                        onChange={(e) => handleChange(k as keyof FormState, e.target.value)}
                        className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${cls.input}`}
                      />
                    </div>
                  ))}

                  <div className="flex flex-col">
                    <label className={`mb-1 font-semibold ${cls.label}`}>ไฟล์แนบ</label>
                    <input
                      type="file"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange("image", e.target.files?.[0] ?? null)
                      }
                      className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${cls.input}`}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={`block mb-1 font-semibold ${cls.label}`}>รายละเอียดงาน</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className={`border w-full p-2 rounded-lg h-35 resize-none focus:ring-2 outline-none ${cls.input}`}
                  />
                </div>

                <div className="flex justify-end gap-4 border-t pt-4 mt-4">
                  <button
                    onClick={closeModal}
                    className={`px-6 py-2 rounded-lg ${t ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSave}
                    className={`px-6 py-2 rounded-lg ${t ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

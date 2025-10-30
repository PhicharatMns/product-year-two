import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";

interface Employee {
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
  image: File | null;
}

interface FormState extends Omit<Employee, "_id"> {
  image: File | null;
  Status: string;
}

const defaultForm: FormState = {
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
};

const headers = [
  "ชื่องาน",
  "รายชื่อผู้จ้าง",
  "เบอร์ติดต่อ",
  "สถานะ",
  "วันที่รับ",
  "วันที่ต้องปิดงาน",
  "จัดการ",
];

export default function Searchpastjobs() {
  const { theme } = useTheme();
  const t = theme === "dark";

  const [data, setData] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [anim, setAnim] = useState(false);
  const [fade, setFade] = useState(false);

  const cls = {
    label: t ? "text-yellow-300" : "text-blue-700",
    input: t
      ? "border-gray-600 focus:ring-yellow-400 bg-gray-700 text-white"
      : "border-blue-300 focus:ring-blue-400 bg-white text-gray-800",
  };

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (key: keyof FormState, value: string | File | null) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== "")
          fd.append(k, v instanceof File ? v : String(v));
      });

      if (editId) {
        await fetch(`http://localhost:5000/api/employees/${editId}`, {
          method: "PUT",
          body: fd,
        });
      } else {
        await fetch(`http://localhost:5000/api/employees`, {
          method: "POST",
          body: fd,
        });
      }

      fetchData();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบใช่หรือไม่?")) return;
    try {
      await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (e?: Employee) => {
    if (e) {
      setForm({
        Worksheet: e.Worksheet,
        Employer: e.Employer,
        Contact_number: e.Contact_number,
        address: e.address,
        responsible: e.responsible,
        Date_of_acceptance_of_work:
          e.Date_of_acceptance_of_work?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        Closing_date:
          e.Closing_date?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        description: e.description,
        Status: e.Status || "Active",
        image: null,
      });
      setEditId(e._id);
    } else {
      setForm(defaultForm);
      setEditId(null);
    }
    setShowModal(true);
    setTimeout(() => setAnim(true), 10);
  };

  const closeModal = () => {
    setAnim(false);
    setTimeout(() => setShowModal(false), 300);
  };

  const filtered = data.filter(
    (e) =>
      (e.Worksheet ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.Employer ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.Contact_number ?? "").includes(search)
  );

  return (
    <div
      className={`transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto pt-10 p-6">
        <div
          className={`rounded-xl shadow-lg p-5 min-h-screen ${
            t ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-5">
            <h2
              className={`text-3xl font-bold ${
                t ? "text-yellow-500" : "text-blue-700"
              }`}
            >
              รับใบ{" "}
              <span className={t ? "text-white" : "text-yellow-500"}>งาน</span>
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => openModal()}
                className={`border p-1 group relative flex items-center cursor-pointer overflow-hidden rounded-md px-6 font-medium text-neutral-0 transition duration-300  text-white ${
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
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${cls.label}`}
                />
                <input
                  placeholder="ค้นหา..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`border pl-10 pr-3 py-1 rounded-xl ${cls.input}`}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div
            className={`hidden lg:grid font-extrabold grid-cols-7 gap-5 border-b-2 px-5  mb-3 ${
              t
                ? "text-yellow-500 border-yellow-500"
                : "text-blue-700 border-blue-500"
            }`}
          >
            {headers.map((h, i) => (
              <div key={i} className={`${i === 6 ? "text-center" : ""}`}>
                {h}
              </div>
            ))}
          </div>

          {filtered.map((e, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-7 gap-5 items-center rounded-xl shadow-sm py-1 px-5 mt-2 ${
                t ? "bg-gray-800/90 border-gray-700" : "bg-blue-50/40"
              } border`}
            >
              {(
                [
                  "Worksheet",
                  "Employer",
                  "Contact_number",
                ] as (keyof Employee)[]
              ).map((k) => (
                <p key={k} className="hidden lg:block truncate">
                  {e[k] instanceof File ? e[k].name : e[k] ?? ""}
                </p>
              ))}

              <p className="hidden lg:block truncate text-orange-400">
                {e.Status ?? ""}
              </p>

              {(
                [
                  "Date_of_acceptance_of_work",
                  "Closing_date",
                ] as (keyof Employee)[]
              ).map((k) => (
                <p key={k} className="hidden lg:block truncate">
                  {typeof e[k] === "string" ? e[k].split("T")[0] : ""}
                </p>
              ))}

              <div className="gap-1 flex justify-center">
                {/* ปุ่มลบ */}
                <button
                  onClick={() => handleDelete(e._id)}
                  className="relative overflow-hidden cursor-pointer rounded-md bg-red-500 px-2 py-0.5 text-white text-sm duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             active:translate-y-1 active:scale-x-110 active:scale-y-90 hover:bg-red-600"
                >
                  ลบ
                </button>

                {/* ปุ่มแก้ไข */}
                <button
                  onClick={() => openModal(e)}
                  className={`relative overflow-hidden cursor-pointer rounded-md  px-3 py-0.5 text-white text-sm shadow-md transition-all duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
              active:-translate-y-1 active:scale-x-110 active:scale-y-110 ${
                theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
              }`}
                >
                  แก้ไข
                </button>

                {/* ปุ่มรายละเอียด */}
                <Link to={`/Details/${e._id}`}>
                  <button
                    className="relative overflow-hidden cursor-pointer rounded-md bg-green-500 px-2 py-0.5 text-white text-sm duration-300 
               [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
              active:-translate-y-1 active:scale-x-110 active:scale-y-110 hover:bg-green-600"
                  >
                    รายละเอียด
                  </button>
                </Link>
              </div>
            </div>
          ))}

          {/* Modal */}
          {showModal && (
            <div
              className={`fixed inset-0 z-50 flex justify-center items-center bg-black/40 transition-opacity ${
                anim ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`rounded-2xl shadow-2xl p-8 w-[95%] md:w-[700px] lg:w-[900px] border max-h-[95vh] overflow-y-auto transform transition-all duration-300 ${
                  anim ? "scale-100 opacity-100" : "scale-95 opacity-0"
                } ${
                  t
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-blue-200 text-gray-800"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 border-b pb-3 ${cls.label}`}
                >
                  {editId ? "แก้ไขใบงาน" : "เพิ่มใบงาน"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Worksheet",
                    "Employer",
                    "Contact_number",
                    "responsible",
                    "address",
                  ].map((k) => (
                    <div key={k} className="flex flex-col">
                      <label className={`mb-1 font-semibold ${cls.label}`}>
                        {k}
                      </label>
                      <input
                        type="text"
                        value={form[k as keyof FormState] as string}
                        onChange={(e) =>
                          handleChange(k as keyof FormState, e.target.value)
                        }
                        className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${cls.input}`}
                      />
                    </div>
                  ))}
                  {["Date_of_acceptance_of_work", "Closing_date"].map((k) => (
                    <div key={k} className="flex flex-col">
                      <label className={`mb-1 font-semibold ${cls.label}`}>
                        {k}
                      </label>
                      <input
                        type="date"
                        value={form[k as keyof FormState] as string}
                        onChange={(e) =>
                          handleChange(k as keyof FormState, e.target.value)
                        }
                        className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${cls.input}`}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col">
                    <label className={`mb-1 font-semibold ${cls.label}`}>
                      ไฟล์แนบ
                    </label>
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
                  <label className={`block mb-1 font-semibold ${cls.label}`}>
                    รายละเอียดงาน
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className={`border w-full p-2 rounded-lg h-35 resize-none focus:ring-2 outline-none ${cls.input}`}
                  />
                </div>
                <div className="flex justify-end gap-4 border-t pt-4 mt-4">
                  <button
                    onClick={closeModal}
                    className="group relative py-1  overflow-hidden rounded-lg cursor-pointer border bg-white px-4  text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                  >
                    <span className="relative z-10">ยกเลิก</span>
                    <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                      <span className="absolute left-0 top-0 w-0 h-full bg-gray-200  transition-all duration-500 group-hover:w-full"></span>
                    </span>
                  </button>
                  <button
                    onClick={handleSave}
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
      </div>
    </div>
  );
}

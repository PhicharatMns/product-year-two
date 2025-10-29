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
            t ? "bg-gray-800 text-white" : "bg-white text-gray-900"
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
                className={`px-5 py-2 rounded-md text-white ${
                  t ? "bg-yellow-500" : "bg-blue-500"
                } hover:scale-105 transition`}
              >
                + เพิ่มใบงาน
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
            className={`hidden lg:grid grid-cols-7 gap-5 border-b-2 px-5 pb-2 ${
              t ? "text-yellow-500" : "text-blue-700"
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
                t
                  ? "bg-gray-900/80 border-gray-700"
                  : "bg-blue-50/50 border-blue-100"
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
                <button
                  onClick={() => openModal(e)}
                  className="bg-yellow-500 text-white px-2 py-0.5 rounded text-sm hover:bg-yellow-600"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(e._id)}
                  className="bg-red-500 text-white px-2 py-0.5 rounded text-sm hover:bg-red-600"
                >
                  ลบ
                </button>
                <Link to={`/Details/${e._id}`}>
                  <button className="bg-green-500 text-white px-2 py-0.5 rounded text-sm hover:bg-green-600">
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
                    className={`px-6 py-2 rounded-lg ${
                      t
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSave}
                    className={`px-6 py-2 rounded-lg ${
                      t
                        ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
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
    </div>
  );
}

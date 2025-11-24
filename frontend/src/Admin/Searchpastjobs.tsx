import React, { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
// import react-leaflet components
import THSarabunFont from "./THSarabunBase64";
import jsPDF from "jspdf";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet-draw"; // ต้อง import แบบนี้เพื่อให้ L.Control.Draw ทำงาน
import "leaflet-draw/dist/leaflet.draw.css"; // โหลด CSS ของ draw
import L from "leaflet";
import { motion } from "framer-motion";

interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}
import SignatureCanvas from "react-signature-canvas";

//  ข้อมูลพนักงาน
interface Employee {
  _id: string;
  Worksheet: string;
  Employer: string;
  Contact_number: string;
  address: GeoPoint; //  แทนที่จะเป็น string
  responsible: string;
  Date_of_acceptance_of_work: string;
  Closing_date: string;
  description: string;
  Status?: string;
  image: File | null;
  messageDelete: string;
}
// ฟอร์มเพิ่ม/แก้ไขงาน
interface FormState extends Omit<Employee, "_id"> {
  image: File | null;
  Status: string;
}

//  Default Form
const defaultForm: FormState = {
  Worksheet: "",
  Employer: "",
  Contact_number: "",
  address: { type: "Point", coordinates: [100.5018, 13.7563] },
  responsible: "",
  Date_of_acceptance_of_work: new Date().toISOString().split("T")[0],
  Closing_date: new Date().toISOString().split("T")[0],
  description: "",
  Status: "กำลังดำเนินการ",
  image: null,
  messageDelete: "",
};

//  Table Headers
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
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [anim, setAnim] = useState(false);
  const [fade, setFade] = useState(false);
  const [Opendatele, setopendatele] = useState(false);
  const [OpenMap, setOpenMap] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [Focused, setFocused] = useState(false);
  const [Focusedpopup, setFocusedpopup] = useState(false);
  const [messageDelete, setMessageDelete] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [searchpopup, setSearchpopup] = useState("");
  const [opendatefilepopup, setopendatefilepopup] = useState(fade);
  const [signature, setSignature] = useState<string | null>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const cls = {
    label: t ? "text-yellow-500" : "text-blue-500",
    input: t
      ? "border-gray-600 duration-300 bg-gray-700 focus:ring-yellow-400  text-white"
      : " focus:ring-blue-400 duration-300 text-gray-800 bg-gray-50",
  };

  //ดึงข้อมูล employees
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    }
  };

  //เเก้ไข employees
  const handleChange = (key: keyof FormState, value: string | File | null) =>
    setForm((f) => ({ ...f, [key]: value }));

  const generatePDF_Employee = (form, signatureBase64) => {
    // 1. Setup Document
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const {
      internal: { pageSize },
    } = doc;
    const pageWidth = pageSize.getWidth();
    const pageHeight = pageSize.getHeight();
    const margin = 50;
    const contentWidth = pageWidth - 2 * margin;
    let currentY = 60;

    // Primary color & style
    const primaryColor = [63, 81, 181]; // Deep Indigo
    const secondaryColor = [100, 100, 100]; // Gray

    // 2. Font Setup
    doc.addFileToVFS("THSarabun.ttf", THSarabunFont);
    doc.addFont("THSarabun.ttf", "THSarabun", "normal");
    doc.addFont("THSarabun.ttf", "THSarabun", "bold");
    doc.setFont("THSarabun");

    const formatDate = (dateString) =>
      dateString ? new Date(dateString).toLocaleDateString("th-TH") : "-";

    // --- HEADER ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 70, "F");
    doc.setFontSize(24);
    doc.setFont("THSarabun", "bold");
    doc.setTextColor(255);
    doc.text("TechJob - Employee Report", pageWidth / 2, 45, {
      align: "center",
    });
    currentY += 40;

    // --- DATE ---
    const startDate = formatDate(form.Date_of_acceptance_of_work);
    const endDate = formatDate(form.Closing_date);
    doc.setFontSize(10);
    doc.setFont("THSarabun", "normal");
    doc.setTextColor(0);
    doc.text(`วันที่รับงาน: ${startDate}`, margin, currentY);
    doc.text(`วันที่ปิดงาน: ${endDate}`, pageWidth - margin, currentY, {
      align: "right",
    });
    currentY += 30;

    // --- EMPLOYEE INFO BOX ---
    const boxMargin = 15;
    const boxHeight = 180;
    const halfWidth = contentWidth / 2;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(3);
    doc.roundedRect(margin, currentY, contentWidth, boxHeight, 12, 12, "S");

    const employeeData = [
      { label: "ชื่องาน", value: form.Worksheet },
      { label: "ชื่อผู้จ้าง", value: form.Employer },
      { label: "เบอร์ติดต่อ", value: form.Contact_number },
      { label: "เมล", value: form.address?.responsible },
    ];

    doc.setFontSize(10);
    let colY = currentY + boxMargin + 20;
    const colX1 = margin + boxMargin;
    const colX2 = margin + halfWidth + boxMargin;
    const labelOffset = 100;
    const maxTextWidth = halfWidth - 2 * boxMargin - labelOffset;
    

    employeeData.forEach((item, index) => {
      const value = String(item.value || "- ไม่ระบุ -");
      const x = index % 2 === 0 ? colX1 : colX2;
      const y = colY;

      doc.setFont("THSarabun", "bold");
      doc.setTextColor(...primaryColor);
      doc.text(`${item.label}:`, x, y);

      doc.setFont("THSarabun", "normal");
      doc.setTextColor(0);
      const lines = doc.splitTextToSize(value, maxTextWidth);
      doc.text(lines, x + labelOffset, y);

      if (index % 2 !== 0) colY += Math.max(lines.length * 16, 28);
    });

    currentY += boxHeight + 40;

    // --- DESCRIPTION BOX ---
    const detailBoxHeight = 140;
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(1.5);
    doc.roundedRect(
      margin,
      currentY,
      contentWidth,
      detailBoxHeight,
      12,
      12,
      "S"
    );

    doc.setFont("THSarabun", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text("รายละเอียดเพิ่มเติม:", margin + boxMargin, currentY + 25);

    doc.setFont("THSarabun", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);
    const detailText = String(form.description || "-");
    const detailLines = doc.splitTextToSize(
      detailText,
      contentWidth - 2 * boxMargin
    );
    doc.text(detailLines, margin + boxMargin, currentY + 50);

    currentY += detailBoxHeight + 40;

    // --- SIGNATURE ---
    const sigWidth = 160;
    const sigHeight = 50;
    const sigX = margin;
    if (signatureBase64) {
      doc.addImage(signatureBase64, "PNG", sigX, currentY, sigWidth, sigHeight);
    } else {
      doc.setFont("THSarabun", "normal");
      doc.setTextColor(secondaryColor);
      doc.text(
        "....................................................",
        sigX,
        currentY + 25
      );
    }

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("ผู้รับมอบงาน", sigX + sigWidth / 2, currentY + sigHeight + 20, {
      align: "center",
    });

    // --- FOOTER ---
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      "เอกสารนี้จัดทำโดยฝ่ายบุคคล TechJob เพื่อการศึกษา",
      margin,
      pageHeight - 30
    );

    // --- SAVE PDF ---
    const fileName = form._id
      ? `employee_${form._id}.pdf`
      : "employee_report.pdf";
    doc.save(fileName);
  };

  // -------------------- ตัวอย่างการเรียกใช้ --------------------
  const handleSave = async () => {
    try {
      // 1. สร้าง FormData จาก form
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== "") {
          if (k === "address")
            fd.append("address", JSON.stringify(form.address));
          else fd.append(k, v instanceof File ? v : String(v));
        }
      });

      // 2. ส่งข้อมูลไป backend (POST หรือ PUT)
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

      // 3. ดึงลายเซ็นต์จาก SignatureCanvas
      const signatureBase64 = sigCanvasRef.current?.toDataURL("image/png");

      // 4. สร้าง PDF พร้อมข้อมูลและลายเซ็นต์
      generatePDF_Employee(form, signatureBase64);

      // 5. ล้างลายเซ็นต์หลังสร้าง PDF
      sigCanvasRef.current?.clear();

      // 6. รีเฟรชข้อมูลและปิด Modal
      fetchData();
      closeModal();
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
    }
  };

  // ลบ employees
  const Deleteflie = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchData(); // รีเฟรชข้อมูล
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, messageDelete: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Status: "Delete",
          messageDelete: messageDelete,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // รีเฟรช list งานหลังอัพเดต
      fetchData(); // ดึงข้อมูลใหม่จาก backend
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  //เตีอนว่าจะลบจริงไหม
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
        Status: e.Status || "กำลังดำเนินการ",
        image: null,
        messageDelete: e.messageDelete,
      });
      setEditId(e._id);
    } else {
      setForm(defaultForm);
      setEditId(null);
    }
    setShowModal(true);
    setTimeout(() => setAnim(true), 10);
  };

  //setAnim
  const closeModal = () => {
    setAnim(false);
    setTimeout(() => setShowModal(false), 300);
  };

  //setAnim delate Employee
  const Opendatele_function = (e: Employee) => {
    setDeleteTarget(e); // เก็บงานที่จะลบ
    setopendatele(true); // เปิด modal
    setAnim(false); // เริ่ม animation
    setTimeout(() => setAnim(true), 0); // trigger animation
  };
  //setAnim delate Employee
  const clasOpendate = () => {
    setAnim(false);
    setTimeout(() => setopendatele(false), 300);
  };

  const Opendatelepopup = () => {
    setShowTrash(true); // mount modal
    setAnim(false); // เริ่มที่ opacity-0
    setTimeout(() => setAnim(true), 20); // ทำให้ค่อยๆ ขึ้น
  };

  const OpenFilepopupDate = () => {
    setAnim(false); // fade out ก่อน
    setTimeout(() => setShowTrash(false), 300); // แล้วค่อย unmount
  };

  const openclasdatefilePopup = () => {
    setAnim(false);
    setTimeout(() => setopendatefilepopup(false), 300);
  };

  const clasdatefilePopup = (e: Employee) => {
    setDeleteTarget(e); // เก็บ Employee ที่จะลบ
    setAnim(false);
    setShowTrash(false); // ปิด modal เก่า
    setTimeout(() => {
      setopendatefilepopup(true); // เปิด modal ลบจริง
      setTimeout(() => setAnim(true), 10); // trigger animation
    }, 20);
  };

  // ฟิลเตอร์ข้อมูลตามคำค้นหา
  const filtered = data.filter(
    (e) =>
      (e.Worksheet ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.Employer ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.Contact_number ?? "").includes(search)
  );

  //------------------------------Map ทั้งหมด----------------------------------------
  // ประกาศด้านบน component หรือ function
  const defaultCenter: [number, number] = [13.736717, 100.523186]; // พิกัดเริ่มต้น (Bangkok)

  // โหลดค่าที่เคยบันทึกไว้ตอนเปิดหน้า
  useEffect(() => {
    if (form?.address) {
      try {
        const addr =
          typeof form.address === "string"
            ? JSON.parse(form.address)
            : form.address;

        //  GeoJSON: coordinates = [lng, lat]
        if (
          addr &&
          Array.isArray(addr.coordinates) &&
          typeof addr.coordinates[0] === "number" &&
          typeof addr.coordinates[1] === "number"
        ) {
          // ต้องสลับตำแหน่งกลับเป็น [lat, lng]
          setMarkerPos([addr.coordinates[1], addr.coordinates[0]]);
        } else {
          setMarkerPos(null);
        }
      } catch (err) {
        console.error("Invalid address format:", err);
        setMarkerPos(null);
      }
    } else {
      setMarkerPos(null);
    }
  }, [form?.address]);

  // component ดักการคลิก
  function ClickHandler() {
    useMapEvents({
      click(e) {
        setMarkerPos([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  }

  //  ฟังก์ชันกดยืนยัน
  const handleConfirm = () => {
    if (markerPos) {
      const [lat, lng] = markerPos;

      const posObj: GeoPoint = {
        type: "Point",
        coordinates: [lng, lat],
      };

      //  เซ็ต object โดยตรง ไม่ต้อง stringify
      setForm((f) => ({
        ...f,
        address: posObj,
      }));

      setOpenMap(false);
    }
  };

  // ซูมไปตรงพิกัดที่เคยปักไว้ล่าสุด
  function FlyToSaved({ markerPos }: { markerPos: [number, number] | null }) {
    const map = useMap();

    useEffect(() => {
      if (
        markerPos &&
        markerPos[0] !== undefined &&
        markerPos[1] !== undefined
      ) {
        map.flyTo(markerPos, 16);
      }
    }, [markerPos, map]);

    return null;
  }

  // สร้าง icon กำหนดสีเอง
  const customIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png", // สีเหลือง
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // โหลดข้อมูลทั้งหมดตอนเปิดหน้า
  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const bg = theme === "dark" ? "bg-gray-800" : " shadow-sm bg-white";
  const bgborder = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const texthead = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const texthaed = theme === "dark" ? "text-yellow-500" : "text-blue-500";

  return (
    <div
      className={`transition-opacity duration-500 container mx-auto p-5 max-w-380   ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="">
        <div className={``}>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-5">
            <h2
              className={`text-3xl font-bold ${
                t ? "text-yellow-500" : "text-blue-700"
              }`}
            >
              สร้าง{" "}
              <span className={t ? "text-white" : "text-yellow-500"}>
                ใบงาน
              </span>
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={Opendatelepopup}
                className={`border p-1 group relative flex items-center cursor-pointer overflow-hidden rounded-md px-6 font-medium text-neutral-0 transition duration-300  text-white bg-red-500`}
              >
                ถังขยะ
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                  <div className="relative h-full w-8 bg-white/50"></div>
                </div>
              </button>
              <button
                onClick={() => openModal()}
                className={`border p-1 group relative flex items-center cursor-pointer overflow-hidden rounded-md px-6 font-medium text-neutral-0 transition duration-300  text-white ${
                  theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                }`}
              >
                เพิ่มใบงาน
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                  <div className="relative h-full w-8 bg-white/50"></div>
                </div>
              </button>
              <div className="relative">
                <CiSearch
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${cls.label}`}
                />

                <input
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="ค้นหา..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 border
                    ${
                      theme === "dark"
                        ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border"
                        : "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border"
                    }}
                    ${Focused ? "w-72" : "w-60"} ${cls.input}`}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div
            className={`hidden lg:grid font-semibold  text-lg grid-cols-7 gap-5 border-b-2 px-5  mb-3 ${
              t
                ? "text-yellow-500 border-yellow-500"
                : "text-blue-500 border-blue-500"
            }`}
          >
            {headers.map((h, i) => (
              <div key={i} className={`${i === 6 ? "text-center" : ""}`}>
                {h}
              </div>
            ))}
          </div>

          {/* แสดงเฉพาะงานที่ Status = Active */}
          {filtered.filter(
            (e) =>
              e.Status === "ล่าช้า" ||
              e.Status === "กำลังดำเนินการ" ||
              e.Status === "Active" ||
              e.Status === "เสร็จสิ้น"
          ).length > 0 ? (
            filtered
              .filter(
                (e) =>
                  e.Status === "ล่าช้า" ||
                  e.Status === "กำลังดำเนินการ" ||
                  e.Status === "Active" ||
                  e.Status === "เสร็จสิ้น"
              )
              .sort((a, b) => {
                const statusOrder = [
                  "ล่าช้า",
                  "กำลังดำเนินการ",
                  "Active",
                  "เสร็จสิ้น",
                ];

                const indexA = statusOrder.indexOf(a.Status ?? "");
                const indexB = statusOrder.indexOf(b.Status ?? "");
                const statusDiff =
                  (indexA === -1 ? Infinity : indexA) -
                  (indexB === -1 ? Infinity : indexB);
                if (statusDiff !== 0) return statusDiff;

                const dateA = a.Closing_date
                  ? new Date(a.Closing_date).getTime()
                  : Infinity;
                const dateB = b.Closing_date
                  ? new Date(b.Closing_date).getTime()
                  : Infinity;
                return dateA - dateB;
              })
              .map((e, index) => (
                <motion.div
                  key={e._id ?? index} // fallback เป็น index เผื่อ _id ไม่มี
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className={`grid grid-cols-1 lg:grid-cols-7 rounded-lg gap-5 items-center py-1 px-5 mt-2 border ${
                    theme === "dark" ? "bg-gray-900" : "bg-gray-100"
                  }`}
                >
                  {/* ชื่อ คต. */}
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

                  {/* สถานะ */}
                  <p
                    className={`${
                      e.Status === "กำลังดำเนินการ" ? texthaed : ""
                    } ${e.Status === "เสร็จสิ้น" ? "text-green-500" : ""} ${
                      e.Status === "ล่าช้า" ? "text-red-500" : ""
                    }`}
                  >
                    {e.Status || "-"}
                  </p>

                  {/* วันที่ */}
                  {(
                    [
                      "Date_of_acceptance_of_work",
                      "Closing_date",
                    ] as (keyof Employee)[]
                  ).map((k) => {
                    let dateStr = "";
                    if (e[k]) {
                      if (typeof e[k] === "string")
                        dateStr = e[k].split("T")[0];
                      else if (e[k] instanceof Date)
                        dateStr = e[k].toISOString().split("T")[0];
                    }
                    return (
                      <p key={k} className="hidden lg:block truncate">
                        {dateStr}
                      </p>
                    );
                  })}

                  {/* ปุ่ม */}
                  <div className="gap-1 flex justify-center">
                    <button
                      onClick={() => Opendatele_function(e)}
                      className="relative overflow-hidden cursor-pointer rounded-md bg-red-500 px-3 py-1 text-white text-sm shadow-md transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-red-600 active:-translate-y-1 active:scale-x-90 active:scale-y-110"
                    >
                      ลบ
                    </button>

                    <button
                      onClick={() => openModal(e)}
                      className={`relative overflow-hidden cursor-pointer rounded-md px-3 py-1 text-white text-sm shadow-md transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
                        theme === "dark"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      แก้ไข
                    </button>

                    <Link to={`/Details/${e._id}`}>
                      <button
                        className={`relative overflow-hidden cursor-pointer rounded-md px-2 py-1 text-white text-sm shadow-md transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
                          theme === "dark"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        รายละเอียด
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))
          ) : (
            <div
              className={`text-center py-5 font-semibold ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              ไม่พบใบงานของคุณ ในเวลานี่
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div
              className={`fixed inset-0 z-50 flex justify-center duration-300 items-center backdrop-blur-sm bg-black/40 transition-opacity ${
                anim ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`rounded-2xl shadow-2xl p-8 w-[95%] md:w-[700px] lg:w-[900px] border max-h-[95vh] overflow-y-auto transform transition-all duration-300 ${
                  anim ? "scale-100 opacity-100" : "scale-95 opacity-0"
                } ${
                  t
                    ? "bg-gray-800 border-gray-900 text-white"
                    : "bg-white border-blue-200 text-gray-900"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 border-b pb-3 ${cls.label}`}
                >
                  {editId ? "แก้ไขใบงาน" : "เพิ่มใบงาน"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries({
                    Worksheet: "ชื่องาน",
                    Employer: "ชื่อผู้จ้าง",
                    Contact_number: "เบอร์ติดต่อ",
                    responsible: "เมล",
                    address: "ที่อยุ่งาน  ",
                  }).map(([k, label]) => (
                    <div key={k} className="flex flex-col">
                      <label className={`mb-1  ${cls.label}`}>{label}</label>

                      {k === "address" ? (
                        <button
                          type="button"
                          className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${cls.input} text-left`}
                          onClick={() => setOpenMap(true)}
                        >
                          ที่อยู่งาน
                        </button>
                      ) : (
                        <input
                          type="text"
                          value={form[k as keyof FormState] as string}
                          onChange={(e) =>
                            handleChange(k as keyof FormState, e.target.value)
                          }
                          className={`border w-full p-2 rounded-lg focus:ring-2 outline-none ${cls.input}`}
                        />
                      )}
                    </div>
                  ))}

                  {[
                    ["Date_of_acceptance_of_work", "วันเริ่มงาน"],
                    ["Closing_date", "วันปิดงาน"],
                  ].map(([k, label]) => (
                    <div
                      key={k}
                      className={`flex flex-col ${
                        k === "Closing_date" ? "col-span-2" : ""
                      }`}
                    >
                      <label className={`mb-1 font-semibold ${cls.label}`}>
                        {label}
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
                </div>
                <div className="">
                  <label className={`block mb-1 font-semibold ${cls.label}`}>
                    ลายเซ็นต์
                  </label>
                  <div className="border rounded-lg">
                    <SignatureCanvas
                      ref={sigCanvasRef}
                      penColor="black"
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "rounded-lg",
                      }}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      className="px-4 py-1 bg-gray-300 rounded-lg"
                      onClick={() => sigCanvasRef.current?.clear()}
                    >
                      ล้าง
                    </button>
                    {/* <button
                          onClick={() => generatePDF_Employee(form, signature)}
                          className="px-4 py-1 bg-blue-500 text-white rounded-lg"
                        >
                          ยืนยันและดาวน์โหลด PDF
                        </button> */}
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
                    onClick={() => {
                      handleSave(); // บันทึกฟอร์มก่อน
                    }}
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
          {/* //เตือนก่อนลบ */}
          {Opendatele && deleteTarget && (
            <div
              className={`fixed inset-0 z-50 flex justify-center duration-300 items-center backdrop-blur-sm bg-black/40 transition-opacity ${
                anim ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`rounded-2xl shadow-2xl p-5 w-120 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
                  anim ? "scale-100 opacity-100" : "scale-90 opacity-0"
                } ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <div className="flex flex-col gap-4">
                  {/* หัวข้อ */}
                  <div className="flex items-center gap-1">
                    <p
                      className={`font-semibold text-lg ${
                        theme === "dark" ? "text-yellow-500" : "text-blue-500"
                      }`}
                    >
                      ลบงาน :
                    </p>
                    <span>{deleteTarget.Worksheet}</span>
                  </div>

                  {/* หมายเหตุเตือนก่อนลบ */}
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      theme === "dark"
                        ? "bg-red-900/30 text-red-300"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    การลบงานนี้จะทำให้ระบบ ย้ายงานไปเก็บไว้ในถังขยะ งานจะ
                    ไม่แสดงในรายการหลัก อีกต่อไป แต่ ยังสามารถกู้คืนได้ในภายหลัง
                    หากต้องการ
                  </div>

                  {/* ช่องพิมพ์เหตุผล */}
                  <div className="flex flex-col gap-1">
                    <label className="font-medium">
                      กรุณาระบุเหตุผลที่ต้องการลบงานนี้:
                    </label>
                    <textarea
                      value={messageDelete}
                      onChange={(e) => setMessageDelete(e.target.value)}
                      placeholder="พิมพ์เหตุผลที่ต้องการลบ..."
                      className={`border rounded-lg p-3 h-28 outline-none transition ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* ปุ่ม */}
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      onClick={clasOpendate}
                      className="group relative overflow-hidden rounded-lg cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                    >
                      <span className="relative z-10">ยกเลิก</span>
                      <span className="absolute inset-0 overflow-hidden pointer-events-none">
                        <span className="absolute left-0 top-0 w-0 h-full bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        if (deleteTarget) {
                          handleDelete(deleteTarget._id, messageDelete);
                          setMessageDelete("");
                          clasOpendate(); // ปิด modal
                        }
                      }}
                      className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-red-500 text-white px-4 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                    >
                      <span className="relative z-10">ลบ</span>
                      <span className="absolute inset-0 overflow-hidden pointer-events-none">
                        <span className="absolute left-0 top-0 w-0 h-full bg-red-600 transition-all duration-500 group-hover:w-full"></span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* เปิดMap */}
          {OpenMap && (
            <div
              className={`fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm `}
            >
              <div className="w-300 h-190 p-5 bg-gray-800 rounded-lg">
                <MapContainer
                  center={defaultCenter}
                  zoom={13}
                  className="w-full h-170 rounded-lg"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <ClickHandler />
                  {markerPos && (
                    <Marker position={markerPos} icon={customIcon} />
                  )}
                  <FlyToSaved markerPos={markerPos} />

                  {/* เพิ่มฟีเจอร์วาด shape */}
                </MapContainer>

                <div className="flex gap-2 justify-end my-3 ">
                  <button
                    onClick={() => {
                      setOpenMap(false);
                    }}
                    className="group relative overflow-hidden rounded-lg cursor-pointer border bg-white px-4  text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                  >
                    <span className="relative z-10">ยกเลิก</span>
                    <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                      <span className="absolute left-0 top-0 w-0 h-full bg-gray-200  transition-all duration-500 group-hover:w-full"></span>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setOpenMap(false);
                      handleConfirm();
                    }}
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
      {showTrash && (
        <div
          className={`inset-0 z-50 fixed flex justify-center items-center transition-all duration-300 backdrop-blur-sm bg-black/40 ${
            anim ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl w-[900px] h-200 shadow-2xl border ${bg}
    transition-all duration-300 transform
    ${
      anim
        ? "opacity-100 scale-100 translate-y-0"
        : "opacity-0 scale-95 translate-y-5"
    }
  `}
          >
            <div className="flex justify-between border-b px-6 py-4 ">
              <p
                className={` text-2xl  font-semibold  ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                ถังขยะ
                <span
                  className={`${
                    theme === "dark" ? "text-white" : "text-yellow-500"
                  }`}
                >
                  ไฟล์งาน
                </span>
              </p>

              <div className="relative">
                <CiSearch
                  className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300`}
                />
                <input
                  placeholder="ค้นหาใบงาน..."
                  // onChange={(e) => setSearch(e.target.value)}
                  value={searchpopup}
                  onChange={(e) => setSearchpopup(e.target.value)}
                  onFocus={() => setFocusedpopup(true)}
                  onBlur={() => setFocusedpopup(false)}
                  type="text"
                  className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 border
                    ${
                      theme === "dark"
                        ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border"
                        : "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border"
                    }}
                    ${Focusedpopup ? "w-72" : "w-60"} ${cls.input}`}
                />
              </div>
            </div>
            {/* ข้อมูล */}
            <div className="px-6 border-b">
              <div className="grid grid-cols-5 gap-5 py-3  px-6">
                {[
                  "งาน",
                  "สาเหตุการลบ",
                  "ลบวันที่",
                  "ลบงาน",
                  "รายละเอียดงาน",
                ].map((e, i) => {
                  return (
                    <div
                      key={i}
                      className={`${i === 4 ? "text-center" : ""} ${texthead}`}
                    >
                      <p className="font-semibold">{e}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-6 h-150 border-b my-4 overflow-y-auto scrollbar-hide">
              {data
                .filter((t) => t.Status === "Delete") // แสดงเฉพาะ Delete
                .filter(
                  (e) =>
                    (e.Worksheet ?? "")
                      .toLowerCase()
                      .includes(searchpopup.toLowerCase()) ||
                    (e.messageDelete ?? "")
                      .toLowerCase()
                      .includes(searchpopup.toLowerCase()) ||
                    (e.Status ?? "")
                      .toLowerCase()
                      .includes(searchpopup.toLowerCase())
                )
                .map((e, i) => {
                  return (
                    <div
                      className={`grid grid-cols-5 gap-5 rounded-lg py-2  border mb-3 items-center  px-6 ${bgborder}`}
                      key={i}
                    >
                      <div>{e.Worksheet}</div>
                      <div>{e.messageDelete}</div>
                      <div>{e.Status}</div>
                      <div className="">
                        <button
                          // onClick={() => Deleteflie(e?._id)}
                          onClick={() => clasdatefilePopup(e)} // ส่ง employee เข้าไป
                          className="relative overflow-hidden w-fit cursor-pointer rounded-md bg-red-500 px-3 py-1 text-white text-sm shadow-md transition-all duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             hover:bg-red-600 active:-translate-y-1 active:scale-x-90 active:scale-y-110"
                        >
                          ลบงาน
                        </button>
                      </div>

                      <Link to={`/Details/${e._id}`}>
                        <div className="mx-auto w-fit">
                          <button
                            className={`relative overflow-hidden rounded-md cursor-pointer w-fit px-3 w-f py-1 text-white text-sm duration-300 
               [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
               active:translate-y-1 active:scale-x-110 active:scale-y-90  ${
                 theme === "dark"
                   ? "bg-yellow-500 hover:bg-yellow-700"
                   : "bg-blue-500 hover:bg-blue-700"
               }`}
                          >
                            รายละเอียด
                          </button>
                        </div>
                      </Link>
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-end pr-4">
              <button
                onClick={OpenFilepopupDate}
                className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
              >
                <span className="relative z-10">ยกเลิก</span>
                <span className="absolute inset-0 overflow-hidden pointer-events-none">
                  <span className="absolute left-0 top-0 w-0 h-full bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ลบจริง */}
      {opendatefilepopup && (
        <div
          className={`fixed inset-0 z-50 flex justify-center duration-300 items-center backdrop-blur-sm bg-black/40 transition-opacity ${
            anim ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl shadow-2xl p-5 w-120 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
              anim ? "scale-100 opacity-100" : "scale-90 opacity-0"
            } ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <div className="flex flex-col gap-4">
              {/* หัวข้อ */}
              <div className="flex items-center gap-1">
                <p
                  className={`font-semibold text-lg ${
                    theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  }`}
                >
                  ลบงานนี้
                </p>
              </div>

              {/* หมายเหตุเตือนก่อนลบ */}
              <div
                className={`p-3 rounded-lg text-sm ${
                  theme === "dark"
                    ? "bg-red-900/30 text-red-300"
                    : "bg-red-100 text-red-600"
                }`}
              >
                การลบภาวะนี้จะทำให้ข้อมูลหายไปทันที และไม่สามารถกู้คืนได้
              </div>

              {/* ปุ่ม */}
              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={openclasdatefilePopup}
                  className="group relative overflow-hidden rounded-lg cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                >
                  <span className="relative z-10">ยกเลิก</span>
                  <span className="absolute inset-0 overflow-hidden pointer-events-none">
                    <span className="absolute left-0 top-0 w-0 h-full bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (deleteTarget?._id) {
                      Deleteflie(deleteTarget._id);
                      setMessageDelete(""); // เคลียร์ textarea
                      openclasdatefilePopup(); // ปิด modal หลังลบ
                    } else {
                      console.warn("No target selected!");
                    }
                  }}
                  className="group relative overflow-hidden rounded-lg cursor-pointer border bg-red-500 text-white px-4 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                >
                  <span className="relative z-10">ลบ</span>
                  <span className="absolute inset-0 overflow-hidden pointer-events-none">
                    <span className="absolute left-0 top-0 w-0 h-full bg-red-600 transition-all duration-500 group-hover:w-full"></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

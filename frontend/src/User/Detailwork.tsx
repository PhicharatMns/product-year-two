import { useTheme } from "@/components/theme-provider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Employee {
  _id: string;
  Worksheet?: string;
  Supervisor?: string;
  PhoneNumber?: string;
  Date_of_acceptance_of_work?: string;
  Closing_date?: string;
  description?: string;
  address?: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
}

export default function Detailwork() {
  const { theme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [fade, setFade] = useState(false);

  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const text_color = theme === "dark" ? "text-white" : "text-black";
  const borderSoft = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const titleColor = theme === "dark" ? "text-yellow-500" : "text-blue-500";

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/employees");
        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
        const data: Employee[] = await res.json();

        const selected = data.find((emp) => emp._id === id);
        setJob(selected || null);

        // ตั้งค่า marker ถ้ามี coordinates
        if (selected?.address?.coordinates) {
          const [lng, lat] = selected.address.coordinates;
          setMarkerPos([lat, lng]);
        } else {
          // fallback ถ้าไม่มีตำแหน่ง
          setMarkerPos([13.7563, 100.5018]); // Bangkok
        }
      } catch (err) {
        console.error(err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // เริ่ม fade-in หลังจากโหลดเสร็จ
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setFade(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!job) return <div className="text-center py-10">ไม่พบข้อมูลงาน</div>;

  return (
    <div className={`w-max-380 p-5 mx-auto container ${bg} ${text}`}>
      <p className={`text-3xl mb-5 font-bold  ${titleColor}`}>
        รายละเอียด
        <span
          className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}
        >
          งาน
        </span>
      </p>

      <div
        className={`shadow-2xl p-6 sm:p-8 md:p-10 transition-all duration-300 rounded-2xl ${cardBg}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {["ชื่องาน :", "ชื่อหัวหน้างาน :", "เบอร์โทรศัพท์ :", "Email :"].map(
            (title, idx) => (
              <div
                key={idx}
                className={`border ${borderSoft} rounded-2xl p-4 sm:p-6 font-semibold`}
              >
                {title}
              </div>
            )
          )}
        </div>

        <div className={`mt-5 transition-all duration-300 rounded-2xl`}>
          <div className="grid grid-cols-2 gap-5">
            <div className={`border p-3 rounded-xl ${bg}`}>
              <p>หัวหน้างาน: {job.Supervisor || "-"}</p>
              <p>ตำแหน่ง: {"-"}</p>
              <p>เบอร์ติดต่อ: {job.PhoneNumber || "-"}</p>
              <p>
                วันเริ่มงาน:{" "}
                {job.Date_of_acceptance_of_work
                  ? new Date(job.Date_of_acceptance_of_work).toLocaleDateString(
                      "th-TH"
                    )
                  : "-"}
              </p>
              <p>
                วันปิดงาน:{" "}
                {job.Closing_date
                  ? new Date(job.Closing_date).toLocaleDateString("th-TH")
                  : "-"}
              </p>
            </div>

            <div className={`border p-3 rounded-xl ${bg}`}>
              <p className={`text-lg mb-1 font-semibold ${titleColor}`}>
                รายละเอียดงาน
              </p>
              <p className="text-ellipsis"> {job.description || "-"}</p>
            </div>
          </div>
          <div className="border py-5 px-6 col-span-2 rounded-2xl ">
            <h2 className="text-xl font-semibold text-blue-500 mb-3">
              ข้อความตอบกลับ
            </h2>
          </div>

          <div className="border py-5 px-6 rounded-2xl ">
            <h2 className="text-xl font-semibold text-blue-500 mb-3">
              ข้อความตอบกลับ
            </h2>

            <div
              className={`p-5 rounded-2xl border ${borderSoft}   dark:text-gray-200`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <div className={`col-span-2 ${text} `}>
                  <p>
                    “ขอบคุณสำหรับการรายงานงานนี้ ตรวจสอบเรียบร้อยดีแล้ว
                    ขอให้ดำเนินการตรวจสอบอุปกรณ์เพิ่มเติมอีกครั้งในสัปดาห์หน้า
                    และแนบรูปภาพหลังซ่อมในระบบด้วยนะครับ”
                  </p>
                </div>

                <div className="col-span-2 text-sm text-gray-500 mt-2">
                  — หัวหน้างาน: นายสมชาย แสงทอง (วันที่ตอบกลับ: 23 ตุลาคม 2568)
                </div>
                  
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

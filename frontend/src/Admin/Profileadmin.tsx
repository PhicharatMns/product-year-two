import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Verified } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// กำหนด Type ให้ตรงกับข้อมูลใน MongoDB
interface AdminProfile {
  Name: string;
  Nickname?: string;
  ID?: string;
  Birthday?: string;
  Address?: string;
  Phone_Number: string;
  Email: string;
  Position: string;
  Start_data?: string;
  Profile?: string;
  role?: string;
}

export default function Profileadmin() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // State เก็บข้อมูล Admin
  const [adminData, setAdminData] = useState<AdminProfile | null>(null);
  const [fade, setFade] = useState(false);

  // URL รูป Default
  const defaultProfileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  // Theme Classes
  const bg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const card = theme === "dark" ? "bg-gray-800/90" : "bg-white";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const softText = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const accent = theme === "dark" ? "text-yellow-500" : "text-blue-500";

  // Fetch Data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/logins");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/login/dashboardUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminData(res.data);
        setFade(true); // เริ่ม Animation หลังจากได้ข้อมูล
      } catch (err) {
        console.error("Error fetching profile:", err);
        // navigate("/logins"); // ถ้า error อาจจะให้เด้งออก
      }
    };

    fetchData();
  }, [navigate]);

  // ฟังก์ชันแปลงวันที่ให้สวยงาม
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`h-screen flex items-center justify-center ${bg} transition-colors duration-500`}
      >
        {/* กล่องหลัก */}
        <div
          className={`w-full h-full flex flex-col ${card} shadow-2xl transition-colors duration-500`}
        >
          {/* ส่วน Cover */}
          <div
            className={`relative h-56 sm:h-64 md:h-72 lg:h-80 ${bg} transition-colors duration-500`}
          >
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
              <img
                src={
                  adminData?.Profile
                    ? `http://localhost:5000/uploads/Profile/${adminData.Profile}`
                    : defaultProfileImage
                }
                onError={(e) => {
                  e.currentTarget.src = defaultProfileImage;
                }}
                alt="profile"
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300 object-cover bg-gray-500"
              />
            </div>
          </div>

          {/* เนื้อหาโปรไฟล์ */}
          <div className="flex-1 flex flex-col justify-start mt-24 px-4 sm:px-6 md:px-12 overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className={`text-2xl sm:text-3xl font-bold ${text}`}>
                {adminData?.Name || "กำลังโหลด..."}
                <Verified className="inline-block ml-2 text-blue-500" size={20} />
              </h2>
              <p className={`mt-1 ${softText}`}>{adminData?.Position || "Admin"}</p>
            </div>

            {/* กล่องข้อมูล */}
            <div
              className={`w-full max-w-5xl mx-auto ${bg} p-6 sm:p-8 rounded-2xl transition-colors duration-500 mb-10`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 transition-colors duration-500">
                {[
                  { label: "ชื่อเล่น", value: adminData?.Nickname || "-" },
                  { label: "เลขบัตรประชาชน", value: adminData?.ID || "-" },
                  { label: "วันเกิด", value: formatDate(adminData?.Birthday) },
                  { label: "ที่อยู่", value: adminData?.Address || "-" },
                  { label: "เบอร์โทรศัพท์", value: adminData?.Phone_Number || "-" },
                  { label: "อีเมล", value: adminData?.Email || "-" },
                  { label: "ตำแหน่ง", value: adminData?.Position || "-" },
                  { label: "วันที่เริ่มงาน", value: formatDate(adminData?.Start_data) },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:gap-2 border-b border-gray-300/30 pb-2 last:border-0"
                  >
                    <span
                      className={`font-semibold ${accent} w-full sm:w-40 transition-colors duration-500`}
                    >
                      {item.label}:
                    </span>
                    <p className={`${softText} break-words`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
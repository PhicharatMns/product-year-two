import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Verified } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profileadmin() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Style Variables
  const bg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const card = theme === "dark" ? "bg-gray-800/90" : "bg-white";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const softText = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const accent = theme === "dark" ? "text-yellow-500" : "text-blue-500";

  const [fade, setFade] = useState(false);
  const [userData, setUserData] = useState<any>(null); // เก็บข้อมูล User
  const [loading, setLoading] = useState(true);

  // Default Profile Image
  const defaultProfileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  useEffect(() => {
    // Fade Animation
    const timer = setTimeout(() => setFade(true), 50);

    // Fetch Data Function
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/logins"); // ถ้าไม่มี Token ดีดกลับหน้า Login
        return;
      }

      try {
        // ยิง API ไปที่ Backend (Port 5000 ตามที่คุณตั้งค่าไว้)
        const res = await axios.get("http://localhost:5000/api/login/dashboardUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        // กรณี Token หมดอายุหรือไม่ถูกต้อง
        // localStorage.removeItem("token");
        // navigate("/logins");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => clearTimeout(timer);
  }, [navigate]);

  // Helper function แปลงวันที่ให้สวยงาม (ตัดเวลาออก)
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    // ถ้า Date มาเป็น ISO string ยาวๆ ให้ตัดเหลือแค่ YYYY-MM-DD
    return dateString.split("T")[0]; 
  };

  if (loading) {
    return (
      <div className={`h-screen flex items-center justify-center ${bg} ${text}`}>
        Loading Profile...
      </div>
    );
  }

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
                  userData?.Profile
                    ? `http://localhost:5000/uploads/Profile/${userData.Profile}`
                    : defaultProfileImage
                }
                onError={(e) => {
                    e.currentTarget.src = defaultProfileImage;
                }}
                alt="profile"
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300 object-cover bg-gray-300"
              />
            </div>
          </div>

          {/* เนื้อหาโปรไฟล์ */}
          <div className="flex-1 flex flex-col justify-start mt-24 px-4 sm:px-6 md:px-12 overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className={`text-2xl sm:text-3xl font-bold ${text}`}>
                {userData?.Name || "ไม่ระบุชื่อ"}
                <Verified className="inline-block ml-2 text-blue-500" size={20} />
              </h2>
              <p className={`mt-1 ${softText}`}>{userData?.Position || "Admin"}</p>
            </div>

            {/* กล่องข้อมูล */}
            <div
              className={`w-full max-w-5xl mx-auto ${bg} p-6 sm:p-8 rounded-2xl transition-colors duration-500 mb-10`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 transition-colors duration-500">
                {[
                  { label: "ชื่อเล่น", value: userData?.Nickname },
                  { label: "ID", value: userData?.ID },
                  { label: "Birthday", value: formatDate(userData?.Birthday) },
                  { label: "Address", value: userData?.Address },
                  { label: "Phone", value: userData?.Phone_Number },
                  { label: "Email", value: userData?.Email },
                  { label: "Position", value: userData?.Position },
                  { label: "Start Date", value: formatDate(userData?.Start_data) },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:gap-2 border-b border-gray-300/30 pb-2 last:border-0"
                  >
                    <span
                      className={`font-semibold ${accent} w-full sm:w-32 transition-colors duration-500`}
                    >
                      {item.label}:
                    </span>
                    <p className={`${softText} break-words`}>
                      {item.value || "-"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// ✨ [แก้ไข] Import ไอคอน BicepsFlexed
import { BicepsFlexed, PersonStanding, ToolCase } from "lucide-react";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  UserCheck,
  Loader2,
  BookUser,
  Pencil,
  X,
  Star,
} from "lucide-react";

// --- Component: DetailItem (เหมือนเดิม) ---
const DetailItem = ({ Icon, label, value }) => {
  const { theme } = useTheme();
  return (
    <div className="flex items-start space-x-4 py-3">
      <Icon
        className={`w-5 h-5 flex-shrink-0 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        } mt-1`}
      />
      <div className="flex flex-col overflow-hidden">
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </span>
        <span
          className={`text-base font-semibold ${
            theme === "dark" ? "text-gray-50" : "text-gray-800"
          } break-words`}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

// --- ✨ [แก้ไข] Component: CoolBadge ---
// (โค้ดนี้ไม่ได้ถูกเรียกใช้ใน Profile แต่ผมทิ้งไว้ให้เผื่อคุณใช้ในอนาคต)
const CoolBadge = ({ text, Icon, theme }) => {
  const badgeColors =
    theme === "dark"
      ? "bg-gradient-to-br from-purple-600 to-blue-700 text-white" // Gradient Dark
      : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"; // Gradient Light

  const glassStyle =
    theme === "dark"
      ? "bg-white/5 border border-white/10 shadow-lg" // Glass Dark
      : "bg-white/20 border border-gray-100 shadow-md"; // Glass Light

  return (
    <motion.div
      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-semibold text-sm cursor-default 
                 ${glassStyle} ${badgeColors} 
                 transition-all duration-300 ease-in-out`} // <-- ✨ เพิ่มคลาส transition
      initial={{ scale: 0.8, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0 " />}
      <span>{text}</span>
    </motion.div>
  );
};

// --- Component: EditProfileModal (เหมือนเดิม 100%) ---
const EditProfileModal = ({
  user,
  onClose,
  theme,
  primaryColor,
  onUpdateSuccess,
}) => {
  // ... (โค้ด Modal ทั้งหมดเหมือนเดิม) ...

  // (สมมติว่าโค้ด Modal อยู่ในนี้ทั้งหมด)

  return (
    // ... เนื้อหาของ Modal ...
    <div></div> // (ตัวอย่าง placeholder)
  );
}; 
export default function Profile() {
  const { theme } = useTheme();
  
  // (แก้ปัญหา token is not defined)
  // คุณต้องดึง token มาจาก localStorage ที่นี่
  const token = localStorage.getItem("token"); 

  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [phones, setphones] = useState("");
  const [Position, setposition] = useState("");
  const [profile, setprofile] = useState("");
  const [ID, setID] = useState("");
  const [Address, setAddress] = useState("");
  const [Start_data, setStart_data] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- fetchData (เหมือนเดิม) ---
  const fetchData = async () => {
    // (เพิ่มการตรวจสอบ token)
    if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/login/dashboardUser",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName(response.data.Name || "ไม่ระบุชื่อ");
      setemail(response.data.Email || "ไม่ระบุอีเมล");
      setphones(response.data.Phone_Number || "ไม่ระบุเบอร์โทร");
      setposition(response.data.Position || "ไม่ระบุตำแหน่ง");
      setprofile(response.data.Profile || "");
      setID(response.data.ID || "N/A");
      setAddress(response.data.Address || "ไม่ระบุที่อยู่");

      const rawDate = response.data.Start_data;
      if (rawDate) {
        const date = new Date(rawDate);
        const formattedDate = date.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        setStart_data(formattedDate);
      } else {
        setStart_data("ไม่ระบุวันที่");
      }
    } catch (err) {
      console.error("Fetch profile data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]); // <-- (เพิ่ม token ใน dependency array)

  const handleProfileUpdateSuccess = () => {
    fetchData();
  };

  // --- Styles (สไตล์ทางการ) ---
  // (ส่วนนี้ถูกต้องดีแล้ว เพราะอยู่ภายใน 'Profile' component)
  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-indigo-600";
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const cardStyle = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textStyle = theme === "dark" ? "text-gray-50" : "text-gray-900";
  const subTextStyle = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${bgColor}`}
      >
        <Loader2 className={`w-8 h-8 ${primaryColor} animate-spin`} />
        <span className={`ml-3 text-xl ${subTextStyle}`}>
          กำลังโหลดข้อมูล...
        </span>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${textStyle} transition-all duration-500 p-4 md:p-12`}
    >
      {/* ภาชนะหลัก (จำกัดความกว้าง) */}
      <motion.div
        className="max-w-full mx-auto" // <-- ✨ [แก้ไข] แก้ไข Layout ให้อยู่กลาง
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- 1. หัวเรื่องของหน้า --- */}
        <h1 className="text-3xl font-bold mb-6">Employee Profile</h1>

        {/* --- 2. การ์ดโปรไฟล์หลัก --- */}
        <motion.div
          className={`${cardStyle} rounded-lg shadow-lg overflow-hidden`}
          layout
        >
          {/* --- 2.1 ส่วน Header ของการ์ด (รูป, ชื่อ, ปุ่ม Edit, และ ✨ Badge) --- */}
          <div className={`p-6 md:p-8 border-b ${borderColor}`}>
            <div className="flex justify-between items-start">
              {/* รูป + ชื่อ + ตำแหน่ง */}
              <div className="flex items-center space-x-5 md:space-x-6">
                <motion.img
                  src={`http://localhost:5000/uploads/Profile/${profile}`}
                  alt="Profile"
                  className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-md"
                />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{Name}</h2>
                  <p
                    className={`text-lg md:text-xl ${subTextStyle} flex items-center space-x-2 mt-1`}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>{Position}</span>
                  </p>
                </div>
              </div>

              {/* --- ✨ [แก้ไข] เปลี่ยนเป็น motion.button และเพิ่ม animation --- */}
              <motion.button
                className="flex items-center rounded-2xl bg-blue-500 py-2.5 px-3 border-b" // ลบ animate-flexing
                type="button"
                // --- เพิ่ม Animation ที่นี่ ---
                animate={{
                  scale: [1, 1.05, 1], // Keyframes: 100% -> 105% -> 100%
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <BicepsFlexed className="w-5 h-5 text-white" />
                <p className="ml-2 text-white">ช่างทึกทน</p>
              </motion.button>
              {/* ช่างทึกทน */}
              {/* ช่างสุดเก่ง */}
              {/* ช่างชำนาญ */}
              {/* ช่างยอดเยี่ยม */}
            </div>
          </div>

          {/* --- 2.2 ส่วน Details ของการ์ด (ข้อมูลทั้งหมด) --- */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* คอลัมน์ซ้าย: Contact */}
            <section>
              <h3
                className={`text-lg font-semibold ${primaryColor} mb-4 pb-2 border-b ${borderColor}`}
              >
                Contact Information
              </h3>
              <div className="space-y-2">
                <DetailItem Icon={Mail} label="Email Address" value={email} />
                <DetailItem Icon={Phone} label="Phone Number" value={phones} />
                <DetailItem
                  Icon={MapPin}
                  label="Current Address"
                  value={Address}
                />
              </div>
            </section>

            {/* คอลัมน์ขวา: Work */}
            <section>
              <h3
                className={`text-lg font-semibold ${primaryColor} mb-4 pb-2 border-b ${borderColor}`}
              >
                Work Details
              </h3>
              <div className="space-y-2">
                <DetailItem Icon={UserCheck} label="Employee ID" value={ID} />
                <DetailItem
                  Icon={Calendar}
                  label="Start Date"
                  value={Start_data}
                />
                <DetailItem
                  Icon={ToolCase}
                  label="จำนวนงานที่ทำ"
                  value={""}
                />
              </div>
            </section>
          </div>
        </motion.div>
      </motion.div>

      {/* --- ส่วน Modal (เหมือนเดิม) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <EditProfileModal
            theme={theme}
            primaryColor={primaryColor}
            onClose={() => setIsModalOpen(false)}
            user={{ Name, phones, Address }}
            onUpdateSuccess={handleProfileUpdateSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
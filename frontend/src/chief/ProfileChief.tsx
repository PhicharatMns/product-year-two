import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import axios from "axios";

// ✨ [แก้ไข] Import ไอคอน BicepsFlexed
import { BicepsFlexed } from "lucide-react";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  UserCheck,
  UserStar,
} from "lucide-react";

interface DetailItemProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}

// --- Component: DetailItem ---
const DetailItem: React.FC<DetailItemProps> = ({ Icon, label, value }) => {
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

// --- Component: Profile ---
export default function ProfileChief() {
  const { theme } = useTheme();
  const token = localStorage.getItem("token");

  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [phones, setphones] = useState("");
  const [Position, setposition] = useState("");
  const [profile, setprofile] = useState("");
  const [ID, setID] = useState("");
  const [Address, setAddress] = useState("");
  const [Start_data, setStart_data] = useState("");
  // const [loading, setLoading] = useState(true);
  const [fade, setfade] = useState(false);

  const fetchData = async () => {
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
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setfade(true), 100);
    return () => clearTimeout(timer);
  }, [token]);

  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-indigo-600";
  const cardStyle = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textStyle = theme === "dark" ? "text-gray-50" : "text-gray-900";
  const subTextStyle = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  // if (loading) {
  //   return (
  //     <div
  //       className={`min-h-screen flex items-center justify-center ${bgColor}`}
  //     >
  //       <Loader2 className={`w-8 h-8 ${primaryColor} animate-spin`} />
  //       <span className={`ml-3 text-xl ${subTextStyle}`}>
  //         กำลังโหลดข้อมูล...
  //       </span>
  //     </div>
  //   );
  // }

  return (
    <div
      className={`min-h-screen ${textStyle} transition-all duration-300 p-4 md:p-12 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold mb-6">Chief Profile</h1>

        {/* Profile Card */}
        <div className={`${cardStyle} rounded-lg shadow-lg overflow-hidden`}>
          <div className={`p-6 md:p-8 border-b ${borderColor}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-5 md:space-x-6">
                <img
                  src={`https://i.pinimg.com/1200x/3c/7f/94/3c7f94cd27f95fb70e0855429176dc34.jpg${profile}`}
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

              {/* Badge Button */}
              <button className="flex items-center rounded-2xl bg-blue-500 py-2.5 px-3 border-b">
                <UserStar  className="w-5 h-5 text-white" />
                <p className="ml-2 text-white">หัวหน้าช่าง</p>
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import axios from "axios";
import { motion } from "framer-motion";
// ✨ [แก้ไข] Import ไอคอน BicepsFlexed
import { BicepsFlexed } from "lucide-react";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  UserCheck,
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
export default function Profile() {
  const { theme } = useTheme();
  const token = localStorage.getItem("token");

  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [phones, setphones] = useState("");
  const [Position, setposition] = useState("");
  const [profile, setprofile] = useState("");
  const [ID, setID] = useState("");
  const [role, setrole] = useState("");
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
      setrole(response.data.role || "-");
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

  interface RequisitionItem {
    jobId?: string;
    id: string;
    name: string;
    quantity: string;
    description?: string;
    requesterName?: string;
    requesterProfile?: string;
    section?: string;
    role?: string;
    Closing_date?: string;
    createdAt?: string;
    _id?: string;
    status?: string;
    statusUpdatedAt?: string;
    additemecomfam?: string;
  }

  // const [employees, setEmployees] = useState([]);

  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5000/api/employees");
  //       setEmployees(res.data); // ดึง array ของ employee
  //     } catch (err) {
  //       console.error("Error fetching employees:", err);
  //     }
  //   };

  //   fetchEmployees();
  // }, []);

  interface typeJobCount {
    _id: string;
    NameJOB: string;
    Work_day: string;
    Closing_day: string;
    count: number;
    Name: string;
  }

  const [JobCount, setJobCount] = useState<typeJobCount[]>([]);

  const fetchJobCounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/otherTradesman");
      const data = await res.json();
      setJobCount(data);
    } catch (err) {
      console.error(err);
    }
  };

  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>(
    []
  );

  const fetchRequisitionItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/additem");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.items || [];
      setRequisitionItems(list);
    } catch (err) {
      console.error("โหลดรายการเบิกของล้มเหลว:", err);
      setRequisitionItems([]);
    }
  };

  useEffect(() => {
    fetchJobCounts();
    fetchRequisitionItems();
  }, []);

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
  const bgHead = theme === "dark" ? "bg-gray-900" : "bg-gray-50";

  const textHead = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const textL = theme === "dark" ? "text-white" : "text-black";
  return (
    <div
      className={` container mx-w-380 mx-auto ${textStyle} transition-all duration-300 p-5  ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="">
        <p
          className={`text-3xl font-bold mb-6 ${
            theme === "dark" ? "text-yellow-500" : "text-blue-500"
          }`}
        >
          โปรไฟล์{" "}
          <span
            className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}
          >
            ช่าง
          </span>
        </p>

        {/* Profile Card */}
        <div className={`${bgHead} rounded-lg shadow-lg overflow-hidden`}>
          <div className={`p-5 border-b ${borderColor}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-5 md:space-x-6">
                <img
                  src={`http://localhost:5000/uploads/Profile/${profile}`}
                  alt="Profile"
                  className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-md"
                />
                <div>
                  <p className={`text-2xl font-bold ${textHead}`}>
                    นาย : <span className={`${textL}`}>{Name}</span>
                  </p>
                  <p
                    className={`text-lg md:text-xl ${subTextStyle} flex items-center space-x-2 mt-1`}
                  >
                    <Briefcase size={20} />
                    <span className="text-sm">
                      ตำแหน่ง :
                      <span className="">
                        {role === "user" ? "ช่าง" : "หัวหน้าช่าง"}
                      </span>{" "}
                      สายงาน : <span>{Position}</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Badge Button */}
            </div>
          </div>

          {/* Details */}
          <div className="py-5 p-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <section>
              <h3
                className={`text-lg font-semibold ${textHead} mb-1 pb-2 border-b `}
              >
                ข้อมูลการติดต่อ
              </h3>
              <div className={``}>
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
                className={`text-lg font-semibold ${textHead} mb-4 pb-2 border-b `}
              >
                รายละเอียดงาน
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

        <div className="grid grid-cols-2 gap-5 my-5 h-90">
          <div className={`border ${bgHead} rounded-lg`}>
            <div className="p-4">
              <p className={`text-lg ${textHead} font-semibold`}>
                {" "}
                ประวัติการได้รับงาน
              </p>
              <div className="grid grid-cols-3 gap- my-3 border-b">
                {["ชื่องาน", "วันที่เริ่ม", "วันส่งมอบ"].map((e, i) => (
                  <div className={`${textHead}`} key={i}>
                    {e} {/* แสดงชื่อหัวข้อ */}
                  </div>
                ))}
              </div>
              {JobCount.filter((job) => job.Name === Name).map((e, i) => (
                <motion.div
                  key={e._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className="grid grid-cols-3 my-3 border-b">
                    <div>{e.NameJOB}</div>
                    <div>
                      {new Date(e.Work_day).toLocaleDateString("th-TH")}
                    </div>
                    <div>
                      {new Date(e.Closing_day).toLocaleDateString("th-TH")}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className={`border ${bgHead} rounded-lg`}>
            <div className="p-4">
              <p className={`text-lg ${textHead} font-semibold`}>
                {" "}
                ประวัติการขอเบิกของ
              </p>
              <div className="grid grid-cols-3 gap- my-3 border-b">
                {["ของที่เบิก", "สถานะ", "วันที่เบิก"].map((e, i) => (
                  <div className={`${textHead}`} key={i}>
                    {e} {/* แสดงชื่อหัวข้อ */}
                  </div>
                ))}
              </div>
              {requisitionItems
                .filter((e) => e.requesterName === Name)
                .map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <div className="grid grid-cols-3 my-3 border-b">
                      <div>{e.name}</div>
                      <div>{e.status}</div>
                      <div>
                        {e.createdAt
                          ? new Date(e.createdAt).toLocaleDateString("th-TH")
                          : "ไม่ระบุวันที่"}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

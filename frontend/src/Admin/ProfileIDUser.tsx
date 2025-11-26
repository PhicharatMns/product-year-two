import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  UserCheck,
} from "lucide-react";

// --- DetailItem component ---
interface DetailItemProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}
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

// --- Main Component ---
interface Tradesman {
  _id: string;
  Name: string;
  ID: string;
  role: string;
  message?: string;
  Profile?: string;
  Email?: string;
  Phone_Number?: string;
  Position?: string;
  Address?: string;
  Start_data?: string;
}

interface JobCountItem {
  _id: string;
  NameJOB: string;
  Work_day: string;
  Closing_day: string;
  Name: string;
}

interface RequisitionItem {
  _id: string;
  name: string;
  requesterName?: string;
  status?: string;
  createdAt?: string;
}

export default function ProfileIDUser() {
  const { _id } = useParams();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Tradesman | null>(null);
  const [JobCount, setJobCount] = useState<JobCountItem[]>([]);
  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>([]);
  const [fade, setFade] = useState(false);

  // --- Fetch User ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/login/all-tradesman"
        );
        const found = res.data.find((item: Tradesman) => item._id === _id);
        if (found && found.Start_data) {
          const date = new Date(found.Start_data);
          found.Start_data = date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
        setUser(found || null);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    const timer = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(timer);
  }, [_id]);

  // --- Fetch JobCount ---
  useEffect(() => {
    const fetchJobCounts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/otherTradesman");
        const data = await res.json();
        setJobCount(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobCounts();
  }, []);

  // --- Fetch Requisition Items ---
  useEffect(() => {
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
    fetchRequisitionItems();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (!user) return <p>ไม่พบผู้ใช้งาน</p>;

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
      className={`container mx-w-380 mx-auto ${textStyle} transition-all duration-300 p-5 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className={`text-3xl font-bold mb-6 ${textHead}`}>
        โปรไฟล์{" "}
        <span className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}>
          {user.role === "user" ? "ช่าง" : "หัวหน้าช่าง"}
        </span>
      </p>

      {/* Profile Card */}
      <div className={`${bgHead} rounded-lg shadow-lg overflow-hidden`}>
        <div className={`p-5 border-b ${borderColor}`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-5 md:space-x-6">
              <img
                src={`http://localhost:5000/uploads/Profile/${user.Profile}`}
                alt="Profile"
                className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-md"
              />
              <div>
                <p className={`text-2xl font-bold ${textHead}`}>
                  ชื่อ: <span className={`${textL}`}>{user.Name}</span>
                </p>
                <p className={`text-lg md:text-xl ${subTextStyle} flex items-center space-x-2 mt-1`}>
                  <Briefcase size={20} />
                  <span className="text-sm">
                    ตำแหน่ง : {user.role === "user" ? "ช่าง" : "หัวหน้าช่าง"} 
                    สายงาน : {user.Position || "-"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="py-5 p-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <section>
            <h3 className={`text-lg font-semibold ${textHead} mb-1 pb-2 border-b`}>
              ข้อมูลการติดต่อ
            </h3>
            <DetailItem Icon={Mail} label="Email Address" value={user.Email || "-"} />
            <DetailItem Icon={Phone} label="Phone Number" value={user.Phone_Number || "-"} />
            <DetailItem Icon={MapPin} label="Current Address" value={user.Address || "-"} />
          </section>

          <section>
            <h3 className={`text-lg font-semibold ${textHead} mb-4 pb-2 border-b`}>
              รายละเอียดงาน
            </h3>
            <DetailItem Icon={UserCheck} label="Employee ID" value={user.ID || "-"} />
            <DetailItem Icon={Calendar} label="Start Date" value={user.Start_data || "-"} />
          </section>
        </div>
      </div>

      {/* Job History & Requisition History */}
      <div className="grid grid-cols-2 gap-5 my-5 h-90">
        {/* ประวัติการได้รับงาน */}
        <div className={`border ${bgHead} rounded-lg`}>
          <div className="p-4">
            <p className={`text-lg ${textHead} font-semibold`}>ประวัติการได้รับงาน</p>
            <div className="grid grid-cols-3 gap- my-3 border-b">
              {["ชื่องาน", "วันที่เริ่ม", "วันส่งมอบ"].map((e, i) => (
                <div className={`${textHead}`} key={i}>{e}</div>
              ))}
            </div>
            {JobCount.filter((job) => job.Name === user.Name).map((e, i) => (
              <motion.div
                key={e._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="grid grid-cols-3 my-3 border-b">
                  <div>{e.NameJOB}</div>
                  <div>{new Date(e.Work_day).toLocaleDateString("th-TH")}</div>
                  <div>{new Date(e.Closing_day).toLocaleDateString("th-TH")}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ประวัติการขอเบิกของ */}
        <div className={`border ${bgHead} rounded-lg`}>
          <div className="p-4">
            <p className={`text-lg ${textHead} font-semibold`}>ประวัติการขอเบิกของ</p>
            <div className="grid grid-cols-3 gap- my-3 border-b">
              {["ของที่เบิก", "สถานะ", "วันที่เบิก"].map((e, i) => (
                <div className={`${textHead}`} key={i}>{e}</div>
              ))}
            </div>
            {requisitionItems.filter((e) => e.requesterName === user.Name).map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="grid grid-cols-3 my-3 border-b">
                  <div>{e.name}</div>
                  <div>{e.status}</div>
                  <div>{e.createdAt ? new Date(e.createdAt).toLocaleDateString("th-TH") : "ไม่ระบุวันที่"}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

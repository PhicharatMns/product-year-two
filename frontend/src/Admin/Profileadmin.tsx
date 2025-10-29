import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Verified } from "lucide-react";

export default function Profileadmin() {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const card = theme === "dark" ? "bg-gray-800/90" : "bg-white";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const softText = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const accent = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`h-screen flex items-center justify-center ${bg} transition-colors duration-500`}
      >
        {/* กล่องหลัก เต็มความสูงจอแต่ยังมี scroll ได้ถ้าข้อมูลเยอะ */}
        <div
          className={`w-full h-full flex flex-col ${card} shadow-2xl transition-colors duration-500`}
        >
          {/* ส่วน Cover */}
          <div
            className={`relative h-56 sm:h-64 md:h-72 lg:h-80 ${bg} transition-colors duration-500`}
          >
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
              <img
                src="https://i.pinimg.com/1200x/98/0f/8e/980f8edaae405546073f9a735058a7df.jpg"
                alt="profile"
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300 object-cover"
              />
            </div>
          </div>

          {/* เนื้อหาโปรไฟล์ */}
          
          <div className="flex-1 flex flex-col justify-start mt-24 px-4 sm:px-6 md:px-12 overflow-y-auto">
               <div className="text-center mb-6">
              <h2 className={`text-2xl sm:text-3xl font-bold ${text}`}>
                วงกลม สามวง
                <Verified className="inline-block ml-2 text-blue-500" size={20} />
              </h2>
              <p className={`mt-1 ${softText}`}>Admin</p>
            </div>

            {/* กล่องข้อมูล */}
            <div
              className={`w-full max-w-5xl  mx-auto ${bg} p-6 sm:p-8 rounded-2xl transition-colors duration-500`}
            >
           
              <div className="grid grid-cols-1  sm:grid-cols-2 gap-6 transition-colors duration-500">
                {[
                  { label: "ชื่อเล่น", value: "คมคิด" },
                  { label: "ID", value: "123-3245-234-23-1" },
                  { label: "Birthday", value: "1992-11-18" },
                  { label: "Address", value: "ที่พักพนักงาน ห้อง____" },
                  { label: "Phone", value: "098-9089-899" },
                  { label: "Email", value: "grunsi@gmail.com" },
                  { label: "Position", value: "Admin" },
                  { label: "Start_data", value: "2025-10-03" },

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
                    <p className={`${softText} break-words`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
       </div >
      </div>
    </div>
  );
}

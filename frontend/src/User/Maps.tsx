import React from "react";
import { useTheme } from "@/components/theme-provider";
import { MapPin } from "lucide-react";

export default function Maps() {
  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-[#0f0f0f]" : "bg-gray-100";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-900/70" : "bg-white";
  const borderSoft =
    theme === "dark" ? "border-yellow-300/10" : "border-blue-200/50";
  const titleColor = theme === "dark" ? "text-yellow-400" : "text-blue-600";

  return (
    <div
      className={`min-h-screen  flex flex-col lg:flex-row justify-center items-start lg:items-stretch gap-8 p-6 transition-all duration-500`}
    >
      {/* กล่องกรอกข้อมูล (ซ้าย) */}
      <div
        className={`w-full lg:max-w-150 ${cardBg} ${borderSoft} border rounded-2xl shadow-lg p-6 text-left ${text}`}
      >
        <h2 className={`text-2xl font-bold mb-6 ${titleColor}`}>กรอกข้อมูล</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="ชื่อของคุณ"
            className={`w-full p-3 border rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          <input
            type="number"
            placeholder="เบอร์โทรศัพท์"
            className={`w-full p-3 border rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          <input
            type="text"
            placeholder="ตำแหน่งที่ตั้ง"
            className={`w-full p-3 border rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          <textarea
            placeholder="รายละเอียดงาน"
            rows={4}
            className={`w-full p-3 border rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          ></textarea>

          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all">
            ยืนยัน
          </button>
        </div>
      </div>

      <div
        className={`w-full lg:max-w-150  ${cardBg} ${borderSoft} border rounded-2xl shadow-lg p-6 text-left ${text}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <MapPin className={`${titleColor} w-7 h-7 animate-bounce`} />
          <h1 className={`text-2xl font-bold ${titleColor}`}>แผนที่ช่าง</h1>
        </div>

        <p className="text-sm mb-6">ตำแหน่งงาน / ช่าง ในแผนที่</p>

        <div className="w-full lg:h-screen overflow-hidden rounded-xl shadow-md border border-gray-300 dark:border-yellow-300/20">
          <iframe
            title="แผนที่ช่าง"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d64178.193675471965!2d100.46096712319256!3d13.68021303560223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29860a45abbaf%3A0xfd31102a18e45fab!2z4LmA4LiU4Lit4Liw4Lih4Lit4Lil4Lil4LmM4LmE4Lil4Lif4LmM4Liq4LmC4LiV4Lij4LmMIOC4l-C5iOC4suC4nuC4o-C4sA!5e1!3m2!1sth!2sth!4v1761291196092!5m2!1sth!2sth"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

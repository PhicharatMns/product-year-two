// src/components/Notification.tsx
import React from "react";
import { useTheme } from "@/components/theme-provider";

export default function Notification() {
  const { theme } = useTheme();

  // dynamic colors ตาม theme
  const bg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-600" : "bg-blue-50/40";
  const border = theme === "dark" ? "border-gray-700" : "border-blue-100";
  const labelText = theme === "dark" ? "text-yellow-300" : "text-blue-700";

  return (
    <div className={`p-6 max-w-380 mx-auto cursor-pointer ${text}`}>
      <p className="text-5xl font-bold text-blue-500">การแจ้งเตือน</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 mt-5">
        {/* Notification Card 1 */}
        <div className={`hover:scale-102 duration-200 border-b ${border} rounded-2xl ${cardBg} p-5`}>
          <div className="flex justify-between">
            <p className="text-2xl font-bold">
              โปรเจคบ้านจัดสรร{" "}
            </p>
            <p className="rounded-sm text-sm p-2 bg-red-500 text-white">สำคัญ</p>
          </div>
          <p className="mt-2 ml-2 ">
           สัมผัสถึงความหรูหรา พร้อมอาคารฟิตเนส รับวิวสวน และสระว่ายน้ำระบบเกลือ แยกสระเด็ก และสระผู้ใหญ่ พร้อมจากุชชี่ รองรับทุกการใช้ชีวิตของทุกคนในครอบครัว
          </p>
        </div>


      </div>
    </div>
  );
}

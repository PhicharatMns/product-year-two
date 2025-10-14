import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";

export default function Profile() {

  const [contact] = useState({
    phone: "0812345678",
    email: "somsee@gmail.com",
    address: "123 หมู่ 4 กรุงเทพมหานคร",
    social: "somsee",
  });

  const [skill] = useState({
    position: "ช่างไฟฟ้า",
    experience: "4 ปี",
    tools: "มี",
    contract: "---",
    insurance: "มี",
    startDate: "10/10/2020",
  });

  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-[#0f0f0f]" : "bg-gray-100";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-900/70" : "bg-white";
  const borderSoft = theme === "dark" ? "border-yellow-300/10" : "border-blue-200/50";
  const titleColor = theme === "dark" ? "text-yellow-400" : "text-blue-600";
  const accentColor = theme === "dark" ? "text-yellow-300" : "text-blue-500";

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 `}>
      <div
        className={`flex flex-wrap rounded-3xl shadow-xl overflow-hidden max-w-6xl w-full ${text} ${cardBg} backdrop-blur-md`}
      >
        {/* ✅ ด้านซ้าย */}
        <div className="flex flex-col items-center justify-start p-10 md:w-1/3 text-center border-b md:border-b-0 md:border-r border-blue-100/40">
          <h1 className="text-4xl font-bold mb-8">
            Pro<span className={accentColor}>file</span>
          </h1>

          {/* ✅ รูปโปรไฟล์ */}
          <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-blue-400/40 mb-6">
            <img
              src="https://i.pinimg.com/736x/c1/9e/8c/c19e8c264bdb02463f66c04e3bf97204.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-3">
            <h2 className="text-xl font-semibold text-blue-400">สมศรี ใจดี</h2>
            <p className="text-sm opacity-80">ช่างมืออาชีพ พร้อมให้บริการ</p>
          </div>
        </div>

        {/* ✅ ด้านขวา */}
        <div className="flex-1 p-10 space-y-8">
          {/* 🔹 ข้อมูลติดต่อ */}
          <div className={`rounded-2xl p-6 shadow-md border ${borderSoft} ${cardBg} transition-all duration-300 hover:shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-4 border-b-2 pb-2 ${titleColor} border-current`}>
              ข้อมูลติดต่อ
            </h2>
            <div className="space-y-2 leading-relaxed">
              <p>📞 เบอร์โทรศัพท์: <b>{contact.phone}</b></p>
              <p>📧 Gmail: {contact.email}</p>
              <p>🏠 ที่อยู่: {contact.address}</p>
              <p>💬 ไลน์/เฟซบุ๊ก: {contact.social}</p>
            </div>
          </div>

          {/* 🔸 ความเชี่ยวชาญ */}
          <div className={`rounded-2xl p-6 shadow-md border ${borderSoft} ${cardBg} transition-all duration-300 hover:shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-4 border-b-2 pb-2 ${theme === "dark" ? "text-yellow-300" : "text-yellow-500"} border-current`}>
              ความเชี่ยวชาญและคุณสมบัติ
            </h2>
            <div className="space-y-2 leading-relaxed">
              <p>🔧 ตำแหน่ง: <b>{skill.position}</b></p>
              <p>🧰 ประสบการณ์ทำงาน: {skill.experience}</p>
              <p>🪛 เครื่องมือส่วนตัว: {skill.tools}</p>
              <p>📑 สัญญาจ้าง: {skill.contract}</p>
              <p>🩺 ประกันอุบัติเหตุ: {skill.insurance}</p>
              <p>📅 วันที่เริ่มงาน: <b>{skill.startDate}</b></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



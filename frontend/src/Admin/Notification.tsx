// src/components/Notification.tsx
import React from "react";
import { useTheme } from "@/components/theme-provider";

export default function Notification() {
  const { theme } = useTheme();

  // dynamic colors ตาม theme
  const bg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-blue-50/40";
  const border = theme === "dark" ? "border-gray-700" : "border-blue-100";
  const labelText = theme === "dark" ? "text-yellow-300" : "text-blue-700";

  return (
    <div className={`p-6 max-w-4xl mx-auto ${bg} ${text}`}>
      <p className="text-5xl font-bold text-blue-500">การแจ้งเตือน</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 mt-5">
        {/* Notification Card 1 */}
        <div className={`hover:scale-102 duration-200 border-b ${border} rounded-2xl ${cardBg} p-5`}>
          <p className="text-2xl font-bold">
            โปรเจคบ้านจัดสรร{" "}
            <span className="rounded-sm text-sm p-1 bg-red-500 text-white">สำคัญ</span>
          </p>
          <p className="mt-2 ml-2">
            ชายใจซื่อ เจอสร้อยข้อมือทองคำหนัก 1 บาท เก็บไว้รอคืนเจ้าของนานนับเดือน
            เผยไม่คิดขายแม้ชีวิตลำบาก มีเพียงจักรยานคู่ใจคันเดียว
          </p>
        </div>

        {/* Notification Card 2 */}
        <div className={`hover:scale-102 duration-200 border-b ${border} rounded-2xl ${cardBg} p-5`}>
          <p className="text-2xl font-bold">
            ซ่อมหม้อแปลง ซอยบางนา 54{" "}
            <span className="rounded-sm text-sm p-1 bg-blue-500 text-white">แจ้งเตือน</span>
          </p>
          <p className="mt-2 ml-2">
            ชายใจซื่อ เจอสร้อยข้อมือทองคำหนัก 1 บาท เก็บไว้รอคืนเจ้าของนานนับเดือน
            เผยไม่คิดขายแม้ชีวิตลำบาก
          </p>
        </div>

        {/* Notification Card 3 */}
        <div className={`hover:scale-102 duration-200 border-b ${border} rounded-2xl ${cardBg} p-5`}>
          <p className="text-2xl font-bold">
            สร้างตึก 12 SPU{" "}
            <span className="rounded-sm text-sm p-1 bg-yellow-500 text-white">รอดำเนินการ</span>
          </p>
          <p className="mt-2 ml-2">
            ชายใจซื่อ เจอสร้อยข้อมือทองคำหนัก 1 บาท เก็บไว้รอคืนเจ้าของนานนับเดือน
            เผยไม่คิดขายแม้ชีวิตลำบาก
          </p>
        </div>

        {/* Notification Card 4 */}
        <div className={`hover:scale-102 duration-200 border-b ${border} rounded-2xl ${cardBg} p-5`}>
          <p className="text-2xl font-bold">
            ซ่อมอาคาร บริษัทกรุงศรี{" "}
            <span className="rounded-sm text-sm p-1 bg-red-500 text-white">สำคัญ</span>
          </p>
          <p className="mt-2 ml-2">
            ชายใจซื่อ เจอสร้อยข้อมือทองคำหนัก 1 บาท เก็บไว้รอคืนเจ้าของนานนับเดือน
            เผยไม่คิดขายแม้ชีวิตลำบาก
          </p>
        </div>
      </div>
    </div>
  );
}

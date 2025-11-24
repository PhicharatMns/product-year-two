"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import THSarabunFont from "./THSarabunBase64";

export default function PDF() {
  const [text, setText] = useState("");

  const generatePDF = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    // โหลดฟอนต์ไทย
    doc.addFileToVFS("THSarabun.ttf", THSarabunFont);
    doc.addFont("THSarabun.ttf", "THSarabun", "normal");
    doc.setFont("THSarabun");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let currentY = 60; // จุดเริ่มต้นบรรทัดแรก

    // --- หัวข้อ ---
    doc.setFontSize(18);
    doc.setTextColor(63, 81, 181); // สีฟ้า
    doc.text("ข้อมูลที่กรอก:", margin, currentY);

    // วาดเส้นใต้หัวข้อ
    doc.setDrawColor(63, 81, 181); // สีเส้นตรงกับหัวข้อ
    doc.setLineWidth(1.5);
    doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5);

    currentY += 30; // เว้นบรรทัด

    // --- ข้อมูล ---
    const content = text || "ไม่พบข้อมูล";
    const lines = doc.splitTextToSize(content, pageWidth - margin * 2);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // สีดำ
    doc.text(lines, margin, currentY);

    // วาดเส้นใต้ข้อมูล (optional)
    const dataHeight = lines.length * 20; // ประมาณความสูงข้อความ
    doc.setDrawColor(200, 200, 200); // สีเทาอ่อน
    doc.setLineWidth(0.5);
    doc.line(
      margin,
      currentY + dataHeight + 5,
      pageWidth - margin,
      currentY + dataHeight + 5
    );

    // ดาวน์โหลด PDF
    doc.save("thai.pdf");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        สร้าง PDF ภาษาไทย
      </h2>

      <textarea
        className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 text-base"
        placeholder="พิมพ์ข้อความภาษาไทยที่ต้องการใส่ใน PDF..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={generatePDF}
        className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        ยืนยันและดาวน์โหลด PDF
      </button>
    </div>
  );
}

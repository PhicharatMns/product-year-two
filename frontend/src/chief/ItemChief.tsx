import React, { useEffect, useState } from "react";
// 1. (แก้ไข) Import ไอคอนที่สื่อความหมายตรงขึ้น
import { Package, BadgeCheck, TriangleAlert } from "lucide-react";
// (ใหม่) 1. Import useTheme
import { useTheme } from "@/components/theme-provider";

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
  createdAt?: string;
  _id?: string;
  status?: string;
  statusUpdatedAt?: string;
  additemecomfam?: string;
}

export default function ItemChief() {
  // (ใหม่) 2. เรียกใช้ Hook และกำหนดคลาสตามธีม
  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const tableHeaderBg = theme === "dark" ? "bg-gray-700" : "bg-gray-50";

  const cards = [
    { name: "คําขอทั้งหมด", num: 5, icon: Package },
    { name: "คําขอใหม่", num: 2, icon: BadgeCheck },
    { name: "คําขอล่าสุด", num: 1, icon: TriangleAlert },
  ];

  const [RequisitionItems, setRequisitionItems] = useState<RequisitionItem[]>(
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
    fetchRequisitionItems();
  }, []);

  return (
    // (แก้ไข) 6. ใช้ตัวแปร `bg` และเพิ่ม transition
    <div
      className={`min-h-screen p-4 sm:p-8 font-inter ${bg} transition-colors duration-300 ease-in-out`}
    >
      {/* (แก้ไข) 7. แก้ไข max-w-380 เป็น max-w-7xl */}
      <div className="max-w-380 mx-auto">
        {/* ส่วนหัว (ใช้คลาส text, textSecondary) และเพิ่ม transition */}
        <div className="mb-6">
          <h1
            className={`text-2xl sm:text-3xl font-bold ${text} transition-colors duration-300 ease-in-out`}
          >
            หน้าจัดการ (Chief)
          </h1>
          <p
            className={`mt-1 text-sm sm:text-base ${textSecondary} transition-colors duration-300 ease-in-out`}
          >
            ภาพรวมสถิติ และ รายการอนุมัติ
          </p>
        </div>
        {/* grid 3 */}
        <div className="grid grid-cols-3 gap-5">
          {cards.map((e, i) => {
            const Icon = e.icon; // เอา icon จาก array
            return (
              <div
                key={i}
                className="bg-blue-500  text-white rounded-xl py-5 pl-5 "
              >
                <div className="flex gap-3 items-center">
                  <Icon className="w-8 h-8 mb-2" />
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">{e.name}</p>
                    <p className="font-semibold">{e.num}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"></div>

        <div className="mb-4">
          <h2
            className={`text-xl font-semibold ${text} transition-colors duration-300 ease-in-out`}
          >
            รายการเบิกของรออนุมัติ
          </h2>
        </div>

        {/* (ใช้คลาส cardBg) และเพิ่ม transition */}
        <div
          className={`shadow-md rounded-lg overflow-x-auto ${cardBg} transition-colors duration-300 ease-in-out`}
        >
          <div className="min-w-[768px] md:min-w-full">
            {/* Header (Grid) (ใช้ tableHeaderBg, textSecondary) และเพิ่ม transition */}
            <div
              className={`grid grid-cols-12 gap-4 px-6 py-3 ${tableHeaderBg} text-left text-xs font-medium ${textSecondary} uppercase tracking-wider transition-colors duration-300 ease-in-out`}
            >
              <div className="col-span-1">ID</div>
              <div className="col-span-3">ผู้เบิก</div>
              <div className="col-span-2">จำนวนรายการ</div>
              <div className="col-span-3">สถานะ</div>
              <div className="col-span-3 text-right">จัดการ</div>
            </div>

          </div>
        </div>
        {RequisitionItems.map((e,i)=>{
          return(
            <div>
              {e.name}
            </div>
          )
        })}
      </div>
    </div>
  );
}

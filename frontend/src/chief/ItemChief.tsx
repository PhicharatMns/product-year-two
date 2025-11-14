import React from 'react';
// 1. (แก้ไข) Import ไอคอนที่สื่อความหมายตรงขึ้น
import { 
  Package,
  BadgeCheck,
  TriangleAlert 
} from "lucide-react";
// (ใหม่) 1. Import useTheme
import { useTheme } from "@/components/theme-provider";

// 2. ข้อมูลจำลองสำหรับ "ตารางอนุมัติ"
const mockItemsToApprove = [
  { id: 'R-1001', requester: 'สมชาย ใจดี', itemCount: 5, status: 'Pending' },
  { id: 'R-1002', requester: 'สมหญิง จริงใจ', itemCount: 2, status: 'Pending' },
  { id: 'R-1003', requester: 'วิรัช สุขเสมอ', itemCount: 8, status: 'Pending' },
  { id: 'R-1004', requester: 'อารี ล้ำเลิศ', itemCount: 1, status: 'Approved' },
  { id: 'R-1005', requester: 'มานะ อดทน', itemCount: 3, status: 'Rejected' },
];

export default function ItemChief() {
  
  // (ใหม่) 2. เรียกใช้ Hook และกำหนดคลาสตามธีม
  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const tableHeaderBg = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const statIconBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";

  // (ใหม่) 3. ย้ายฟังก์ชันนี้เข้ามาข้างใน และทำให้รองรับ Dark Mode
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Pending': 
        return theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 'Approved': 
        return theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      case 'Rejected': 
        return theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
      default: 
        return theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  // 4. คำนวณ Stats จาก `mockItemsToApprove` (เหมือนเดิม)
  const totalRequests = mockItemsToApprove.length;
  const approvedCount = mockItemsToApprove.filter(
    item => item.status === 'Approved'
  ).length;
  const pendingCount = mockItemsToApprove.filter(
    item => item.status === 'Pending'
  ).length;

  // 5. อัปเดต array `stats` (เหมือนเดิม)
  const stats = [
    { 
      title: "คำขอทั้งหมด", 
      value: totalRequests, 
      icon: <Package size={24} />,
      color: "text-blue-600"
    },
    { 
      title: "อนุมัติแล้ว", 
      value: approvedCount, 
      icon: <BadgeCheck size={24} />,
      color: "text-green-600"
    },
    { 
      title: "ยังไม่อนุมัติ", 
      value: pendingCount, 
      icon: <TriangleAlert size={24} />, 
      color: "text-red-600"
    },
  ];

  return (
    // (แก้ไข) 6. ใช้ตัวแปร `bg` และเพิ่ม transition
    <div className={`min-h-screen p-4 sm:p-8 font-inter ${bg} transition-colors duration-300 ease-in-out`}>
      
      {/* (แก้ไข) 7. แก้ไข max-w-380 เป็น max-w-7xl */}
      <div className="max-w-380 mx-auto">
        
        {/* ส่วนหัว (ใช้คลาส text, textSecondary) และเพิ่ม transition */}
        <div className="mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold ${text} transition-colors duration-300 ease-in-out`}>
            หน้าจัดการ (Chief)
          </h1>
          <p className={`mt-1 text-sm sm:text-base ${textSecondary} transition-colors duration-300 ease-in-out`}>
            ภาพรวมสถิติ และ รายการอนุมัติ
          </p>
        </div>

        {/* 7. ส่วน Stats Cards (ใช้คลาส cardBg, statIconBg, textSecondary, text) และเพิ่ม transition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.title} 
              className={`${cardBg} p-6 rounded-lg shadow-md flex items-center space-x-4 transition-colors duration-300 ease-in-out`}
            >
              <div className={`p-3 rounded-full ${statIconBg} ${stat.color} transition-colors duration-300 ease-in-out`}>
                {stat.icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${textSecondary} transition-colors duration-300 ease-in-out`}>{stat.title}</p>
                <p className={`text-3xl font-bold ${text} transition-colors duration-300 ease-in-out`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 8. ส่วนตารางอนุมัติ */}
        <div className="mb-4">
          <h2 className={`text-xl font-semibold ${text} transition-colors duration-300 ease-in-out`}>
            รายการเบิกของรออนุมัติ
          </h2>
        </div>
        {/* (ใช้คลาส cardBg) และเพิ่ม transition */}
        <div className={`shadow-md rounded-lg overflow-x-auto ${cardBg} transition-colors duration-300 ease-in-out`}>
          <div className="min-w-[768px] md:min-w-full">
            
            {/* Header (Grid) (ใช้ tableHeaderBg, textSecondary) และเพิ่ม transition */}
            <div className={`grid grid-cols-12 gap-4 px-6 py-3 ${tableHeaderBg} text-left text-xs font-medium ${textSecondary} uppercase tracking-wider transition-colors duration-300 ease-in-out`}>
              <div className="col-span-1">ID</div>
              <div className="col-span-3">ผู้เบิก</div>
              <div className="col-span-2">จำนวนรายการ</div>
              <div className="col-span-3">สถานะ</div>
              <div className="col-span-3 text-right">จัดการ</div>
            </div>

            {/* Body (Grid) (ใช้ border, hoverBg, text, textSecondary) และเพิ่ม transition */}
            <div className={`divide-y ${border} transition-colors duration-300 ease-in-out`}>
              {mockItemsToApprove.map((item) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 ${hoverBg} text-sm items-center transition-colors duration-300 ease-in-out`}
                >
                  <div className={`col-span-1 font-medium ${text} transition-colors duration-300 ease-in-out`}>
                    {item.id}
                  </div>
                  <div className={`col-span-3 ${textSecondary} transition-colors duration-300 ease-in-out`}>
                    {item.requester}
                  </div>
                  <div className={`col-span-2 ${textSecondary} transition-colors duration-300 ease-in-out`}>
                    {item.itemCount}
                  </div>
                  <div className="col-span-3">
                    {/* (แก้ไข) เรียกใช้ getStatusClasses ที่อัปเดตแล้ว และเพิ่ม transition */}
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                        item.status
                      )} transition-colors duration-300 ease-in-out`}
                    >
                      {item.status === 'Pending' ? 'รออนุมัติ' : 
                       item.status === 'Approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                    </span>
                  </div>

                  {/* (หมายเหตุ) ปุ่มสีทึบแบบนี้มักจะทำงานได้ดีทั้งสองธีม เลยไม่จำเป็นต้องแก้ไข */}
                  <div className="col-span-3 text-right font-medium space-x-3">
                    <button className="relative overflow-hidden cursor-pointer  rounded-md bg-blue-500 px-2 py-1 text-white text-sm duration-300 
                     [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
                     active:translate-y-1 active:scale-x-110 active:scale-y-90 hover:bg-blue-600"
                    >
                      รายละเอียด
                    </button>
                    
                    {item.status === 'Pending' && (
                      <>  
                      <button className="relative overflow-hidden cursor-pointer  rounded-md bg-green-500 px-2 py-1 text-white text-sm duration-300 
                     [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
                     active:translate-y-1 active:scale-x-110 active:scale-y-90 hover:bg-green-600"
                      >
                        อนุมัติ
                      </button>
                      <button className="relative overflow-hidden cursor-pointer  rounded-md bg-red-500 px-2 py-1 text-white text-sm duration-300 
                     [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
                     active:translate-y-1 active:scale-x-110 active:scale-y-90 hover:bg-red-600"
                      >
                        ปฏิเสธ
                      </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
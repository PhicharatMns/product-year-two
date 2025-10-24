import React, { useEffect, useState } from "react";

type NotificationItem = {
  time: string;
  job: string;
  name: string;
  Lname: string;
  Description: string;
  title: string;
};

type MessAdminProps = {
  item: NotificationItem;
  onClose: () => void;
};

export default function MessAdmin({ item, onClose }: MessAdminProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ให้ transition ทำงานหลัง mount
    setVisible(true);
  }, []);

  return (
    <div
      className={`ml-1 fixed lg:left-65 left-4 bottom-0 rounded-t-xl h-120 w-80 p-2 bg-white lg:z-50 shadow-lg transform transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className=" mb-4 border-b-2 border-blue-100 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-blue-500"> กล่องข้อความ</p>

          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 500);
            }}
            className=" text-2xl px-2 py-1 text-black cursor-pointer"
          >
            ✕
          </button>
        </div>
        <p className="text-black">
          <span className="text-blue-500">งาน : </span>
          {item.job}
        </p>
      </div>

      {/* //data */}
      <div className="text-black flex items-center gap-3">
        <img className="w-10 h-10 object-cover object-center rounded-4xl" src="554432404_682538797803517_5094989873043710515_n.jpg" alt="" />
        <p className="border bg-gray-300 p-1 rounded-lg">{item.Description}</p>
      </div>
    </div>
  );
}

// เเบบไม่มี ข้อมุล ดึงจาก Notification
// MessAdmin.tsx
// import React from "react";

// type MessAdminProps = {
//   onClose: () => void;
// };

// export default function MessAdmin({ onClose }: MessAdminProps) {
//   return (
//     <div className="ml-1 fixed lg:left-65 left-4 bottom-0 rounded-t-xl h-100 w-80 p-2 bg-white lg:z-50 transition-all transform duration-500 shadow-lg">
//       <button
//         onClick={onClose}
//         className="mb-4 px-2 py-1 bg-red-500 text-white rounded"
//       >
//         ✖ ปิด
//       </button>

//       <div>
//         <p>นี่คือหน้าต่าง MessAdmin</p>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";

const Profile: React.FC = () => {
  // ข้อมูลติดต่อ
  const [contact] = useState({
    phone: "0812345678",
    email: "somsee@gmail.com",
    address: "123 หมู่ 4 กรุงเทพมหานคร",
    social: "somsee",
  });

  // ข้อมูลความเชี่ยวชาญ
  const [skill] = useState({
    position: "ช่างไฟฟ้า",
    experience: "4 ปี",
    tools: "มี",
    contract: "---",
    insurance: "มี",
    startDate: "10/10/2020",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
      <div className="flex flex-wrap bg-white rounded-2xl shadow-lg overflow-hidden max-w-6xl w-full">
        {/* ขยับโปร */}
        <div className="flex flex-col items-center justify-start p-8 md:w-1/3  text-center">
          {/* ตรงหัวข้อโปรไฟล์ */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Pro<span className="text-blue-700">file</span>
          </h1>

          {/* รอใส่รูป */}
        <div className="w-80 h-80 rounded-full overflow-hidden shadow-md mb-6 shadow-4xl">
  <img
    src="https://st2.depositphotos.com/5592054/10810/v/450/depositphotos_108100060-stock-illustration-handyman-running-with-a-toolbox.jpg"
    alt="Profile"
    className="w-full h-full object-cover"
  />
</div>
        </div>

        {/* Right side - Info sections */}
        <div className="flex-1 p-8 space-y-8">
          {/* ข้อมูล */}
          <div className="border rounded-2xl p-5 shadow-sm">
            <h2 className="text-3xl font-semibold text-blue-500  mb-3 border-b pb-1">
              ข้อมูลติดต่อ
            </h2>
            <p>เบอร์โทรศัพท์: <b>{contact.phone}</b></p>
            <p>Gmail: {contact.email}</p>
            <p>ที่อยู่ปัจจุบัน: {contact.address}</p>
            <p>ไลน์/เฟซบุ๊ก: {contact.social}</p>
          </div>

          {/* ข้อมูล */}
          <div className="border rounded-2xl p-5 shadow-sm">
            <h2 className="text-3xl font-semibold text-yellow-500 mb-3 border-b pb-1">
              ความเชี่ยวชาญและคุณสมบัติ
            </h2>
            <p>ตำแหน่ง: <b>{skill.position}</b></p>
            <p>ประสบการณ์ทำงาน: {skill.experience}</p>
            <p>อุปกรณ์/เครื่องมือส่วนตัว: {skill.tools}</p>
            <p>สัญญาจ้าง: {skill.contract}</p>
            <p>ประกันอุบัติเหตุ: {skill.insurance}</p>
            <p>วันที่เริ่มงาน: <b>{skill.startDate}</b></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;



 
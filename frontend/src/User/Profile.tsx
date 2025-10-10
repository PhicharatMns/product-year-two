// import React, { useState } from 'react';

// interface InfoItem {
//   label: string;
//   value: string;
// }

// const Profile: React.FC = () => {
//   const [isEditingContact, setIsEditingContact] = useState(false);
//   const [isEditingSkill, setIsEditingSkill] = useState(false);

//   const [contactInfo, setContactInfo] = useState<InfoItem[]>([
//     { label: 'เบอร์โทรศัพท์:', value: '0812345678' },
//     { label: 'Gmail:', value: 'somsee@gmail.com' },
//     { label: 'ที่อยู่ปัจจุบัน:', value: '123 หมู่ 4 กรุงเทพฯ' },
//     { label: 'ไลน์/เฟซบุ๊ก:', value: 'somsee' },
//   ]);

//   const [skillInfo, setSkillInfo] = useState<InfoItem[]>([
//     { label: 'ตำแหน่ง:', value: 'ช่างไฟฟ้า' },
//     { label: 'ประสบการณ์ทำงาน:', value: '4 ปี' },
//     { label: 'อุปกรณ์/เครื่องมือส่วนตัว:', value: 'มี' },
//     { label: 'สัญญาจ้าง:', value: '---' },
//     { label: 'ประกันอุบัติเหตุ:', value: 'มี' },
//     { label: 'วันที่เริ่มงาน:', value: '10/10/2020' },
//   ]);

//   const handleInputChange = (
//     index: number,
//     value: string,
//     type: 'contact' | 'skill'
//   ) => {
//     const updater = type === 'contact' ? setContactInfo : setSkillInfo;
//     const current = type === 'contact' ? contactInfo : skillInfo;
//     const updated = [...current];
//     updated[index].value = value;
//     updater(updated);
//   };

//   const toggleEdit = (type: 'contact' | 'skill') => {
//     if (type === 'contact') {
//       setIsEditingContact(!isEditingContact);
//     } else {
//       setIsEditingSkill(!isEditingSkill);
//     }
//   };

//   const renderSection = (
//     title: string,
//     items: InfoItem[],
//     isEditing: boolean,
//     type: 'contact' | 'skill'
//   ) => (
//     <div className="flex-1 min-w-[280px]">
//       <div className="font-bold mb-3 text-gray-700">{title}</div>
//       {items.map((item, idx) => (
//        <div className="mb-4" key={idx}>
//   <label className="block text-gray-600 text-sm mb-1">{item.label}</label>
//   {isEditing ? (
//     <input
//       value={item.value}
//       onChange={(e) => handleInputChange(idx, e.target.value, type)}
//       className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
//     />
//   ) : (
//     <div className="font-semibold text-gray-800">{item.value}</div>
//   )}
// </div>

//       ))}
//       <button
//         onClick={() => toggleEdit(type)}
//         className={`mt-4 px-4 py-2 rounded font-semibold text-white transition ${
//           isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
//         }`}
//       >
//         {isEditing ? 'Save' : 'Edit'}
//       </button>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-10 font-sans">
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">
//           <span className="text-blue-500">Pro</span>file
//         </h1>

//         <div className="flex items-center gap-5 border-b border-gray-200 pb-5 mb-5">
//           <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
//             {/* เปลี่ยน src ด้านล่างให้แสดงภาพ */}
//             <img src="" alt="Avatar" className="w-full h-full object-cover" />
//           </div>
//           <div>
//             <p><strong>ID :</strong> 00001</p>
//             <p><strong>นาย สมศรี ดีใจ</strong></p>
//             <p>วัน/เดือน/ปีเกิด : 00/00/0000</p>
//             <p>เลขบัตรประชาชน : 1234567890123</p>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-10">
//           {renderSection('ข้อมูลติดต่อ', contactInfo, isEditingContact, 'contact')}
//           {renderSection('ความเชี่ยวชาญและคุณสมบัติ', skillInfo, isEditingSkill, 'skill')}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

// --------------------------------------------

// import React, { useState } from "react";

// interface InfoItem {
//   label: string;
//   value: string;
// }

// const Profile: React.FC = () => {
//   const [isEditingContact, setIsEditingContact] = useState(false);
//   const [isEditingSkill, setIsEditingSkill] = useState(false);

//   const [contactInfo, setContactInfo] = useState<InfoItem[]>([
//     { label: "เบอร์โทรศัพท์:", value: "0812345678" },
//     { label: "Gmail:", value: "somsee@gmail.com" },
//     { label: "ที่อยู่ปัจจุบัน:", value: "123 หมู่ 4 กรุงเทพฯ" },
//     { label: "ไลน์/เฟซบุ๊ก:", value: "somsee" },
//   ]);

//   const [skillInfo, setSkillInfo] = useState<InfoItem[]>([
//     { label: "ตำแหน่ง:", value: "ช่างไฟฟ้า" },
//     { label: "ประสบการณ์ทำงาน:", value: "4 ปี" },
//     { label: "อุปกรณ์/เครื่องมือส่วนตัว:", value: "มี" },
//     { label: "สัญญาจ้าง:", value: "---" },
//     { label: "ประกันอุบัติเหตุ:", value: "มี" },
//     { label: "วันที่เริ่มงาน:", value: "10/10/2020" },
//   ]);

//   const handleInputChange = (
//     index: number,
//     value: string,
//     type: "contact" | "skill"
//   ) => {
//     const updater = type === "contact" ? setContactInfo : setSkillInfo;
//     const current = type === "contact" ? contactInfo : skillInfo;
//     const updated = [...current];
//     updated[index].value = value;
//     updater(updated);
//   };

//   const toggleEdit = (type: "contact" | "skill") => {
//     if (type === "contact") setIsEditingContact(!isEditingContact);
//     else setIsEditingSkill(!isEditingSkill);
//   };

//   const renderSection = (
//     title: string,
//     items: InfoItem[],
//     isEditing: boolean,
//     type: "contact" | "skill"
//   ) => (
//     <div className="flex-1 min-w-[280px] bg-white rounded-xl border border-gray-700 shadow-md p-4 transition-all hover:shadow-lg">
//       <div className="font-extrabold text-base text-gray-800 mb-4 border-b border-gray-300 pb-2">
//         {title}
//       </div>
//       {items.map((item, idx) => (
//        <div className="mb-4" key={idx}>
//   <label className="block text-gray-600 text-sm mb-1">{item.label}</label>
//   {isEditing ? (
//     <input
//       value={item.value}
//       onChange={(e) => handleInputChange(idx, e.target.value, type)}
//       className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
//     />
//   ) : (
//     <div className="font-semibold text-gray-800">{item.value}</div>
//   )}
// </div>

//       ))}
//       <button
//         onClick={() => toggleEdit(type)}
//         className={`mt-4 px-4 py-2 rounded font-semibold text-white transition ${
//           isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
//         }`}
//       >
//         {isEditing ? 'Save' : 'Edit'}
//       </button>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 p-8 font-sans">
//       <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-400 shadow-xl p-8">
//         <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
//           <span className="text-gray-800">Pro</span>
//           <span className="text-gray-900">file</span>
//         </h1>

//         {/* รูปโปร */}
//         <div className="flex flex-wrap items-center gap-6 border-b border-gray-300 pb-6 mb-6">
//           <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-gray-400 shadow-md">
//             <img
//               // src=""
//               alt="Avatar"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="space-y-1 text-gray-800">
//             <p className="font-semibold">
//               <span className="text-gray-600">ID:</span> 00001
//             </p>
//             <p className="text-xl font-extrabold text-gray-900">
//               นาย สมศรี ดีใจ
//             </p>
//             <p className="font-medium">วัน/เดือน/ปีเกิด : 00/00/0000</p>
//             <p className="font-medium">เลขบัตรประชาชน : 1234567890123</p>
//           </div>
//         </div>

      
//         <div className="flex flex-wrap gap-6 justify-center">
//           {renderSection("ข้อมูลติดต่อ", contactInfo, isEditingContact, "contact")}
//           {renderSection("ความเชี่ยวชาญและคุณสมบัติ", skillInfo, isEditingSkill, "skill")}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

// ---------------------------------------------

import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
interface InfoItem {
  label: string;
  value: string;
}

const Profile: React.FC = () => {
  // ข้อมูลส่วนตัว
  const [basicInfo] = useState<InfoItem[]>([
    { label: "Date of Birth:", value: "26 January, 1991" },
    { label: "Gender:", value: "Female" },
    {
      label: "Languages:",
      value: "English, Urdu, Arabic, French",
    },
    { label: "Occupation:", value: "Developer & Photographer" },
    { label: "Freelance:", value: "Available" },
  ]);

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



 
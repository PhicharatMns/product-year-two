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


import React, { useState } from "react";

interface InfoItem {
  label: string;
  value: string;
}

const Profile: React.FC = () => {
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingSkill, setIsEditingSkill] = useState(false);

  const [contactInfo, setContactInfo] = useState<InfoItem[]>([
    { label: "เบอร์โทรศัพท์:", value: "0812345678" },
    { label: "Gmail:", value: "somsee@gmail.com" },
    { label: "ที่อยู่ปัจจุบัน:", value: "123 หมู่ 4 กรุงเทพฯ" },
    { label: "ไลน์/เฟซบุ๊ก:", value: "somsee" },
  ]);

  const [skillInfo, setSkillInfo] = useState<InfoItem[]>([
    { label: "ตำแหน่ง:", value: "ช่างไฟฟ้า" },
    { label: "ประสบการณ์ทำงาน:", value: "4 ปี" },
    { label: "อุปกรณ์/เครื่องมือส่วนตัว:", value: "มี" },
    { label: "สัญญาจ้าง:", value: "---" },
    { label: "ประกันอุบัติเหตุ:", value: "มี" },
    { label: "วันที่เริ่มงาน:", value: "10/10/2020" },
  ]);

  const handleInputChange = (
    index: number,
    value: string,
    type: "contact" | "skill"
  ) => {
    const updater = type === "contact" ? setContactInfo : setSkillInfo;
    const current = type === "contact" ? contactInfo : skillInfo;
    const updated = [...current];
    updated[index].value = value;
    updater(updated);
  };

  const toggleEdit = (type: "contact" | "skill") => {
    if (type === "contact") setIsEditingContact(!isEditingContact);
    else setIsEditingSkill(!isEditingSkill);
  };

  const renderSection = (
    title: string,
    items: InfoItem[],
    isEditing: boolean,
    type: "contact" | "skill"
  ) => (
    <div className="flex-1 min-w-[280px] bg-white rounded-xl border border-gray-700 shadow-md p-4 transition-all hover:shadow-lg">
      <div className="font-extrabold text-base text-gray-800 mb-4 border-b border-gray-300 pb-2">
        {title}
      </div>
      {items.map((item, idx) => (
       <div className="mb-4" key={idx}>
  <label className="block text-gray-600 text-sm mb-1">{item.label}</label>
  {isEditing ? (
    <input
      value={item.value}
      onChange={(e) => handleInputChange(idx, e.target.value, type)}
      className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
    />
  ) : (
    <div className="font-semibold text-gray-800">{item.value}</div>
  )}
</div>

      ))}
      <button
        onClick={() => toggleEdit(type)}
        className={`mt-4 px-4 py-2 rounded font-semibold text-white transition ${
          isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-400 shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          <span className="text-gray-800">Pro</span>
          <span className="text-gray-900">file</span>
        </h1>

        {/* รูปโปร */}
        <div className="flex flex-wrap items-center gap-6 border-b border-gray-300 pb-6 mb-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-gray-400 shadow-md">
            <img
              // src=""
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1 text-gray-800">
            <p className="font-semibold">
              <span className="text-gray-600">ID:</span> 00001
            </p>
            <p className="text-xl font-extrabold text-gray-900">
              นาย สมศรี ดีใจ
            </p>
            <p className="font-medium">วัน/เดือน/ปีเกิด : 00/00/0000</p>
            <p className="font-medium">เลขบัตรประชาชน : 1234567890123</p>
          </div>
        </div>

      
        <div className="flex flex-wrap gap-6 justify-center">
          {renderSection("ข้อมูลติดต่อ", contactInfo, isEditingContact, "contact")}
          {renderSection("ความเชี่ยวชาญและคุณสมบัติ", skillInfo, isEditingSkill, "skill")}
        </div>
      </div>
    </div>
  );
};

export default Profile;


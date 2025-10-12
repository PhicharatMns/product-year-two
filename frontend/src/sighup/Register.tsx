// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const [user, setUser] = useState("");
//   const [pass, setPass] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async () => {
//     if (!user || !pass) {
//       alert("กรุณากรอกข้อมูลให้ครบ");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/login/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", // ✅ สำคัญ ต้องมีเพื่อรับ cookie จาก backend
//         body: JSON.stringify({ user, pass }),
//       });

//       const data = await res.json();
//       console.log("Register response:", res.status, data);

//       alert(data.message);

//       if (res.status === 200 || res.status === 400) {
//         // ไปหน้า User Dashboard หลังสมัครเสร็จหรือชื่อผู้ใช้มีอยู่แล้ว
//         navigate("/User/Dashboard");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("เกิดข้อผิดพลาดในการสมัครสมาชิก");
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="flex-1 flex items-center justify-center bg-white rounded-r-[3rem] shadow-lg">
//         <div className="w-full max-w-md p-8 shadow-lg">
//           <h2 className="text-2xl font-bold text-center text-green-600 mb-8">
//             สมัครสมาชิกใหม่
//           </h2>

//           <div className="mb-6">
//             <label className="block text-green-700 mb-2">อีเมล/ชื่อผู้ใช้</label>
//             <input
//               type="text"
//               value={user}
//               onChange={(e) => setUser(e.target.value)}
//               placeholder="กรอกชื่อผู้ใช้"
//               className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-green-700 mb-2">รหัสผ่าน</label>
//             <input
//               type="password"
//               value={pass}
//               onChange={(e) => setPass(e.target.value)}
//               placeholder="กรอกรหัสผ่าน"
//               className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           <div className="flex justify-center">
//             <button
//               onClick={handleRegister}
//               className="bg-green-600 px-6 py-2 text-white font-semibold rounded-md shadow hover:bg-green-700"
//             >
//               สมัครสมาชิก
//             </button>
//           </div>

//           <p className="text-center mt-6">
//             มีบัญชีอยู่แล้ว?{" "}
//             <span
//               className="text-blue-600 cursor-pointer hover:underline"
//               onClick={() => navigate("/logins")}
//             >
//               เข้าสู่ระบบ
//             </span>
//           </p>
//         </div>
//       </div>

//       <div className="hidden md:flex flex-1 bg-green-700 relative items-center justify-center">
//         <img
//           src="https://i.pinimg.com/1200x/57/e6/c7/57e6c76add74f7163c6057159d953440.jpg"
//           alt="background"
//           className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90"
//         />
//         <div className="relative z-10 text-center">
//           <h1 className="text-[8rem] font-extrabold text-white leading-none">
//             T<span className="text-yellow-400">J</span>
//           </h1>
//           <p className="text-white text-lg font-semibold mt-4">
//             จ้าง ซ่อม สร้าง เสร็จ
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

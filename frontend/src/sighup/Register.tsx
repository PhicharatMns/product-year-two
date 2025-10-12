import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!user || !pass) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ สำคัญ ต้องมีเพื่อรับ cookie จาก backend
        body: JSON.stringify({ user, pass }),
      });

      const data = await res.json();
      console.log("Register response:", res.status, data);

      alert(data.message);

      if (res.status === 200 || res.status === 400) {
        // ไปหน้า User Dashboard หลังสมัครเสร็จหรือชื่อผู้ใช้มีอยู่แล้ว
        navigate("/User/Dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex items-center justify-center bg-white rounded-r-[3rem] shadow-lg">
        <div className="w-full max-w-md p-8 shadow-lg">
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="กรอกชื่อผู้ใช้"
            className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <label className="block text-green-700 mb-2">รหัสผ่าน</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="กรอกรหัสผ่าน"
            className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <div className="mx-auto w-fit">
            <button
              onClick={handleRegister}
              className="bg-green-600 px-6 py-2 my-5 text-white font-semibold rounded-md shadow hover:bg-green-700"
            >
              สมัครสมาชิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

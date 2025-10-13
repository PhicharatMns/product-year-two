import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [User, setUser] = useState("");
  const [Pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!User || !Pass) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/tradesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          User,
          Pass,
          role: "user", // default เป็น user
        }),
      });

      const data = await res.json();
      console.log("Register response:", res.status, data);
      alert(data.message || "สมัครสมาชิกสำเร็จ");

      if (res.status === 201) {
        // สมัครสำเร็จแล้ว login ต่อเลย
        const loginRes = await fetch(
          "http://localhost:5000/api/tradesman/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ User, Pass }),
          }
        );
        const loginData = await loginRes.json();

        if (loginRes.status === 200) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("role", loginData.role);
          navigate("/user/dashboard"); // redirect user
        } else {
          alert(loginData.message);
        }
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
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">
            สมัครสมาชิก
          </h2>

          <div className="mb-4">
            <label className="block text-blue-700 mb-2">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={User}
              onChange={(e) => setUser(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้"
              className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-blue-700 mb-2">รหัสผ่าน</label>
            <input
              type="password"
              value={Pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mx-auto w-fit">
            <button
              onClick={handleRegister}
              className="bg-blue-600 px-6 py-2 my-5 text-white font-semibold rounded-md shadow hover:bg-blue-700"
            >
              สมัครสมาชิก
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-blue-700 relative items-center justify-center">
        <img
          src="https://i.pinimg.com/1200x/57/e6/c7/57e6c76add74f7163c6057159d953440.jpg"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-[8rem] font-extrabold text-white leading-none">
            T<span className="text-yellow-400">J</span>
          </h1>
          <p className="text-white text-lg font-semibold mt-4">
            จ้าง ซ่อม สร้าง เสร็จ
          </p>
        </div>
      </div>
    </div>
  );
}

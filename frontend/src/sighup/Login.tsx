import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import axios from "axios";
import { useState } from "react";

export default function Login() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [passwork, setPasswork] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ป้องกัน refresh

    try {
      // เรียก API backend ให้ตรงกับ router
      const response = await axios.post(
        "http://localhost:5000/api/login/login",
        {
          username,
          passwork,
        }
      );

      setMessage(response.data.message || "เข้าสู่ระบบสำเร็จ");

      localStorage.setItem("token", response.data.token); //  บันทึก token
      localStorage.setItem("role", response.data.role); // เก็บ role

      // ไปหน้า /user/dashboardUser
      if (response.data.role === "admin") {
        navigate("/dashboard"); // หน้า admin
      } else if (response.data.role === "user") {
        navigate("/user/DashboardUser"); // หน้า user
      } else {
        navigate("/executive/Dashboard");
      }
    } catch (err) {
      console.error(err);
      setMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className={`flex h-screen ${theme === "dark" ? "bg-black/10" : ""}`}>
      <div className="flex-1 flex items-center justify-center shadow-lg">
        <div
          className={`w-full max-w-md p-8 shadow-lg rounded-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">
            ยินดีต้อนรับ
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-blue-700 mb-2">
                อีเมล/ชื่อผู้ใช้
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="กรอกข้อมูล"
                className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-blue-700 mb-2">รหัสผ่าน</label>
              <input
                type="password"
                value={passwork}
                onChange={(e) => setPasswork(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
                className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 w-full py-2 text-white font-semibold rounded-md shadow hover:bg-blue-700"
            >
              เข้าสู่ระบบ
            </button>

            {message && (
              <p className="text-center text-red-500 mt-4">{message}</p>
            )}
          </form>

          <p className="text-center mt-4 text-sm">
            ยังไม่มีบัญชี?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:underline font-semibold"
            >
              สมัครสมาชิก
            </Link>
          </p>
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

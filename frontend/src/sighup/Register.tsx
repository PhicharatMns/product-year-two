import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [passwork, setPasswork] = useState("");
  const [confirmPasswork, setConfirmPasswork] = useState("");
  const [role, setRole] = useState("user"); //  ค่าเริ่มต้นเป็น user
  const [message, setMessage] = useState("");
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwork !== confirmPasswork) {
      setMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login/register",
        { username, passwork, role }, // ส่ง role ไปด้วย
        { withCredentials: true }
      );

      setMessage(response.data.message || "สมัครสมาชิกสำเร็จ!");
      setTimeout(() => navigate("/logins"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-400 relative">
      <img
        src="https://img.freepik.com/free-photo/beautiful-cityscape-bangkok-highway-bridge-thailand_335224-998.jpg?semt=ais_hybrid&w=1920&q=100"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Bangkok city"
      />

      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-8 w-96 relative z-10">
        <h2 className="text-4xl font-bold mb-6 text-center">สมัครสมาชิก</h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block mb-2">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้"
              className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-2">รหัสผ่าน</label>
            <input
              type="password"
              value={passwork}
              onChange={(e) => setPasswork(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Confirm password */}
          <div className="mb-4">
            <label className="block mb-2">ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              value={confirmPasswork}
              onChange={(e) => setConfirmPasswork(e.target.value)}
              placeholder="กรอกรหัสอีกครั้ง"
              className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/*  ปุ่มสมัครเป็นแอดมิน */}
          <div className="mb-6 flex items-center space-x-2">
            <input
              type="checkbox"
              id="admin"
              checked={role === "admin"}
              onChange={(e) => setRole(e.target.checked ? "admin" : "user")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="admin" className="text-sm text-gray-700">
              สมัครเป็นแอดมิน
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 w-full py-2 text-white font-semibold rounded-md shadow hover:bg-blue-700"
          >
            สมัครสมาชิก
          </button>

          {message && (
            <p className="text-center text-red-500 mt-4">{message}</p>
          )}

          <p className="text-center mt-4 text-sm">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              to="/logins"
              className="text-blue-500 hover:underline font-semibold"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

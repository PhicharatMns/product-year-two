import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [passwork, setPasswork] = useState("");
  const [confirmPasswork, setConfirmPasswork] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwork !== confirmPasswork) {
      setMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      //  เรียก API backend ให้ตรงกับ router ที่ใช้ /api/login/register
      const response = await axios.post(
        "http://localhost:5000/api/login/register",
        {
          username,
          passwork,
        }
      );

      setMessage(response.data.message || "สมัครสมาชิกสำเร็จ!");
      //  ไปหน้า login หลังสมัครสำเร็จ
      setTimeout(() => navigate("/logins"), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto w-fit  h-screen items-center flex">
      <div>
        <div className=" shadow-xl rounded p-5 w-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block  mb-2">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="เช่น TJuser"
                className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

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

            <div className="mb-6">
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
    </div>
  );
}

import { Link } from "react-router-dom";

export default function login() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">
            ยินดีต้อนรับ
          </h2>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                อีเมล/ชื่อผู้ใช้
              </label>
              <input
                type="text"
                placeholder="กรอกข้อมูล"
                className="w-full p-3 rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                type="password"
                placeholder="กรอกรหัสผ่าน"
                className="w-full p-3 rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-right text-sm text-gray-500 mt-1 cursor-pointer hover:text-blue-600">
                ลืมรหัสผ่าน
              </p>
            </div>

            <div className="flex justify-between mt-6">
             
              <Link
                to="/register"
                className="px-6 py-2 bg-white text-blue-700 font-semibold rounded-md shadow hover:shadow-lg transition"
              >
                ลงทะเบียน
              </Link>
              <a href="/pages/Register.jsx" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition">
                เข้าสู่ระบบ
              </a>
            
            
              
            </div>
          </form>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <h1 className="text-[120px] font-extrabold">
          <span className="text-black">T</span>
          <span className="text-yellow-400">J</span>
        </h1>
      </div>
    </div>
  );
}

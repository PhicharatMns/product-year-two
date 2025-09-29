import { Link } from "react-router-dom";

export default function Login () {
  return (
    <div className="flex h-screen ">
      <div className="flex-1 flex items-center justify-center bg-white rounded-r-[3rem] shadow-lg">
        <div className="w-full max-w-md p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">
            ยินดีต้อนรับ
          </h2>

          <div className="mb-6">
            <label className="block text-blue-700 mb-2">อีเมล/ชื่อผู้ใช้</label>
            <input
              type="text"
              placeholder="กรอกข้อมูล"
              className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-blue-700 mb-2">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่าน"
              className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex justify-between">
            <Link to={"/Register"}>
              <button className="bg-white shadow-md px-6 py-2 rounded-lg text-blue-600 font-medium hover:bg-gray-100">
                ลงทะเบียน
              </button>
            </Link>
            <Link to={"/Home"}>
              <button className="bg-blue-600 px-6 py-2 text-white font-semibold rounded-md shadow hover:bg-blue-700">
                เข้าสู่ระบบ
              </button>
            </Link>
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

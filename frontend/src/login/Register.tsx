export default function Register() {
  return (
  <div className="flex h-screen">
    
      <div className="flex-1 flex items-center justify-center bg-white rounded-r-[3rem] shadow-lg">
        <div className="w-full max-w-md p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">
            ลงทะเบียน
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

         
          <div className="mb-6">
            <label className="block text-blue-700 mb-2">ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              placeholder="ยืนยันรหัสผ่าน"
              className="w-full px-4 py-3 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

         
          <div className="flex justify-center">
            <button className="bg-white shadow-md px-8 py-2 rounded-lg text-blue-600 font-medium hover:bg-gray-100">
              ลงทะเบียน
            </button>
          </div>
        </div>
      </div>

      
      <div className="hidden md:flex flex-1 bg-blue-600 relative items-center justify-center">
        
        <img
          src="https://i.pinimg.com/736x/0a/e8/84/0ae884928f23d4858ba38efb96405b7e.jpg"
          alt="worker"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90"
        />

       
        <div className="absolute top-6 right-8 text-4xl font-extrabold z-10">
          <span className="text-white">T</span>
          <span className="text-yellow-400">J</span>
        </div>

       
        <div className="relative z-10 text-center text-white max-w-sm">
          <p className="text-xl font-semibold leading-relaxed">
            “ รวมรวมช่างมากฝีมือ <br />
            และประสบการณ์มากกว่า 10 ปี ”
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-blue-50 min-h-screen py-10 px-4 md:px-10">
      <div className="container mx-auto">
        {/* หัวข้อใหญ่ */}
        <h1 className="text-5xl md:text-6xl text-blue-600 font-extrabold mb-10">
          Dashboard
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* ==================== CARD สถิติฝั่งซ้าย ==================== */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              <h2 className="text-3xl font-bold text-blue-600 mb-6">สถิติ</h2>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-4 text-white hover:scale-[1.02] transition-transform cursor-pointer shadow-md">
                  <div className="flex justify-between items-center">
                    <span>ช่างทั้งหมด</span>
                    <span className="font-semibold">5,140</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">คน</p>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-4 text-white hover:scale-[1.02] transition-transform cursor-pointer shadow-md">
                  <div className="flex justify-between items-center">
                    <span>วัสดุอุปกรณ์</span>
                    <span className="font-semibold">855,140</span>
                  </div>
                  <p className="text-sm text-blue-100 mt-1">ชิ้น</p>
                </div>

                <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-4 text-white hover:scale-[1.02] transition-transform cursor-pointer shadow-md">
                  <div className="flex justify-between items-center">
                    <span>งานทั้งหมด</span>
                    <span className="font-semibold">1,500</span>
                  </div>
                  <p className="text-sm text-green-100 mt-1">งาน</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl p-4 text-white hover:scale-[1.02] transition-transform cursor-pointer shadow-md">
                  <div className="flex justify-between items-center">
                    <span>กำลังดำเนิน</span>
                    <span className="font-semibold">855,140</span>
                  </div>
                  <p className="text-sm text-yellow-100 mt-1">งาน</p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== เนื้อหาฝั่งขวา ==================== */}
          <div className="flex-1 flex flex-col gap-8">
            {/* กราฟ/สรุปข้อมูล */}
            <div className="bg-white h-80 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-blue-600">
                  รวมทั้งหมด
                </h3>
                <button className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition">
                  ดูเพิ่มเติม
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
                (พื้นที่แสดงกราฟ)
              </div>
            </div>

            {/* กล่องสี่ช่องเล็ก */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-40 rounded-2xl shadow-md flex items-center justify-center text-white text-3xl font-bold hover:scale-105 transition">
                A
              </div>
              <div className="bg-gradient-to-br from-pink-400 to-pink-600 h-40 rounded-2xl shadow-md flex items-center justify-center text-white text-3xl font-bold hover:scale-105 transition">
                B
              </div>
              <div className="bg-gradient-to-br from-green-400 to-green-600 h-40 rounded-2xl shadow-md flex items-center justify-center text-white text-3xl font-bold hover:scale-105 transition">
                C
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 h-40 rounded-2xl shadow-md flex items-center justify-center text-white text-3xl font-bold hover:scale-105 transition">
                D
              </div>
            </div>

            {/* ส่วนข้อมูลเพิ่มเติม */}
            <div className="bg-white h-64 rounded-2xl shadow-lg flex flex-col items-center justify-center text-blue-600 text-xl font-semibold">
              ข้อมูลเพิ่มเติมจะมาในภายหลัง
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

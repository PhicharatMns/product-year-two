export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        <header>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
            Dashboard
          </h1>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 bg-gray-100 h-screen rounded-2xl flex items-center justify-center text-gray-400 text-xl font-semibold">
              กราฟ
            </div>

            <div className="lg:w-1/3 grid grid-cols-1 gap-4">
              <div className="bg-gray-500 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1">
                <h2 className="text-xl font-semibold mb-2">จำนวนช่าง</h2>
                <p className="my-5 text-5xl">7,850 <span className="text-sm align-top">คน</span></p>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-2xl shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                  รายละเอียด
                </button>
              </div>
              <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1">
                <h2 className="text-xl font-semibold mb-2">งานทั้งหมด</h2>
                <p className="my-5 text-5xl">500 <span className="text-sm align-top">งาน</span></p>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-2xl shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                  รายละเอียด
                </button>
              </div>
              <div className="bg-yellow-500 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1">
                <h2 className="text-xl font-semibold mb-2">กำลังดำเนิน</h2>
                <p className="my-5 text-5xl">85 <span className="text-sm align-top">งาน</span></p>
                <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2 px-6 rounded-2xl shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                  รายละเอียด
                </button>
              </div>
              <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1">
                <h2 className="text-xl font-semibold mb-2">งานที่เสร็จแล้ว</h2>
                <p className="my-5 text-5xl">26 <span className="text-sm align-top">งาน</span></p>
                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-2xl shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                  รายละเอียด
                </button>
              </div>
            </div>
          </div>
          <div className="w-full border mt-5 h-50 rounded-2xl ">
            <p>จำนวนวัสดุ </p>
          </div>
        </section>

      </div>
    </div>
  );
}

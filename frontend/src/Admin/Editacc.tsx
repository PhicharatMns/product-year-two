export default function Editacc() {
  const workers = [
    {
      img: "https://i.pinimg.com/1200x/ca/3b/ee/ca3bee207c4135d0cf99a9874db41ece.jpg",
      name: "สมชาย ใจดี",
      type: "ช่างไม้",
      position: "Head Carpenter",
      date: "27/08/2568",
    },

  ];

  return (
    <div className="min-h-screen bg-blue-50 py-10 flex justify-center">
      <div className=" mx-auto container bg-white rounded-2xl shadow-xl p-6">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-3xl font-bold text-blue-700">
            จัดการบัญชี<span className="text-blue-500">ช่าง</span>
          </p>
        <div>
          <button className="border p-2 rounded-xl bg-blue-700 text-white cursor-pointer">เพิ่มช่าง</button>
        </div>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <form className="flex border-2 border-blue-300 rounded-full overflow-hidden shadow-sm bg-white">
            <input
              type="text"
              placeholder="ค้นหาช่าง..."
              className="flex-grow px-5 py-2 focus:outline-none text-gray-700"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-2 hover:bg-blue-700 transition font-medium"
            >
              ค้นหา
            </button>
          </form>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-5 font-semibold text-lg text-blue-800 border-b-4 border-blue-200 pb-2 mb-2">
          <p>รูป</p>
          <p>ชื่อ</p>
          <p className="text-center">ประเภทงาน</p>
          <p className="text-center">ตำแหน่ง</p>
          <p className="text-center">วันที่สมัคร</p>
          <p className="text-center">การจัดการ</p>
        </div>

        {/* Table Rows */}
        <div className="space-y-3">
          {workers.map((worker, idx) => (
            <div
              key={idx}
              className="grid grid-cols-6 gap-5 items-center border border-blue-100 rounded-xl bg-blue-50/40 hover:bg-blue-100 transition-all duration-200 shadow-sm py-4 px-2"
            >
              <img
                src={worker.img}
                alt={worker.name}
                className="w-16 h-16 object-cover rounded-full mx-auto border-2 border-blue-300 shadow-sm"
              />
              <p className="text-center font-medium text-gray-800">{worker.name}</p>
              <p className="text-center text-blue-700">{worker.type}</p>
              <p className="text-center text-blue-600">{worker.position}</p>
              <p className="text-center text-gray-600">{worker.date}</p>
              <div className="flex justify-center">
                <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all shadow-md">
                  แก้ไข
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

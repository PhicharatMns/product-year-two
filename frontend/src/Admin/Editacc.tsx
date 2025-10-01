export default function Editacc() {
  const workers = [
    {
      img: "https://i.pinimg.com/1200x/ca/3b/ee/ca3bee207c4135d0cf99a9874db41ece.jpg",
      name: "สมชาย ใจดี",
      type: "ช่างไม้",
      position: "Head Carpenter",
      date: "27/08/2568",
    },
    {
      img: "https://i.pinimg.com/1200x/ca/3b/ee/ca3bee207c4135d0cf99a9874db41ece.jpg",
      name: "สมชาย ใจดี",
      type: "ช่างไม้",
      position: "Head Carpenter",
      date: "27/08/2568",
    },
    {
      img: "https://i.pinimg.com/1200x/ca/3b/ee/ca3bee207c4135d0cf99a9874db41ece.jpg",
      name: "สมชาย ใจดี",
      type: "ช่างไม้",
      position: "Head Carpenter",
      date: "27/08/2568",
    },
  ];

  return (
    <div className=" container mx-auto min-h-screen flex justify-center py-10">
      <div className="w-full p-6">
        <p className="text-2xl font-bold mb-5 text-blue-700 ml-2">
          จัดการบัญชี <span className="text-yellow-500">ช่าง</span>
        </p>

        {/* Search bar */}
        <div className="mb-6 ml-2 mr-2">
          <form className="flex border rounded-full overflow-hidden shadow-sm">
            <input
              type="text"
              placeholder="ค้นหาช่าง"
              className="flex-grow px-4 py-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600 transition"
            >
              ค้นหา
            </button>
          </form>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-5 font-bold text-lg border-b-2 text-blue-700 py-2 ml-2 mr-2">
          <p>รูป</p>
          <p>ชื่อ</p>
          <p className="text-center">ประเภทงาน</p>
          <p className="text-center">ตำแหน่ง</p>
          <p className="text-center">วันที่สมัคร</p>
          <p className="text-center">การจัดการ</p>
        </div>

        {/* Table Rows */}
        {workers.map((worker, idx) => (
          <div
            key={idx}
            className="grid grid-cols-6 gap-5 items-center text-gray-700 border-b py-3 ml-2 mr-2 hover:bg-blue-100 transition rounded-lg"
          >
            <img
              src={worker.img}
              alt={worker.name}
              className="w-20 h-20 object-cover rounded-full mx-auto"
            />
            <p className="flex items-center justify-center">{worker.name}</p>
            <p className="text-center">{worker.type}</p>
            <p className="text-center">{worker.position}</p>
            <p className="text-center">{worker.date}</p>
            <div className="flex justify-center">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition">
                แก้ไข
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

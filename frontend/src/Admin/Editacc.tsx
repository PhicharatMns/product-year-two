import Sidebar from "../component/sidebaradmin";
import { MdOutlineSearch } from "react-icons/md";

const workers = [
  {
    id: 1,
    name: "นาย สำรั กองไฟ",
    type: "ไม้",
    position: "Head carpenter",
    date: "20/8/2020",
    img: "https://i.pinimg.com/736x/50/94/4b/50944bd02630d6b061c43497d296052c.jpg",
  },
  {
    id: 2,
    name: "นาย กองเงิน แสงดาว",
    type: "ไฟฟ้า",
    position: "Electrician employee",
    date: "2/7/2015",
    img: "https://i.pinimg.com/736x/74/ed/07/74ed0718585023499fd6348d2757910e.jpg",
  },
  {
    id: 3,
    name: "นาย ข้าวต้ม เงินไหล",
    type: "ประปา",
    position: "Head plumber",
    date: "28/5/2016",
    img: "https://i.pinimg.com/1200x/58/8e/30/588e308a4d90007676f625ecfb783b22.jpg",
  },
];

export default function App() {
  return (
    <div className="flex min-h-screen">
      {/* ใช้ Sidebar component แทนของเก่า */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">
          จัดการบัญชี<span className="text-yellow-400">ช่าง</span>
        </h1>

        {/* Search bar */}
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="ค้นหา..."
            className="border rounded-l-lg p-2 flex-1"
          />

<button className="border border-l-0 p-2 rounded-r-lg bg-gray-200">
  <MdOutlineSearch className="text-gray-600 w-6 h-6" />
</button>

        </div>

        {/* Table */}
        <div className="space-y-4">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="flex items-center justify-between border rounded-lg p-4 hover:scale-[1.01] transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={worker.img}
                  alt={worker.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-bold">{worker.name}</div>
                  <div className="text-gray-500">{worker.type}</div>
                </div>
              </div>
              <div>{worker.position}</div>
              <div>{worker.date}</div>
              <div className="flex gap-2">
                <button className="bg-yellow-400 px-4 py-1 rounded text-white">
                  แก้ไข
                </button>
                <button className="bg-blue-700 px-4 py-1 rounded text-white">
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

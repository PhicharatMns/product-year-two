import Sidebar from "../component/sidebar";
import { CiSearch } from "react-icons/ci";

export default function Searchpastjobs() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="container mx-auto my-5">
          <p className="font-bold text-xl">
            รับใบ <span className="text-yellow-500">งาน</span>
          </p>
          <div className="my-5 flex justify-between ">
            <div>
              <button className="border p-2 rounded-xl text-xl text-blue-500 hover:scale-101 duration-300">
                + เพิ่มใบงาน
              </button>
            </div>

            <div className="flex gap-8 items-center text-lg">
              <p>กําหนดประเภทงาน</p>
              <p>หมวดหมู่</p>
              <div className="relative">
                <CiSearch className="absolute left-2 top-1/2 -translate-y-1/2" />
                <input type="text" className="border rounded-xl pl-8 p-0.5" />
              </div>
            </div>
          </div>
          {/* ตราตราง */}
          <div>
            <div className="grid grid-cols-8 gap-5 font-bold text-lg">
              <div>
                <p>ID</p>
              </div>
              <div>
                <p>ชื่องาน</p>
              </div>
              <div>
                <p>รายละเอียด</p>
              </div>
              <div>
                <p>สถานะ</p>
              </div>
              <div>
                <p>รายชื่อ</p>
              </div>
              <div>
                <p>วันที่รับ</p>
              </div>
              <div>
                <p>วันที่ต้องปิดงาน</p>
              </div>
              <div>
                <p>รายละเอียด</p>
              </div>
            </div>
            {/* data ตาตราง */}
            <div className="grid grid-cols-8 gap-5 my-5">
              <div className="">
                <p>ID</p>
              </div>
              <div>
                <p>ชื่องาน</p>
              </div>
              <div>
                <p>รายละเอียด</p>
              </div>
              <div>
                <p>สถานะ</p>
              </div>
              <div>
                <p>รายชื่อ</p>
              </div>
              <div>
                <p>วันที่รับ</p>
              </div>
              <div>
                <p>วันที่ต้องปิดงาน</p>
              </div>
              <div>
                <p>รายละเอียด</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

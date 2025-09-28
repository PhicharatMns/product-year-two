import { CiSearch } from "react-icons/ci";
import Sidebaradmin from "../component/sidebaradmin";

export default function Searchpastjobs() {
  return (
    <div className="flex">
      <Sidebaradmin />
      <div className="flex-1">
        <div className="container mx-auto my-5">
          <p className="font-bold text-xl">
            รับใบ <span className="text-yellow-500">งาน</span>
          </p>
          <div className="my-8 flex justify-between ">
            <div>
              <button className="border p-2 rounded-xl text-xl bg-blue-500 text-white hover:scale-101 duration-300">
                + เพิ่มใบงาน
              </button>
            </div>

            <div className="flex gap-8 items-center text-lg font-medium">
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
            <div className="grid grid-cols-8 gap-5 font-bold text-lg border-b pb-2">
              <p>ID</p>
              <p>ชื่องาน</p>
              <p>รายละเอียด</p>
              <p>สถานะ</p>
              <p>รายชื่อ</p>
              <p>วันที่รับ</p>
              <p>วันที่ต้องปิดงาน</p>
              <p>รายละเอียด</p>
            </div>
            {/* data ตาตราง */}
            <div className="grid grid-cols-8 gap-5 font-bold text-sm pl-1 mt-3 text-gray-600 border-b pb-2 items-center">
              <p>ID</p>
              <p>ชื่องาน</p>
              <p>รายละเอียด</p>
              <p>สถานะ</p>
              <p>รายชื่อ</p>
              <p>วันที่รับ</p>
              <p>วันที่ต้องปิดงาน</p>
              <div className=" flex gap-2">
                <button className="border  px-2 py-1 text-green-500">
                  รายละเอียด
                </button>
                <button className="border  px-2 py-1 text-red-500">
                  {" "}
                  เเก้ไข
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

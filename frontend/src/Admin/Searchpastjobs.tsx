import { CiSearch } from "react-icons/ci";

const headerNav = [
  "ID",
  "ชื่องาน",
  "รายละเอียด",
  "สถานะ",
  "รายชื่อ",
  "วันที่รับ",
  "วันที่ต้องปิดงาน",
  "รายละเอียด",
];



export default function Searchpastjobs() {
  return (
    <div className="flex">
      <div className="flex-1">
        <div className="container mx-auto my-5 w-350  ">
          <p className="font-bold text-xl">
            รับใบ<span className="text-yellow-500">งาน</span>
          </p>
          <div className="my-8 flex justify-between ">
            <div>
              <button className="border p-2 rounded-xl text-xl bg-blue-500 text-white hover:scale-101 duration-300 hover:bg-white hover:text-blue-500">
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
              {headerNav.map((event, index) => {
                return (
                  <div className={index === 0 ? "text-left" : ""} key={index}>
                    {event}

                  </div>
                )
              })}
            </div>
            {/* data ตาตราง */}
            <div className="grid grid-cols-8 gap-5 font-bold text-sm pl-1 mt-3 text-gray-600 border-b pb-2 items-center">
              <p className="">00001</p>
              <p>บางประกงบางเมื่อ</p>
              <p className=" mx-auto">
                บางประกงบางเมื่อ สร้างใหม่อยุ่สบาย
              </p>

              <p>กําลังทํา</p>
              <p>พิชรัตน์</p>
              <p>14/5/26</p>
              <p>16/7/26</p>
              <div className=" flex gap-2">
                <button className="border  px-2 py-1 text-green-500 rounded-lg">
                  รายละเอียด
                </button>
                <button className="border  px-2 py-1 text-red-500 rounded-lg">
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

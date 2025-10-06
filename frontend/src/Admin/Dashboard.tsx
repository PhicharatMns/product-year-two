export default function Dashboard() {
  return (
    <div className="bg-blue-50 min-h-screen py-10">

      <div className="container mx-auto rounded-xl">
        <p className="text-6xl text-blue-500 font-bold  ">Dashboard</p>
        <div className="flex flex-col md:flex-row gap-6">


          <div className="md:w-1/3">
            <div className="bg-white h-full rounded-xl shadow-lg    text-black text-xl">
              <p className="p-5 text-4xl font-bold "> สถิติ</p>
              <div className="grid grid-cols-1 gap-5">
      <div className="border w-full h-20  bg-gray-700 "> 
        <div className="grid grid-cols-3 gap-3 text-center mt-6">
        <p className=" text-white ">รวมทั้งหมด</p>
        <p className="text-white ">5,140</p>
        <p className="text-white">คน</p>
        </div>
            
      </div>  <div className=" w-full h-20  bg-amber-500 "> 
         <div className="grid grid-cols-3 gap-3 text-center mt-6">
        <p className=" text-white ">วัสดุอุปกรณ์</p>
        <p className="text-white ">855,140</p>
        <p className="text-white">ชิ้น</p>
        </div>
</div>
<div className=" w-full h-20  bg-green-600"> 
         <div className="grid grid-cols-3 gap-3 text-center mt-6">
        <p className=" text-white ">งานทั้งหมด</p>
        <p className="text-white ">1,500</p>
        <p className="text-white">ชิ้น</p>
        </div>
</div>
            </div>
          </div>
          </div>


          <div className="flex-1 flex flex-col gap-6">


            <div className="bg-gray-500  h-80 rounded-xl shadow-lg flex ">
              <div className=" grid-cols-1 gap-5 flex ">
                <p className="mt-5 ml-5 text-white">รวมทั้งหมด</p>
                
              </div>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="bg-gray-500 h-40 rounded-xl shadow-lg flex items-center justify-center text-white text-xl">

              </div>
              <div className="bg-gray-500 h-40 rounded-xl shadow-lg flex items-center justify-center text-white text-xl">
                ที่อยู่
              </div>
              <div className="bg-gray-500 h-40 rounded-xl shadow-lg flex items-center justify-center text-white text-xl">
                ที่อยู่
              </div>
              <div className="bg-gray-500 h-40 rounded-xl shadow-lg flex items-center justify-center text-white text-xl">
                ที่อยู่
              </div>
            </div>


            <div className="bg-gray-500 h-64 rounded-xl shadow-lg flex items-center justify-center text-white text-xl">
              ข้อมูลเพิ่มเติม
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

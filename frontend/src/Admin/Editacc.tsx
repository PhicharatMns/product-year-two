import Sidebar from "../component/sidebar";



export default function Editacc() {
  return (
    <div className="flex min-h-screen bg-gray-100">
    
    

     
      <div className="flex-1 p-6">
        <p className="text-7xl my-5 ml-5 font-bold">
          จัดการบัญชี
          <span className="font-bold text-yellow-500">ช่าง</span>
        </p>
        <div>
       <div className="border rounded-4xl text-gray-500 w-50 h-11 ml-5">
          <form className="flex items-center">
            <input
              type="text"
              placeholder="ค้นหาช่าง"
              className="flex-grow px-4 py-2  rounded-4xl focus:outline-none"
            />
     <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-4xl hover:bg-blue-600 ml-1"
            >
              ค้นหา
            </button>
          </form>
          <div> 
    
       
        </div>
        </div>

 <div>
          <div className="grid grid-cols-6 gap-5 font-bold text-lg border-b pb-2 mt-5 ml-5 mr-5">
            <p className="">รูป</p>
            <p>ชื่อ</p>
            <p className=" mx-auto">ประเภทงาน</p>
            <p className=" mx-auto">ตำแหน่ง</p>
            <p className=" mx-auto">วันที่สมัคร</p>
            <p className=" mx-auto">สถานะ</p>
          </div>
             
          <div className="grid grid-cols-6 gap-5 font-bold text-sm pl-1 mt-3 text-gray-600 border-b pb-2 items-center ml-5 mr-5">
            <img src="https://i.pinimg.com/1200x/ca/3b/ee/ca3bee207c4135d0cf99a9874db41ece.jpg" className="w-20 h-full" alt="pic" />
            
            <p className="">สมชาย ใจดี</p>
            <p className=" mx-auto"> ช่างไม้</p>
             <p className=" mx-auto"> Head Carpenter</p>
             <p className=" mx-auto"> 27/08/2568</p>
             <p className=" mx-auto"> กำลังทำงาน</p>
     </div>
          </div> 
 <div>
             
          <div className="grid grid-cols-6 gap-5 font-bold text-sm pl-1 mt-3 text-gray-600 border-b pb-2 items-center ml-5 mr-5">
            <img src="https://i.pinimg.com/1200x/ca/3b/ee/ca3bee207c4135d0cf99a9874db41ece.jpg" className="w-20 h-full" alt="pic" />
            
            <p className="">สมชาย ใจดี</p>
            <p className=" mx-auto"> ช่างไม้</p>
             <p className=" mx-auto"> Head Carpenter</p>
             <p className=" mx-auto"> 27/08/2568</p>
             <p className=" mx-auto"> กำลังทำงาน</p>
     </div>
          </div>
                <div className="grid grid-cols-6 gap-5 font-bold text-sm pl-1 mt-3 text-gray-600 border-b pb-2 items-center ml-5 mr-5">
            <img src="https://i.pinimg.com/1200x/ca/3b/ee/ca3bee207c4135d0cf99a9874db41ece.jpg" className="w-20 h-full" alt="pic" />
            
            <p className="">สมชาย ใจดี</p>
            <p className=" mx-auto"> ช่างไม้</p>
             <p className=" mx-auto"> Head Carpenter</p>
             <p className=" mx-auto"> 27/08/2568</p>
             <p className=" mx-auto"> กำลังทำงาน</p>
     </div>
        </div>
      </div>
    </div>

  );
}

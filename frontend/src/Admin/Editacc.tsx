import Sidebaradmin from "../component/sidebaradmin";

export default function Editacc() {
  return (
    <div className="flex min-h-screen bg-gray-100">
    
      <Sidebaradmin />

     
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
        </div>
      </div>
    </div>
  );
}

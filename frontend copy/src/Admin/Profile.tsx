export default function Profile() {
    return (
        <div className="container mx-auto py-10">

            <div className="flex justify-center mb-5">
                <div className="w-full">
                    <p className="text-7xl font-bold text-blue-700 ml-2">
                        โปร<span className="text-yellow-500">ไฟล์</span>
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-5 border   ">
                <img src="https://i.pinimg.com/736x/b7/6a/a8/b76aa8452826d7397a40d79a1dd97656.jpg" className="w-30 h-30  rounded-full " alt="" />


                <div className="ml-5 flex flex-col">
                    <div className="font-bold text-4xl">
                        คุณ จักรยาน สีแดง <span className="text-2xl text-blue-500">#jak01</span>
                    </div>
                    
                    <div className="text-xl font-bold text-blue-500">
                        ช่างไม้
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-5 border mt-5  ">


                <div className="ml-5 flex flex-col">
                    <div className="font-bold text-4xl  text-yellow-500">
                        ข้อมูล
                    </div>

                    <div className=" flex flex-col gap-6 mt-5 ">

                        <div className="grid grid-cols-2 gap-y-3 gap-x-10 text-gray-400 text-3xl">
                            <div>
                                <p className="text-2xl">ชื่อ</p>
                                <p className="font-bold text-black">จักรยาน</p>
                            </div>
                            <div>
                                <p className="text-2xl">นามสกุล</p>
                                <p className="font-bold text-black">สีแดง</p>
                            </div>
                            <div>
                                <p className="text-2xl">อีเมล</p>
                                <p className="font-bold text-black">jakkayan@gmail.com</p>
                            </div>
                            <div>
                                <p className="text-2xl">เบอร์ติดต่อ</p>
                                <p className="font-bold text-black">093 453 4646</p>
                            </div>
                            <div>
                                <p className="text-2xl">ตำแหน่ง</p>
                                <p className="font-bold text-black">ช่างไม้</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-5 border mt-5  ">
                <div className="ml-5 flex flex-col">
                    <div className="font-bold text-4xl text-yellow-500">
                        ที่อยู่
                    </div>
                    <div className=" flex flex-col gap-6 mt-3 ">

                        <div className="grid grid-cols-3 gap-y-3 gap-x-10 text-gray-400 text-3xl">
                            <div>
                                <p className="text-2xl">จังหวัด</p>
                                <p className="font-bold text-black">กรุงเทพ</p>
                            </div>
                             <div>
                                <p className="text-2xl">อำเภอ</p>
                                <p className="font-bold text-black">บ้านเบียร์</p>
                            </div>
                             <div>
                                <p className="text-2xl">รหัสไปรษณีย์</p>
                                <p className="font-bold text-black">10240</p>
                            </div>
                        </div>


                  
                    </div>
                </div>
            </div>
        </div>
    );
}

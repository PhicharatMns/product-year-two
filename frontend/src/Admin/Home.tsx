

export default function Home() {
    return (
        <div className="flex">
            <div className="flex-1">
                <div className='container mx-auto my-5  '>
                    <p className="text-xl font-bold my-5">Home</p>
                    <div className="grid grid-cols-2 gap-5 ">
                        <div className="group border h-100 relative rounded-xl shadow-xl shadow-blue-100 hover:scale-105 duration-300 cursor-pointer overflow-hidden">
                            <div className="group  border h-100 relative rounded-xl shadow-xl shadow-blue-100 hover:scale-105 duration-300 cursor-pointer overflow-hidden">
                                <img
                                    src="https://i.pinimg.com/1200x/94/3e/d0/943ed0b57da011bb90711b8d4f00a048.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl opacity-70 transition duration-300 group-hover:blur-sm"
                                />
                                <p className="relative  text-center flex items-center h-full justify-center font-bold text-black text-4xl opacity-70 group-hover:opacity-100 transition duration-300 drop-shadow-lg">
                                    สถิติช่าง
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="border relative group    rounded-xl shadow-xl shadow-blue-100 hover:scale-101 duration-300 hover:cursor-pointer overflow-hidden">
                                <img
                                    src="https://i.pinimg.com/736x/66/7f/8e/667f8ec81d8808e017fa1a74938dc788.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl opacity-50 transition duration-300 group-hover:blur-sm"
                                />
                                <p className='relative text-center flex items-center h-full justify-center font-bold text-black text-4xl opacity-70 group-hover:opacity-100 transition duration-300 drop-shadow-lg'>สร้างใบงานใหม่</p>
                            </div>
                            <div className="border relative group    rounded-xl shadow-xl shadow-blue-100 hover:scale-101 duration-300 hover:cursor-pointer overflow-hidden">
                                <img
                                    src="https://i.pinimg.com/736x/e9/9c/7d/e99c7d6f96ab662825877bd3edbe1447.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl opacity-60 transition duration-300 group-hover:blur-sm"
                                />
                                <p className='relative text-center flex items-center h-full justify-center font-bold text-black text-4xl opacity-70 group-hover:opacity-100 transition duration-300 drop-shadow-lg'>สรุปสภานะงาน</p>
                            </div>
                            <div className='border relative group  col-span-2  rounded-xl shadow-xl shadow-blue-100 hover:scale-101 duration-300'>
                                <img
                                    src="https://i.pinimg.com/1200x/1b/bb/d9/1bbbd964e3a61967de8868cac5c11994.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl opacity-40 transition duration-300 group-hover:blur-sm"
                                />
                                <p className="relative text-center flex items-center h-full justify-center font-bold text-black text-4xl opacity-70 group-hover:opacity-100 transition duration-300 drop-shadow-lg ">ค้นหางานย้อนหลัง</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 my-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="border relative group  col-span-2  rounded-xl shadow-xl shadow-blue-100 hover:scale-101 duration-300">
                                <img
                                    src="https://i.pinimg.com/1200x/59/37/46/5937465d1de8c2677cdc0eb5aaf27785.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl opacity-70 transition duration-300 group-hover:blur-sm"
                                />
                                <p className="relative text-center flex items-center h-full justify-center font-bold text-black text-4xl opacity-70 group-hover:opacity-100 transition duration-300 drop-shadow-lg">เเจ้งเตือนช่าง</p>
                            </div>

                            <div className="border relative group col-span-2  rounded-xl w-full shadow-xl shadow-blue-100 hover:scale-101 duration-300">
                                <img
                                    src="https://i.pinimg.com/736x/0e/7c/55/0e7c55859f2cba3280b7b429b999e185.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl opacity-70 transition duration-300 group-hover:blur-sm"
                                />
                                <p className="relative text-center flex items-center h-full justify-center font-bold text-black text-4xl opacity-70 group-hover:opacity-100 transition duration-300 drop-shadow-lg">จัดการบัญชี</p>
                            </div>
                        </div>

                        <div className="group border h-100 relative rounded-xl shadow-xl shadow-blue-100 hover:scale-105 duration-300 cursor-pointer overflow-hidden">
                            <img
                                src="https://i.pinimg.com/1200x/07/ad/e4/07ade4b991698badeb6644880326623e.jpg"
                                alt=""
                                className="absolute w-full h-full object-cover object-center rounded-xl opacity-70 transition duration-300 group-hover:blur-sm"
                            />
                            <p className="relative text-center flex items-center h-full justify-center font-bold text-black text-4xl opacity-70 group-hover:opacity-100 transition duration-300 drop-shadow-lg">ดูเเผนที่ช่าง</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
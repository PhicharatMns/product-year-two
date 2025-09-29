

export default function Home() {
    return (
        <div className="flex">
            <div className="flex-1">
                <div className='container mx-auto h-200 my-5'>
                    <p className="text-xl text-blue-500 my-5">Home</p>
                    <div className="grid grid-cols-2 gap-5 ">
                        <div className="border h-100 relative rounded-xl shadow-xl shadow-blue-100 hover:scale-101 duration-300">
                            <img
                                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                alt=""
                                className="absolute w-full h-full object-cover object-center rounded-xl "
                            />
                            <p className='relative text-center flex items-center h-full justify-center text-white text-4xl'>สถิติช่าง</p>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="border relative rounded-xl shadow-xl shadow-blue-100 hover:scale-101 duration-300">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl "
                                />
                                <p className='relative text-center flex items-center h-full justify-center text-white text-4xl'>สร้างใบงานใหม่</p>
                            </div>
                            <div className="border relative rounded-xl shadow-xl shadow-blue-100 hover:scale-101 duration-300">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl "
                                />
                                <p className='relative text-center flex items-center h-full justify-center text-white text-4xl'>สรุปสภานะงาน</p>
                            </div>
                            <div className='col-span-2 border relative rounded-xl shadow-xl shadow-blue-100 hover:scale-101 duration-300'>
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl "
                                />
                                <p className="relative text-center flex items-center h-full justify-center text-white text-4xl">ค้นหางานย้อนหลัง</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 my-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="border col-span-2  relative rounded-xl shadow-xl shadow-blue-100 hover:scale-101 duration-300">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
                                />
                                <p  className="relative text-center flex items-center h-full justify-center text-white text-4xl">เเจ้งเตือนช่าง</p>
                            </div>

                            <div className="border col-span-2 relative rounded-xl w-full shadow-xl shadow-blue-100 hover:scale-101 duration-300">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
                                />
                                <p  className="relative text-center flex items-center h-full justify-center text-white text-4xl">จัดการบัญชี</p>
                            </div>
                        </div>

                        <div className="border relative h-100 rounded-xl shadow-xl shadow-blue-100 hover:scale-101 duration-300">
                            <img
                                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
                            />
                            <p  className="relative text-center flex items-center h-full justify-center text-white text-4xl">ดูเเผนที่ช่าง</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
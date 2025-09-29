

export default function Home() {
    return (
        <div className="flex">
            <div className="flex-1">
                <div className='container mx-auto h-200 my-5'>
                    <div className="grid grid-cols-2 gap-5 ">
                        <div className="border h-100 relative">
                            <img
                                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                alt=""
                                className="absolute w-full h-full object-cover object-center rounded-xl "
                            />
                            <p className='relative'>สถิติช่าง</p>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="border relative">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl "
                                />
                                <p className='relative'>สร้างใบงานใหม่</p>
                            </div>
                            <div className="border relative">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl "
                                />
                                <p className='relative'>สรุปสภานะงาน</p>
                            </div>
                            <div className='col-span-2 border relative'>
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl "
                                />
                                <p className="relative">ค้นหางานย้อนหลัง</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 my-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="border col-span-2  relative ">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
                                />
                                <p  className="relative">เเจ้งเตือนช่าง</p>
                            </div>

                            <div className="border col-span-2 relative w-full">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
                                />
                                <p  className="relative">จัดการบัญชี</p>
                            </div>
                        </div>

                        <div className="border relative h-100">
                            <img
                                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
                            />
                            <p  className="relative">ดูเเผนที่ช่าง</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
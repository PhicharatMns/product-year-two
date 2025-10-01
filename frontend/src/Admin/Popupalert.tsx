export default function Popup() {
    return (
        <div className=" border container mx-auto mt-10 items-center">
            <div className="w-full p-6">
                <p className="text-5xl font-bold mb-5 text-blue-700">
                    เพิ่มใบงาน
                </p>
                <div>

                    <div className=" flex flex-col gap-2 mt-5 ">

                        <div className="w-fit">
                            <div className="grid grid-cols-3 gap-5  text-black-400 text-3xl">
                                <div>
                                    <p className="text-2xl">ชื่อใบงาน</p>

                                    <input placeholder="พิมพ์ชื่อใบงาน" className="text-black border p-2 py-2 rounded-lg text-sm" type="text" />

                                </div>
                                <div>
                                    <p className="text-2xl">เบอร์ติดต่อ</p>

                                    <input placeholder="เบอร์ติดต่อ" className="text-black border p-2 py-2 rounded-lg text-sm" type="number" />

                                </div>
                                <div>
                                    <p className="text-2xl">รายละเอียดที่อยู่</p>

                                    <input placeholder="ที่อยู่" className="text-black border p-2 py-2 rounded-lg text-sm" type="text" />

                                </div>
                                <div>
                                    <p className="text-2xl">ชื่อผู้จ้าง</p>

                                    <input placeholder="ชื่อ" className="text-black border p-2 py-2 rounded-lg text-sm" type="text" />

                                </div>
                                <div>
                                    <p className="text-2xl">ผู้รับผิดชอบ</p>

                                    <input placeholder="ชื่อ" className="text-black border p-2 py-2 rounded-lg text-sm" type="text" />

                                </div>
                                <div>

                                </div>
                                <div>
                                    <p className="text-2xl">วันที่รับ</p>

                                    <input placeholder="ชื่อ" className="text-black border p-2 py-2 rounded-lg text-sm" type="date" />

                                </div>
                                <div>
                                    <p className="text-2xl">วันที่เสร็จ</p>

                                    <input placeholder="ชื่อ" className="text-black border p-2 py-2 rounded-lg text-sm" type="date" />

                                </div>

                            </div>

                        </div>
                        <div>
                            <p className="text-2xl">ไฟล์งาน</p>

                            <input placeholder="ชื่อ" className="text-black border p-2 py-2 rounded-lg text-sm" type="file" />

                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-2xl ">รายละเอียดงาน</p>

                            <textarea
                                placeholder="รายละเอียด"
                                className="w-full h-40 text-black border p-3 rounded-lg text-lg resize-none"
                            />
                        </div>

                    </div>
                </div>
                <div className=" flex justify-end">
                <button className=" bg-blue-500 text-white hover:bg-blue-700 mt-5 rounded-lg w-15 h-10 text-center">ยืนยัน</button>
          </div> 
           </div>

        </div>
    )


}
export default function Details() {
    return (
        <div>
            <div className="container mx-auto my-5">
                <div>
                    <p className="text-lg font-bold my-5">รายละเอียดงาน</p>
                    <p className="text-sm">ชื่องาน : โครงการสร้างดึกหน้าไก่</p>
                </div>
            </div>
            <div className="border-b border-y">
                <div className='justify-between container mx-auto text py-5 flex'>
                    <p>นาย พิชรัตน์ มีสรรพวงศ์</p>
                    <p>เบอร์ติดต่อ : 097-169-7949</p>
                    <p>ที่อยู่ : กรุงเทพ บางประกง เเละ บางเมืองใหม่ เเละ การเดินทาง 10270</p>
                </div>
            </div>
            <div className="grid grid-cols-10 gap-2">
                <div className="border-r border-b col-span-2 h-full">
                    <div className="grid text-center grid-cols-3 text-lg gap-5">
                        <p>รูปภาพ</p>
                        <p>ชื่อ-นามสกุล</p>
                        <p>ตําเเหน่ง</p>
                    </div>
                    <div className=" grid text-center my-5 items-center text-sm text-gray-500 grid-cols-3 gap-5">
                        <img className="w-15 h-15 mx-auto object-cover object-center rounded-4xl " src="https://scontent.fbkk29-7.fna.fbcdn.net/v/t39.30808-6/555743161_1209804381184597_6337927824820409289_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Ey1_2pT8tU0Q7kNvwE59RZE&_nc_oc=AdmgTtShwayGefP7JujVDQf0EFkLXB_SUnh3QGL8AStSokQ9X9CXeMvTcro7dEgx3_U&_nc_zt=23&_nc_ht=scontent.fbkk29-7.fna&_nc_gid=8-Q6NQigDM0AB06ZBMINEg&oh=00_AfY7VaZTNbmDIwGvoUPTbk2NWbt2L0nZ40RzWbO-7_1Mnw&oe=68E03571" alt="" />
                        <p className=" w-30 overflow-x-auto whitespace-nowrap p-1">
                            นาย พิชรัตน์ มีสรรพวงศ์ 
                        </p>

                        <p>ไม้</p>
                    </div>

                </div>
                <div className="border col-span-8"></div>
            </div>
        </div >
    )
}
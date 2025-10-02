export default function Details() {
    const data = [
        "รูป",
        "ชื่อ",
        "ตําเเหน่ง",
        "รายงาน",
        "สถานะงาน",
        "ตอบกลับ",
    ];
    const polic = [
        {
            image: "https://scontent.fbkk2-7.fna.fbcdn.net/v/t39.30808-6/555660740_1212040137608811_5277703083957208735_n.jpg?...",
            name: "พิชรัตน์ มีสรรพวงศ์",
            position: "ไม้",
            report: "บ้านไฟไม้",
            status: "กําลังดําเนิน",
            reply: "ตอบกลับ",
        },
    ];

    return (
        <div className="bg-blue-50 min-h-screen py-10">
            {/* หัวข้อ */}
            <div className="container mx-auto my-5 bg-white rounded-xl shadow-md p-6 border border-blue-200">
                <p className="text-2xl font-bold text-blue-700 mb-3">รายละเอียดงาน</p>
                <p className="text-gray-700">ชื่องาน : โครงการสร้างดึกหน้าไก่</p>
            </div>

            {/* ข้อมูลผู้รับผิดชอบ */}
            <div className="bg-white container mx-auto rounded-xl shadow-md border border-blue-200 p-6 mb-8">
                <div className="flex flex-col md:flex-row md:justify-between text-gray-700 gap-3">
                    <p className="font-semibold">นาย พิชรัตน์ มีสรรพวงศ์</p>
                    <p>เบอร์ติดต่อ : <span className="text-blue-600 font-medium">097-169-7949</span></p>
                    <p>ที่อยู่ : กรุงเทพ บางประกง เเละ บางเมืองใหม่ เเละ การเดินทาง 10270</p>
                </div>
            </div>

            {/* ตาราง */}
            <div className="grid grid-cols-10 gap-4 container mx-auto">
                {/* ซ้าย */}
                <div className="col-span-2 bg-white rounded-xl shadow-md border border-blue-200 p-5">
                    <div className="grid text-center grid-cols-3 text-lg font-bold text-blue-700 gap-4">
                        <p>รูปภาพ</p>
                        <p>ชื่อ-นามสกุล</p>
                        <p>ตําเเหน่ง</p>
                    </div>
                    <div className="grid text-center my-5 items-center text-sm text-gray-600 grid-cols-3 gap-4">
                        <img
                            className="w-16 h-16 mx-auto object-cover rounded-full ring-2 ring-blue-400"
                            src="https://scontent.fbkk29-7.fna.fbcdn.net/v/t39.30808-6/555743161_1209804381184597_6337927824820409289_n.jpg?..."
                            alt=""
                        />
                        <p className="truncate px-2">นาย พิชรัตน์ มีสรรพวงศ์</p>
                        <p className="text-blue-600 font-medium">ไม้</p>
                    </div>
                </div>

                {/* ขวา */}
                <div className="col-span-8 bg-white rounded-xl shadow-md border border-blue-200 p-5">
                    <p className="text-xl font-semibold text-blue-700 mb-4">รายละเอียดการดําเนินงาน</p>
                    
                    {/* หัวตาราง */}
                    <div className="grid grid-cols-6 gap-5 bg-blue-100 p-3 rounded-lg font-semibold text-blue-700 text-center">
                        {data.map((event, index) => (
                            <p key={index}>{event}</p>
                        ))}
                    </div>

                    {/* ข้อมูล */}
                    {polic.map((event, index) => (
                        <div
                            className="grid grid-cols-6 gap-5 text-center text-gray-700 mt-4 items-center hover:bg-blue-50 rounded-lg p-3 transition"
                            key={index}
                        >
                            <img
                                src={event.image}
                                alt={event.name}
                                className="w-12 h-12 object-cover rounded-full mx-auto"
                            />
                            <p>{event.name}</p>
                            <p className="text-blue-600">{event.position}</p>
                            <p>{event.report}</p>
                            <p className="text-yellow-600 font-medium">{event.status}</p>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
                                {event.reply}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Details() {
  interface Employees {
    _id: string;
    Worksheet: string;
    Employer: string;
    Contact_number: string;
    address: string;
    responsible: string;
    Date_of_acceptance_of_work: string;
    Closing_date: string;
    description: string;
    JobTitle?: string;
    Status?: string;
    image: string;
  }

  const [dataEmployees, setDataEmployees] = useState<Employees[]>([]);
  const [Mobiles, setMobled] = useState(false);

  const data = ["รูป", "ชื่อ", "ตำแหน่ง", "รายงาน", "สถานะงาน", "ตอบกลับ"];
  const polic = [
    {
      image:
        "https://scontent.fbkk2-7.fna.fbcdn.net/v/t39.30808-6/555660740_1212040137608811_5277703083957208735_n.jpg?...",
      name: "พิชรัตน์ มีสรรพวงศ์",
      position: "ไม้",
      report: "บ้านไฟไม้",
      status: "กำลังดำเนิน",
      reply: "ตอบกลับ",
    },
  ];

  // ดึงข้อมูลพนักงาน
  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const data: Employees[] = await res.json();
      setDataEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const { id } = useParams();

  return (
    <div className="bg-blue-50  min-h-screen p-2 py-10 ">
      {dataEmployees.map((event, index) => {
        if (event._id === id)
          return (
            <div className=" max-w-380 mx-auto" key={index}>
              <div className=" mx-auto bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-200">
                <p className="text-3xl font-extrabold text-blue-700 mb-3">
                  ชื่องาน
                </p>
                <p className="text-gray-700 mb-5 text-lg">{event.Worksheet}</p>

                <p className="text-2xl font-bold text-blue-700 mb-2">
                  รายละเอียดงาน
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {event.description}
                </p>
              </div>

              <div className=" mx-auto bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-8">
                <div className="flex flex-col md:flex-row md:justify-between text-gray-700 gap-4 text-lg">
                  <p className="font-semibold">
                    ชื่อผู้จ้าง:{" "}
                    <span className="text-blue-600 font-bold">
                      {event.Employer}
                    </span>
                  </p>

                  <p className="font-semibold">
                    เบอร์ติดต่อ:{" "}
                    <span className="text-blue-600 font-bold">
                      {event.Contact_number}
                    </span>
                  </p>
                  <p className="font-semibold">
                    ที่อยู่:{" "}
                    <span className="text-blue-600 font-bold">
                      {event.address}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-10 grid-cols-1 gap-6  mx-auto">
                <div className="border lg:col-span-4 rounded-2xl border-blue-200 bg-white shadow-lg p-5">
                  <div className="flex justify-between items-center border-b border-blue-200 pb-3 mb-5">
                    <h3 className="text-xl font-bold text-blue-700">
                      รายชื่อช่าง
                    </h3>
                    <button
                      onClick={() => setMobled(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow"
                    >
                      + เพิ่มช่าง
                    </button>
                  </div>

                  <div className=" items-center text-gray-700 font-semibold text-lg p-1 shadow-sm rounded-xl hover:shadow-lg duration-300 hover:scale-101">
                    <div className="flex items-center gap-5">
                      <img
                        className="w-16 h-16 rounded-2xl object-cover"
                        src={`http://localhost:5000/uploads/${event.image}`}
                        alt={event.Employer}
                      />
                      <div className="">
                        <p>นาย : พิชรัตน์ มีสรรพวงศ์</p>
                        <p className="text-sm text-gray-500">ตำแหน่ง : ช่างไม้</p>
                      </div>
                      <div className="  ml-auto ">
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-3 py-1 rounded-lg shadow">
                          แก้ไข
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-white rounded-2xl shadow-lg border border-blue-200 p-6">
                  <p className="text-xl font-bold text-blue-700 mb-4">
                    รายละเอียดการดำเนินงาน
                  </p>

                  <div className="grid grid-cols-6 gap-5 bg-blue-100 p-3 rounded-lg font-bold text-blue-700 text-center text-lg">
                    {data.map((event, index) => (
                      <p key={index}>{event}</p>
                    ))}
                  </div>

                  {polic.map((event, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 gap-5 text-center text-gray-700 mt-4 items-center hover:bg-blue-50 rounded-lg p-3 transition font-medium"
                    >
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-12 h-12 object-cover rounded-full mx-auto"
                      />
                      <p>{event.name}</p>
                      <p className="text-blue-600">{event.position}</p>
                      <p>{event.report}</p>
                      <p className="text-yellow-600 font-bold">
                        {event.status}
                      </p>
                      <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow">
                        {event.reply}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
      })}

      {Mobiles && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[95%] md:w-[700px] lg:w-[900px] border border-blue-200 max-h-[95vh] overflow-y-auto">
            <div className="mb-6 border-b border-blue-200 pb-3 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-700">เพิ่มช่าง</h2>
              <button
                onClick={() => setMobled(false)}
                className="text-gray-500 hover:text-red-500 font-semibold"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 text-center py-5">
              (ใส่ฟอร์มเพิ่มช่างที่นี่)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

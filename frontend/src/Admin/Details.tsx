// export default function Details() {
const data = ["รูป", "ชื่อ", "ตําเเหน่ง", "รายงาน", "สถานะงาน", "ตอบกลับ"];
const polic = [
  {
    image:
      "https://scontent.fbkk2-7.fna.fbcdn.net/v/t39.30808-6/555660740_1212040137608811_5277703083957208735_n.jpg?...",
    name: "พิชรัตน์ มีสรรพวงศ์",
    position: "ไม้",
    report: "บ้านไฟไม้",
    status: "กําลังดําเนิน",
    reply: "ตอบกลับ",
  },
];

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
  const [showModal, setShowModal] = useState(false);
  const [Worksheet, setWorksheet] = useState("");
  const [Employer, setEmployer] = useState("");
  const [Contact_number, setContact_number] = useState("");
  const [address, setaddress] = useState("");
  const [responsible, setresponsible] = useState("");
  const [Date_of_acceptance_of_work, setDate_of_acceptance_of_work] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [Closing_date, setClosing_date] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setdescription] = useState("");
  const [image, setimage] = useState("");
  const [Status, setStatus] = useState("Active");

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
    <div>
      {dataEmployees.map((event, index) => {
        if (event._id === id)
          return (
            <div key={index} className="bg-blue-50 min-h-screen py-10">
              {/* หัวข้อ */}
              <div className="container mx-auto my-5 bg-white rounded-xl shadow-md p-6 border border-blue-200">
                <p className="text-2xl font-bold text-blue-700 mb-2">ชื่องาน</p>
                <p className=" text-gray-700 mb-2">{event.Worksheet}</p>
                <p className="text-2xl font-bold text-blue-700 mb-2">
                  รายละเอียดงาน
                </p>
                <p className="text-gray-700 mb-2">{event.description}</p>
              </div>

              {/* ข้อมูลผู้รับผิดชอบ */}
              <div className="bg-white container mx-auto rounded-xl shadow-md border border-blue-200 p-6 mb-8">
                <div className="flex flex-col md:flex-row md:justify-between text-gray-700 gap-3">
                  <p className="font-semibold">{event.Employer}</p>
                  <p>
                    เบอร์ติดต่อ :{" "}
                    <span className="text-blue-600 font-medium">
                      {event.Contact_number}
                    </span>
                  </p>
                  <p>{event.address}</p>
                </div>
              </div>

              {/* ตาราง */}
              <div className="grid grid-cols-10 gap-4 container mx-auto">
                <div className="border col-span-3 rounded-xl border-blue-200 bg-white shadow-md p-5">
                  <div className="grid border-b border-blue-200 pb-2 text-blue-700 items-center font-semibold text-lg grid-cols-4 gap-5 mb-5">
                    <p>รูปภาพ</p>
                    <p>ชื่อนามสกุล</p>
                    <p>ตําเเหน่ง</p>
                    <p className="border w-fit p-1 rounded-xl bg-blue-500 text-white">
                      เพิ่มช่าง
                    </p>
                  </div>

                  <div className="grid items-center text-blue-700 font-semibold text-lg grid-cols-4 gap-5 ">
                    <img
                      className="w-16 h-16 rounded-4xl"
                      src={`http://localhost:5000/uploads/${event.image}`}
                      alt=""
                    />
                    <p>ชื่อนามสกุล</p>
                    <p>ตําเเหน่ง</p>
                    <p>รายการ</p>
                  </div>
                </div>

                {/* ขวา */}
                <div className="col-span-7   bg-white rounded-xl shadow-md border border-blue-200 p-5">
                  <p className="text-xl font-semibold text-blue-700 mb-4">
                    รายละเอียดการดําเนินงาน
                  </p>

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
                      <p className="text-yellow-600 font-medium">
                        {event.status}
                      </p>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
                        {event.reply}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
      })}
    </div>
  );
}

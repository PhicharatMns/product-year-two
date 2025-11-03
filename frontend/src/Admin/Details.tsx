import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";

export default function Details() {
  const [showOpenaddTradesman, setshowOpenaddTradesman] = useState(false);
  const [duplicateTradesman, setDuplicateTradesman] =
    useState<Tradesman | null>(null);

  const { id } = useParams();
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

  interface Tradesman {
    _id: string;
    Name: string;
    Nickname: string;
    ID: string;
    Birthday: string;
    Address: string;
    Phone_Number: string;
    Email: string;
    Profile: string;
    Position: string;
    Start_data: string;
    id: string;
  }

  const [dataEmployees, setDataEmployees] = useState<Employees[]>([]);
  const [Mobiles, setMobled] = useState(false);
  const [dataTradesman, setDataTradesman] = useState<Tradesman[]>([]);
  const [SelectedTradesmen, setSelectedTradesmen] = useState<Tradesman[]>([]);

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

  // ดึงข้อมูลช่างทั้งหมด (Tradesman)
  const fetchTradesman = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login/all-tradesman", {
        credentials: "include",
      });
      const data: Tradesman[] = await res.json();
      setDataTradesman(data);
    } catch (err) {
      console.error("โหลดข้อมูลช่างล้มเหลว:", err);
    }
  };

  //  ดึงข้อมูล otherTradesman เฉพาะของงานนี้
  const fetchOtherTradesman = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/otherTradesman/${id}`);
      const data: Tradesman[] = await res.json();
      setSelectedTradesmen(data);
    } catch (err) {
      console.error("โหลด otherTradesman ล้มเหลว:", err);
    }
  };

  const handleAddTradesman = async (tradesman: Tradesman) => {
    try {
      // ตรวจสอบว่าช่างคนนี้ถูกเพิ่มไปแล้วหรือยัง
      const isDuplicate = SelectedTradesmen.some(
        (t) => t.Name === tradesman.Name
      );

      if (isDuplicate) {
        setDuplicateTradesman(tradesman); // เก็บช่างที่ซ้ำ
        setshowOpenaddTradesman(true); // เปิด modal เตือน
        setMobled(false); // ปิด modal เพิ่มช่าง
        return;
      }

      const payload = {
        id: tradesman._id, //  เพิ่มไอดีของช่าง
        Name: tradesman.Name,
        Position: tradesman.Position,
        Phone_Number: tradesman.Phone_Number,
        Profile: tradesman.Profile,
        employeeId: id, // ผูกกับงานปัจจุบัน
      };

      const res = await fetch("http://localhost:5000/api/otherTradesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("ไม่สามารถเพิ่มข้อมูลได้");
      await res.json();

      // ดึงข้อมูลใหม่หลังเพิ่ม
      fetchOtherTradesman();
      setMobled(false);
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
    }
  };

  const handeDelete = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/otherTradesman/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("ลบไม่สำเร็จ");

      fetchOtherTradesman(); // โหลดข้อมูลใหม่
    } catch (err) {
      console.error("เกิดข้อผิดพลาดตอนลบ:", err);
    }
  };

  // โหลดข้อมูลทั้งหมดตอนเปิดหน้า
  useEffect(() => {
    fetchEmployees();
    fetchTradesman();
    if (id) fetchOtherTradesman(); //  ตรวจว่ามี id ก่อน
  }, [id]);

  const { theme } = useTheme();

  const text = theme === "dark" ? "text-white" : "text-gray-800";
  const bg_border =
    theme === "dark" ? "bg-gray-900" : "border-bule-200 shadow-lg";

  return (
    <div className="w-max-380 p-5 mx-auto container">
      <div className="">
        <div className="mb-5">
          <p
            className={`text-3xl sm:text-3xl md:text-3xl font-extrabold drop-shadow-sm  ${
              theme === "dark" ? "text-yellow-500" : "text-blue-500"
            }`}
          >
            รายละเอียด{" "}
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-yellow-500"
              }`}
            >
              งาน
            </span>
          </p>
        </div>
        {dataEmployees.map((event, index) => {
          if (event._id === id)
            return (
              <div key={index}>
                {/* ---------- ข้อมูลงาน ---------- */}
                <div
                  className={`rounded-2xl p-5 mb-5 shadow-lg  border ${
                    theme === "dark" ? "order-yellow-200 bg-gray-900" : ""
                  }`}
                >
                  <p
                    className={`text-3xl font-bold  mb-3 ${
                      theme === "dark" ? "text-yellow-500" : "text-blue-500"
                    }`}
                  >
                    ชื่องาน :{" "}
                    <span
                      className={` mb-5 text-lg ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {event.Worksheet}
                    </span>
                  </p>

                  <p
                    className={`text-2xl font-bold  mb-2  ${
                      theme === "dark" ? "text-yellow-500" : "text-blue-500"
                    }`}
                  >
                    รายละเอียดงาน :{" "}
                    <p
                      className={`leading-relaxed text-lg ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {event.description}
                    </p>
                  </p>
                </div>

                {/* ---------- ผู้ว่าจ้าง ---------- */}
                <div
                  className={`mx-auto rounded-2xl shadow-lg border  p-6 mb-8 ${bg_border}`}
                >
                  <div
                    className={`flex flex-col md:flex-row md:justify-between gap-4 text-lg ${text}`}
                  >
                    <p
                      className={`font-semibold ${
                        theme === "dark" ? "text-yellow-500" : "text-blue-500"
                      }`}
                    >
                      ชื่อผู้จ้าง:{" "}
                      <span
                        className={` ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {event.Employer}
                      </span>
                    </p>

                    <p
                      className={`${
                        theme === "dark" ? "text-yellow-500" : "text-blue-500"
                      } font-semibold`}
                    >
                      เบอร์ติดต่อ:{" "}
                      <span
                        className={` ${
                          theme === "dark" ? "text-white" : "text-black"
                        } `}
                      >
                        {event.Contact_number}
                      </span>
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-yellow-500" : "text-blue-500"
                      } font-semibold`}
                    >
                      ที่อยู่:{" "}
                      <span
                        className={`${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {event.address}
                      </span>
                    </p>
                  </div>
                </div>

                {/* ---------- รายชื่อช่าง ---------- */}
                <div className="grid lg:grid-cols-10 grid-cols-1 gap-6  mx-auto">
                  <div
                    className={`border lg:col-span-4 rounded-2xl p-5 ${bg_border}`}
                  >
                    <div
                      className={`flex justify-between items-center border-b  pb-3 p-2 `}
                    >
                      <h3
                        className={`text-xl font-bold ${
                          theme === "dark" ? "text-yellow-500" : "text-blue-500"
                        }`}
                      >
                        รายชื่อช่าง
                      </h3>
                      <button
                        onClick={() => setMobled(true)}
                        className={`border p-1 group relative flex items-center cursor-pointer overflow-hidden rounded-md px-4 font-medium text-neutral-0 transition duration-300  text-white ${
                          theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                        }`}
                      >
                        + เพิ่มช่าง
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                          <div className="relative h-full w-8 bg-white/50"></div>
                        </div>
                      </button>
                    </div>

                    {/* แสดงรายชื่อช่างที่เพิ่มแล้ว */}
                    <div
                      className={`font-semibold  text-lg p-2 ${
                        theme === "dark" ? "text-yellow-500" : "text-blue-500"
                      }`}
                    >
                      {SelectedTradesmen.map((t, index) => (
                        <div
                          key={index}
                          className={`flex items-center border my-2 rounded-lg px-2 hover:shadow-lg duration-300 justify-between  border-b ${bg_border}`}
                        >
                          <div className="flex items-center gap-5">
                            <img
                              src={`http://localhost:5000/uploads/Profile/${t.Profile}`}
                              alt={t.Name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="my-2">
                              <p
                                className={`text-sm ${
                                  theme === "dark" ? "text-white" : "text-black"
                                }`}
                              >
                                <span
                                  className={`font-extrabold ${
                                    theme === "dark"
                                      ? "text-yellow-500"
                                      : "text-blue-500"
                                  }`}
                                >
                                  ชื่อ :{" "}
                                </span>
                                {t.Name}
                              </p>
                              <p
                                className={`text-sm ${
                                  theme === "dark" ? "text-white" : "text-black"
                                }`}
                              >
                                <span
                                  className={` font-extrabold ${
                                    theme === "dark"
                                      ? "text-yellow-500"
                                      : "text-blue-500"
                                  }`}
                                >
                                  ตําเเหน่ง :{" "}
                                </span>{" "}
                                {t.Position}
                              </p>
                              <p
                                className={`text-sm  ${
                                  theme === "dark" ? "text-white" : "text-black"
                                }`}
                              >
                                <span
                                  className={`font-extrabold ${
                                    theme === "dark"
                                      ? "text-yellow-500"
                                      : "text-blue-500"
                                  }`}
                                >
                                  เบอร์ติดต่อ :{" "}
                                </span>{" "}
                                {t.Phone_Number}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handeDelete(t._id)}
                            className={`relative overflow-hidden cursor-pointer rounded-md px-4 py-2 text-white text-sm duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             active:translate-y-1 active:scale-x-110 active:scale-y-90  ${
               theme === "dark"
                 ? "bg-yellow-500 hover:bg-yellow-600"
                 : "bg-blue-500 hover:bg-blue-600"
             }`}
                          >
                            ลบ
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ---------- รายละเอียดการดำเนินงาน ---------- */}
                  <div
                    className={`lg:col-span-6 h-fit  rounded-2xl shadow-lg  p-6 ${bg_border}`}
                  >
                    <p
                      className={`text-xl font-bold mb-4 ${
                        theme === "dark" ? "text-yellow-500" : "text-blue-500"
                      }`}
                    >
                      รายละเอียดการดำเนินงาน
                    </p>

                    <div
                      className={`grid grid-cols-6 gap-5 shadowp-lg border p-3 rounded-lg font-bold text-center text-lg ${bg_border} ${text}`}
                    >
                      {data.map((event, index) => (
                        <p key={index}>{event}</p>
                      ))}
                    </div>

                    {polic.map((event, index) => (
                      <div
                        key={index}
                        className={`grid grid-cols-6 gap-5 text-center  mt-4 items-center rounded-lg p-3 transition font-medium ${text}`}
                      >
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-12 h-12 object-cover rounded-full mx-auto"
                        />
                        <p>{event.name}</p>
                        <p
                          className={`${
                            theme === "dark"
                              ? "text-yellow-500"
                              : "text-blue-500"
                          }`}
                        >
                          {event.position}
                        </p>
                        <p>{event.report}</p>
                        <p className="text-yellow-600 font-bold">
                          {event.status}
                        </p>
                        <button
                          className={`px-3 py-1 text-white rounded-lg duration-500 cursor-pointer shadow ${
                            theme === "dark"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          {event.reply}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
        })}

        {/* เตือนว่า เคยเเอดช่างใว้เเล้ว */}
        {showOpenaddTradesman && duplicateTradesman && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop:blur-sm z-50">
            <div
              className={`rounded-2xl shadow-2xl p-8 w-[400px] border ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center">
                <p className="flex gap-1">
                  ช่าง{" "}
                  <span
                    className={`${
                      theme === "dark" ? "text-yellow-500" : "text-blue-500"
                    }`}
                  >
                    {duplicateTradesman.Name}
                  </span>
                  <p>อยุ่ในระบบเเล้ว</p>
                </p>

                <button
                  className="cursor-pointer border bg-red-500 text-white px-2 w-fit p-1 rounded-lg ml-auto"
                  onClick={() => setshowOpenaddTradesman(false)}
                >
                  ออก{" "}
                </button>
              </div>

              <div>
                <img src="" alt="" />
                <p></p>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Modal เพิ่มช่าง ---------- */}
        {Mobiles && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-10">
            <div
              className={`rounded-2xl shadow-2xl p-8 w-[95%] md:w-[700px] lg:w-[900px] border max-h-[95vh] overflow-y-auto scrollbar-hide ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              {" "}
              <div className="mb-6 border-b border-blue-200 pb-3 flex justify-between items-center">
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  }`}
                >
                  เพิ่มช่าง
                  <span
                    className={`${
                      theme === "dark" ? "text-white" : "text-yellow-500"
                    }`}
                  >
                    เข้างาน
                  </span>
                </h2>
                <button
                  onClick={() => setMobled(false)}
                  className={`font-semibold cursor-pointer ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  ✕
                </button>
              </div>
              <div className="my-6">
                {dataTradesman.map((event, index) => (
                  <div
                    key={index}
                    className={`flex my-2 py-2 justify-between  pr-5 shadow-sm  pl-3 rounded-xl ${
                      theme === "dark" ? "bg-gray-900" : "bg-white"
                    }`}
                  >
                    <div className="flex gap-5 items-center">
                      <img
                        src={`http://localhost:5000/uploads/Profile/${event.Profile}`}
                        alt=""
                        className="w-12 h-12 object-cover  rounded-full bg-blue-700 shadow-md"
                      />
                      <div className="flex-col">
                        <h2
                          className={`text-lg font-extrabold ${
                            theme === "dark"
                              ? "text-yellow-500"
                              : "text-blue-500"
                          }`}
                        >
                          {event.Name}
                        </h2>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          <span
                            className={` font-extrabold ${
                              theme === "dark"
                                ? "text-yellow-500"
                                : "text-blue-500"
                            }`}
                          >
                            ตำแหน่ง :
                          </span>{" "}
                          {event.Address}
                        </p>{" "}
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          {" "}
                          <span
                            className={` font-extrabold ${
                              theme === "dark"
                                ? "text-yellow-500"
                                : "text-blue-500"
                            }`}
                          >
                            เบอร์โทร :
                          </span>{" "}
                          {event.Phone_Number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button
                        onClick={() => handleAddTradesman(event)}
                        className={`relative overflow-hidden cursor-pointer rounded-md px-3 py-2 text-white text-sm duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             active:translate-y-1 active:scale-x-110 active:scale-y-90  ${
               theme === "dark"
                 ? "bg-yellow-500 hover:bg-yellow-600"
                 : "bg-blue-500 hover:bg-blue-600"
             }`}
                      >
                        {" "}
                        เพิ่มช่าง
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

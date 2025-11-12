import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";
// import {  AnimatePresence } from "framer-motion";
export default function Details() {
  const [showOpenaddTradesman, setshowOpenaddTradesman] = useState(false);
  const [duplicateTradesman, setDuplicateTradesman] =
    useState<Tradesman | null>(null);

  interface Address {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  }

  const { id } = useParams();
  interface Employees {
    _id: string;
    Worksheet: string;
    Employer: string;
    Contact_number: string;
    address: Address;
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
    role: string;
  }

  const [dataEmployees, setDataEmployees] = useState<Employees[]>([]);
  const [Mobiles, setMobled] = useState(false);
  const [dataTradesman, setDataTradesman] = useState<Tradesman[]>([]);
  const [SelectedTradesmen, setSelectedTradesmen] = useState<Tradesman[]>([]);
  const [jobCounts, setJobCounts] = useState<{ [key: string]: number }>({});
  const [modalFade, setModalFade] = useState(false);
  const [fade, setFade] = useState(false);
  const [duplicateFade, setDuplicateFade] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [openMap, setopenMap] = useState(false);
  const [fadeMap, setFadeMap] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>("ทั้งหมด");
  const [Search, setSearch] = useState<string>(""); //   string
  const [focused, setFocused] = useState(false);

  const openModal = () => {
    setMobled(true);
    setTimeout(() => setModalFade(true), 50); // ให้ transition ทำงาน
  };

  const closeModal = () => {
    setModalFade(false);
    setTimeout(() => setMobled(false), 300); // รอให้ fade out เสร็จก่อนปิดจริง
  };

  const openshowOpenaddTradesman = () => {
    setDuplicateFade(true);
    setTimeout(() => setshowOpenaddTradesman(true), 50);
  };

  const classhowOpenaddTradesman = () => {
    setDuplicateFade(false);
    setTimeout(() => setshowOpenaddTradesman(false), 300);
  };

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
      // ตรวจสอบ role ของช่าง
      if (tradesman.Position !== "chief" && tradesman.role !== "chief") {
        alert("สามารถเพิ่มได้เฉพาะช่างที่เป็น Chief เท่านั้น");
        return;
      }

      // ตรวจสอบว่าช่างคนนี้ถูกเพิ่มไปแล้วหรือยัง
      const isDuplicate = SelectedTradesmen.some((t) => t.id === tradesman._id);

      if (isDuplicate) {
        setDuplicateTradesman(tradesman); // เก็บช่างที่ซ้ำ
        openshowOpenaddTradesman(); // เปิด modal เตือน
        return;
      }

      const payload = {
        id: tradesman._id,
        Name: tradesman.Name,
        Position: tradesman.Position,
        Phone_Number: tradesman.Phone_Number,
        Profile: tradesman.Profile,
        employeeId: id,
        role: tradesman.role, // <-- เพิ่มตรงนี้
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

  //รับงานช่าง
  const fetchJobCounts = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/otherTradesman/count/all"
      );
      const data: { _id: string; count: number }[] = await res.json();
      const map: { [key: string]: number } = {};
      data.forEach((item) => {
        map[item._id] = item.count;
      });
      setJobCounts(map);
    } catch (err) {
      console.error("โหลดจำนวนงานล้มเหลว:", err);
    }
  };

  // // ตอนเปิดแผนที่
  // const openMapHandler = () => {
  //   setopenMap(true);
  //   setTimeout(() => setFadeMap(true), 50);
  // };

  // ตอนปิดแผนที่
  const closeMapHandler = () => {
    setFadeMap(false);
    setTimeout(() => setopenMap(false), 300);
  };

  // โหลดข้อมูลทั้งหมดตอนเปิดหน้า
  useEffect(() => {
    fetchEmployees();
    fetchTradesman();
    fetchJobCounts();
    if (id) fetchOtherTradesman();
    const timer = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(timer);
  }, [id]);

  // ตั้งค่า markerPos หลังจาก dataEmployees โหลดเสร็จ
  useEffect(() => {
    if (id && dataEmployees.length > 0) {
      const employee = dataEmployees.find((e) => e._id === id);

      if (employee && employee.address?.coordinates) {
        const [lng, lat] = employee.address.coordinates;
        setMarkerPos([lat, lng]);
      } else {
        // fallback ถ้าไม่มี address หรือ coordinates
        setMarkerPos([13.7563, 100.5018]);
      }
    }
  }, [dataEmployees, id]);

  const { theme } = useTheme();

  // const text = theme === "dark" ? "text-white" : "text-gray-800";
  // const bg_border =
  //   theme === "dark" ? "bg-gray-900" : "border-bule-200 shadow-lg";

  return (
    <div
      className={` w-max-380 h-screen transition-opacity duration-300 p-5 mx-auto container  ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="">
        <div className="">
          {dataEmployees.map((event, index) => {
            if (event._id === id)
              return (
                <div key={index}>
                  <div className="text-3xl font-bold flex gap-2">
                    <p
                      className={`${
                        theme === "dark" ? "text-yellow-500" : "text-blue-500"
                      }`}
                    >
                      รายละเอียดงาน :
                    </p>
                    <span
                      className={`${
                        theme === "dark" ? "text-bule-500" : "text-yellow-500"
                      }`}
                    >
                      {event.Worksheet}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-5 mt-5">
                    <div className={`border p-3 rounded-xl `}>
                      <p>ผู้จ้าง: {event.Employer || "-"}</p>
                      <p>เบอร์ติดต่อ: {event.Contact_number || "-"}</p>
                      <p>
                        วันเริ่มงาน:{" "}
                        {event.Date_of_acceptance_of_work
                          ? new Date(
                              event.Date_of_acceptance_of_work
                            ).toLocaleDateString("th-TH")
                          : "-"}
                      </p>
                      <p>
                        วันกําหนดส่งงาน:{" "}
                        {event.Closing_date
                          ? new Date(event.Closing_date).toLocaleDateString(
                              "th-TH"
                            )
                          : "-"}
                      </p>
                    </div>

                    <div className={`border p-3 rounded-xl`}>
                      <p className={`text-lg mb-1 font-semibold `}>
                        รายละเอียดงาน
                      </p>
                      <p className="text-ellipsis">
                        {event.description || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              );
          })}

          <div className="grid grid-cols-5 gap-4 mt-3">
            <div className="col-span-2">
              <div className="w-full h-90 mb-1 p-5 rounded-2xl border ">
                <div
                  className={` items-center ${
                    theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  } mb-3 border-b pb-3 flex justify-between`}
                >
                  <p className="text-xl font-semibold">รายชื่อช่าง</p>
                  <button
                    onClick={openModal}
                    className={`border p-1 group relative flex items-center cursor-pointer overflow-hidden rounded-md px-4 font-medium text-white transition duration-300 ${
                      theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                    }`}
                  >
                    + เพิ่มช่าง
                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                      <div className="relative h-full w-8 bg-white/50"></div>
                    </div>
                  </button>
                </div>
                <div className="overflow-auto scrollbar-hide h-60">
                  {SelectedTradesmen.map((event, index) => {
                    return (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }} // เริ่มมองไม่เห็น + เลื่อนลง
                        animate={{ opacity: 1, y: 0 }} // จบที่มองเห็น + ตำแหน่งปกติ
                        transition={{
                          duration: 0.5, // เวลา animation 0.5 วินาที
                          delay: index * 0.5, // ทำให้แต่ละ item delay ตามลำดับ
                          ease: "easeOut",
                        }}
                      >
                        <div
                          key={index}
                          className={`items-center  border  p-1 my-1 rounded-xl ${
                            theme === "dark" ? "bg-gray-800" : "shadow-sm"
                          }`}
                        >
                          <div className="items-center justify-between flex">
                            <p className={`text-sm pl-2 font-semibold `}>
                              {event.Name}
                            </p>
                            <button
                              onClick={() => handeDelete(event._id)}
                              className={`relative overflow-hidden cursor-pointer rounded-md px-4 py-1 text-black text-sm duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             active:translate-y-1 active:scale-x-110 active:scale-y-90  
              `}
                            >
                              <RiDeleteBin5Line fontSize={20} />
                            </button>
                            {/* {event.role?.toLowerCase() !== "user" && (
                              <button
                                onClick={() => handeDelete(event._id)}
                                className={`relative overflow-hidden cursor-pointer rounded-md px-4 py-1 text-black text-sm duration-300 
    [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
    active:translate-y-1 active:scale-x-110 active:scale-y-90`}
                              >
                                <RiDeleteBin5Line fontSize={20} />
                              </button>
                            )} */}
                          </div>
                          <div className="flex gap-2">
                            <img
                              className="h-10 w-10 rounded-4xl bg-blue-500"
                              src=""
                              alt=""
                            />
                            <div className="text-sm flex flex-col gap-1">
                              <p className={``}>
                                <span className={`font-semibold `}>
                                  หัวหน้างาน:
                                </span>{" "}
                                ชื่อหัวหน้างาน
                              </p>
                              <p className={`truncate w-120 `}>
                                <span className={`font-semibold `}>
                                  รายละเอียด:
                                </span>{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="w-full h-90 mb-1 p-3 rounded-2xl border ">
                <div
                  className={`${
                    theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  } text-xl font-semibold mb-3 border-b pb-3`}
                >
                  รายการติดต่อ / เบิกของ
                </div>
                <div
                  className={`items-center border p-1 my-1 rounded-xl ${
                    theme === "dark" ? "bg-gray-800" : "shadow-sm"
                  }`}
                >
                  <p className={`text-sm pl-2 font-semibold `}>การขอเบิกของ</p>
                  <div className="flex gap-2">
                    <img
                      className="h-10 w-10 rounded-4xl bg-blue-500"
                      src=""
                      alt=""
                    />
                    <div className="text-sm flex flex-col gap-1">
                      <p className={``}>
                        <span className={`font-semibold `}>หัวหน้างาน:</span>{" "}
                        ชื่อหัวหน้างาน
                      </p>
                      <p className={`truncate w-120 `}>
                        <span className={`font-semibold `}>รายละเอียด:</span>{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* เเผนที่ */}
            <div className="`border py-3 px-4 col-span-3 z-0 rounded-2xl border">
              <h2 className={`text-xl font-semibold mb-3 `}>แผนที่งาน</h2>
              {markerPos && (
                <MapContainer
                  center={markerPos}
                  zoom={13}
                  className="w-full h-155 rounded-lg"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={markerPos}
                    icon={L.icon({
                      iconUrl:
                        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                    })}
                  >
                    <Tooltip permanent direction="top" offset={[0, -40]}>
                      {dataEmployees.find((e) => e._id === id)?.Worksheet ||
                        "ชื่องาน"}
                    </Tooltip>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </div>
        </div>

        {/* เตือนว่า เคยเเอดช่างใว้เเล้ว */}
        {showOpenaddTradesman && duplicateTradesman && (
          <div
            className={`fixed inset-0 duration-100 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 ${
              duplicateFade ? "opacity-100" : "opacity-0"
            }`}
          >
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
                  className={`relative ml-auto overflow-hidden cursor-pointer rounded-md px-4 py-1 text-white text-sm duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             active:translate-y-1 active:scale-x-110 active:scale-y-90  bg-red-500
              `}
                  onClick={classhowOpenaddTradesman}
                >
                  ออก{" "}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Modal เพิ่มช่าง ---------- */}
        {Mobiles && (
          <div
            className={`fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 
     duration-300 ${modalFade ? "opacity-100 " : "opacity-0"}`}
          >
            {" "}
            <div
              className={`rounded-2xl w-[900px] h-200 shadow-2xl border ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } ${modalFade ? "opacity-100 " : "scale-90 opacity-0"} `}
            >
              {" "}
              <div className="flex justify-between border-b px-6 py-4 ">
                <p
                  className={` text-2xl  font-semibold  ${
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
                </p>

                <div className="relative">
                  <CiSearch
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300`}
                  />
                  <input
                    placeholder="ค้นหาใบงาน..."
                    value={Search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    type="text"
                    className={`border rounded-xl pl-10 pr-3 duration-300 transition-all focus:outline-none focus:ring-2 py-1 
                              ${
                                focused
                                  ? "w-72 shadow-lg"
                                  : "w-60 border-gray-300"
                              }  
                              ${
                                theme === "dark"
                                  ? "border-gray-600 focus:ring-yellow-500 bg-gray-700 text-white"
                                  : " focus:ring-blue-400 bg-white text-gray-800"
                              }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-8 py-3 border-b mb-3 gap-5 px-6">
                {[
                  { name: "ทั้งหมด" },
                  { name: "IT Support" },
                  { name: "Helpdesk" },
                  { name: "Network" },
                  { name: "System Admin" },
                  { name: "IT Support" },
                  { name: "Technical" },
                  { name: "Customer" },
                ].map((dept) => (
                  <div key={dept.name} className="">
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setSelectedPosition(dept.name)}
                    >
                      <p
                        className={`truncate relative w-fit mx-auto after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full
          after:origin-bottom after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-500
          after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100
          ${selectedPosition === dept.name ? "font-bold text-blue-500" : ""}`}
                      >
                        {dept.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 h-150 overflow-y-auto scrollbar-hide">
                {/* <AnimatePresence mode="popLayout"> */}
                {dataTradesman
                  .filter(
                    (t) =>
                      (t.Position === "chief" || t.role === "chief") && // เฉพาะ Chief
                      (selectedPosition === "ทั้งหมด" ||
                        t.Position === selectedPosition) && // กรองตำแหน่ง
                      t.Name.toLowerCase().includes(Search.toLowerCase()) //  ค้นหาชื่อ
                  )
                  .sort(
                    (a, b) => (jobCounts[a._id] ?? 0) - (jobCounts[b._id] ?? 0)
                  )
                  .map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                    >
                      <div
                        key={index}
                        className={`flex my-2 py-1 justify-between shadow-sm  px-5 rounded-xl ${
                          theme === "dark" ? "bg-gray-900" : "bg-white"
                        }`}
                      >
                        <div className="flex  gap-5 items-center">
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
                            <p>
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
                                  งานที่ได้รับในเดือนนี่ :
                                </span>{" "}
                                {jobCounts[event._id] ?? 0} งาน
                              </p>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <button
                            onClick={async () => {
                              await handleAddTradesman(event);
                              closeModal();
                            }}
                            className={`relative overflow-hidden cursor-pointer rounded-md px-3 py-2 text-white text-sm duration-300 
     [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
     active:translate-y-1 active:scale-x-110 active:scale-y-90  ${
       theme === "dark"
         ? "bg-yellow-500 hover:bg-yellow-600"
         : "bg-blue-500 hover:bg-blue-600"
     }`}
                          >
                            เพิ่มช่าง
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                {/* </AnimatePresence> */}
              </div>
              <div
                className={`flex justify-end  border-t p-4 ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  onClick={closeModal}
                  className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                >
                  <span className="relative z-10">ยกเลิก</span>
                  <span className="absolute inset-0 overflow-hidden pointer-events-none">
                    <span className="absolute left-0 top-0 w-0 h-full bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {openMap && markerPos && (
          <div
            className={`fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
              fadeMap ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-300 h-190 p-5 pb-12 bg-gray-800 rounded-lg transition-transform duration-300">
              <MapContainer
                center={markerPos}
                zoom={13}
                className="w-full h-170 rounded-lg"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={markerPos}
                  icon={L.icon({
                    iconUrl:
                      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  })}
                >
                  <Tooltip permanent direction="top" offset={[0, -40]}>
                    {dataEmployees.find((e) => e._id === id)?.Worksheet ||
                      "ชื่องาน"}
                  </Tooltip>
                </Marker>
              </MapContainer>

              {/* ปุ่มปิด */}
              <div className="flex gap-2 justify-end my-3">
                <button
                  onClick={closeMapHandler}
                  className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                >
                  <span className="relative z-10">ยกเลิก</span>
                  <span className="absolute inset-0 overflow-hidden pointer-events-none">
                    <span className="absolute left-0 top-0 w-0 h-full bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

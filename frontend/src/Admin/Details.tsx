import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";
import { TiMessage } from "react-icons/ti";
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
    NameJOB: string;
  }

  interface RequisitionItem {
    jobId?: string;
    id: string;
    name: string;
    quantity: string;
    description?: string;
    requesterName?: string; // ชื่อคนขอเบิก
    requesterProfile?: string; // รูปโปรไฟล์
    section?: string;
    role?: string;
    createdAt?: string;
    _id?: string;
    status?: string;
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
  const [PopUpDate, setPopUpDate] = useState(false);
  const [selectedTradesmanId, setSelectedTradesmanId] = useState<string | null>(
    null
  );
  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>(
    []
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const openPopupNotApproved = (itemId: string) => {
    setSelectedItemId(itemId);
    colsePopupMessage();
    setPopupNotApproved(true);
    setTimeout(() => setDuplicateFade(true), 50);
  };

  // ปิด popup
  const closePopupMessage = () => {
    setDuplicateFade(false);
    setTimeout(() => setPopupNotApproved(false), 300);
  };

  const [PopupMessage, setPopupMessage] = useState(false);
  const [PopupNotApproved, setPopupNotApproved] = useState(false);

  const openPopupMessage = (id: string) => {
    setSelectedTradesmanId(id); // ใช้ id ของ requisition item
    setPopupMessage(true);
    setTimeout(() => setDuplicateFade(true), 50);
  };

  const colsePopupMessage = () => {
    setDuplicateFade(false);
    setTimeout(() => setPopupMessage(false), 300);
  };

  const openPopUpDate = (id: string) => {
    setPopUpDate(true);
    setSelectedTradesmanId(id); // เก็บ id ของช่างที่จะลบ
    setTimeout(() => setDuplicateFade(true), 50);
  };

  const closePopUpDate = () => {
    setDuplicateFade(false);
    setTimeout(() => setPopUpDate(false), 300);
  };

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

  const fetchRequisitionItems = async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/additem?jobId=${id}`);
      const data: RequisitionItem[] = await res.json();
      setRequisitionItems(data);
    } catch (err) {
      console.error("โหลดรายการเบิกของล้มเหลว:", err);
      setRequisitionItems([]);
    }
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
      // ตรวจสอบว่าช่างคนนี้ถูกเพิ่มไปแล้วหรือยัง
      const isDuplicate = SelectedTradesmen.some((t) => t.id === tradesman._id);

      if (isDuplicate) {
        setDuplicateTradesman(tradesman); // เก็บช่างที่ซ้ำ
        openshowOpenaddTradesman(); // เปิด modal เตือน
        return;
      }

      // หา Worksheet และวันของงานนี้จาก dataEmployees
      const employee = dataEmployees.find((e) => e._id === id);
      const worksheetName = employee?.Worksheet || "ไม่ระบุชื่องาน";
      const workDay =
        employee?.Date_of_acceptance_of_work || "ไม่ระบุวันเริ่มงาน";
      const closingDay = employee?.Closing_date || "ไม่ระบุวันปิดงาน";

      const payload = {
        id: tradesman._id,
        Name: tradesman.Name,
        Position: tradesman.Position,
        Phone_Number: tradesman.Phone_Number,
        Profile: tradesman.Profile,
        employeeId: id,
        role: tradesman.role,
        NameJOB: worksheetName,
        Work_day: workDay, // <-- เพิ่มตรงนี้
        Closing_day: closingDay, // <-- เพิ่มตรงนี้
        Email: tradesman.Email
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

  const handleApprove = async (itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token");
        return;
      }

      const payload = { status: "อนุมัติเเล้วรอการติดต่อคลัง" };
      console.log("Approving:", itemId, payload);

      const res = await fetch(
        `http://localhost:5000/api/additem/${itemId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("Response:", res.status, data);

      if (!res.ok) {
        alert("อัปเดตสถานะไม่สำเร็จ");
        return;
      }

      setRequisitionItems((prev) =>
        prev.map((i) =>
          i.id === itemId || i._id === itemId
            ? {
              ...i,
              status: "อนุมัติเเล้วรอการติดต่อคลัง",
              reasondescriptionstatus: rejectReason,
            }
            : i
        )
      );
      colsePopupMessage();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (itemId: string) => {
    try {
      const token = localStorage.getItem("token"); // หรือที่คุณเก็บ token
      if (!token) {
        alert("ไม่พบ token");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/additem/${itemId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "ไม่อนุมัติ",
            reasondescriptionstatus: rejectReason,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert("อัปเดตสถานะไม่สำเร็จ");
        return;
      }

      // อัปเดตข้อมูลใน state
      setRequisitionItems((prev) =>
        prev.map((i) =>
          i.id === itemId || i._id === itemId
            ? {
              ...i,
              status: "ไม่อนุมัติ",
              reasondescriptionstatus: rejectReason,
            }
            : i
        )
      );

      setRejectReason(""); // ล้าง textarea
      closePopupMessage();
    } catch (err) {
      console.error(err);
    }
  };

  // โหลดข้อมูลทั้งหมดตอนเปิดหน้า
  useEffect(() => {
    fetchEmployees();
    fetchTradesman();
    fetchJobCounts();
    fetchRequisitionItems();
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

  const bg = theme === "dark" ? "bg-gray-900" : " shadow-sm bg-white";
  const changeText_color =
    theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const titleColor = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const text_color = theme === "dark" ? "text-white" : "text-black";
  const bgpopup = theme === "dark" ? "bg-gray-800" : " shadow-sm bg-white";

  return (
    <div
      className={` w-max-380 h-screen transition-opacity duration-300 p-5 mx-auto container  ${fade ? "opacity-100" : "opacity-0"
        }`}
    >
      <div className="">
        <div className="">
          {dataEmployees.map((event, index) => {
            if (event._id === id)
              return (
                <div key={index}>
                  <div className="text-3xl font-bold flex gap-2 ">
                    <p
                      className={`${theme === "dark" ? "text-yellow-500" : "text-blue-500"
                        }`}
                    >
                      รายละเอียดงาน :
                    </p>
                    <span
                      className={`  ${theme === "dark" ? "text-bule-500" : "text-yellow-500"
                        }`}
                    >
                      {event.Worksheet}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-5 mt-5">
                    <div className={`border p-3 rounded-xl ${bg} `}>
                      <p className={`${changeText_color} font-semibold `}>
                        ผู้จ้าง:{" "}
                        <span
                          className={`${theme === "dark" ? "text-white" : "text-black"
                            }`}
                        >
                          {event.Employer || "-"}
                        </span>{" "}
                      </p>
                      <p className={`${changeText_color} font-semibold `}>
                        เบอร์ติดต่อ:{" "}
                        <span
                          className={`${theme === "dark" ? "text-white" : "text-black"
                            }`}
                        >
                          {event.Contact_number || "-"}
                        </span>
                      </p>
                      <p className={`${changeText_color} font-semibold `}>
                        สถานะงาน:{" "}
                        <span
                          className={`${theme === "dark" ? "text-white" : "text-black"
                            }`}
                        >
                          {event.Status || "-"}
                        </span>
                      </p>
                      <p className={`${changeText_color} font-semibold `}>
                        วันเริ่มงาน:{" "}
                        <span
                          className={`${theme === "dark" ? "text-white" : "text-black"
                            }`}
                        >
                          {" "}
                          {event.Date_of_acceptance_of_work
                            ? new Date(
                              event.Date_of_acceptance_of_work
                            ).toLocaleDateString("th-TH")
                            : "-"}
                        </span>
                      </p>
                      <p className={`${changeText_color} font-semibold `}>
                        วันกําหนดส่งงาน:{" "}
                        <span
                          className={`${theme === "dark" ? "text-white" : "text-black"
                            }`}
                        >
                          {event.Closing_date
                            ? new Date(event.Closing_date).toLocaleDateString(
                              "th-TH"
                            )
                            : "-"}
                        </span>
                      </p>
                    </div>

                    <div className={`border p-3 rounded-xl ${bg}`}>
                      <p
                        className={`text-lg mb-1 font-semibold  ${changeText_color}`}
                      >
                        รายละเอียดงาน
                      </p>
                      <p className="text-ellipsis scrollbar-hide  h-20 overflow-auto">
                        {event.description || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              );
          })}

          <div className="grid grid-cols-5 gap-4 mt-3">
            <div className={`  col-span-2  `}>
              <div
                className={`w-full h-80 mb-2 p-5 rounded-2xl border bg-red ${bg}`}
              >
                <div
                  className={` items-center ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
                    } mb-3 border-b pb-3 flex justify-between`}
                >
                  <p className="text-xl font-semibold">รายชื่อช่าง</p>
                  <button
                    onClick={openModal}
                    className={`border p-1 group relative flex items-center cursor-pointer overflow-hidden rounded-md px-4 font-medium text-white transition duration-300 ${theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                      }`}
                  >
                    + เพิ่มช่าง
                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] pointer-events-none">
                      <div className="relative h-full w-8 bg-white/50"></div>
                    </div>
                  </button>
                </div>
                <div className="overflow-auto scrollbar-hide h-60">
                  {SelectedTradesmen.length > 0 ? (
                    SelectedTradesmen.map((event, index) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                      >
                        <div
                          className={`items-center border p-1 my-2 rounded-xl ${theme === "dark"
                            ? "bg-gray-800"
                            : "shadow-sm bg-gray-50"
                            }`}
                        >
                          <div className="items-center justify-between flex">
                            <p
                              className={`${titleColor} text-sm pl-2 font-semibold`}
                            >
                              นาย :{" "}
                              <span
                                className={`${theme === "dark" ? "text-white" : "text-black"
                                  }`}
                              >
                                {event.Name}
                              </span>
                            </p>
                            <button
                              onClick={() => openPopUpDate(event._id)}
                              className={`relative items-center overflow-hidden cursor-pointer rounded-md px-4 py-1  text-sm duration-300 
             [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
             active:translate-y-1 active:scale-x-110 active:scale-y-90`}
                            >
                              <RiDeleteBin5Line fontSize={20} />
                            </button>
                          </div>
                          <div className="flex gap-2 items-center">
                            <img
                              className="w-12 h-12 rounded-full object-cover"
                              src={
                                event.Profile
                                  ? `http://localhost:5000/uploads/Profile/${event.Profile}`
                                  : "/default-profile.png"
                              }
                              alt="รูปผู้ขอเบิก"
                            />
                            <div className="text-sm flex flex-col">
                              <p
                                className={`font-semibold ${theme === "dark" ? "text-white" : "text-black"
                                  }`}
                              >
                                <div>
                                  <span
                                    className={` font-extrabold ${theme === "dark"
                                      ? "text-yellow-500"
                                      : "text-blue-500"
                                      }`}
                                  >
                                    ตำแหน่ง :
                                  </span>{" "}
                                  {{
                                    admin: "แอดมิน",
                                    user: "ช่าง",
                                    chief: "หัวหน้าช่าง",
                                    staff: "พนักงาน",
                                  }[event.role] || event.role}
                                  <span> สายงาน {event.Position}</span>
                                </div>
                                <span className={`${titleColor} font-semibold`}>
                                  เบอร์ติดต่อ :
                                </span>{" "}
                                {event.Phone_Number}
                              </p>
                              <p
                                className={`font-semibold ${theme === "dark" ? "text-white" : "text-black"
                                  }`}
                              >
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p>ยังไม่มีช่างในงานนี่</p>
                  )}
                </div>
              </div>
              <div className={`w-full h-90 mb-1 p-3 rounded-2xl border ${bg}`}>
                <div
                  className={`${theme === "dark" ? "text-yellow-500" : "text-blue-500"
                    } text-xl font-semibold mb-3 border-b pb-3`}
                >
                  รายการ / เบิกของ / ปิดงาน
                </div>
                <div>
                  <div className=" overflow-auto h-70 w-full scrollbar-hide">
                    {requisitionItems
                      .sort((a, b) => {
                        const dateA = a.createdAt
                          ? new Date(a.createdAt).getTime()
                          : 0;
                        const dateB = b.createdAt
                          ? new Date(b.createdAt).getTime()
                          : 0;

                        return dateB - dateA; // ใหม่ → เก่า
                      })
                      .map((e, index) => (
                        <motion.div
                          key={e.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.2 * index,
                            ease: "easeOut",
                          }}
                          className={`items-center border p-2 mb-2 rounded-xl ${theme === "dark"
                            ? "bg-gray-800"
                            : "shadow-sm bg-gray-50"
                            }`}
                        >
                          {/* {e.Status === "เสร็จสิ้น" && (
                            <p className="pl-2 text-sm font-semibold text-green-500">
                              ได้รับการอนุมัติปิดงานเเล้ว
                            </p>
                          )} */}
                          {dataEmployees.map((e, i) => {
                            return (
                              e.Status === "เสร็จสิ้น" && (
                                <div
                                  key={i}
                                  className="pl-2 text-sm font-semibold text-green-500"
                                >
                                  ได้รับการอนุมัติปิดงานเเล้ว
                                </div>
                              )
                            );
                          })}
                          <div className="flex  justify-between">

                            <p
                              className={`text-sm pl-2 truncate  w-120 font-semibold ${titleColor}`}
                            >
                              {e.section} :
                              <span
                                className={`${theme === "dark" ? "text-white" : "text-black"
                                  }`}
                              >
                                {" "}
                                <span
                                  className={`${e.status === "ไม่อนุมัติ"
                                    ? "text-red-500"
                                    : ""
                                    } ${e.status === "รอดําเนินการ"
                                      ? "text-orange-500"
                                      : ""
                                    } ${e.status === "อนุมัติเเล้วรอการติดต่อคลัง"
                                      ? "text-green-500"
                                      : ""
                                    } ${e.status === "ได้รับการยืนยันจากคลังแล้ว"
                                      ? "text-green-500"
                                      : ""
                                    } ${e.status === "รอการอนุมัติ"
                                      ? "text-orange-500"
                                      : ""
                                    }`}
                                >
                                  {e.status}
                                </span>
                                {e.description?.trim() && (
                                  <span className="pl-1">
                                    หมายเหตุ:{" "}
                                    <span
                                      className={`${theme === "dark"
                                        ? "text-white"
                                        : "text-black"
                                        }`}
                                    >
                                      {e.description}
                                    </span>
                                  </span>
                                )}
                              </span>
                            </p>
                            {e.status !== "เสร็จสิ้น" && (
                              <button
                                onClick={() => openPopupMessage(e.id)}
                                className={`relative overflow-hidden cursor-pointer ${text_color} rounded-md text-sm duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90`}
                              >
                                <TiMessage size={24} />
                              </button>
                            )}
                          </div>
                          <div className="flex gap-2 items-center">
                            <img
                              className="w-12 h-12 rounded-full object-cover"
                              src={
                                e.requesterProfile
                                  ? `http://localhost:5000/uploads/Profile/${e.requesterProfile}`
                                  : "/default-profile.png"
                              }
                              alt="รูปผู้ขอเบิก"
                            />
                            <div className="">
                              <div className="text-sm  gap-1">
                                <p
                                  className={`font-semibold ${theme === "dark"
                                    ? "text-white"
                                    : "text-black"
                                    }`}
                                >
                                  <span
                                    className={`font-semibold ${titleColor}`}
                                  >
                                    {" "}
                                    {e.role}{" "}
                                  </span>
                                  นาย : {e.requesterName}
                                </p>
                                <p
                                  className={`truncate w-120 flex gap-2 font-semibold  ${text_color}`}
                                >
                                  <span
                                    className={`font-semibold  ${titleColor}`}
                                  >
                                    รายงาน:
                                  </span>{" "}
                                  {e.name}
                                  <p className="font-semibold ">
                                    {" "}
                                    <span
                                      className={`${titleColor} font-semibold`}
                                    >
                                      {" "}
                                      จํานวน :{" "}
                                    </span>
                                    {e.quantity}
                                  </p>
                                </p>
                                <p
                                  className={` font-semibold  ${theme === "dark"
                                    ? "text-white"
                                    : "text-black"
                                    }`}
                                >
                                  <span
                                    className={`${titleColor} font-semibold `}
                                  >
                                    วันที่ :{" "}
                                  </span>
                                  {e.createdAt
                                    ? new Date(e.createdAt).toLocaleString(
                                      "th-TH",
                                      {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                      }
                                    )
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    {requisitionItems.length === 0 && (
                      <p className={` pl-2 ${text_color}`}>
                        ยังไม่มีรายขอการเบิกของ
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* เเผนที่ */}
            <div
              className={`border py-3 px-4 col-span-3 ${bg} z-0 rounded-2xl border`}
            >
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
            className={`fixed inset-0 duration-100 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 ${duplicateFade ? "opacity-100" : "opacity-0"
              }`}
          >
            <div
              className={`rounded-2xl shadow-2xl p-8 w-[400px] border ${theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
            >
              <div className="flex items-center">
                <p className="flex gap-1">
                  ช่าง{" "}
                  <span
                    className={`${theme === "dark" ? "text-yellow-500" : "text-blue-500"
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
              className={`rounded-2xl w-[900px] h-200 shadow-2xl border ${theme === "dark" ? "bg-gray-800" : "bg-white"
                } ${modalFade ? "opacity-100 " : "scale-90 opacity-0"} `}
            >
              {" "}
              <div className="flex justify-between border-b px-6 py-4 ">
                <p
                  className={` text-2xl  font-semibold  ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
                    }`}
                >
                  เพิ่มช่าง
                  <span
                    className={`${theme === "dark" ? "text-white" : "text-yellow-500"
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
                    placeholder="ค้นหาชื่อช่าง..."
                    value={Search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    type="text"
                    className={`border rounded-xl pl-10 pr-3 duration-300 transition-all focus:outline-none focus:ring-2 py-1 
                              ${focused
                        ? "w-72 shadow-lg"
                        : "w-60 border-gray-300"
                      }  
                              ${theme === "dark"
                        ? "border-gray-600 focus:ring-yellow-500 bg-gray-700 text-white"
                        : " focus:ring-blue-400 bg-white text-gray-800"
                      }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-8 py-3 border-b mb-3 gap-5 px-6">
                {[
                  { name: "ทั้งหมด" },
                  { name: "หัวหน้าช่าง" },
                  { name: "ช่าง" },
                  { name: "ฝ่ายช่วยเหลือ" },
                  { name: "เครือข่าย" },
                  { name: "ผู้ดูแลระบบ" },
                  { name: "สนับสนุนไอที" },
                  { name: "ช่างเทคนิค" },
                ].map((dept) => (
                  <div key={dept.name} className="">
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setSelectedPosition(dept.name)}
                    >
                      <p
                        className={`truncate cursor-pointer relative w-fit mx-auto after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full
                after:origin-bottom after:scale-x-0 ${theme === "dark" ? "after:bg-yellow-500" : "after:bg-blue-500"
                          } after:transition-transform after:duration-500
                after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100
                ${selectedPosition === dept.name ? titleColor : ""}`}
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
                      t.Name && // ต้องมีชื่อก่อน
                      (t.role === "chief" || t.role === "user") && // <<--- ให้แสดงแค่หัวหน้า + ช่าง
                      ((t.role === "chief" &&
                        selectedPosition === "หัวหน้าช่าง") ||
                        (t.role === "user" && selectedPosition === "ช่าง") ||
                        selectedPosition === "ทั้งหมด" ||
                        selectedPosition === "" ||
                        t.Position === selectedPosition) &&
                      t.Name.toLowerCase().includes(
                        (Search || "").toLowerCase()
                      )
                      || t.Position.toLowerCase().includes(Search || '')
                  )

                  .sort(
                    (a, b) => (jobCounts[a._id] ?? 0) - (jobCounts[b._id] ?? 0)
                  )
                  .map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <div
                        key={index}
                        className={`flex my-2 py-1 justify-between shadow-sm  px-5 rounded-xl ${theme === "dark" ? "bg-gray-900" : "bg-white"
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
                              className={`text-lg font-extrabold ${theme === "dark"
                                ? "text-yellow-500"
                                : "text-blue-500"
                                }`}
                            >
                              นาย :{" "}
                              <span
                                className={`${theme === "dark" ? "text-white" : "text-black"
                                  }`}
                              >
                                {" "}
                                {event.Name}
                              </span>
                            </h2>
                            <p
                              className={`text-sm ${theme === "dark" ? "text-white" : "text-black"
                                }`}
                            >
                              <span
                                className={` font-extrabold ${theme === "dark"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                                  }`}
                              >
                                ตำแหน่ง :
                              </span>{" "}
                              {{
                                admin: "แอดมิน",
                                user: "ช่าง",
                                chief: "หัวหน้าช่าง",
                                staff: "พนักงาน",
                              }[event.role] || event.role}
                              <span> สายงาน {event.Position}</span>
                            </p>{" "}
                            <p
                              className={`text-sm ${theme === "dark" ? "text-white" : "text-black"
                                }`}
                            >
                              {" "}
                              <span
                                className={` font-extrabold ${theme === "dark"
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
                                className={`text-sm ${theme === "dark" ? "text-white" : "text-black"
                                  }`}
                              >
                                <span
                                  className={`font-extrabold ${theme === "dark"
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
     active:translate-y-1 active:scale-x-110 active:scale-y-90  ${theme === "dark"
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
                className={`flex justify-end  border-t p-4 ${theme === "dark" ? "border-gray-700" : "border-gray-200"
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
            className={`fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${fadeMap ? "opacity-100" : "opacity-0"
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
      {PopUpDate && selectedTradesmanId && (
        <div
          className={`fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${duplicateFade
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
            }`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`rounded-2xl shadow-2xl ${theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-5 h-100 w-120  flex flex-col `}
          >
            <h2 className={` text-lg font-semibold text-red-500 mb-4 `}>
              ยืนยันการลบ
            </h2>

            {/* รูปช่าง */}
            <div className="mx-auto h-70 mb-5">
              <img
                className="border rounded-full mx-auto object-cover mb-5 bg-yellow-500 w-35 h-35"
                src={
                  SelectedTradesmen.find((t) => t._id === selectedTradesmanId)
                    ?.Profile
                    ? `http://localhost:5000/uploads/Profile/${SelectedTradesmen.find(
                      (t) => t._id === selectedTradesmanId
                    )?.Profile
                    }`
                    : "/default-profile.png"
                }
                alt="รูปช่าง"
              />
              <div className="w-fit  text-light ">
                {" "}
                <p>
                  ID :
                  <span>
                    {" "}
                    {SelectedTradesmen.find(
                      (t) => t._id === selectedTradesmanId
                    )?.id || "-"}
                  </span>
                </p>
                <p>
                  นาย :
                  <span>
                    {" "}
                    {SelectedTradesmen.find(
                      (t) => t._id === selectedTradesmanId
                    )?.Name || "-"}
                  </span>
                </p>
                <p>
                  เบอร์ติดต่อ :
                  <span>
                    {" "}
                    {SelectedTradesmen.find(
                      (t) => t._id === selectedTradesmanId
                    )?.Phone_Number || "-"}
                  </span>
                </p>
                <p>
                  สายงาน :
                  <span>
                    {" "}
                    {SelectedTradesmen.find(
                      (t) => t._id === selectedTradesmanId
                    )?.Position || "-"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end border-t pt-4">
              <button
                onClick={closePopUpDate}
                className="group relative py-1 overflow-hidden rounded-lg cursor-pointer border bg-white px-4  text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
              >
                <span className="relative z-10">ยกเลิก</span>
                <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                  <span className="absolute left-0 top-0 w-0 h-full bg-gray-200  transition-all duration-500 group-hover:w-full"></span>
                </span>
              </button>
              <button
                onClick={async () => {
                  await handeDelete(selectedTradesmanId);
                  closePopUpDate();
                }}
                className="group relative py-1  overflow-hidden rounded-lg cursor-pointer border bg-red-500 text-white px-4 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
              >
                <span className="relative z-10">ยืนยัน</span>
                <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                  <span className="absolute left-0 top-0 w-0 h-full bg-red-600  transition-all duration-500 group-hover:w-full"></span>
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {PopupMessage && selectedTradesmanId && (
        <div
          className={`fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${duplicateFade ? "opacity-100 " : "opacity-0 "
            }`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`${bgpopup} rounded-2xl shadow-2xl p-6 w-[500px] max-h-[400px] overflow-auto`}
          >
            {/** หาข้อมูลจาก requisitionItems โดยใช้ id */}
            {(() => {
              const item = requisitionItems.find(
                (i) =>
                  i.id === selectedTradesmanId || i._id === selectedTradesmanId
              );
              if (!item)
                return <p className="text-center text-gray-500">ไม่พบข้อมูล</p>;
              return (
                <div className="flex flex-col gap-3">
                  <h2 className={` font-semibold text-xl  ${titleColor} `}>
                    รายละเอียดรายการ
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <p>
                        <span className={` font-semibold  ${titleColor} `}>
                          ชื่อผู้ขอเบิก:{" "}
                        </span>
                        {item.requesterName}
                      </p>
                      <p>
                        <span className={`font-semibold  ${titleColor} `}>
                          {" "}
                          ของที่เบิก:{" "}
                        </span>
                        {item.name}
                      </p>
                      <p className="gap-2 flex">
                        <span className={`font-semibold  ${titleColor} `}>
                          {" "}
                          จำนวน:{" "}
                        </span>
                        {item.quantity}
                        <span>รายการ</span>
                      </p>
                      <p>
                        <span className={` font-semibold  ${titleColor} `}>
                          {" "}
                          หมายเหตุ:{" "}
                        </span>
                        {item.description || "-"}
                      </p>
                      <p>
                        <span className={`font-semibold  ${titleColor} `}>
                          {" "}
                          วันที่ขอเบิก:{" "}
                        </span>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString("th-TH", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="border-t">
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={colsePopupMessage}
                        className="group relative py-1  overflow-hidden rounded-lg cursor-pointer border bg-white px-4  text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                      >
                        <span className="relative z-10">ยกเลิก</span>
                        <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                          <span className="absolute left-0 top-0 w-0 h-full bg-gray-200  transition-all duration-500 group-hover:w-full"></span>
                        </span>
                      </button>

                      {item.status !== "อนุมัติเเล้วรอการติดต่อคลัง" &&
                        item.status !== "ไม่อนุมัติ" && (
                          <>
                            <button
                              onClick={() => openPopupNotApproved(item.id)}
                              className={`group relative py-1 bg-red-500 overflow-hidden rounded-lg border cursor-pointer px-4  text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95`}
                            >
                              <span className="relative z-10">ไม่อนุมัติ</span>
                              <span className="absolute inset-0 overflow-hidden pointer-events-none">
                                <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20 transition-all duration-500 group-hover:w-full"></span>
                              </span>
                            </button>
                            <button
                              onClick={() => handleApprove(item.id)}
                              className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4 text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${theme === "dark"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                                }`}
                            >
                              <span className="relative z-10">อนุมัติ</span>
                              <span className="absolute inset-0 overflow-hidden pointer-events-none">
                                <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20 transition-all duration-500 group-hover:w-full"></span>
                              </span>
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      )}

      {PopupNotApproved && selectedItemId && (
        <div>
          {(() => {
            const item = requisitionItems.find((i) => i.id === selectedItemId);
            if (!item)
              return <p className="text-center text-gray-500">ไม่พบข้อมูล</p>;
            return (
              <div
                className={`${duplicateFade ? "opacity-100" : "opacity-0"
                  } duration-300 inset-0 fixed flex items-center justify-center bg-black/40 backdrop-blur-sm z-50`}
              >
                <div
                  className={`rounded-2xl shadow-2xl p-5 w-120 h-90 overflow-y-auto transform transition-all duration-300 ${duplicateFade
                    ? "scale-100 opacity-100"
                    : "scale-90 opacity-0"
                    } ${theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                    }`}
                >
                  {" "}
                  <div className="flex items-center gap-1">
                    {" "}
                    <p
                      className={`font-semibold text-lg ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
                        }`}
                    >
                      รายการ :
                    </p>
                    <span>{item.name}</span>
                    <p
                      className={`font-semibold text-lg ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
                        }`}
                    >
                      จํานวน :
                    </p>
                    <span>{item.quantity}</span>
                  </div>
                  <div
                    className={`p-3 my-4 rounded-lg text-sm ${theme === "dark"
                      ? "bg-red-900/30 text-red-300"
                      : "bg-red-100 text-red-600"
                      }`}
                  >
                    หมายเหตุ: ข้อความที่ถูกส่งไปแล้วจะถูกส่งกลับไปให้ช่างทันที
                    หลังจากส่งแล้ว **ไม่สามารถแก้ไขได้**
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium">
                      กรุณาระบุเหตุผลที่ต้องการลบงานนี้:
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="พิมพ์เหตุผลที่ต้องการลบ..."
                      className={`border rounded-lg p-3 h-28 outline-none transition ${theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                        }`}
                    />
                  </div>
                  <div className="flex gap-2 justify-end mt-5">
                    <button
                      onClick={closePopupMessage}
                      className="group relative overflow-hidden rounded-lg cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                    >
                      <span className="relative z-10">ยกเลิก</span>
                      <span className="absolute inset-0 overflow-hidden pointer-events-none">
                        <span className="absolute left-0 top-0 w-0 h-full bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
                      </span>
                    </button>

                    <button
                      onClick={() => handleReject(item.id)}
                      className="group py-1 relative overflow-hidden rounded-lg cursor-pointer border bg-red-500 text-white px-4 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                    >
                      <span className="relative z-10">ยืนยัน</span>
                      <span className="absolute inset-0 overflow-hidden pointer-events-none">
                        <span className="absolute left-0 top-0 w-0 h-full bg-red-600 transition-all duration-500 group-hover:w-full"></span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

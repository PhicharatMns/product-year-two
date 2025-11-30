import { useTheme } from "@/components/theme-provider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TiMessage } from "react-icons/ti";

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

interface Employee {
  _id: string;
  Worksheet?: string;
  Supervisor?: string;
  PhoneNumber?: string;
  Date_of_acceptance_of_work?: string;
  Closing_date?: string;
  description?: string;
  address?: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  Status?: string;
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

// 🔹 RoutingMachine Component (เร็วขึ้น)
const RoutingMachine = ({
  userPos,
  jobPos,
}: {
  userPos: [number, number];
  jobPos: [number, number];
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(userPos[0], userPos[1]),
        L.latLng(jobPos[0], jobPos[1]),
      ],
      lineOptions: { styles: [{ color: "orange", weight: 6, opacity: 0.8 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      createMarker: (i: number, wp: any) => {
        const iconUrl =
          i === 0
            ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png"
            : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png";
        return L.marker(wp.latLng, {
          icon: L.icon({
            iconUrl,
            iconSize: [30, 45],
            iconAnchor: [15, 45],
            popupAnchor: [0, -40],
          }),
        }).bindPopup(i === 0 ? "ตำแหน่งของคุณ" : "ตำแหน่งงาน");
      },
    }).addTo(map);

    // fitBounds แค่ครั้งเดียวหลัง routing พร้อม
    routingControl.on("routesfound", () => {
      if (!map._fitDone) {
        const bounds = L.latLngBounds([userPos, jobPos]);
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 10 });
        map._fitDone = true;
      }
    });

    return () => map.removeControl(routingControl);
  }, [map, userPos, jobPos]);

  return null;
};

// 🔹 แยก Map Component
const JobMap = ({
  markerPos,
  userPos,
  jobWorksheet,
}: {
  markerPos: [number, number];
  userPos: [number, number];
  jobWorksheet?: string;
}) => {
  return (
    <MapContainer
      center={markerPos}
      zoom={15}
      className="w-full h-155 z-0 rounded-lg"
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
          {jobWorksheet || "ชื่องาน"}
        </Tooltip>
      </Marker>
      <Marker
        position={userPos}
        icon={L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}
      >
        <Tooltip permanent direction="top" offset={[0, -40]}>
          ตำแหน่งคุณ
        </Tooltip>
      </Marker>
      <RoutingMachine userPos={userPos} jobPos={markerPos} />
    </MapContainer>
  );
};

// 🔹 Main Component
export default function DetailworkChief() {
  const { theme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [Mobiles, setMobled] = useState(false);
  const [modalFade, setModalFade] = useState(false);
  const [focused, setFocused] = useState(false);
  const [Search, setSearch] = useState<string>(""); //   string
  const [selectedPosition, setSelectedPosition] = useState<string>("ทั้งหมด");
  const [dataTradesman, setDataTradesman] = useState<Tradesman[]>([]);
  const [jobCounts] = useState<{ [key: string]: number }>({});
  const [SelectedTradesmen, setSelectedTradesmen] = useState<Tradesman[]>([]);
  const [duplicateTradesman, setDuplicateTradesman] =
    useState<Tradesman | null>(null);
  const [showOpenaddTradesman, setshowOpenaddTradesman] = useState(false);
  const [duplicateFade, setDuplicateFade] = useState(false);
  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>(
    []
  );
  const [PopUpDate, setPopUpDate] = useState(false);
  const [selectedTradesmanId, setSelectedTradesmanId] = useState<string | null>(
    null
  );
  const [PopupMessage, setPopupMessage] = useState(false);
  const [PopupNotApproved, setPopupNotApproved] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm bg-white";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const text_color = theme === "dark" ? "text-white" : "text-black";
  const borderSoft = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const titleColor = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const bgpopup = theme === "dark" ? "bg-gray-800" : " shadow-sm bg-white";

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

  //  โหลดข้อมูล + ตำแหน่ง
  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const [res, position] = await Promise.all([
          fetch("http://localhost:5000/api/employees"),
          new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }),
        ]);

        const data: Employee[] = await res.json();
        const selected = data.find((emp) => emp._id === id);
        setJob(selected || null);

        if (selected?.address?.coordinates) {
          const [lng, lat] = selected.address.coordinates;
          setMarkerPos([lat, lng]);
        } else {
          setMarkerPos([13.7563, 100.5018]);
        }

        setUserPos([position.coords.latitude, position.coords.longitude]);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const openshowOpenaddTradesman = () => {
    setDuplicateFade(true);
    setTimeout(() => setshowOpenaddTradesman(true), 50);
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

  const handleAddTradesman = async (tradesman: Tradesman) => {
    try {
      // ตรวจสอบ role
      if (tradesman.Position !== "user" && tradesman.role !== "user") {
        alert("สามารถเพิ่มได้เฉพาะช่างที่เป็น user เท่านั้น");
        return;
      }

      // ตรวจสอบซ้ำ
      const isDuplicate = SelectedTradesmen.some((t) => t.id === tradesman._id);
      if (isDuplicate) {
        setDuplicateTradesman(tradesman);
        openshowOpenaddTradesman(); // เปิด modal เตือน
        return;
      }

      // ดึงข้อมูลงาน
      const worksheetName = job?.Worksheet || "ไม่ระบุชื่องาน";
      const workDay = job?.Date_of_acceptance_of_work || "ไม่ระบุวันเริ่มงาน";
      const closingDay = job?.Closing_date || "ไม่ระบุวันปิดงาน";

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
      };

      const res = await fetch("http://localhost:5000/api/otherTradesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("ไม่สามารถเพิ่มข้อมูลได้");

      await fetchOtherTradesman(); // โหลดข้อมูลใหม่หลัง POST สำเร็จ
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
    }
  };

  const closeModal = () => {
    setModalFade(false);
    setTimeout(() => setMobled(false), 300); // รอให้ fade out เสร็จก่อนปิดจริง
  };

  const classhowOpenaddTradesman = () => {
    setDuplicateFade(false);
    setTimeout(() => setshowOpenaddTradesman(false), 300);
  };

  //  ดึงข้อมูล otherTradesman เฉพาะของงานนี้
  const fetchOtherTradesman = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/otherTradesman/${id}`);
      const data: Tradesman[] = await res.json();
      console.log(" ช่างที่โหลดมา:", data);
      setSelectedTradesmen(data);
    } catch (err) {
      console.error("โหลด otherTradesman ล้มเหลว:", err);
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

  useEffect(() => {
    fetchTradesman();
    fetchRequisitionItems();
    fetchOtherTradesman(); // โหลดช่างที่เกี่ยวข้องทันทีหลังได้ job
  }, []);

  if (!job) return <div></div>;

  return (
    <div className={`w-max-380 p-5 mx-auto container duration-300  ${text}`}>
      <div>
        <div className="text-3xl font-bold flex gap-2">
          <p className={`${titleColor}`}>รายละเอียดงาน :</p>
          <span
            className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}
          >
            {job.Worksheet}
          </span>
        </div>

        {/* ข้อมูลงาน */}
        <div className="mt-5 transition-all  rounded-2xl">
          <div className="grid grid-cols-2 gap-5">
            <div className={`border p-3 rounded-xl ${bg}`}>
              <p className={`${titleColor} font-semibold`}>
                ระยะเวลาในการนําเนินงาน
              </p>
              <p className={`${titleColor} font-semibold `}>
                สถานะงาน:{" "}
                <span
                  className={`${theme === "dark" ? "text-white" : "text-black"
                    }`}
                >
                  {job.Status || "-"}
                </span>
              </p>
              <p className={`${titleColor} font-semibold`}>
                วันเริ่มงาน:
                <span
                  className={`${theme === "dark" ? "text-white" : "text-black"
                    }`}
                >
                  {job.Date_of_acceptance_of_work
                    ? new Date(
                      job.Date_of_acceptance_of_work
                    ).toLocaleDateString("th-TH")
                    : "-"}
                </span>
              </p>
              <p className={`${titleColor} font-semibold`}>
                วันปิดงาน:{" "}
                <span
                  className={`${theme === "dark" ? "text-white" : "text-black"
                    }`}
                >
                  {job.Closing_date
                    ? new Date(job.Closing_date).toLocaleDateString("th-TH")
                    : "-"}
                </span>
              </p>
            </div>

            <div className={`border p-3 rounded-xl ${bg}`}>
              <p className={`text-lg mb-1 font-semibold ${titleColor}`}>
                รายละเอียดงาน
              </p>
              <p className=" h-17 overflow-auto scrollbar-hide">
                {job.description || "-"}
              </p>
            </div>
          </div>

          {/* แผนที่ */}
          <div className="grid grid-cols-5 gap-4 mt-3">
            <div className="col-span-2">
              <div
                className={`w-full h-80 mb-1 p-3 rounded-2xl border ${bg} ${borderSoft} text-gray-600`}
              >
                <div
                  className={`${theme === "dark" ? "text-yellow-500" : "text-blue-500"
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
                  {SelectedTradesmen.filter(
                    (event) => event.role?.toLowerCase() === "user"
                  ).length > 0 ? (
                    SelectedTradesmen.filter(
                      (event) => event.role?.toLowerCase() === "user"
                    ).map((event, index) => (
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
                              className={`relative ${text_color} overflow-hidden cursor-pointer rounded-md px-4 py-1  text-sm duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90`}
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
                            <div className="text-sm flex flex-col gap-1">
                              <p
                                className={` font-semibold ${theme === "dark" ? "text-white" : "text-black"
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

              <div
                className={`w-full h-90 p-3 mt-3 rounded-2xl border ${bg} ${borderSoft} text-gray-600`}
              >
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
                          {job.Status === "เสร็จสิ้น" && (
                            <div className="pl-2 text-sm font-semibold text-green-500">
                              ได้รับการอนุมัติปิดงานเเล้ว
                            </div>
                          )}

                          <div className="flex  justify-between">
                            {" "}
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
                                    : e.status === "รอดําเนินการ"
                                      ? "text-orange-500"
                                      : e.status ===
                                        "อนุมัติเเล้วรอการติดต่อคลัง"
                                        ? "text-yellow-500"
                                        : e.status ===
                                          "ได้รับการยืนยันจากคลังแล้ว"
                                          ? "text-green-500"
                                          : e.status === "เสร็จสิ้น"
                                            ? "text-green-600"
                                            : e.status === "รอการอนุมัติ"
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
                            {e.status !== "เสร็จสิ้น" && e.role !== "chief" && e.section !== 'ปิดงาน' && (
                              <button
                                onClick={() => openPopupMessage(e.id)}
                                className={`relative overflow-hidden cursor-pointer ${text_color} rounded-md text-sm duration-300 
      [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)]
      active:translate-y-1 active:scale-x-110 active:scale-y-90`}
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
                                  {e.section !== 'ปิดงาน' && (
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
                                  )}
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
            <div
              className={`border py-3 px-4 col-span-3 rounded-2xl h-fulls ${bg}`}
            >
              <h2 className={`text-xl font-semibold mb-3 ${titleColor}`}>
                แผนที่งาน
              </h2>
              {loading || !markerPos || !userPos ? (
                <div className="w-full  rounded-lg bg-gray-200 animate-pulse"></div>
              ) : (
                <JobMap
                  markerPos={markerPos}
                  userPos={userPos}
                  jobWorksheet={job.Worksheet}
                />
              )}
            </div>
          </div>
        </div>
      </div>
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
                  placeholder="ค้นหาใบงาน..."
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
                { name: "ไฟฟ้า" },
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
                    (t.Position === "user" || t.role === "user") &&
                    (selectedPosition === "ทั้งหมด" ||
                      t.Position === selectedPosition) &&
                    (t.Name ?? "")
                      .toLowerCase()
                      .includes((Search ?? "").toLowerCase())
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
                      className={`flex my-2 py-1 justify-between shadow-sm  px-5 rounded-xl ${theme === "dark"
                        ? "bg-gray-900"
                        : "bg-gray-100/50 border"
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
                          ></p>{" "}
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

      {/* เตือนก่อนลบ */}
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
            className={` ${theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-2xl  p-5 h-100 w-120  flex flex-col `}
          >
            <h2 className="text-lg font-semibold text-red-500 mb-4">
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
                        item.status !== "ไม่อนุมัติ" &&
                        item.status !== 'ได้รับการยืนยันจากคลังแล้ว' &&

                        (
                          <>
                            <button
                              onClick={() => openPopupNotApproved(item.id)}
                              // onClick={() => handleReject(item.id)}
                              className={`group relative py-1 bg-red-500 overflow-hidden rounded-lg border cursor-pointer px-4  text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95
                      `}
                            >
                              <span className="relative z-10">ไม่อนุมัติ</span>
                              <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                                <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20  transition-all duration-500 group-hover:w-full"></span>
                              </span>
                            </button>
                            <button
                              // onClick={colsePopupMessage}
                              onClick={() => handleApprove(item.id)}
                              className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4  text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${theme === "dark"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                                }`}
                            >
                              <span className="relative z-10">อนุมัติ</span>
                              <span className="absolute inset-0 overflow-hidden  pointer-events-none">
                                <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20  transition-all duration-500 group-hover:w-full"></span>
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

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
  const [fade, setFade] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [Mobiles, setMobled] = useState(false);
  const [modalFade, setModalFade] = useState(false);
  const [focused, setFocused] = useState(false);
  const [Search, setSearch] = useState<string>(""); //   string
  const [selectedPosition, setSelectedPosition] = useState<string>("ทั้งหมด");
  const [dataTradesman, setDataTradesman] = useState<Tradesman[]>([]);
  const [jobCounts, setJobCounts] = useState<{ [key: string]: number }>({});
  const [SelectedTradesmen, setSelectedTradesmen] = useState<Tradesman[]>([]);
  const [duplicateTradesman, setDuplicateTradesman] =
    useState<Tradesman | null>(null);

  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const text_color = theme === "dark" ? "text-white" : "text-black";
  const borderSoft = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const titleColor = theme === "dark" ? "text-yellow-500" : "text-blue-500";

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
        setFade(true);
      }
    }
    loadData();
  }, [id]);

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
        return;
      }

      const payload = {
        id: tradesman._id,
        Name: tradesman.Name,
        Position: tradesman.Position,
        Phone_Number: tradesman.Phone_Number,
        Profile: tradesman.Profile,
        employeeId: id,
      };

      const res = await fetch("http://localhost:5000/api/otherTradesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("ไม่สามารถเพิ่มข้อมูลได้");

      await fetchOtherTradesman(); //  ต้องเรียกหลัง POST สำเร็จ
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
    }
  };

  const closeModal = () => {
    setModalFade(false);
    setTimeout(() => setMobled(false), 300); // รอให้ fade out เสร็จก่อนปิดจริง
  };

  //  ดึงข้อมูล otherTradesman เฉพาะของงานนี้
  const fetchOtherTradesman = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/otherTradesman/${id}`);
      const data: Tradesman[] = await res.json();
      setSelectedTradesmen(data); //  อัปเดต state ทันที
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

  useEffect(() => {
    fetchTradesman();
    fetchOtherTradesman(); // โหลดช่างที่เกี่ยวข้องทันทีหลังได้ job
  }, []);

  if (!job) return <div></div>;

  return (
    <div className={`w-max-380 p-5 mx-auto container ${text}`}>
      <div
        className={`transition-opacity duration-700 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-3xl font-bold flex gap-2">
          <p className={`${titleColor}`}>รายละเอียดงาน :</p>
          <span
            className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}
          >
            {job.Worksheet}
          </span>
        </div>

        {/* ข้อมูลงาน */}
        <div className="mt-5 transition-all duration-300 rounded-2xl">
          <div className="grid grid-cols-2 gap-5">
            <div className={`border p-3 rounded-xl ${bg}`}>
              <p>หัวหน้างาน: {job.Supervisor || "-"}</p>
              <p>ตำแหน่ง: {"-"}</p>
              <p>เบอร์ติดต่อ: {job.PhoneNumber || "-"}</p>
              <p>
                วันเริ่มงาน:{" "}
                {job.Date_of_acceptance_of_work
                  ? new Date(job.Date_of_acceptance_of_work).toLocaleDateString(
                      "th-TH"
                    )
                  : "-"}
              </p>
              <p>
                วันปิดงาน:{" "}
                {job.Closing_date
                  ? new Date(job.Closing_date).toLocaleDateString("th-TH")
                  : "-"}
              </p>
            </div>

            <div className={`border p-3 rounded-xl ${bg}`}>
              <p className={`text-lg mb-1 font-semibold ${titleColor}`}>
                รายละเอียดงาน
              </p>
              <p className="text-ellipsis">{job.description || "-"}</p>
            </div>
          </div>

          {/* แผนที่ */}
          <div className="grid grid-cols-5 gap-4 mt-3">
            <div className="col-span-2">
              <div
                className={`w-full h-80 mb-1 p-5 rounded-2xl border ${bg} ${borderSoft} text-gray-600`}
              >
                <div
                  className={`${
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
                {SelectedTradesmen.map((t) => (
                  <div key={t._id}>
                    <p>{t.Name}</p>
                  </div>
                ))}
              </div>

              <div
                className={`w-full h-90 p-3 rounded-2xl border ${bg} ${borderSoft} text-gray-600`}
              >
                <div
                  className={`${
                    theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  } text-xl font-semibold mb-3 border-b pb-3`}
                >
                  รายการติดต่อ / เบิกของ
                </div>
                <div>
                  <div
                    className={`items-center border p-1 my-1 rounded-xl ${
                      theme === "dark" ? "bg-gray-800" : "shadow-sm"
                    }`}
                  >
                    <p className={`text-sm pl-2 font-semibold ${titleColor}`}>
                      การขอเบิกของ
                    </p>
                    <div className="flex gap-2">
                      <img
                        className="h-10 w-10 rounded-4xl bg-blue-500"
                        src=""
                        alt=""
                      />
                      <div className="text-sm flex flex-col gap-1">
                        <p className={`${text_color}`}>
                          <span className={`font-semibold ${titleColor}`}>
                            หัวหน้างาน:
                          </span>{" "}
                          ชื่อหัวหน้างาน
                        </p>
                        <p className={`truncate w-120 ${text_color}`}>
                          <span className={`font-semibold ${titleColor}`}>
                            รายละเอียด:
                          </span>{" "}
                          {job.description}
                        </p>
                      </div>
                    </div>
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
                  // value={Search}
                  // onChange={(e) => setSearch(e.target.value)}
                  // onFocus={() => setFocused(true)}
                  // onBlur={() => setFocused(false)}
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
                    // onClick={() => setSelectedPosition(dept.name)}
                  >
                    <p
                      className={`truncate relative w-fit mx-auto after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full
                after:origin-bottom after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-500
                after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100
                ${
                  selectedPosition === dept.name
                    ? "font-bold text-blue-500"
                    : ""
                }`}
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
                    (t.Position === "user" || t.role === "user") && // เฉพาะ Chief
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
    </div>
  );
}

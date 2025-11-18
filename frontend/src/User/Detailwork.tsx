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
import { motion } from "framer-motion";

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
  status?: string;
  reasondescriptionstatus?: string;
}

export default function Detailwork() {
  const { theme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [fade, setFade] = useState(false);
  const [SelectedTradesmen, setSelectedTradesmen] = useState<Tradesman[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>(
    []
  );

  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm bg-white";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const text_color = theme === "dark" ? "text-white" : "text-black";
  const borderSoft = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const titleColor = theme === "dark" ? "text-yellow-500" : "text-blue-500";

  // ดึงข้อมูลช่างทั้งหมด (Tradesman)
  const fetchTradesman = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login/all-tradesman", {
        credentials: "include",
      });
      const data: Tradesman[] = await res.json();
      data;
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

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/employees");
        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
        const data: Employee[] = await res.json();

        const selected = data.find((emp) => emp._id === id);
        setJob(selected || null);

        // ตั้งค่า marker ถ้ามี coordinates
        if (selected?.address?.coordinates) {
          const [lng, lat] = selected.address.coordinates;
          setMarkerPos([lat, lng]);
        } else {
          // fallback ถ้าไม่มีตำแหน่ง
          setMarkerPos([13.7563, 100.5018]); // Bangkok
        }
      } catch (err) {
        console.error(err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

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

  // เริ่ม fade-in หลังจากโหลดเสร็จ
  useEffect(() => {
    if (!loading) {
      fetchTradesman();
      fetchRequisitionItems(); // โหลดรายการเบิกของ
      fetchOtherTradesman();
      const timer = setTimeout(() => setFade(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!job) return <div></div>;

  return (
    <div className={`w-max-380 p-5 mx-auto container 0 ${text}`}>
      <div
        className={`transition-opacity duration-700 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-3xl font-bold flex gap-2">
          <p className={` ${titleColor}`}>รายละเอียดงาน :</p>
          <span
            className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}
          >
            {job.Worksheet}
          </span>
        </div>

        <div className={`mt-5 transition-all duration-300 rounded-2xl`}>
          <div className="grid grid-cols-2 gap-5">
            <div className={`border p-3 rounded-xl font-semibold  ${bg}`}>
              {SelectedTradesmen.map((event, index) => {
                return (
                  <div key={index}>
                    {event.role.toLowerCase() == "chief" && (
                      <div>
                        <div className="flex gap-1 items-center">
                          <p className={` ${titleColor}`}>หัวหน้างาน :</p>{" "}
                          <span>{event.Name}</span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <p className={`${titleColor}`}>เบอร์ติดต่อ:</p>
                          <span> {event.Phone_Number || "-"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="flex gap-1 items-center  ">
                <p className={` ${titleColor}`}>วันเริ่มงาน: </p>
                <span>
                  {" "}
                  {job.Date_of_acceptance_of_work
                    ? new Date(
                        job.Date_of_acceptance_of_work
                      ).toLocaleDateString("th-TH")
                    : "-"}
                </span>
              </div>
              <div className="flex gap-1 items-center ">
                <p className={` ${titleColor}`}>วันปิดงาน: </p>
                <span>
                  {" "}
                  {job.Closing_date
                    ? new Date(job.Closing_date).toLocaleDateString("th-TH")
                    : "-"}
                </span>
              </div>
            </div>

            <div className={`border p-3 rounded-xl ${bg}`}>
              <p className={`text-lg mb-1   ${titleColor}`}>รายละเอียดงาน</p>
              <div className="">
                <p className="  h-17 overflow-auto scrollbar-hide ">
                  {" "}
                  {job.description || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mt-3">
            <div
              className={`w-full p-3 h-174  col-span-2 rounded-2xl border ${bg} ${borderSoft} text-gray-600`}
            >
              <div
                className={`${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                } text-xl font-semibold mb-3 border-b pb-3`}
              >
                รายการติดต่อ / เบิกของ
              </div>

              <div className="h-155  overflow-auto scrollbar-hide">
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
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.05 * index,
                        ease: "easeOut",
                      }}
                      className={`items-center border p-2 my-1 rounded-xl ${
                        theme === "dark" ? "bg-gray-800" : "shadow-sm"
                      }`}
                    >
                      <p className={`text-sm pl-2 font-semibold ${titleColor}`}>
                        {item.section} :
                        <span
                          className={`${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          {" "}
                          สถานะ :{" "}
                          <span
                            className={`${
                              item.status === "ไม่อนุมัติ" ? "text-red-500" : ""
                            } ${
                              item.status === "รอดําเนินการ"
                                ? "text-orange-500"
                                : ""
                            } ${
                              item.status === "อนุมัติ" ? "text-green-500" : ""
                            }`}
                          >
                            {item.status}
                          </span>
                          <span> หมายเหตุ : </span>
                          <span className="text-black">
                            {item.reasondescriptionstatus?.trim()
                              ? item.reasondescriptionstatus
                              : "—"}
                          </span>
                        </span>
                      </p>
                      <div className="flex gap-2 items-center">
                        <img
                          className="w-12 h-12 rounded-full object-cover"
                          src={
                            item.requesterProfile
                              ? `http://localhost:5000/uploads/Profile/${item.requesterProfile}`
                              : "/default-profile.png"
                          }
                          alt="รูปผู้ขอเบิก"
                        />
                        <div className="text-sm flex flex-col gap-1">
                          <p
                            className={`font-semibold ${
                              theme === "dark" ? "text-white" : "text-black"
                            }`}
                          >
                            <span className={`font-semibold ${titleColor}`}>
                              {" "}
                              {item.role}{" "}
                            </span>
                            นาย : {item.requesterName}
                          </p>
                          <p
                            className={`truncate w-120 flex gap-2 font-semibold  ${text_color}`}
                          >
                            <span className={`font-semibold  ${titleColor}`}>
                              รายงาน:
                            </span>{" "}
                            {item.name}
                            <p className="font-semibold ">
                              {" "}
                              <span className={`${titleColor} font-semibold`}>
                                {" "}
                                จํานวน :{" "}
                              </span>
                              {item.quantity}
                            </p>
                          </p>
                          <p
                            className={`font-semibold  ${
                              theme === "dark" ? "text-white" : "text-black"
                            }`}
                          >
                            <span className={`${titleColor} font-semibold `}>
                              วันที่ :{" "}
                            </span>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString(
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
                    </motion.div>
                  ))}
                {requisitionItems.length === 0 && (
                  <p className={`text-sm pl-2 ${text_color}`}>
                    ยังไม่มีรายการเบิกของ
                  </p>
                )}
              </div>
            </div>

            {/* แผนที่*/}
            <div
              className={`border py-3 px-4 col-span-3 rounded-2xl h-175 ${bg}`}
            >
              <h2
                className={`text-xl font-semibold text-blue-500 mb-3 ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                แผนที่งาน
              </h2>
              {loading || !markerPos || !userPos ? (
                <div className="w-full   rounded-lg bg-gray-200 animate-pulse"></div>
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
    </div>
  );
}

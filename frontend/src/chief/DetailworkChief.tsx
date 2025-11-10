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
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
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
      className="w-full h-166 rounded-lg"
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

  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const text_color = theme === "dark" ? "text-white" : "text-black";
  const borderSoft = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const titleColor = theme === "dark" ? "text-yellow-500" : "text-blue-500";

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
                <div></div>
              </div>

              <div
                className={`w-full h-100 p-3 rounded-2xl border ${bg} ${borderSoft} text-gray-600`}
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
                <div className="w-full h-166 rounded-lg bg-gray-200 animate-pulse"></div>
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

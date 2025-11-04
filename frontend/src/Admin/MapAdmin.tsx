import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Circle, useMap, useMapEvents } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import L, { LeafletMouseEvent } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// --- Fix default marker icon ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
});

// --- Custom icons ---
const currentIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const stopIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const tempIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- Geocoding Provider (Global) ---
const provider = new OpenStreetMapProvider();

// --- Types ---
type Stop = {
  pos: [number, number];
  name: string;
  phone: string;
  detail: string;
  area?: number;
};

// Props ที่ Map Component จะรับ
type MapProps = {
  addressToGeocode?: string | null;
  onMarkerSet?: (coords: [number, number]) => void;
};

// --- Routing Components ---
// (StopsRouting และ DestinationRouting เหมือนเดิม)
function StopsRouting({ currentPos, stops }: { currentPos: [number, number] | null; stops: Stop[] }) {
  const map = useMap();
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) { map.removeControl(ref.current); ref.current = null; }
    if (!map || !currentPos || stops.length === 0) return;

    ref.current = L.Routing.control({
      waypoints: [L.latLng(...currentPos), ...stops.map(s => L.latLng(...s.pos))],
      lineOptions: { styles: [{ color: "green", weight: 5, opacity: 0.8 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);

    return () => ref.current && map.removeControl(ref.current);
  }, [currentPos, stops, map]);

  return null;
}

function DestinationRouting({ startPos, destination }: { startPos: [number, number] | null; destination: Stop | null }) {
  const map = useMap();
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) { map.removeControl(ref.current); ref.current = null; }
    if (!map || !startPos || !destination) return;

    ref.current = L.Routing.control({
      waypoints: [L.latLng(...startPos), L.latLng(...destination.pos)],
      lineOptions: { styles: [{ color: "red", weight: 5, opacity: 0.8 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);

    return () => ref.current && map.removeControl(ref.current);
  }, [startPos, destination, map]);

  return null;
}

// --- Map Click Handler Component ---
// (MapClickHandler เหมือนเดิม)
type MapClickHandlerProps = {
  isPinning: boolean;
  stops: Stop[];
  setMapPosition: (pos: [number, number]) => void;
  setIsPinning: (is: boolean) => void;
  setStops: React.Dispatch<React.SetStateAction<Stop[]>>;
};

function MapClickHandler({
  isPinning,
  stops,
  setMapPosition,
  setIsPinning,
  setStops,
}: MapClickHandlerProps) {
  
  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMapPosition(newPos); 

      if (isPinning) {
        const newStop: Stop = {
          pos: newPos,
          name: `จุดแวะ ${stops.length + 1}`,
          phone: "",
          detail: "ปักหมุดจากแผนที่",
          area: 0,
        };
        setStops(p => [...p, newStop]); 
        setIsPinning(false); 
      }
    },
  });

  return null; 
}


// --- Main Map Component ---
export default function MapAdmin({ addressToGeocode, onMarkerSet }: MapProps) {
  const [form, setForm] = useState({ name: "", phone: "", location: "", detail: "", area: "" });
  const [formMode, setFormMode] = useState<'stop' | 'destination'>('stop');
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [destination, setDestination] = useState<Stop | null>(null);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);
  const [isPinning, setIsPinning] = useState(false);

  const mapRef = useRef<L.Map | null>(null);

  // --- 1. Load from localStorage (จาก "Beta") ---
  useEffect(() => {
    const savedStops = localStorage.getItem("stops");
    const savedDest = localStorage.getItem("destination");
    const savedCurrent = localStorage.getItem("currentPos"); // <-- โหลดตำแหน่งปัจจุบันด้วย

    try {
      if (savedStops) setStops(JSON.parse(savedStops));
      if (savedDest) setDestination(JSON.parse(savedDest));
      if (savedCurrent) setCurrentPos(JSON.parse(savedCurrent)); // <-- ตั้งค่าตำแหน่ง
    } catch (error) {
      console.error("Error parsing data from localStorage", error);
      // Clear corrupted data
      localStorage.removeItem("stops");
      localStorage.removeItem("destination");
      localStorage.removeItem("currentPos");
    }
  }, []);

  // --- 2. Save to localStorage (จาก "Beta") ---
  useEffect(() => { 
    // ถ้า stops ว่าง, ให้ลบ key ออก / ถ้ามี, ให้บันทึก
    stops.length > 0 
      ? localStorage.setItem("stops", JSON.stringify(stops)) 
      : localStorage.removeItem("stops");
  }, [stops]);

  useEffect(() => {
    // ถ้า destination ว่าง, ให้ลบ key ออก / ถ้ามี, ให้บันทึก
    destination 
      ? localStorage.setItem("destination", JSON.stringify(destination)) 
      : localStorage.removeItem("destination");
  }, [destination]);

  useEffect(() => { 
    // บันทึกตำแหน่งปัจจุบัน
    if(currentPos) localStorage.setItem("currentPos", JSON.stringify(currentPos)); 
  }, [currentPos]);


  // --- 3. Get user location (จาก "Beta") ---
  useEffect(() => {
    // ถ้ายังไม่มี currentPos (ไม่ได้โหลดมา)
    if (!currentPos) {
      navigator.geolocation.getCurrentPosition(pos => {
        const c: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCurrentPos(c); // ตั้งค่า (และจะถูกบันทึกโดย useEffect ข้างบน)
        mapRef.current?.flyTo(c, 15);
      });
    } else if (mapRef.current) {
      // ถ้ามี currentPos (โหลดมาจาก localStorage) ให้ย้ายแผนที่ไปเลย
      mapRef.current.flyTo(currentPos, 13);
    }
  }, [currentPos]); // <-- ใช้ [currentPos] เพื่อให้ทำงานหลังจากโหลดค่ามา

  // Effect สำหรับ GEOCODING (รับคำสั่งจาก Parent)
  useEffect(() => {
    if (addressToGeocode && addressToGeocode.trim()) {
      const geocode = async () => {
        const results = await provider.search({ query: addressToGeocode });
        
        if (results && results.length > 0) {
          const coords: [number, number] = [results[0].y, results[0].x];
          setMapPosition(coords);
          mapRef.current?.flyTo(coords, 15);
          setForm(f => ({ ...f, location: addressToGeocode }));
          if (onMarkerSet) {
            onMarkerSet(coords);
          }
        } else {
          console.warn("Geocode: ไม่พบที่อยู่", addressToGeocode);
          alert("ไม่พบที่อยู่ที่คุณค้นหา");
        }
      };
      geocode();
    }
  }, [addressToGeocode, onMarkerSet]);


  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const togglePinning = () => {
    if (formMode === 'destination') {
      return alert("โหมดปักหมุดใช้ได้กับ 'จุดแวะ' เท่านั้น");
    }
    setIsPinning(!isPinning);
  };

  const searchAndAdd = async () => {
    if (!form.location) return alert("กรุณากรอกข้อมูลตำแหน่ง");
    const res = await provider.search({ query: form.location });
    if (res.length === 0) return alert("ไม่พบตำแหน่งนี้");

    const pos: [number, number] = [res[0].y, res[0].x];
    setMapPosition(pos);
    mapRef.current?.flyTo(pos, 15);
  };

  const confirmPosition = () => {
    if (!mapPosition) return alert("กรุณาเลือกตำแหน่งบนแผนที่ก่อน");
    const data: Stop = {
      pos: mapPosition,
      name: form.name || (formMode === 'stop' ? `จุดแวะ ${stops.length + 1}` : 'จุดหมาย'),
      phone: form.phone,
      detail: form.detail,
      area: Number(form.area) || 0,
    };

    if (formMode === "stop") {
      setStops(p => [...p, data]);
    } else {
      setDestination(data);
    }

    setMapPosition(null);
  };

  const clearStops = () => (setStops([]), alert("ล้างจุดแวะ ✅"));
  const clearDest = () => (setDestination(null), alert("ล้างจุดหมาย ✅"));
  const clearAll = () => (setStops([]), setDestination(null), alert("ล้างทั้งหมด ✅"));
  // (เมื่อ setStops([]) และ setDestination(null), useEffect[Save] จะทำงานและลบข้อมูลใน localStorage ให้อัตโนมัติ)
  const undoLastStop = () => setStops(prev => prev.slice(0, -1));

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Form */}
      <div className="w-full lg:w-[350px] bg-white p-5 rounded-xl shadow">
        <h2 className="font-bold text-xl mb-2">เพิ่มสถานที่ทำงาน</h2>

        <div className="flex gap-2 mb-3 bg-gray-200 p-1 rounded-lg">
          <button onClick={() => setFormMode("stop")} className={`w-full p-2 rounded ${formMode === "stop" ? "bg-green-600 text-white" : ""}`}>จุดแวะ</button>
          <button onClick={() => setFormMode("destination")} className={`w-full p-2 rounded ${formMode === "destination" ? "bg-red-600 text-white" : ""}`}>จุดหมาย</button>
        </div>

        <input name="name" value={form.name} onChange={handleChange} placeholder="ชื่อ" className="p-2 border rounded w-full mb-2" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="เบอร์" className="p-2 border rounded w-full mb-2" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="ค้นหาพิกัด..." className="p-2 border rounded w-full mb-2" />
        <textarea name="detail" value={form.detail} onChange={handleChange} placeholder="รายละเอียด" className="p-2 border rounded w-full mb-2" />
        <input name="area" value={form.area} onChange={handleChange} placeholder="Area (เมตร)" className="p-2 border rounded w-full mb-2" />

        <button onClick={searchAndAdd} className={`w-full p-2 text-white rounded ${formMode === "stop" ? "bg-green-600" : "bg-red-600"}`}>
          🔍 {formMode === "stop" ? "ค้นหาจุดแวะ" : "ค้นหาจุดหมาย"}
        </button>

        <button onClick={togglePinning} disabled={formMode === 'destination'} className={`w-full p-2 mt-2 text-white rounded transition-colors ${isPinning ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} disabled:bg-gray-400 disabled:cursor-not-allowed`}>
          {isPinning ? '📍 คลิกบนแผนที่เพื่อปักหมุด (คลิกอีกครั้งเพื่อยกเลิก)' : '📍 เปิดโหมดปักหมุด'}
        </button>

        <button onClick={confirmPosition} disabled={!mapPosition} className="w-full p-2 mt-2 bg-blue-600 text-white rounded disabled:bg-gray-400">
          ✅ ยืนยันตำแหน่งนี้
        </button>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button onClick={clearStops} className="bg-orange-500 text-white p-2 rounded">ล้างจุดแวะ</button>
          <button onClick={clearDest} className="bg-purple-600 text-white p-2 rounded">ล้างจุดหมาย</button>
        </div>

        <button onClick={undoLastStop} className="bg-yellow-500 text-white p-2 rounded w-full mt-2">Undo จุดล่าสุด</button>
        <button onClick={clearAll} className="bg-gray-700 text-white p-2 rounded w-full mt-2">ล้างทั้งหมด</button>

        {mapPosition && (
          <p className="text-xs text-muted-foreground mt-2">
            ตำแหน่งที่เลือก: {mapPosition[0].toFixed(6)}, {mapPosition[1].toFixed(6)}
          </p>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 h-[500px] rounded-xl shadow overflow-hidden">
        <MapContainer
          // ใช้ currentPos ที่โหลดมาเป็น center เริ่มต้น
          center={currentPos || [13.736717, 100.523186]} 
          zoom={13}
          className="w-full h-full"
          whenCreated={map => (mapRef.current = map)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 1. Component ดักการคลิก */}
          <MapClickHandler
            isPinning={isPinning}
            stops={stops}
            setMapPosition={setMapPosition}
            setIsPinning={setIsPinning}
            setStops={setStops}
          />

          {/* 2. Marker ตำแหน่งปัจจุบัน (จะแสดงทันทีถ้าโหลดมา) */}
          {currentPos && <Marker icon={currentIcon} position={currentPos}><Tooltip permanent>ตำแหน่งปัจจุบัน</Tooltip></Marker>}

          {/* 3. Marker ชั่วคราว (สีเทา) */}
          {mapPosition && (
            <Marker
              icon={tempIcon}
              position={mapPosition}
              draggable
              eventHandlers={{ 
                dragend: (e) => setMapPosition([e.target.getLatLng().lat, e.target.getLatLng().lng]),
                contextmenu: (e) => { 
                  L.DomEvent.stopPropagation(e);
                  setMapPosition(null);
                }
              }}
            >
              <Tooltip permanent>📌 ปรับตำแหน่ง (คลิกขวาเพื่อลบ)</Tooltip>
            </Marker>
          )}

          {/* 4. Marker จุดแวะ (Stops) (จะแสดงทันทีถ้าโหลดมา) */}
          {stops.map((s, i) => (
            <Marker
              key={i}
              icon={stopIcon}
              position={s.pos}
              draggable
              eventHandlers={{
                dragend: e => {
                  const newPos = e.target.getLatLng();
                  setStops(prev => prev.map((item, idx) => idx === i ? { ...item, pos: [newPos.lat, newPos.lng] } : item));
                },
                click: () => {
                  if (window.confirm(`ตั้ง "${s.name}" เป็นจุดหมาย?`)) {
                    setDestination(s);
                    setStops(prev => prev.filter((_, idx) => idx !== i));
                  }
                },
                contextmenu: (e) => { 
                  L.DomEvent.stopPropagation(e);
                  if (window.confirm(`ลบ "${s.name}" (จุดแวะ ${i + 1})?`)) {
                    setStops(prev => prev.filter((_, idx) => idx !== i));
                  }
                }
              }}
            >
              <Tooltip permanent>จุดแวะ {i + 1}: {s.name}</Tooltip>
              {s.area && s.area > 0 && <Circle center={s.pos} radius={s.area} pathOptions={{ color: "green" }} />}
            </Marker>
          ))}

          {/* 5. Marker จุดหมาย (Destination) (จะแสดงทันทีถ้าโหลดมา) */}
          {destination && (
            <Marker
              icon={destinationIcon}
              position={destination.pos}
              draggable
              eventHandlers={{
                dragend: e => {
                  const newPos = e.target.getLatLng();
                  setDestination({ ...destination, pos: [newPos.lat, newPos.lng] });
                },
                contextmenu: (e) => { 
                  L.DomEvent.stopPropagation(e);
                  if (window.confirm(`ลบจุดหมาย "${destination.name}"?`)) {
                    setDestination(null);
                  }
                }
              }}
            >
              <Tooltip permanent>จุดหมาย: {destination.name}</Tooltip>
              {destination.area && destination.area > 0 && <Circle center={destination.pos} radius={destination.area} pathOptions={{ color: "blue" }} />}
            </Marker>
          )}

          {/* 6. Routing (จะวาดเส้นทางทันทีถ้าโหลดข้อมูลมา) */}
          <StopsRouting currentPos={currentPos} stops={stops} />
          <DestinationRouting startPos={stops.length > 0 ? stops[stops.length - 1].pos : currentPos} destination={destination} />

        </MapContainer>
      </div>
    </div>
  );
} 








//Beta






// import { useState, useEffect, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Tooltip, Circle, useMap } from "react-leaflet";
// import { OpenStreetMapProvider } from "leaflet-geosearch";
// import L, { LeafletMouseEvent } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// // fix default marker icon
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconUrl: markerIcon,
//   iconRetinaUrl: markerIcon2x,
//   shadowUrl: markerShadow
// });

// // Custom icons
// const currentIcon = new L.Icon({
//   iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });
// const stopIcon = new L.Icon({
//   iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });
// const destinationIcon = new L.Icon({
//   iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });
// const tempIcon = new L.Icon({
//   iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// // Types
// type Stop = {
//   pos: [number, number];
//   name: string;
//   phone: string;
//   detail: string;
//   area?: number;
// };

// // Routing Components
// function StopsRouting({ currentPos, stops }: { currentPos: [number, number] | null; stops: Stop[] }) {
//   const map = useMap();
//   const ref = useRef<any>(null);

//   useEffect(() => {
//     if (ref.current) { map.removeControl(ref.current); ref.current = null; }
//     if (!map || !currentPos || stops.length === 0) return;

//     ref.current = L.Routing.control({
//       waypoints: [L.latLng(...currentPos), ...stops.map(s => L.latLng(...s.pos))],
//       lineOptions: { styles: [{ color: "green", weight: 5, opacity: 0.8 }] },
//       addWaypoints: false,
//       draggableWaypoints: false,
//       fitSelectedRoutes: true,
//       createMarker: () => null, // เราสร้าง Marker เอง
//     }).addTo(map);

//     return () => ref.current && map.removeControl(ref.current);
//   }, [currentPos, stops, map]);

//   return null;
// }

// function DestinationRouting({ startPos, destination }: { startPos: [number, number] | null; destination: Stop | null }) {
//   const map = useMap();
//   const ref = useRef<any>(null);

//   useEffect(() => {
//     if (ref.current) { map.removeControl(ref.current); ref.current = null; }
//     if (!map || !startPos || !destination) return;

//     ref.current = L.Routing.control({
//       waypoints: [L.latLng(...startPos), L.latLng(...destination.pos)],
//       lineOptions: { styles: [{ color: "red", weight: 5, opacity: 0.8 }] },
//       addWaypoints: false,
//       draggableWaypoints: false,
//       fitSelectedRoutes: true,
//       createMarker: () => null,
//     }).addTo(map);

//     return () => ref.current && map.removeControl(ref.current);
//   }, [startPos, destination, map]);

//   return null;
// }

// // Main Map Component
// export default function Map() {
//   const [form, setForm] = useState({ name: "", phone: "", location: "", detail: "", area: "" });
//   const [formMode, setFormMode] = useState<'stop' | 'destination'>('stop');
//   const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
//   const [stops, setStops] = useState<Stop[]>([]);
//   const [destination, setDestination] = useState<Stop | null>(null);
//   const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);

//   const provider = new OpenStreetMapProvider();
//   const mapRef = useRef<L.Map | null>(null);

//   // Load from localStorage
//   useEffect(() => {
//     const savedStops = localStorage.getItem("stops");
//     const savedDest = localStorage.getItem("destination");
//     const savedCurrent = localStorage.getItem("currentPos");

//     try {
//       if (savedStops) setStops(JSON.parse(savedStops));
//       if (savedDest) setDestination(JSON.parse(savedDest));
//       if (savedCurrent) setCurrentPos(JSON.parse(savedCurrent));
//     } catch (error) {
//       console.error("Error parsing data from localStorage", error);
//       // Clear corrupted data
//       localStorage.removeItem("stops");
//       localStorage.removeItem("destination");
//       localStorage.removeItem("currentPos");
//     }
//   }, []);

//   // Save to localStorage
//   useEffect(() => { stops.length > 0 ? localStorage.setItem("stops", JSON.stringify(stops)) : localStorage.removeItem("stops"); }, [stops]);
//   useEffect(() => { destination ? localStorage.setItem("destination", JSON.stringify(destination)) : localStorage.removeItem("destination"); }, [destination]);
//   useEffect(() => { if(currentPos) localStorage.setItem("currentPos", JSON.stringify(currentPos)); }, [currentPos]);

//   // Get user location if not loaded
//   useEffect(() => {
//     if (!currentPos) {
//       navigator.geolocation.getCurrentPosition(pos => {
//         const c: [number, number] = [pos.coords.latitude, pos.coords.longitude];
//         setCurrentPos(c);
//         mapRef.current?.flyTo(c, 15);
//       });
//     } else if (mapRef.current) {
//       mapRef.current.flyTo(currentPos, 13);
//     }
//   }, [currentPos]);

//   const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

//   const searchAndAdd = async () => {
//     if (!form.location) return alert("กรุณากรอกข้อมูลตำแหน่ง");
//     const res = await provider.search({ query: form.location });
//     if (res.length === 0) return alert("ไม่พบตำแหน่งนี้");

//     const pos: [number, number] = [res[0].y, res[0].x];
//     setMapPosition(pos);
//     mapRef.current?.flyTo(pos, 15);
//   };

//   const confirmPosition = () => {
//     if (!mapPosition) return alert("กรุณาเลือกตำแหน่งบนแผนที่ก่อน");
//     const data: Stop = {
//       pos: mapPosition,
//       name: form.name,
//       phone: form.phone,
//       detail: form.detail,
//       area: Number(form.area) || 0,
//     };

//     if (formMode === "stop") setStops(prev => [...prev, data]);
//     else setDestination(data);

//     setMapPosition(null);
//   };

//   const clearStops = () => setStops([]);
//   const clearDest = () => setDestination(null);
//   const undoLastStop = () => setStops(prev => prev.slice(0, -1));
//   const clearAll = () => { // ล้างข้อมูลทั้งหมด
//     setStops([]);
//     setDestination(null);
//     localStorage.removeItem("stops");
//     localStorage.removeItem("destination");
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 p-4">
//       {/* Form */}
//       <div className="w-full lg:w-[350px] bg-white p-5 rounded-xl shadow">
//         <h2 className="font-bold text-xl mb-2">เพิ่มงาน</h2>
//         <div className="flex gap-2 mb-3 bg-gray-200 p-1 rounded-lg">
//           <button onClick={() => setFormMode("stop")} className={`w-full p-2 rounded ${formMode === "stop" ? "bg-green-600 text-white" : ""}`}>จุดแวะ</button>
//           <button onClick={() => setFormMode("destination")} className={`w-full p-2 rounded ${formMode === "destination" ? "bg-red-600 text-white" : ""}`}>จุดหมาย</button>
//         </div>
//         <input name="name" value={form.name} onChange={handleChange} placeholder="ชื่อ" className="p-2 border rounded w-full mb-2" />
//         <input name="phone" value={form.phone} onChange={handleChange} placeholder="เบอร์" className="p-2 border rounded w-full mb-2" />
//         <input name="location" value={form.location} onChange={handleChange} placeholder="ค้นหาพิกัด..." className="p-2 border rounded w-full mb-2" />
//         <textarea name="detail" value={form.detail} onChange={handleChange} placeholder="รายละเอียด" className="p-2 border rounded w-full mb-2" />
//         <input name="area" value={form.area} onChange={handleChange} placeholder="Area (เมตร)" className="p-2 border rounded w-full mb-2" />

//         <button onClick={searchAndAdd} className={`w-full p-2 text-white rounded ${formMode === "stop" ? "bg-green-600" : "bg-red-600"}`}>
//           {formMode === "stop" ? "ค้นหาและเลือกจุดแวะ" : "ค้นหาและเลือกจุดหมาย"}
//         </button>
//         <button onClick={confirmPosition} className="w-full p-2 mt-2 bg-blue-600 text-white rounded">✅ ยืนยันตำแหน่งนี้</button>

//         <div className="grid grid-cols-2 gap-2 mt-3">
//           <button onClick={clearStops} className="bg-orange-500 text-white p-2 rounded">ล้างจุดแวะ</button>
//           <button onClick={clearDest} className="bg-purple-600 text-white p-2 rounded">ล้างจุดหมาย</button>
//         </div>
//         <button onClick={undoLastStop} className="bg-yellow-500 text-white p-2 rounded w-full mt-2">Undo จุดล่าสุด</button>
//         <button onClick={clearAll} className="bg-gray-700 text-white p-2 rounded w-full mt-2">ล้างทั้งหมด</button>
//       </div>

//       {/* Map */}
//       <div className="flex-1 h-[500px] rounded-xl shadow overflow-hidden">
//         <MapContainer
//           center={currentPos || [13.736717, 100.523186]}
//           zoom={13}
//           className="w-full h-full"
//           whenCreated={map => (mapRef.current = map)}
//           onClick={(e: LeafletMouseEvent) => { setMapPosition([e.latlng.lat, e.latlng.lng]); }}
//         >
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//           {/* ตำแหน่งปัจจุบัน */}
//           {currentPos && <Marker icon={currentIcon} position={currentPos}><Tooltip permanent>ตำแหน่งปัจจุบัน</Tooltip></Marker>}

//           {/* จุดชั่วคราวก่อนยืนยัน */}
//           {mapPosition && (
//             <Marker
//               icon={tempIcon}
//               position={mapPosition}
//               draggable
//               eventHandlers={{ dragend: (e) => setMapPosition([e.target.getLatLng().lat, e.target.getLatLng().lng]) }}
//             >
//               <Tooltip permanent>📌 ปรับตำแหน่ง</Tooltip>
//             </Marker>
//           )}

//           {/* จุดแวะ */}
//           {stops.map((s, i) => (
//             <Marker
//               key={i}
//               icon={stopIcon}
//               position={s.pos}
//               draggable
//               eventHandlers={{
//                 dragend: e => {
//                   const newPos = e.target.getLatLng();
//                   setStops(prev => prev.map((item, idx) => idx === i ? { ...item, pos: [newPos.lat, newPos.lng] } : item));
//                 },
//               }}
//             >
//               <Tooltip permanent>จุดแวะ: {s.name}</Tooltip>
//               {s.area && s.area > 0 && <Circle center={s.pos} radius={s.area} pathOptions={{ color: "green" }} />}
//             </Marker>
//           ))}

//           {/* จุดหมาย */}
//           {destination && (
//             <Marker
//               icon={destinationIcon}
//               position={destination.pos}
//               draggable
//               eventHandlers={{
//                 dragend: e => {
//                   const newPos = e.target.getLatLng();
//                   setDestination({ ...destination, pos: [newPos.lat, newPos.lng] });
//                 },
//               }}
//             >
//               <Tooltip permanent>จุดหมาย: {destination.name}</Tooltip>
//               {destination.area && destination.area > 0 && <Circle center={destination.pos} radius={destination.area} pathOptions={{ color: "blue" }} />}
//             </Marker>
//           )}

//           {/* เส้นทาง */}
//           <StopsRouting currentPos={currentPos} stops={stops} />
//           <DestinationRouting startPos={stops.length > 0 ? stops[stops.length - 1].pos : currentPos} destination={destination} />
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

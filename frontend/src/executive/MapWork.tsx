import { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Circle, useMap, useMapEvents } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import L, { LeafletMouseEvent } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// --- Fix default marker icon ---
// (เหมือนเดิม)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
});

// --- Custom icons (เหมือนเดิม) ---
const currentIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const tempIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
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
const techIcon = new L.DivIcon({
  html: `<span style="font-size: 20px; text-shadow: 0 0 2px white;">🧑‍🔧</span>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// --- Geocoding Provider (Global) ---
const provider = new OpenStreetMapProvider();

// --- Types (เหมือนเดิม) ---
type Stop = {
  pos: [number, number];
  name: string;
  phone: string;
  detail: string;
  area?: number;
  technicians?: number;
};
type MapProps = {
  addressToGeocode?: string | null;
  onMarkerSet?: (coords: [number, number]) => void;
};

// --- ฟังก์ชันสุ่มพิกัด (เหมือนเดิม) ---
function getRandomPointInCircle(center: [number, number], radiusInMeters: number): [number, number] {
  const [lat, lng] = center;
  const radiusInDegrees = radiusInMeters / 111111;
  const t = 2 * Math.PI * Math.random();
  const r = Math.sqrt(Math.random()) * radiusInDegrees;
  const newLat = lat + r * Math.cos(t);
  const newLng = lng + (r * Math.sin(t)) / Math.cos(lat * (Math.PI / 180));
  return [newLat, newLng];
}

// --- Routing Components (เหมือนเดิม ตามโค้ดที่คุณส่งมา) ---
function StopsRouting({ currentPos, stops }: { currentPos: [number, number] | null; stops: Stop[] }) {
  const map = useMap();
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) { map.removeControl(ref.current); ref.current = null; }
    if (!map || !currentPos || stops.length === 0) return;
    ref.current = L.Routing.control({
      waypoints: [L.latLng(...currentPos), ...stops.map(s => L.latLng(...s.pos))],
      lineOptions: { styles: [{ color: "green", weight: 5, opacity: 0.8 }] },
      addWaypoints: false, draggableWaypoints: false, fitSelectedRoutes: true, createMarker: () => null,
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
      addWaypoints: false, draggableWaypoints: false, fitSelectedRoutes: true, createMarker: () => null,
    }).addTo(map);
    return () => ref.current && map.removeControl(ref.current);
  }, [startPos, destination, map]);
  return null;
}

// --- Map Click Handler Component (เหมือนเดิม) ---
type MapClickHandlerProps = {
  isPinning: boolean;
  stops: Stop[];
  setMapPosition: (pos: [number, number]) => void;
  setIsPinning: (is: boolean) => void;
  setStops: React.Dispatch<React.SetStateAction<Stop[]>>;
};
function MapClickHandler({ isPinning, stops, setMapPosition, setIsPinning, setStops }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMapPosition(newPos); 
      if (isPinning) {
        const newStop: Stop = {
          pos: newPos, name: `จุดแวะ ${stops.length + 1}`, phone: "",
          detail: "ปักหมุดจากแผนที่", area: 0, technicians: 0,
        };
        setStops(p => [...p, newStop]); 
        setIsPinning(false); 
      }
    },
  });
  return null; 
}

// --- Main Map Component ---
export default function MapWork({ addressToGeocode, onMarkerSet }: MapProps) {
  
  const [form, setForm] = useState({ 
    name: "", phone: "", location: "", detail: "", area: "", technicians: "" 
  });
  const [formMode, setFormMode] = useState<'stop' | 'destination'>('stop');
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [destination, setDestination] = useState<Stop | null>(null);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);
  const [isPinning, setIsPinning] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // ⭐️ ลบ state isLoading ออก (ตามที่คุณขอล่าสุด)
  // const [isLoading, setIsLoading] = useState(true);

  // --- Load/Save localStorage (ปรับปรุง) ---
  useEffect(() => {
    let posFromStorage = false;
    try {
      const savedStops = localStorage.getItem("stops");
      const savedDest = localStorage.getItem("destination");
      const savedCurrent = localStorage.getItem("currentPos"); 
      
      if (savedStops) setStops(JSON.parse(savedStops));
      if (savedDest) setDestination(JSON.parse(savedDest));
      if (savedCurrent) { 
        setCurrentPos(JSON.parse(savedCurrent)); 
        posFromStorage = true;
      }
    } catch (error) {
      console.error("Error parsing data from localStorage", error);
      localStorage.removeItem("stops");
      localStorage.removeItem("destination");
      localStorage.removeItem("currentPos");
    }

    if (!posFromStorage) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { 
          const c: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setCurrentPos(c); 
        }, 
        (err) => { 
          console.warn("GPS Error:", err.message);
        }
      );
    }
  }, []); // <-- ทำงานครั้งเดียวตอนเริ่ม

  // --- Save to localStorage (แยกส่วน) ---
  useEffect(() => { 
    stops.length > 0 
      ? localStorage.setItem("stops", JSON.stringify(stops)) 
      : localStorage.removeItem("stops");
  }, [stops]);

  useEffect(() => {
    destination 
      ? localStorage.setItem("destination", JSON.stringify(destination)) 
      : localStorage.removeItem("destination");
  }, [destination]);

  useEffect(() => { 
    if(currentPos) localStorage.setItem("currentPos", JSON.stringify(currentPos)); 
  }, [currentPos]);
  
  // --- FlyTo Map (เมื่อ currentPos พร้อม) ---
  useEffect(() => {
    if (currentPos && mapRef.current) {
      mapRef.current.flyTo(currentPos, 15);
    }
  }, [currentPos]); 

  // --- ⭐️ 1. Geocoding Effect (FlyTo จาก Parent) ---
  useEffect(() => {
    if (addressToGeocode && addressToGeocode.trim()) {
      const geocode = async () => {
         const results = await provider.search({ query: addressToGeocode });
         if (results && results.length > 0) {
           const coords: [number, number] = [results[0].y, results[0].x];
           setMapPosition(coords);
           mapRef.current?.flyTo(coords, 15); // <-- ⭐️ เพิ่ม flyTo
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
  }, [addressToGeocode, onMarkerSet]); // ⭐️ เพิ่ม Effect นี้

  // --- Form Handlers ---
  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const togglePinning = () => {
    if (formMode === 'destination') {
      return alert("โหมดปักหมุดใช้ได้กับ 'จุดแวะ' เท่านั้น");
    }
    setIsPinning(!isPinning);
  };

  // --- ⭐️ 2. FlyTo จากปุ่มค้นหาใน Component ---
  const searchAndAdd = async () => {
    if (!form.location) return alert("กรุณากรอกข้อมูลตำแหน่ง");
    const res = await provider.search({ query: form.location });
    if (res.length === 0) return alert("ไม่พบตำแหน่งนี้");
    
    const pos: [number, number] = [res[0].y, res[0].x];
    setMapPosition(pos);
    mapRef.current?.flyTo(pos, 15); // <-- ⭐️ เพิ่ม flyTo
  };
  
  const confirmPosition = () => {
    if (!mapPosition) return alert("กรุณาเลือกตำแหน่งบนแผนที่ก่อน");
    const data: Stop = {
      pos: mapPosition,
      name: form.name || (formMode === 'stop' ? `จุดแวะ ${stops.length + 1}` : 'จุดหมาย'),
      phone: form.phone,
      detail: form.detail,
      area: Number(form.area) || 0,
      technicians: Number(form.technicians) || 0,
    };
    if (formMode === "stop") setStops(p => [...p, data]);
    else setDestination(data);
    setMapPosition(null);
    setForm({ name: "", phone: "", location: "", detail: "", area: "", technicians: "" });
  };
  const clearStops = () => (setStops([]), alert("ล้างจุดแวะ ✅"));
  const clearDest = () => (setDestination(null), alert("ล้างจุดหมาย ✅"));
  const clearAll = () => (setStops([]), setDestination(null), alert("ล้างทั้งหมด ✅"));
  const undoLastStop = () => setStops(prev => prev.slice(0, -1));

  // --- useMemo (เหมือนเดิม) ---
  const stopTechnicianMarkers = useMemo(() => {
    return stops.flatMap((stop, i) => {
      if (!stop.technicians || stop.technicians === 0 || !stop.area || stop.area === 0) {
        return [];
      }
      return Array.from({ length: stop.technicians }).map((_, j) => {
        const pos = getRandomPointInCircle(stop.pos, stop.area);
        return <Marker key={`stop-${i}-${j}`} position={pos} icon={techIcon} />;
      });
    });
  }, [stops]); 

  const destinationTechnicianMarkers = useMemo(() => {
    if (!destination || !destination.technicians || !destination.area) {
      return null;
    }
    return Array.from({ length: destination.technicians }).map((_, j) => {
      const pos = getRandomPointInCircle(destination.pos, destination.area);
      return <Marker key={`dest-${j}`} position={pos} icon={techIcon} />;
    });
  }, [destination]); 

  // ⭐️ ลบหน้า Loading (if (isLoading) { ... }) ออก

  // --- แสดงหน้าแผนที่ ---
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Form (เหมือนเดิม) */}
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
        <input name="area" value={form.area} onChange={handleChange} placeholder="Area (เมตร)" type="number" className="p-2 border rounded w-full mb-2" />
        <input name="technicians" value={form.technicians} onChange={handleChange} placeholder="จำนวนช่าง" type="number" className="p-2 border rounded w-full mb-2" />

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
          center={currentPos || [13.736717, 100.523186]} 
          zoom={13}
          className="w-full h-full"
          whenCreated={map => (mapRef.current = map)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 1. Component ดักการคลิก (เหมือนเดิม) */}
          <MapClickHandler
            isPinning={isPinning}
            stops={stops}
            setMapPosition={setMapPosition}
            setIsPinning={setIsPinning}
            setStops={setStops}
          />

          {/* (Markers ทั้งหมดเหมือนเดิม) */}
          {currentPos && <Marker icon={currentIcon} position={currentPos}><Tooltip permanent>ตำแหน่งปัจจุบัน</Tooltip></Marker>}
          
          {mapPosition && (
            <Marker
              icon={tempIcon}
              position={mapPosition}
              draggable
              eventHandlers={{ 
                dragend: (e) => setMapPosition([e.target.getLatLng().lat, e.target.getLatLng().lng]),
                contextmenu: (e) => { L.DomEvent.stopPropagation(e); setMapPosition(null); }
              }}
            >
              <Tooltip permanent>📌 ปรับตำแหน่ง (คลิกขวาเพื่อลบ)</Tooltip>
            </Marker>
          )}
          
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
              <Tooltip> 
                <div>จุดแวะ {i + 1}: {s.name}</div>
                {s.technicians ? <div>ช่าง: {s.technicians} คน</div> : null}
              </Tooltip>
              {s.area && s.area > 0 && <Circle center={s.pos} radius={s.area} pathOptions={{ color: "green", fillOpacity: 0.1 }} />}
            </Marker>
          ))}
          
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
              <Tooltip>
                <div>จุดหมาย: {destination.name}</div>
                {destination.technicians ? <div>ช่าง: {destination.technicians} คน</div> : null}
              </Tooltip>
              {destination.area && destination.area > 0 && <Circle center={destination.pos} radius={destination.area} pathOptions={{ color: "red", fillOpacity: 0.1 }} />}
            </Marker>
          )}
          
          {/* --- Render Marker ช่าง (เหมือนเดิม) --- */}
          {stopTechnicianMarkers}
          {destinationTechnicianMarkers}

          {/* 7. Routing (เหมือนเดิม) */}
          <StopsRouting currentPos={currentPos} stops={stops} />
          <DestinationRouting startPos={stops.length > 0 ? stops[stops.length - 1].pos : currentPos} destination={destination} />

        </MapContainer>
      </div>
    </div>
  );
}
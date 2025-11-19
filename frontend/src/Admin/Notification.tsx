import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface RequisitionItem {
  jobId?: string;
  id: string;
  name: string;
  quantity: string;
  description?: string;
  requesterName?: string;
  requesterProfile?: string;
  section?: string;
  role?: string;
  createdAt?: string;
  _id?: string;
  status?: string;
  statusUpdatedAt?: string;
  additemecomfam?: string;
}

interface Item {
  _id: string;
  name: string;
  category: string;
  number: number;
  counting: number;
}

export default function Notification() {
  const { theme } = useTheme();

  // --- State ---
  const [fade, setFade] = useState(false);
  const [fadePopup, setFadePopup] = useState(false);
  const [Focused, setFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>(
    []
  );
  const [items, setItems] = useState<Item[]>([]);
  const [PopupDate, setPopupDate] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RequisitionItem | null>(
    null
  );
  const [warningMessage, setWarningMessage] = useState(""); // state สำหรับข้อความเตือน

  // --- Theme classes ---
  const bg = theme === "dark" ? "bg-gray-900" : "shadow-sm bg-white";
  const bgpopup = theme === "dark" ? "bg-gray-800" : "shadow-sm bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-800";
  const texthead = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const bgborder = theme === "dark" ? "bg-gray-800" : "bg-gray-50";

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // --- Fetch Items ---
  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/item/all-items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequisitionItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/additem");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.items || [];
      setRequisitionItems(list);
    } catch (err) {
      console.error("โหลดรายการเบิกของล้มเหลว:", err);
      setRequisitionItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchRequisitionItems();
  }, []);

  // --- Popup ---
  const openPopupDate = (item: RequisitionItem) => {
    setSelectedItem(item);
    setPopupDate(true);
    setTimeout(() => setFadePopup(true), 50);
  };

  const closePopupDate = () => {
    setFadePopup(false);
    setTimeout(() => setPopupDate(false), 300);
  };

  const handleConfirm = async () => {
    if (!selectedItem) return;

    try {
      const token = localStorage.getItem("token");
      const itemInStock = items.find((i) => i.name === selectedItem.name);

      if (!itemInStock) return alert("ไม่พบวัสดุในคลัง");

      const requestedQty = Number(selectedItem.quantity);
      const stockQty = Number(itemInStock.number);

      if (stockQty < requestedQty) {
        setWarningMessage(`จำนวนในคลังไม่เพียงพอ!`);
        return;
      }

      const newNumber = stockQty - requestedQty;

      // --- 1) อัปเดต status ใน additem ---
      await fetch(
        `http://localhost:5000/api/additem/${selectedItem.id}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: "ยืนยันแล้ว",
            status: "ได้รับการยืนยันจากคลังแล้ว",
          }),
        }
      );

      // --- 2) อัปเดตจำนวนในคลังจริง ---
      await fetch(
        `http://localhost:5000/api/item/update-item/${itemInStock._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            number: newNumber,
          }),
        }
      );

      // --- 3) อัปเดต UI ---
      setItems((prev) =>
        prev.map((i) =>
          i._id === itemInStock._id ? { ...i, number: newNumber } : i
        )
      );

      setRequisitionItems((prev) =>
        prev.map((r) =>
          r.id === selectedItem.id
            ? { ...r, status: "ได้รับการยืนยันจากคลังแล้ว" }
            : r
        )
      );

      setWarningMessage("");
      closePopupDate();
      alert("ยืนยันสำเร็จ! จำนวนและสถานะอัปเดตแล้ว");
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err);
    }
  };


  const filteredItems = requisitionItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`transition-opacity p-5 mx-auto container duration-700 w-380 ${fade ? "opacity-100" : "opacity-0"
        }`}
    >
      <div className={text}>
        <div className="mb-5">
          <p className={`text-3xl font-bold ${texthead}`}>
            การแจ้งเตือน
            <span
              className={`${theme === "dark" ? "text-white" : "text-yellow-500"
                }`}
            >
              {" "}
              & ข้อความ
            </span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 my-5">
            {/* --- รายการเบิกของ --- */}
            <div
              className={`${border} col-span-1 h-205 lg:col-span-3 rounded-lg ${bg}`}
            >
              {/* Header & Search */}
              <div
                className={`flex flex-col sm:flex-row justify-between items-center p-4 border-b ${border}`}
              >
                <p className={`text-lg font-semibold mb-2 sm:mb-0 ${texthead}`}>
                  รายการเบิกของ
                  <span
                    className={`text-sm font-normal ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } ml-2`}
                  >
                    ({filteredItems.length} รายการ)
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                    />
                    <input
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="ค้นหา..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 ${theme === "dark"
                        ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                        : "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border "
                        } ${Focused ? "w-72" : "w-60"}`}
                    />
                  </div>
                </div>
              </div>

              {/* Status Tabs */}
              <div
                className={`flex p-3 items-center border-b ${border} overflow-x-auto`}
              >
                <div className="grid grid-cols-5 gap-5 w-full">
                  {[
                    "ทั้งหมด",
                    "รอดําเนินการ",
                    "รอเบิกขอใหม่",
                    "ยืนยันแล้ว",
                    "ยืนยันแล้ว",
                  ].map((e, i) => (
                    <div key={i}>
                      <p className="px-5 text-sm">{e}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Header */}
              <div className="border">
                <div className="grid grid-cols-11 gap-5 p-2 pl-5 m-2">
                  {[
                    "ผู้ขอเบิก",
                    "สถานะ",
                    "ของที่เบิก",
                    "จํานวน",
                    "วันที่",
                    "รายระเอียด",
                  ].map((event, index) => (
                    <div
                      key={index}
                      className={`${[0, 1, 2, 4, 5].includes(index) ? "col-span-2" : ""
                        } ${[4, 5].includes(index) ? "text-center" : ""}`}
                    >
                      {event}
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Rows */}
              {requisitionItems
                .filter(
                  (e) =>
                    e.status !== "รอดําเนินการ" && e.status !== "ไม่อนุมัติ"
                )
                .filter(
                  (e) =>
                    e.name.toLowerCase().includes(search.toLowerCase()) ||
                    e.requesterName
                      ?.toLowerCase()
                      .includes(search.toLowerCase())
                )
                .map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.2,
                      ease: "easeOut",
                    }}
                    className={`grid grid-cols-11 items-center gap-5 text-sm p-2 pl-5 border rounded-xl m-2 ${bgborder}`}
                  >
                    <div className="flex col-span-2 items-center gap-3">
                      <img
                        src={
                          e.requesterProfile
                            ? `http://localhost:5000/uploads/Profile/${e.requesterProfile}`
                            : "/default-profile.png"
                        }
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                      <p>{e.requesterName}</p>
                    </div>
                    <div className="truncate col-span-2">
                      {e.additemecomfam}
                    </div>
                    <div className="truncate col-span-2">{e.name}</div>
                    <div className="truncate">{e.quantity}</div>
                    <div className="truncate text-center col-span-2">
                      {e.statusUpdatedAt &&
                        new Date(e.statusUpdatedAt).toLocaleString("th-TH", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                    </div>
                    <div className="col-span-2 mx-auto">
                      <button
                        onClick={() => openPopupDate(e)}
                        className={`relative overflow-hidden cursor-pointer rounded-md px-2 py-1 text-white text-sm shadow-md transition-all duration-300 active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${theme === "dark"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-blue-600 hover:bg-blue-700"
                          }`}
                      >
                        รายละเอียด
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* --- รายงานจากช่าง --- */}
            <div className={`border col-span-2 rounded-lg ${bg}`}>
              <div
                className={`flex flex-col sm:flex-row justify-between items-center p-5 border-b ${border}`}
              >
                <p className={`text-lg font-semibold mb-2 sm:mb-0 ${texthead}`}>
                  รายงานจากช่าง
                  <span
                    className={`text-sm font-normal ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } ml-2`}
                  >
                    รายการ
                  </span>
                </p>
              </div>

              <div className="border">
                <div className="grid grid-cols-4 gap-5 p-2 m-2 pl-5 text-sm">
                  {["ประเภทงาน", "งาน", "ข้อความ", "วันที่"].map(
                    (event, index) => (
                      <div
                        key={index}
                        className={index === 3 ? "text-center" : ""}
                      >
                        {event}
                      </div>
                    )
                  )}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                className={`border p-2 mt-2 m-2 pl-5 text-sm rounded-xl ${bgborder}`}
              >
                <div className="grid grid-cols-4 gap-5 items-center">
                  <div className="flex items-center gap-2">
                    <img
                      className="bg-black rounded-4xl w-10 h-10"
                      src=""
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p>5</p>
                      <p>5</p>
                    </div>
                  </div>
                  <div>งาน</div>
                  <div>ข้อความ</div>
                  <div className="text-center">วันที่</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Popup --- */}
      {PopupDate && selectedItem && (
        <div
          className={`fixed z-50 inset-0 flex items-center justify-center duration-300 bg-black/40 backdrop-blur-sm ${fadePopup ? "opacity-100" : "opacity-0"
            }`}
        >
          <div
            className={`${bgpopup} rounded-2xl shadow-2xl p-6 w-[500px] max-h-[400px] overflow-auto`}
          >
            <h2 className={`font-semibold text-xl mb-2 ${texthead}`}>
              รายละเอียดรายการ
            </h2>

            <p>
              <span className={`${texthead} font-semibold`}>ชื่อ: </span>
              {selectedItem.name}
            </p>
            <p>
              <span className={`${texthead} font-semibold`}>ผู้ขอเบิก: </span>
              {selectedItem.requesterName}
            </p>
            <p>
              <span className={`${texthead} font-semibold`}>
                จำนวนที่ขอเบิก:{" "}
              </span>
              {selectedItem.quantity}
            </p>

            {/* --- จำนวนคงเหลือในคลัง --- */}
            {(() => {
              const itemInStock = items.find(
                (item) => item.name === selectedItem.name
              );

              if (itemInStock) {
                const remaining =
                  Number(itemInStock.number) - Number(selectedItem.quantity);
                return (
                  <div className="">
                    <p>
                      <span className={`${texthead} font-semibold`}>
                        จำนวนในคลัง:{" "}
                      </span>
                      {itemInStock.number}
                    </p>
                    <p>
                      <span className={`${texthead} font-semibold`}>
                        หลังยืนยัน:{" "}
                      </span>
                      {remaining >= 0 ? remaining : 0}
                    </p>
                  </div>
                );
              } else {
                return (
                  <p className="mt-3">
                    <span className={`${texthead} font-semibold`}>
                      จำนวนในคลัง:{" "}
                    </span>
                    ไม่พบข้อมูล
                  </p>
                );
              }
            })()}

            <div className="flex justify-end gap-3 mt-4">
              {selectedItem.status === "ได้รับการยืนยันจากคลังแล้ว" ? (
                <span
                  onClick={closePopupDate}
                  className={`block w-full cursor-pointer border text-center rounded-lg px-3 py-2 ${theme === "dark"
                    ? "bg-red-900/30 text-red-300"
                    : "bg-red-100 text-red-600"
                    }`}
                >
                  รายการนี่ถูกยืนยันไปแล้ว
                </span>
              ) : warningMessage ? (
                <span
                  onClick={closePopupDate}
                  className={`block w-full cursor-pointer border text-center rounded-lg px-3 py-2 ${theme === "dark"
                    ? "bg-red-900/30 text-red-300"
                    : "bg-red-100 text-red-600"
                    }`}
                >
                  {warningMessage}
                </span>
              ) : (
                <>
                  <button
                    onClick={closePopupDate}
                    className="group relative overflow-hidden rounded-lg cursor-pointer border bg-white px-4 text-gray-700 font-medium shadow-md transition-transform duration-300 hover:scale-103 active:scale-95"
                  >
                    <span className="relative z-10">ยกเลิก</span>
                    <span className="absolute inset-0 overflow-hidden pointer-events-none">
                      <span className="absolute left-0 top-0 w-0 h-full bg-gray-200 transition-all duration-500 group-hover:w-full"></span>
                    </span>
                  </button>

                  <button
                    onClick={handleConfirm}
                    className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4 text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                      }`}
                  >
                    <span className="relative z-10">ยืนยัน</span>
                    <span className="absolute inset-0 overflow-hidden pointer-events-none">
                      <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20 transition-all duration-500 group-hover:w-full"></span>
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

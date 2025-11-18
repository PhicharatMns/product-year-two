import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

// *** แก้ไข: เพิ่ม MoreHorizontal กลับเข้ามา ***
import { Monitor, Search } from "lucide-react";
import { motion } from "framer-motion";

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
  statusUpdatedAt?: string;
}

interface typeinterface {
  name?: string;
  category?: string;
  number?: string;
  counting?: string;
}

export default function Notification() {
  // --- Hooks & Context ---
  const { theme } = useTheme();

  const [fade, setFade] = useState(false);
  const [fadePopup, setFadefadePopup] = useState(false);
  const [search] = useState("");
  const [Focused, setFocused] = useState(false);
  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>(
    []
  );
  const [additem, setadditem] = useState<typeinterface[]>([]);
  const [PopupDate, setPopupDate] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RequisitionItem | null>(
    null
  );

  const openPopupDate = (item: RequisitionItem) => {
    setSelectedItem(item); // เก็บ item ที่กด
    setPopupDate(true);
    setTimeout(() => setFadefadePopup(true), 50);
  };

  const closePopupDate = () => {
    setFadefadePopup(false);
    setTimeout(() => setPopupDate(false), 300);
  };

  const fetchRequisitionItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/additem");
      const data = await res.json();
      console.log("Fetched data:", data);

      // ป้องกันไม่ให้ state เป็น non-array
      const items = Array.isArray(data) ? data : data.items || [];
      setRequisitionItems(items);
    } catch (err) {
      console.error("โหลดรายการเบิกของล้มเหลว:", err);
      setRequisitionItems([]);
    }
  };

  const handleConfirm = async () => {
    if (!selectedItem) return;

    try {
      const token = localStorage.getItem("token"); // ดึง token จาก localStorage

      // --- 1) อัปเดต status ของ requisition ---
      const resStatus = await fetch(
        `http://localhost:5000/api/additem/${selectedItem.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // เพิ่มตรงนี้
          },
          body: JSON.stringify({
            status: "ยืนยันแล้ว",
            reasondescriptionstatus: "ยืนยันแล้ว",
          }),
        }
      );

      if (!resStatus.ok) {
        const errData = await resStatus.json();
        throw new Error(errData.message || "ส่งข้อความยืนยันล้มเหลว");
      }

      // --- 2) ส่งข้อความไป additemecomfam ---
      const resConfirm = await fetch(
        `http://localhost:5000/api/additem/${selectedItem.id}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // เพิ่มตรงนี้
          },
          body: JSON.stringify({
            message: "ยืนยันแล้ว",
          }),
        }
      );

      if (!resConfirm.ok) {
        const errData = await resConfirm.json();
        throw new Error(
          errData.message || "บันทึกข้อความ additemecomfam ล้มเหลว"
        );
      }

      alert("ยืนยันสำเร็จ! ส่งข้อความยืนยันเรียบร้อย");

      fetchRequisitionItems();
      closePopupDate();
    } catch (err: any) {
      console.error(err);
      alert("เกิดข้อผิดพลาด: " + err.message); // แสดงข้อความจริงจาก server
    }
  };

  const bg = theme === "dark" ? "bg-gray-900" : " shadow-sm bg-white";
  const bgpopup = theme === "dark" ? "bg-gray-800" : " shadow-sm bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-800";
  const texthead = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const bgborder = theme === "dark" ? "bg-gray-800" : "bg-gray-50";

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    fetchRequisitionItems();
    fetchRequisitionItems();
  }, []);

  return (
    <div
      className={`transition-opacity p-5 mx-auto container duration-700 w-380 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      {" "}
      <div className={` ${text}`}>
        {" "}
        <div className="mb-5">
          {/* --- Header --- */}
          <p
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-yellow-500" : "text-blue-500"
            }`}
          >
            การแจ้งเตือน
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-yellow-500"
              }`}
            >
              & ข้อความ
            </span>{" "}
          </p>{" "}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 my-5">
            {/* --- [ฝั่ง 1] รายการเบิกของ (lg:col-span-3) --- */}{" "}
            <div
              className={` ${border} col-span-1 h-205 lg:col-span-3 rounded-lg ${bg}`}
            >
              {/* Card Header & Search */}{" "}
              <div
                className={`flex flex-col sm:flex-row justify-between items-center p-4 border-b ${border}`}
              >
                {" "}
                <p
                  className={`text-lg font-semibold mb-2 sm:mb-0 ${texthead} `}
                >
                  รายการเบิกของ
                  <span
                    className={`text-sm font-normal ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } ml-2`}
                  >
                    {/* ({filteredItems.length} รายการ){" "} */}
                    รายการ
                  </span>{" "}
                </p>{" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <div className="relative">
                    {" "}
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />{" "}
                    <input
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="ค้นหา..."
                      value={search}
                      // onChange={(e) => setSearch(e.target.value)}
                      className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 
 ${
   theme === "dark"
     ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-600"
     : "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-300" // *** แก้ไข: ลบ 'e' ที่เป็นตัวอักษรแปลกๆ ออก ***
 }
 ${Focused ? "w-72" : "w-60"}`}
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </div>
              <div
                className={`flex p-3 items-center border-b ${border} overflow-x-auto`}
              >
                <div className="grid grid-cols-5 gap-5 w-full">
                  {[
                    "ท้งหมด",
                    "รอการยืนยัน",
                    "รอเบิกขอใหม่",
                    "ยืนยันเเล้ว",
                    "ยืนยันเเล้ว",
                  ].map((e, i) => {
                    return (
                      <div key={i}>
                        <p className=" px-5 text-sm ">{e}</p>
                      </div>
                    );
                  })}
                </div>{" "}
              </div>
              <div className="border">
                {/* Table Content "รายการเบิกของ" */}
                <div className="grid grid-cols-11 gap-5  p-2 pl-5  m-2">
                  {[
                    "ผู้ขอเบิก",
                    "สถานะ",
                    "ของที่เบิก",
                    "จํานวน",
                    "วันที่",
                    "รายระเอียด",
                  ].map((event, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          index === 0 ||
                          index === 1 ||
                          index === 2 ||
                          index === 4 ||
                          index === 5
                            ? "col-span-2"
                            : ""
                        } ${index === 4 || index === 5 ? "text-center" : ""}`}
                      >
                        {event}
                      </div>
                    );
                  })}
                </div>
              </div>
              {requisitionItems
                .filter(
                  (e) =>
                    e.status?.toLocaleLowerCase() ===
                    "ยืนยันแล้ว"
                )
                .map((e, i) => {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.05,
                        ease: "easeOut",
                      }}
                      className={`grid grid-cols-11 items-center gap-5 text-sm p-2 pl-5 border rounded-xl m-2 ${bgborder}`}
                    >
                      <div
                        key={i}
                        className="flex col-span-2  items-center gap-3"
                      >
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
                      <div className=" truncate col-span-2">{e.status}</div>
                      <div className=" truncate col-span-2">{e.name}</div>
                      <div className=" truncate ">{e.quantity}</div>
                      <div className=" truncate text-center col-span-2">
                        {e.statusUpdatedAt &&
                          new Date(e.statusUpdatedAt).toLocaleString("th-TH", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                      </div>
                      <div className="col-span-2 mx-auto">
                        <button
                          onClick={() => openPopupDate(e)}
                          className={`relative overflow-hidden   cursor-pointer rounded-md px-2 py-1 text-white text-sm shadow-md transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110 ${
                            theme === "dark"
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          รายละเอียด
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
            {/* รอเเก้ */}
            <div className={`border col-span-2 rounded-lg ${bg}`}>
              <div
                className={`flex flex-col sm:flex-row justify-between items-center p-5 border-b ${border}`}
              >
                <p className={`text-lg font-semibold mb-2 sm:mb-0 ${texthead}`}>
                  รายงานจากช่าง
                  <span
                    className={`text-sm font-normal ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } ml-2`}
                  >
                    รายการ
                  </span>{" "}
                </p>
              </div>
              <div className="border">
                <div className="grid grid-cols-4 gap-5 p-2 m-2 pl-5 text-sm">
                  {["ประเภทงาน", "งาน", "ข้อความ", "วันที่"].map(
                    (event, index) => {
                      return (
                        <div className={index === 3 ? "text-center" : ""}>
                          {event}
                        </div>
                      );
                    }
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
            </div>{" "}
          </div>
        </div>
      </div>
      {PopupDate && (
        <div
          className={`fixed z-50 inset-0 flex items-center justify-center duration-300 bg-black/40 backdrop-blur-sm ${
            fadePopup ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`${bgpopup} rounded-2xl shadow-2xl p-6 w-[500px] max-h-[400px] overflow-auto`}
          >
            <h2 className={` font-semibold text-xl mb-2 ${texthead} `}>
              รายละเอียดรายการ
            </h2>

            {selectedItem &&
              additem.find((item) => item.name === selectedItem.name)
                ?.counting === "ยืนยันเเล้ว" && (
                <p
                  className={`p-3 rounded-lg my-3 text-sm ${
                    theme === "dark"
                      ? "bg-red-900/30 text-red-300"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  รายการนี้ได้รับการยืนยันแล้ว ไม่สามารถยืนยันซ้ำได้
                </p>
              )}
            <p>
              <span className={`${texthead} font-semibold`}>ชื่อ : </span>
              {selectedItem?.name}
            </p>
            <p>
              <span className={`${texthead} font-semibold`}>ผู้ขอเบิก : </span>{" "}
              {selectedItem?.requesterName}
            </p>
            <p>
              <span className={`${texthead} font-semibold`}>
                {" "}
                จำนวนที่ขอเบิก :{" "}
              </span>{" "}
              {selectedItem?.quantity}
            </p>

            {/* --- จำนวนคงเหลือหลังเบิก --- */}
            {selectedItem && (
              <>
                {additem.find((item) => item.name === selectedItem.name) ? (
                  (() => {
                    const itemInStock = additem.find(
                      (item) => item.name === selectedItem.name
                    );
                    // คำนวนจำนวนเหลือ
                    const remaining =
                      Number(itemInStock?.number || 0) -
                      Number(selectedItem.quantity);
                    return (
                      <div>
                        <p>
                          <span className={`${texthead} font-semibold`}>
                            เหลือ :{" "}
                          </span>
                          {itemInStock?.number}
                        </p>
                        <p>
                          <span className={`${texthead} font-semibold`}>
                            หลังยืนยัน:{" "}
                          </span>
                          {remaining >= 0 ? remaining : 0}
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <p>ไม่พบข้อมูลในคลัง</p>
                )}
              </>
            )}
            <button
              onClick={closePopupDate}
              className="mt-4 px-3 py-1 bg-blue-600 text-white rounded-md"
            >
              ปิด
            </button>

            <button
              onClick={handleConfirm}
              className="mt-3 px-3 py-1 rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

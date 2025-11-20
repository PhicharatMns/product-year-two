import React, { useEffect, useState } from "react";
// 1. (แก้ไข) Import ไอคอนที่สื่อความหมายตรงขึ้น
import { Package, BadgeCheck, TriangleAlert } from "lucide-react";
// (ใหม่) 1. Import useTheme
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";
import { Item } from "@radix-ui/react-dropdown-menu";

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

export default function ItemChief() {
  // (ใหม่) 2. เรียกใช้ Hook และกำหนดคลาสตามธีม
  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const textbg = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const bgpopup = theme === "dark" ? "bg-gray-800" : " shadow-sm bg-white";
  const titleColor = theme === "dark" ? "text-yellow-500" : "text-blue-500";

  const [faed, setfaed] = useState(false);
  const [PopupMessage, setPopupMessage] = useState(false);
  const [duplicateFade, setDuplicateFade] = useState(false);
  const [selectedTradesmanId, setSelectedTradesmanId] = useState<string | null>(
    null
  );
  const [PopupNotApproved, setPopupNotApproved] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RequisitionItem | null>(
    null
  );

  const openPopupNotApproved = (item: RequisitionItem) => {
    setSelectedItem(item); // เก็บ item ทั้งตัว
    setPopupMessage(false); // ปิด popup อนุมัติเดิม
    setPopupNotApproved(true);
    setTimeout(() => setDuplicateFade(true), 50);
  };

  // ปิด popup
  const closePopupMessage = () => {
    setDuplicateFade(false);
    setTimeout(() => setPopupNotApproved(false), 300);
  };

  const openPopupMessage = (item: RequisitionItem) => {
    setSelectedItem(item); // เก็บ item ทั้งตัว
    setPopupMessage(true);
    setTimeout(() => setDuplicateFade(true), 50);
  };

  const colsePopupMessage = () => {
    setDuplicateFade(false);
    setTimeout(() => {
      setPopupMessage(false);
      setSelectedTradesmanId(null);
      setRejectReason("");
    }, 200);
  };

  const [RequisitionItems, setRequisitionItems] = useState<RequisitionItem[]>(
    []
  );
  const total = RequisitionItems.length;
  const confirmed = RequisitionItems.filter(
    (item) => item.status === "อนุมัติเเล้วรอการติดต่อคลัง"
  ).length;

  const Waiting_to_receive = RequisitionItems.filter(
    (Item) => Item.status === "ได้รับการยืนยันจากคลังแล้ว"
  ).length;

  const cards = [
    {
      name: "คําขอทั้งหมด",
      num: total,
      icon: Package,
      color: "text-blue-500",
    },
    {
      name: "อนุมัติเเล้วรอการติดต่อคลัง",
      num: confirmed,
      icon: TriangleAlert,
      color: "text-red-500",
    },
    {
      name: "ได้รับการยืนยันจากคลังแล้ว",
      num: Waiting_to_receive,
      icon: BadgeCheck,
      color: "text-green-500",
    },
  ];

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

  const [rejectReason, setRejectReason] = useState("");
  
  const handleApprove = async (itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("ไม่พบ token");

      const payload = {
        status: "อนุมัติเเล้วรอการติดต่อคลัง",
        reasondescriptionstatus: rejectReason || "",
      };

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

      // const data = await res.json();
      if (!res.ok) return alert("อัปเดตสถานะไม่สำเร็จ");

      // อัปเดต state ทันที
      setRequisitionItems((prev) =>
        prev
          .map((i) =>
            i.id === itemId || i._id === itemId
              ? { ...i, status: payload.status }
              : i
          )
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
      );

      colsePopupMessage();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("ไม่พบ token");

      const payload = {
        status: "ไม่อนุมัติ",
        reasondescriptionstatus: rejectReason,
      };

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

      if (!res.ok) {
        alert("อัปเดตสถานะไม่สำเร็จ");
        return;
      }

      // อัปเดต state ทันที
      setRequisitionItems((prev) =>
        prev
          .map((i) =>
            i.id === itemId || i._id === itemId
              ? {
                  ...i,
                  status: "ไม่อนุมัติ",
                  reasondescriptionstatus: rejectReason,
                }
              : i
          )
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // เรียงจากใหม่ -> เก่า
          })
      );

      // ปิด popup และล้างค่า
      closePopupMessage();
      setRejectReason("");
      colsePopupMessage();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setfaed(true), 50);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    fetchRequisitionItems();
  }, []);

  return (
    // (แก้ไข) 6. ใช้ตัวแปร `bg` และเพิ่ม transition
    <div
      className={`max-w-380 mx-auto duration-500 p-5 ${
        faed ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* (แก้ไข) 7. แก้ไข max-w-380 เป็น max-w-7xl */}
      <div className="max-w-380 mx-auto">
        {/* ส่วนหัว (ใช้คลาส text, textSecondary) และเพิ่ม transition */}
        <div className="mb-6">
          <h1
            className={`text-2xl sm:text-3xl font-bold ${textbg} transition-colors duration-300 ease-in-out`}
          >
            หน้าจัดการ (Chief)
          </h1>
          <p
            className={`mt-1 text-sm sm:text-base ${textSecondary} transition-colors duration-300 ease-in-out`}
          >
            ภาพรวมสถิติ และ รายการอนุมัติ
          </p>
        </div>
        {/* grid 3 */}
        <div className="grid grid-cols-3 gap-5">
          {cards.map((e, i) => {
            const Icon = e.icon; // เอา icon จาก array
            return (
              <div
                key={i}
                className={` rounded-xl py-5 pl-5  ${
                  theme === "dark" ? "bg-gray-900" : "bg-white shadow-lg"
                }`}
              >
                <div className="flex gap-3 items-center ">
                  <Icon
                    className={`w-10 ${e.color} h-10 rounded-full p-2 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                    size={24}
                  />
                  <div className="">
                    <p
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-500"
                      }`}
                    >
                      {e.name}
                    </p>
                    <p className="font-semibold text-2xl">{e.num}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="my-5">
          <h2
            className={`text-xl font-semibold ${textbg} transition-colors duration-300 ease-in-out`}
          >
            รายการเบิกของรออนุมัติ
          </h2>
        </div>

        {/* (ใช้คลาส cardBg) และเพิ่ม transition */}
        <div
          className={`border-b pb-2 ${
            theme === "dark" ? "border-yellow-500" : "border-blue-500"
          } `}
        >
          <div className="min-w-[768px]">
            {/* Header (Grid) (ใช้ tableHeaderBg, textSecondary) และเพิ่ม transition */}
            <div
              className={`grid grid-cols-6 gap-4 px-6 font-semibold ${textbg} `}
            >
              <div>ผู้เบิก</div>
              <div>สถานะ</div>
              <div>ประเภท</div>
              <div>จํานวน</div>
              <div>เวลาที่เบิก</div>
              <div className="text-center">จัดการ</div>
            </div>
          </div>
        </div>
        <div className=" h-145 overflow-auto scrollbar-hide">
          {RequisitionItems.sort((a, b) => {
            // ถ้า createdAt เป็น string ให้แปลงเป็น Date ก่อน
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // เรียงจากใหม่ -> เก่า
          }).map((e, i) => {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                <div
                  key={i}
                  className={`grid grid-cols-6 gap-4 px-6 py-2 border mt-2 rounded-lg ${bg}`}
                >
                  <p>{e.requesterName}</p>
                  <p
                    className={` ${
                      e.status === "ไม่อนุมัติ"
                        ? "text-red-500"
                        : e.status === "ได้รับการยืนยันจากคลังแล้ว"
                        ? "text-green-500"
                        : titleColor
                    }`}
                  >
                    {e.status}
                  </p>
                  <p>{e.name}</p>
                  <p>{e.quantity}</p>
                  <p>
                    {e.createdAt
                      ? new Date(e.createdAt).toLocaleString("th-TH", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "-"}
                  </p>
                  <div className="text-center">
                    <button
                      onClick={() => openPopupMessage(e)}
                      className={`relative w-fit overflow-hidden cursor-pointer rounded-md px-3 py-1 text-white text-sm duration-300 
        [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] 
        active:translate-y-1 active:scale-x-110 active:scale-y-90 ${
          theme === "dark"
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
                    >
                      เบิกของ
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {PopupMessage && selectedItem && (
        <div
          className={`fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
            duplicateFade ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`${bgpopup} rounded-2xl shadow-2xl p-6 w-[500px] max-h-[400px] overflow-auto`}
          >
            <h2 className={` font-semibold text-xl mb-3  ${titleColor} `}>
              รายละเอียดรายการ
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <p>
                  <span className={` font-semibold  ${titleColor} `}>
                    ชื่อผู้ขอเบิก:{" "}
                  </span>
                  {selectedItem.requesterName}
                </p>
                <p>
                  <span className={`font-semibold  ${titleColor} `}>
                    {" "}
                    ของที่เบิก:{" "}
                  </span>
                  {selectedItem.name}
                </p>
                <p className="gap-2 flex">
                  <span className={`font-semibold  ${titleColor} `}>
                    {" "}
                    จำนวน:{" "}
                  </span>
                  {selectedItem.quantity}
                  <span>รายการ</span>
                </p>
                <p>
                  <span className={` font-semibold  ${titleColor} `}>
                    {" "}
                    หมายเหตุ:{" "}
                  </span>
                  {selectedItem.description || "-"}
                </p>
                <p>
                  <span className={`font-semibold  ${titleColor} `}>
                    {" "}
                    วันที่ขอเบิก:{" "}
                  </span>
                  {selectedItem.createdAt
                    ? new Date(selectedItem.createdAt).toLocaleString("th-TH", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="border-t mt-5">
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

                  {/* ปุ่มไม่อนุมัติ */}
                  {selectedItem.status !== "ได้รับการยืนยันจากคลังแล้ว" &&
                    selectedItem.status !== "ไม่อนุมัติ" && (
                      <button
                        onClick={() => openPopupNotApproved(selectedItem)}
                        className="group relative py-1 bg-red-500 overflow-hidden rounded-lg border cursor-pointer px-4 text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95"
                      >
                        <span className="relative z-10">ไม่อนุมัติ</span>
                        <span className="absolute inset-0 overflow-hidden pointer-events-none">
                          <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20 transition-all duration-500 group-hover:w-full"></span>
                        </span>
                      </button>
                    )}

                  {/* ปุ่มอนุมัติ */}
                  {selectedItem.status !== "ได้รับการยืนยันจากคลังแล้ว" &&
                    selectedItem.status !== "ไม่อนุมัติ" && (
                      <button
                        onClick={() => handleApprove(selectedItem.id)}
                        className={`group relative py-1 overflow-hidden rounded-lg border cursor-pointer px-4 text-white font-medium shadow-lg transition-transform duration-300 hover:scale-103 active:scale-95 ${
                          theme === "dark"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        <span className="relative z-10">อนุมัติ</span>
                        <span className="absolute inset-0 overflow-hidden pointer-events-none">
                          <span className="absolute left-0 top-0 w-0 h-full bg-white opacity-20 transition-all duration-500 group-hover:w-full"></span>
                        </span>
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {PopupNotApproved && selectedItem && (
        <div
          className={`${
            duplicateFade ? "opacity-100" : "opacity-0"
          } duration-300 inset-0 fixed flex items-center justify-center bg-black/40 backdrop-blur-sm z-50`}
        >
          <div
            className={`rounded-2xl shadow-2xl p-5 w-120 h-90 overflow-y-auto transform transition-all duration-300 ${
              duplicateFade ? "scale-100 opacity-100" : "scale-90 opacity-0"
            } ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center gap-1">
              <p
                className={`font-semibold text-lg ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                รายการ :
              </p>
              <span>{selectedItem.name}</span>
              <p
                className={`font-semibold text-lg ${
                  theme === "dark" ? "text-yellow-500" : "text-blue-500"
                }`}
              >
                จํานวน :
              </p>
              <span>{selectedItem.quantity}</span>
            </div>
            <div
              className={`p-3 my-4 rounded-lg text-sm ${
                theme === "dark"
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
                className={`border rounded-lg p-3 h-28 outline-none transition ${
                  theme === "dark"
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
                onClick={() => handleReject(selectedItem.id)}
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
      )}
    </div>
  );
}

import { useTheme } from "@/components/theme-provider";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
// type ของฟังก์ชัน
export type NotificationItem = {
  time: string;
  job: string;
  name: string;
  Lname: string;
  Description: string;
  title: string;
};

type OutletContextType = {
  openMessAdmin: (item: NotificationItem) => void; // type ของฟังก์ชัน
};

const object = [
  {
    time: "01/10/68",
    job: "ซ่อมแอร์",
    name: "สมชาย",
    Lname: "ใจเย็น",
    Description: "ซื้ออะไหล่แอร์",
    title: "เปลี่ยนคอมเพรสเซอร์",
  },
  {
    time: "03/10/68",
    job: "ติดตั้งไฟ",
    name: "อนันต์",
    Lname: "ทองดี",
    Description: "เบิกสายไฟและหลอดไฟ",
    title: "เดินสายไฟเพิ่ม",
  },
  {
    time: "05/10/68",
    job: "ซ่อมท่อน้ำ",
    name: "สมศรี",
    Lname: "ใจดี",
    Description: "เบิกข้อต่อและกาวทาท่อ",
    title: "รั่วที่ห้องน้ำชั้น 2",
  },
  {
    time: "07/10/68",
    job: "ทำความสะอาด",
    name: "สายฝน",
    Lname: "สุขใจ",
    Description: "เบิกน้ำยาทำความสะอาด",
    title: "ล้างพื้นโรงอาหาร",
  },
  {
    time: "09/10/68",
    job: "งานช่างไม้",
    name: "มานพ",
    Lname: "ใจตรง",
    Description: "เบิกไม้และตะปู",
    title: "ซ่อมโต๊ะเรียน",
  },
  {
    time: "12/10/68",
    job: "ติดตั้งกล้องวงจรปิด",
    name: "ธนกฤต",
    Lname: "พัฒน์ดี",
    Description: "เบิกกล้องและสายแลน",
    title: "ติดตั้งเพิ่มจุดทางเข้า",
  },
  {
    time: "15/10/68",
    job: "ตรวจระบบไฟ",
    name: "ปรีชา",
    Lname: "รักงาน",
    Description: "เบิกมัลติมิเตอร์และไขควง",
    title: "เช็กไฟฟ้าตึกใหม่",
  },
  {
    time: "18/10/68",
    job: "ทาสีอาคาร",
    name: "จิราพร",
    Lname: "สุขสันต์",
    Description: "เบิกสีและลูกกลิ้งทาสี",
    title: "ทาสีห้องประชุม",
  },
  {
    time: "22/10/68",
    job: "ปรับปรุงสวน",
    name: "สมบัติ",
    Lname: "เพียรดี",
    Description: "เบิกต้นไม้และปุ๋ย",
    title: "จัดสวนหน้าอาคาร",
  },
  {
    time: "25/10/68",
    job: "ดูแลระบบอินเทอร์เน็ต",
    name: "นฤมล",
    Lname: "ตั้งใจดี",
    Description: "เบิกเราท์เตอร์และสายแลน",
    title: "เปลี่ยนอุปกรณ์ใหม่",
  },
];

const technicianReports = [
  {
    date: "01/10/68",
    name: "สมชาย ใจเย็น",
    report: "ตรวจเช็คแอร์ห้องประชุมใหญ่",
    detail: "พบว่าคอมเพรสเซอร์เสีย ต้องเปลี่ยนใหม่ นัดเปลี่ยนวันพรุ่งนี้",
  },
  {
    date: "03/10/68",
    name: "อนันต์ ทองดี",
    report: "ติดตั้งระบบไฟเพิ่มเติมในออฟฟิศ",
    detail: "เดินสายไฟใหม่และติดหลอดไฟ LED จำนวน 10 จุด",
  },
  {
    date: "05/10/68",
    name: "สมศรี ใจดี",
    report: "ซ่อมท่อน้ำห้องน้ำหญิง",
    detail: "ท่อรั่วบริเวณข้อต่อ เปลี่ยนใหม่เรียบร้อยแล้ว",
  },
  {
    date: "07/10/68",
    name: "สายฝน สุขใจ",
    report: "ทำความสะอาดโรงอาหาร",
    detail: "ล้างพื้นและเก็บขยะครบทุกโซน ใช้เวลาประมาณ 3 ชั่วโมง",
  },
  {
    date: "10/10/68",
    name: "มานพ ใจตรง",
    report: "ซ่อมโต๊ะเรียนที่หัก",
    detail: "เปลี่ยนขาโต๊ะใหม่ 4 ตัว และตรวจสอบความมั่นคงครบทุกตัว",
  },
  {
    date: "12/10/68",
    name: "ธนกฤต พัฒน์ดี",
    report: "ติดตั้งกล้องวงจรปิดเพิ่ม",
    detail: "ติดตั้งเพิ่ม 2 จุด พร้อมเชื่อมต่อระบบสำเร็จ",
  },
  {
    date: "15/10/68",
    name: "ปรีชา รักงาน",
    report: "ตรวจระบบไฟฟ้าตึกใหม่",
    detail: "ตรวจพบแรงดันไฟตกที่ชั้น 3 ทำการแก้ไขเรียบร้อยแล้ว",
  },
  {
    date: "18/10/68",
    name: "จิราพร สุขสันต์",
    report: "ทาสีห้องประชุมใหญ่",
    detail: "ใช้สีน้ำอะคริลิก 3 แกลลอน ทาสีเสร็จภายในวันเดียว",
  },
  {
    date: "21/10/68",
    name: "สมบัติ เพียรดี",
    report: "จัดสวนหน้าอาคาร",
    detail: "ปลูกต้นไม้ใหม่ 12 ต้น และตัดแต่งกิ่งต้นเก่าเรียบร้อย",
  },
  {
    date: "23/10/68",
    name: "นฤมล ตั้งใจดี",
    report: "ปรับปรุงระบบอินเทอร์เน็ต",
    detail: "เปลี่ยนเราเตอร์ใหม่และเดินสายแลนใหม่ 5 เส้น",
  },
];

export default function Notification() {
  const { theme } = useTheme();
  const { openMessAdmin } = useOutletContext() as OutletContextType;
  const bg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const text = theme === "dark" ? "text-white" : "text-gray-800";
  const [fade, setFade] = useState(false);


  useEffect(() => {
    // เปิด fade หลัง render
    const timer = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"
        }`}
    >
      <div className={`w-max-380 p-4 mx-auto container pt-10 ${text}`}>
        <div className="p-5">
          <p
            className={`text-3xl font-extrabold ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
              }`}
          >
            การแจ้ง
            <span
              className={` ${theme === "dark" ? "text-white" : "text-yellow-500"
                }`}
            >
              เตือน
            </span>
          </p>

          <div className="grid grid-cols-5 gap-5 my-5  ">
            <div className={`border  col-span-3  p-5 rounded-lg ${bg}`}>
              <p
                className={` text-2xl font-semibold ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  }`}
              >
                รายการขอเบิก อุปกรณ์
              </p>
              <div className="grid grid-cols-5 gap-5 my-5 border-b pb-2">
                <p>วันที่</p>
                <p>งาน</p>
                <p>ชื่อนามสกุล</p>
                <p>รายการ</p>
                <p>รายละเอียดงาน</p>
              </div>
              {object.map((event, index) => {
                return (
                  <div
                    onClick={() => openMessAdmin(event)}
                    key={index}
                    className="grid grid-cols-5 gap-5 my-5 border-b duration-500 hover:rounded-lg p-1"
                  >
                    <p>{event.time}</p>
                    <p>{event.job}</p>
                    <p>
                      {event.name} <span>{event.Lname}</span>
                    </p>
                    <p className="truncate">{event.Description}</p>

                    {/* ใส่ปุ่ม Hover */}
                    <p>
                      <button
                        role="link"
                        className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
                      >
                        {event.title}
                      </button>
                    </p>
                  </div>

                );
              })}
            </div>
            {/* รายการ2 */}
            <div className={`border col-span-2 p-5 rounded-lg  ${bg}`}>
              <p
                className={`text-2xl font-semibold ${theme === "dark" ? "text-yellow-500" : "text-blue-500"
                  }`}
              >
                รายงานจากช่าง
              </p>
              <div className="grid grid-cols-4 gap-5 my-5 border-b pb-2">
                <p>วันที่</p>
                <p>งาน</p>
                <p>ชื่อนามสกุล</p>
                <p>รายการ</p>
              </div>
              {technicianReports.map((event, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-5 my-5 border-b hover:bg-gray-300 duration-500 hover:rounded-lg p-1 "
                  >
                    <p>{event.date}</p>
                    <p>{event.name}</p>
                    <p className="truncate">{event.report}</p>
                    <p className="truncate">{event.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useTheme } from "@/components/theme-provider";

export default function Detailwork() {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-gray-800" : "bg-gray-100";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-900/80" : "bg-white";
  const borderSoft = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const titleColor = theme === "dark" ? "text-yellow-400" : "text-blue-600";



  return (
    <div className={`min-h-screen mx-auto container  p-4  ${bg} ${text}`}>
      <div className="p-5 ">
        <h1
          className={`text-3xl  font-extrabold mb-8 sm:mb-8 ${titleColor}`}
        >
          รายละเอียด
          <span className={`${theme === "dark" ? "text-white" : "text-yellow-500"}`}>
            งาน
          </span>
        </h1>


        <div
          className={`shadow-2xl p-6 sm:p-8 md:p-10 transition-all duration-300 rounded-2xl ${cardBg}`}
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {["ชื่องาน :", "ชื่อหัวหน้างาน :", "เบอร์โทรศัพท์ :", "Email :"].map(
              (title, idx) => (
                <div
                  key={idx}
                  className={`border ${borderSoft} rounded-2xl p-4 sm:p-6 font-semibold`}
                >
                  {title}
                </div>
              )
            )}
          </div>




          <div className="text-2xl py-2 font-semibold border p-5 rounded-2xl">รายละเอียดงาน
            <p className="text-sm mt-2 text-gray-500 ">
              งานซ่อมแซมระบบไฟฟ้าภายในอาคารสำนักงานชั้น 3 ตรวจสอบระบบสายไฟ
              และเปลี่ยนหลอดไฟที่ชำรุด พร้อมจัดระเบียบสายไฟให้เรียบร้อย
            </p>
          </div>

          <div className="flex items-start justify-start"></div>
          <div className="grid grid-cols-5  gap-4 mt-5">
            <div
              className={`w-full min-h-[350px] col-span-3 rounded-2xl border ${borderSoft} p-6 text-gray-600`}
            >

              <div className="text-xl font-semibold mb-3 text-green-500">
                รายละเอียดการเบิกของ
              </div>


              <div
                className={`mb-5 p-5 rounded-2xl border border-dashed border-green-500 `}
              >
                <p className={`${text} text-lg`}>
                  การเบิกของได้รับการ{" "}
                  <span className="text-green-400">อนุมัติ</span> เรียบร้อยแล้ว
                </p>
              </div>
            </div>
            <div className="border py-5 px-6 col-span-2 rounded-2xl ">
              <h2 className="text-xl font-semibold text-blue-500 mb-3">
                ข้อความตอบกลับ
              </h2>

            
           
             
 </div>
             

       
<div className="border py-5 px-6 rounded-2xl ">
  <h2 className="text-xl font-semibold text-blue-500 mb-3">
    ข้อความตอบกลับ
  </h2>

  <div
    className={`p-5 rounded-2xl border ${borderSoft}   dark:text-gray-200`}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
      <div className={`col-span-2 ${text} `}>
        <p>
          “ขอบคุณสำหรับการรายงานงานนี้ ตรวจสอบเรียบร้อยดีแล้ว
          ขอให้ดำเนินการตรวจสอบอุปกรณ์เพิ่มเติมอีกครั้งในสัปดาห์หน้า
          และแนบรูปภาพหลังซ่อมในระบบด้วยนะครับ”
        </p>
      </div>

      <div className="col-span-2 text-sm text-gray-500 mt-2">
        — หัวหน้างาน: นายสมชาย แสงทอง (วันที่ตอบกลับ: 23 ตุลาคม 2568)
      </div>
    </div>
  </div>
</div>
</div>

          {/* แผนที่ */}
          <div className="text-2xl mt-10 font-semibold">แผนที่</div>
          <div className="w-full h-[400px] mt-3 rounded-2xl overflow-hidden border border-gray-300">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.484201879492!2d100.5017653152993!3d13.756330390360096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed6e1aa12c3%3A0x6d77e2e0c4a18b2!2sBangkok%2C%20Thailand!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useTheme } from "@/components/theme-provider";

export default function DetailItem() {
  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-gray-800" : "bg-gray-100";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-900/80" : "bg-white";
  const borderSoft = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const titleColor = theme === "dark" ? "text-yellow-400" : "text-blue-600";
  const texthead = theme === "dark" ? "text-yellow-400" : "text-blue-500";
  return (
    <div className={`w-max-380 p-5 mx-auto container `}>
      <div>
        <p className={`text-4xl mb-5 font-bold text-yellow-500`}>
          รายละเอียด
          <span
            className={`${theme === "dark" ? "text-yellow" : "text-blue-500"}`}
          >
            อุปกรณ์
          </span>
        </p>
      </div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium ">กำลังดำเนินการ</span>
        <span className="text-sm font-medium ">45%</span>
      </div>
      <div className=" mb-5 w-full bg-gray-200 rounded-full h-5 dark:bg-gray-400">
        <div
          className="bg-yellow-500 h-5 rounded-full"
          style={{ width: "45%" }}
        ></div>
      </div>


      <ol className="relative text-gray-500 border-s-2 border-gray-200 dark:border-gray-700 dark:text-gray-400">
{/* 1 */}
       <li className="mb-10 ms-6">
          <span className="absolute flex  items-center justify-center w-12 h-12 bg-green-500 rounded-full -start-6 ring-4 ring-white dark:ring-green-500 dark:bg-green-500">
            <svg
              className="w-6 h-6 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
          </span>
          <div className="flex items-center ml-5 mb-1 ">
            <h3 className="font-semibold  text-lg text-green-500 leading-tight">
              ยืนยันคำขอ
            </h3>
            <time className="ms-3 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              5 พ.ย. 2025, 09:35 น.
            </time>
          </div>
          <p className={`ml-5 text-base font-normal ${text}`}>
            Illio, explicabo! Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Fugit necessitatibus dolorum saepe
          </p>
          <hr className={`my-4 ${borderSoft}`} />
        </li>
{/* 2 */}
        <li className="mb-12 ms-12">
          <span className="hover:scale-105 duration-200 absolute flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-full -start-6 ring-4 ring-white dark:ring-yellow-500 dark:bg-yellow-500">
            <svg
              className="w-6 h-6 text-white "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 20 16"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
            </svg>
          </span>
      
          <time className="block mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            5 พ.ย. 2025, 09:35 น.
          </time>
          <h3 className="font-medium text-lg text-yellow-500 leading-tight">
            รอการอนุมัติ
          </h3>
          
           <p className={`ml-5 text-base font-normal ${text}`}>
            Illio, explicabo! Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Fugit necessitatibus dolorum saepe
          </p>
          <hr className={`my-4 ${borderSoft}`} /> 
         
     
      </li>
 
       
        <li className="mb-12 ms-12">
          <span className="absolute flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full -start-6 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
            </svg>
          </span>
         
          <time className="block mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            รอดำเนินการ
          </time>
          <h3 className="font-medium text-lg leading-tight">อนุมัติแล้ว</h3>
           <p className={`ml-5 text-base font-normal ${text}`}>
            Illio, explicabo! Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Fugit necessitatibus dolorum saepe
          </p>
          <hr className={`my-4 ${borderSoft}`} />
       
        </li>

        <li className="ms-12">
          <span className="absolute flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full -start-6 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
            </svg>
          </span>
    
          <time className="block mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            รอดำเนินการ
          </time>
          <h3 className="font-medium text-lg leading-tight">เสร็จสิ้น</h3>
           <p className={`ml-5 text-base font-normal ${text}`}>
            Illio, explicabo! Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Fugit necessitatibus dolorum saepe
          </p>
         <hr className={`my-4 ${borderSoft}`} />
       
        </li>
      </ol>

      <div
        className={`mt-10 p-6 ${cardBg} border ${borderSoft} rounded-lg shadow-md`}
      >
        <h4 className={`text-xl font-semibold mb-4 ${texthead}`}>
          ข้อมูลเพิ่มเติม
        </h4>
        <div className="space-y-4">
          <div className={`flex justify-between ${text}`}>
            <span className="font-medium text-gray-500 dark:text-gray-400">
              ผู้เบิก:
            </span>
            <span className="font-semibold">คุณสมชาย ใจดี</span>
          </div>

          <div className={`flex justify-between ${text}`}>
            <span className="font-medium text-gray-500 dark:text-gray-400">
              รหัสอุปกรณ์:
            </span>
            <span className="font-semibold">SRV-0042</span>
          </div>

          <div className={`flex justify-between ${text}`}>
            <span className="font-medium text-gray-500 dark:text-gray-400">
              วันที่เบิก:
            </span>
            <span className="font-semibold">5 พ.ย. 2025</span>
          </div>

          <div className={`flex justify-between ${text}`}>
            <span className="font-medium text-gray-500 dark:text-gray-400">
              แผนก:
            </span>
            <span className="font-semibold">IT Support</span>
          </div>

          <div className={`flex flex-col mt-4 ${text}`}>
            <span className="font-medium text-gray-500 dark:text-gray-400">
              หมายเหตุ:
            </span>
            <p className={`mt-2 p-3 ${bg} rounded-md border ${borderSoft}`}>
              ขอเบิก Server Rack 1U สำหรับโปรเจคใหม่ ทดแทนตัวเก่าที่ชำรุด
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
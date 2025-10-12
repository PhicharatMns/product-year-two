import { useTheme } from "@/components/theme-provider";

export default function Notification() {
  const { theme } = useTheme();

  const text = theme === "dark" ? "text-white" : "text-gray-800";


  return (
    <div className={`p-6 max-w-380 mx-auto cursor-pointer ${text}`}>
      <p
        className={`text-5xl font-bold ${
          theme === "dark" ? "text-yellow-500" : "text-blue-500"
        }`}
      >
        การแจ้ง
        <span
          className={` ${
            theme === "dark" ? "text-white" : "text-yellow-500"
          }`}
        >
          เตือน
        </span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 mt-5 shadow-xl rounded-xl">
        <div
          className={`hover:scale-101 duration-500 border-b rounded-2xl  p-5`}
        >
          <div className="flex justify-between">
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>โปรเจคบ้านจัดสรร </p>
            <p className="rounded-sm text-sm p-2 bg-red-500 text-white">
              สำคัญ
            </p>
          </div>
          <p className={`mt-2 ml-2  ${theme === 'dark' ?'' : 'text-gray-500'}`}>
            สัมผัสถึงความหรูหรา พร้อมอาคารฟิตเนส รับวิวสวน
            และสระว่ายน้ำระบบเกลือ แยกสระเด็ก และสระผู้ใหญ่ พร้อมจากุชชี่
            รองรับทุกการใช้ชีวิตของทุกคนในครอบครัว
          </p>
        </div>
      </div>
    </div>
  );
}

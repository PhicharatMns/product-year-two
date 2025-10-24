import React from "react";
import { useTheme } from "@/components/theme-provider";
import { Verified } from "lucide-react";

export default function ProfileModern() {
  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const card = theme === "dark" ? "bg-gray-800/90" : "bg-white";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const softText = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const hovercorlor = theme === 'dark' ? 'shadow-yellow-500' : 'shadow-blue-500'

  return (
    <div className={` h-screen  flex flex-col lg:flex-row justify-center items-center gap-8 p-10 transition-all duration-500`}>
      {/* Profile Card */}
      <div className={`flex items-center shadow-lg rounded-xl ${bg}`}>
        <div className={` rounded-3xl p-8 h-150 w-150 flex flex-col justify-center items-center`}>
          <img
            src="https://i.pinimg.com/1200x/98/0f/8e/980f8edaae405546073f9a735058a7df.jpg"
            alt="profile"
            className={`w-100 hover:${hovercorlor} hover:shadow-lg hover:scale-101 duration-400 h-100 rounded-full object-cover mb-6`}
          />

          <h2 className={`text-2xl font-bold mb-1 ${text}`}>กรุงศรี อโสก
            <Verified className="inline-block ml-2 hover: text-blue-500" size={16} />
          </h2>
          <p className={`text-sm ${softText}`}>Admin</p>
        </div>


        <div className="flex flex-col gap-6 justify-center w-150 ">
          <div className={`rounded-3xl p-6`}>
            <div className="flex pl-4 mb-4">
              <h3 className={`text-4xl font-bold " ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>ข้อมูล</h3>
            </div>

            <div className={`space-y-4 text-lg p-5 rounded-2xl ${bg}`}>
              <div className="flex gap-1">
                <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>ชื่อเล่น :</span>
                <p>คมคิด</p>

              </div>
              <div className="flex gap-1">
                <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>ID :</span>
                <p>123-3245-234-23-1</p>

              </div>
              <div className="flex gap-1">
                <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>Birthday :</span>
                <p> 1992-11-18</p>

              </div>
              <div className="flex gap-1">
                <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>Address :</span>
                <p>ที่พักพนักงาน ห้อง____</p>

              </div>
              <div className="flex gap-1">
                <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>Phone_Number</span>
                <p> 098-9089-899</p>

              </div>
              <div className="flex gap-1">
                <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>Email :</span>
                <p> grunsi@gmail.com</p>

              </div>
              <div className="flex gap-1">
                <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>Position  :</span>
                <p>Admin</p>

              </div>
              <div className="flex gap-1">
                <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>Start_data :</span>
                <p> 2025-10-03</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

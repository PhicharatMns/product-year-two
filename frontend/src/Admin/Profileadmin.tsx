import React from "react";
import { useTheme } from "@/components/theme-provider";
import { Mail, Phone, User, Lock, CreditCard, Wifi, Home, DollarSign, Verified } from "lucide-react";

export default function ProfileModern() {
  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const card = theme === "dark" ? "bg-gray-800/90" : "bg-white";
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const softText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`w-screen h-screen ${bg} flex flex-col lg:flex-row justify-center items-center gap-8 p-10 transition-all duration-500`}>
      {/* Profile Card */}
      <div className={`${card} shadow-2xl rounded-3xl p-8 h-150 w-150 flex flex-col justify-center items-center`}>
        <img
          src="https://i.pinimg.com/1200x/98/0f/8e/980f8edaae405546073f9a735058a7df.jpg"
          alt="profile"
          className="w-50 h- rounded-full object-cover mb-6"
        />

        <h2 className={`text-2xl font-bold mb-1 ${text}`}>กรุงศรี อโสก
          <Verified className="inline-block ml-2 text-blue-500" size={16} />
        </h2>
        <p className={`text-sm ${softText}`}>Admin</p>

        

        
      </div>

      
      <div className="flex flex-col gap-6 h-screen justify-center max-w-md">
        
        <div className={`${card} shadow-xl rounded-3xl p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">ข้อมูล</h3>
            <button className="text-sm text-gray-400 hover:text-blue-500">Edit</button>
          </div>

          <div className={`space-y-4 text-sm p-5 rounded-2xl ${bg}`}>
            <div className={`flex justify-between items-center  `}>
              <span>โทรศัพท์ :</span>
                <p>0812345678</p>
            
            </div>
            <div className="flex justify-between items-center">
              <span>Email :</span>
                <p> grunsi@gmail.com</p>
             
            </div>
            <div className="flex justify-between items-center">
              <span>GitHub :</span>
                <p> grunsi_1 </p>
             
            </div>
            <div className="flex justify-between items-center">
              <span>IG :</span>
                <p> grunsi_ok </p>
             
            </div>
            <div className="flex justify-between items-center">
              <span>Facebook :</span>
                <p> grunsi admin</p>
             
            </div>
          </div>
        </div>

       
       
      </div>
    </div>
  );
}

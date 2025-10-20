import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import axios from "axios";

export default function Profile() {
  const { theme } = useTheme();
  const token = localStorage.getItem("token");
  const [Message, setMessage] = useState("");
  const [email, setemail] = useState("");
  const [phones, setphones] = useState("");
  const [position, setposition] = useState("");
  const [profile, setprofile] = useState("");
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/login/dashboardUser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Sidebar response:", response.data);
        setMessage(response.data.Name);
        setemail(response.data.Email);
        setphones(response.data.Phone_Number);
        setposition(response.data.Position);
        setprofile(response.data.Profile);
      } catch (err) {
        console.error("Fetch sidebar message error:", err);
      }
    };

    fetchData();
  }, [token]);

  //ค่าสี
  const text = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-900/70" : "bg-white";
  const borderSoft =
    theme === "dark" ? "border-yellow-300/10" : "border-blue-200/50";
  const titleColor = theme === "dark" ? "text-yellow-400" : "text-blue-600";
  const accentColor = theme === "dark" ? "text-yellow-300" : "text-blue-500";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 `}
    >
      <div
        className={`flex flex-wrap rounded-3xl shadow-xl overflow-hidden max-w-6xl w-full ${text} ${cardBg} backdrop-blur-md`}
      >
        <div className="flex flex-col items-center justify-start p-10 md:w-1/3 text-center border-b md:border-b-0 md:border-r border-blue-100/40">
          <h1 className="text-4xl font-bold mb-8">
            Pro<span className={accentColor}>file</span>
          </h1>

          <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-blue-400/40 mb-4">
            <img
              src={`http://localhost:5000/uploads/Profile/${Profile}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-blue-400">{Message}</h2>
            <p className="text-sm opacity-80">ช่างมืออาชีพ พร้อมให้บริการ</p>
          </div>
        </div>

        <div className="flex-1 p-10 space-y-8">
          <div
            className={`rounded-2xl p-6 shadow-md border ${borderSoft} ${cardBg} transition-all duration-300 hover:shadow-lg`}
          >
            <h2
              className={`text-2xl font-semibold mb-4 border-b-2 pb-2 ${titleColor} border-current`}
            >
              ข้อมูลติดต่อ
            </h2>
            <div className="space-y-2 leading-relaxed">
              <p>
                {" "}
                เบอร์โทรศัพท์ : <b>{phones}</b>
              </p>
              <p>ชื่อเล่น :</p>
              <p>อีเมล : {email}</p>
              <p>วันที่เริ่มงาน : </p>
              <p>วันเดือนปีเกิด :</p>
              <p>ตำแหน่ง :</p>
              <p>เบอร์โทรติดต่อ :</p>
              <p></p>
            </div>
          </div>

          <div
            className={`rounded-2xl p-6 shadow-md border ${borderSoft} ${cardBg} transition-all duration-300 hover:shadow-lg`}
          >
            <h2
              className={`text-2xl font-semibold mb-4 border-b-2 pb-2 ${
                theme === "dark" ? "text-yellow-300" : "text-yellow-500"
              } border-current`}
            >
              ที่อยู่
            </h2>
            <div className="space-y-2 leading-relaxed">
              {/* <p> ตำแหน่ง: <b>{skill.position}</b></p>
              <p> ประสบการณ์ทำงาน: {skill.experience}</p>
              <p> เครื่องมือส่วนตัว: {skill.tools}</p>
              <p>สัญญาจ้าง: {skill.contract}</p>
              <p> ประกันอุบัติเหตุ: {skill.insurance}</p>
              <p> วันที่เริ่มงาน: <b>{skill.startDate}</b></p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

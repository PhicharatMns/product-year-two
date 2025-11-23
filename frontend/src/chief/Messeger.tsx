import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import {
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Search,
} from "lucide-react";
import { CiSearch } from "react-icons/ci";

type typeMessage = {
  _id: string;
  Name: string;
  Nickname: string;
  Profile: string;
  role: string;
  Position: string;
  requireNameinMessage: string;
};

import * as jwt_decode from "jwt-decode"; // แบบ non-default

export default function Messager() {
  const { theme } = useTheme();
  const [Message, setMessage] = useState<typeMessage[]>([]);
  const [selectedUser, setSelectedUser] = useState<typeMessage | null>(null);
  const [Focused, setFocused] = useState(false);

  const fetchMessagess = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login/all-tradesman");
      const data = await res.json();
      setMessage(data);
    } catch (err) {
      console.error(err);
    }
  };
  const token = localStorage.getItem("token"); // หรือ cookie
  let loggedInUserName = "ไม่ทราบชื่อ";

  if (token) {
    try {
      const decoded: any = (jwt_decode as any)(token);
      loggedInUserName = decoded.Name || "ไม่ทราบชื่อ";
    } catch (err) {
      console.error("JWT decode error:", err);
      loggedInUserName = "ไม่ทราบชื่อ";
    }
  }

  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!selectedUser || !text.trim()) return;

    const newMessage = {
      Name: selectedUser.Name,
      ID: selectedUser._id,
      Profile: selectedUser.Profile,
      message: text,
      role: selectedUser.role,
      Position: selectedUser.Position,
      requireNameinMessage: loggedInUserName, // ชื่อเราแสดงใน message
    };

    try {
      const res = await fetch("http://localhost:5000/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newMessage),
      });

      const data = await res.json();

      // อัปเดตข้อความทันทีใน state (แสดงทันที)
      setMessages((prev) => [...prev, data]);

      //  ดึงข้อมูลใหม่จาก server ทันที (ป้องกันไม่ sync)
      fetchMessages();

      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const [messages, setMessages] = useState<typeMessage[]>([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/message/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("ดึงข้อความล้มเหลว:", err);
    }
  };

  useEffect(() => {
    fetchMessagess(); // ดึงรายชื่อช่าง
    fetchMessages(); // ดึงข้อความครั้งแรก
  }, []);

  const isDark = theme === "dark";

  const primaryText = isDark ? "text-yellow-500" : "text-blue-500";
  const subText = isDark ? "text-gray-400" : "text-gray-500";
  const bg = isDark ? "bg-gray-900" : "shadow-sm bg-white";

  const countIssue = Message.filter((m) => m.role === "issue").length;
  const countUrgent = Message.filter((m) => m.role === "urgent").length;
  const countMessage = Message.length;

  return (
    <div className={`max-w-380 mx-auto container p-5 min-h-screen`}>
      {/* Header Section */}
      <div className="mb-6 shrink-0">
        <h1 className={`text-2xl font-semibold mb-1 ${primaryText}`}>
          ภาพรวมข้อความจากช่าง
        </h1>
        <p className={`${subText} text-sm`}>
          จัดการและติดตามข้อความแจ้งเตือนทั้งหมดในระบบ
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 shrink-0">
        <div
          className={`${bg} p-4 lg:p-6 rounded-xl flex items-center justify-between`}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`p-2 rounded-lg bg-opacity-10 ${primaryText} bg-current`}
              >
                <MessageSquare size={20} />
              </div>
              <span className={`${subText} font-medium text-sm lg:text-base`}>
                แจ้งปัญหา
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold">{countIssue}</h2>
          </div>
        </div>

        <div
          className={`${bg} p-4 lg:p-6 rounded-xl flex items-center justify-between`}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                <AlertTriangle size={20} />
              </div>
              <span className={`${subText} font-medium text-sm lg:text-base`}>
                เหตุด่วน
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold">{countUrgent}</h2>
          </div>
        </div>

        <div
          className={`${bg} p-4 lg:p-6 rounded-xl flex items-center justify-between`}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <CheckCircle size={20} />
              </div>
              <span className={`${subText} font-medium text-sm lg:text-base`}>
                ข้อความ
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold">{countMessage}</h2>
          </div>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4  lg:gap-6 flex-1 min-h-0">
        {/* Left: List */}
        <div
          className={`lg:col-span-8 ${bg} rounded-xl overflow-hidden flex flex-col h-full`}
        >
          <div className="flex 5 justify-between items-center">
            <div className=" p-2 grid grid-cols-3 w-fit gap-3">
              {["ทั้งหมด", "ช่าง", "หัวหน้าช่าง"].map((e, i) => (
                <div
                  className={`border text-center px-2 rounded-full py-1 text-white ${
                    theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                  }`}
                  key={i}
                >
                  {e}
                </div>
              ))}
            </div>

            <div className="relative pr-4">
              <CiSearch
                className={`absolute left-3 top-1/2 -translate-y-1/2 `}
              />

              <input
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="ค้นหา..."
                className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 border
                              ${
                                theme === "dark"
                                  ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border"
                                  : "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border"
                              }}
                              ${Focused ? "w-72" : "w-60"} `}
              />
            </div>
          </div>
          {/* Table Header */}
          <div
            className={`grid grid-cols-12 ${
              isDark ? "bg-gray-900/30" : "bg-gray-50"
            } p-4 text-xs uppercase font-semibold tracking-wider ${subText} shrink-0`}
          >
            <div className="col-span-6">ชื่อ / ตำแหน่ง</div>
            <div className="col-span-3 text-center hidden sm:block">สถานะ</div>
            <div className="col-span-3 text-end hidden sm:block">จัดการ</div>
          </div>

          {/* Table Rows */}
          <div
            className={`divide-y overflow-y-auto overscroll-contain flex-1 ${
              isDark ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            {Message.map((e) => (
              <div
                key={e._id}
                onClick={() => setSelectedUser(e)} //  กดเลือกชื่อ
                className={`grid grid-cols-12 px-4 py-2 cursor-pointer `}
              >
                <div className="col-span-6">
                  {e.Name} / {e.Position}
                </div>
                <div className="col-span-3 text-center hidden sm:block">
                  {e.role}
                </div>
                <div className="col-span-3 text-end hidden sm:block">
                  จัดการ
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected User Panel */}
        <div className={`col-span-4 h-165 ${bg} rounded-lg px-4`}>
          {!selectedUser ? (
            <p className={subText}>➤ เลือกรายชื่อจากด้านซ้ายเพื่อแสดงข้อมูล</p>
          ) : (
            <div className="h-158 flex flex-col">
              {/* ส่วนข้อมูล */}
              <div className="rounded-lg p-4 flex-1 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  {selectedUser.Profile && (
                    <img
                      src={`http://localhost:5000/uploads/Profile/${
                        selectedUser.Profile || "default.png"
                      }`}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="">
                    <h2 className="text-lg font-semibold items-center">
                      {selectedUser.Name}
                    </h2>
                    <span className={`${subText}`}>
                      ตำแหน่ง: {selectedUser.Position}
                      <span> /สายงาน : {selectedUser.role}</span>
                    </span>
                  </div>
                </div>

                {/* แสดงข้อความเฉพาะ ID ตรงกับ selectedUser._id */}
                {messages
                  .filter(
                    (msg) =>
                      msg.ID === selectedUser._id ||
                      msg.requireNameinMessage === selectedUser.Name
                  )
                  .map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-2 p-2 rounded-lg border ${
                        msg.requireNameinMessage === loggedInUserName
                          ? "bg-blue-100 text-right"
                          : "bg-gray-100 text-left"
                      }`}
                    >
                      <span className="text-sm font-semibold">
                        {msg.requireNameinMessage || "ไม่ทราบชื่อ"}:
                      </span>{" "}
                      <span className="text-sm">{msg.message}</span>
                      <br />
                      <span className="text-xs text-gray-400">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>

              {/* ช่องกรอกข้อความ */}
              <div className="mt-3">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="border w-full p-2 rounded-lg"
                  placeholder="พิมพ์ข้อความ..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

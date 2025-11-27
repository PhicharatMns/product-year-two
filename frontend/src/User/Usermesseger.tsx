import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { AlertTriangle, CheckCircle, MessageSquare, Send } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import * as jwt_decode from "jwt-decode";
import { HiUsers } from "react-icons/hi2";

type typeMessage = {
  _id: string;
  Name: string;
  Nickname: string;
  Profile: string;
  role: string;
  Position: string;
  requireNameinMessage: string;
  message?: string;
  problem?: string;
  ID?: string; // สำหรับเช็ค selectedUser._id
};

export default function Usermesseger() {
  const { theme } = useTheme();
  const [Message, setMessage] = useState<typeMessage[]>([]);
  const [messages, setMessages] = useState<typeMessage[]>([]);
  const [selectedUser, setSelectedUser] = useState<typeMessage | null>(null);
  const [Focused, setFocused] = useState(false);
  const [text, setText] = useState("");
  const [name, setName] = useState("Chief");
  const [showMenu, setShowMenu] = useState(false);
  const [problemType, setProblemType] = useState("");
  const [loggedInUserName, setLoggedInUserName] = useState("ไม่ทราบชื่อ");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = (jwt_decode as any)(token);
        setLoggedInUserName(decoded.Name || "ไม่ทราบชื่อ");
      } catch (err) {
        console.error("JWT decode error:", err);
      }
    }
  }, [token]);

  // Motion counts
  const countIssueMV = useMotionValue(0);
  const countUrgentMV = useMotionValue(0);
  const countMessageMV = useMotionValue(0);

  const countIssue = useTransform(countIssueMV, Math.round);
  const countUrgent = useTransform(countUrgentMV, Math.round);
  const countMessage = useTransform(countMessageMV, Math.round);

  const [selectedRole, setSelectedRole] = useState<
    "all" | "user" | "admin" | "chief" | "executive"
  >("all");

  // ดึงรายชื่อช่าง
  const fetchMessagess = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login/all-tradesman");
      const data = await res.json();
      setMessage(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ดึงข้อความ
  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/message/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("ดึงข้อความล้มเหลว:", err);
    }
  };

  // อัปเดตตัวเลขนับ
  const updateCounts = (msgs: typeMessage[]) => {
    const issueCount = msgs.filter((m) => m.problem === "issue").length;
    const urgentCount = msgs.filter((m) => m.problem === "urgent").length;
    const messageCount = msgs.length;

    animate(countIssueMV, issueCount, { duration: 1.5 });
    animate(countUrgentMV, urgentCount, { duration: 1.5 });
    animate(countMessageMV, messageCount, { duration: 1.5 });
  };

  // ส่งข้อความ
  const sendMessage = async () => {
    if (!selectedUser || !text.trim()) return;

    const newMessage = {
      Name: selectedUser.Name,
      ID: selectedUser._id,
      Profile: selectedUser.Profile,
      message: text,
      role: selectedUser.role,
      Position: selectedUser.Position,
      requireNameinMessage: loggedInUserName,
      problem: problemType,
    };

    try {
      const res = await fetch("http://localhost:5000/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMessage),
      });
      const data = await res.json();
      // เพิ่มข้อความใหม่ทันที
      const updatedMessages = [...messages, data.data];
      setMessages(updatedMessages);
      updateCounts(updatedMessages); // อัปเดตตัวเลขทันที
      setText("");
      setProblemType("");
    } catch (err) {
      console.error(err);
    }
  };

  const markAsCommit = async (msgId: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/message/update-problem/${msgId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ problem: "commit" }),
        }
      );
      const data = await res.json();
      if (data.success) {
        const updatedMessages = messages.map((msg) =>
          msg._id === msgId ? { ...msg, problem: "commit" } : msg
        );
        setMessages(updatedMessages);
        updateCounts(updatedMessages);
      }
    } catch (err) {
      console.error("อัปเดตปัญหาล้มเหลว:", err);
    }
  };

  const handleEmergency = () => {
    setProblemType("urgent");
    setShowMenu(false);
  };
  const handleReport = () => {
    setProblemType("issue");
    setShowMenu(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/login/dashboardUser",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setName(response.data.Name || "ไม่ระบุชื่อ"); // สำหรับ display บนหน้า
        setLoggedInUserName(response.data.Name || "ไม่ทราบชื่อ"); // สำหรับส่งข้อความ
      } catch (err) {
        console.error("Sidebar fetch error:", err);
      }
    };
    fetchData();
    fetchMessagess();
    fetchMessages();
  }, []);

  const isDark = theme === "dark";
  const primaryText = isDark ? "text-yellow-500" : "text-blue-500";
  const subText = isDark ? "text-gray-400" : "text-gray-500";
  const bg = isDark ? "bg-gray-900" : "shadow-sm bg-white";
  const texthead = theme === "dark" ? "text-yellow-500" : "text-blue-500";

  return (
    <div
      className={`max-w-380 container mx-auto container p-4 sm:p-5 min-h-screen`}
    >
      {/* Header */}
      <div className="mb-6 shrink-0">
        <h1
          className={`text-2xl sm:text-3xl font-semibold mb-1 ${primaryText}`}
        >
          ภาพรวมข้อความจากช่าง
        </h1>
        <p className={`${subText} text-sm`}>
          จัดการและติดตามข้อความแจ้งเตือนทั้งหมดในระบบ
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-4 shrink-0">
        {/* แจ้งปัญหา */}
        <div
          className={`rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-md border ${bg}`}
        >
          <div className="flex gap-3 items-center">
            <div className={`p-3 rounded-full bg-gray-500/10 text-blue-500`}>
              <MessageSquare size={20} />
            </div>
            <div className="flex flex-col font-semibold text-sm sm:text-base">
              <p className={`${texthead}`}>แจ้งปัญหา</p>
              <motion.span className="text-lg">{countIssue}</motion.span>
            </div>
          </div>
        </div>

        {/* เหตุด่วน */}
        <div
          className={`rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-md border ${bg}`}
        >
          <div className="flex gap-3 items-center">
            <div className={`p-3 rounded-full bg-rose-500/10 text-rose-500`}>
              <AlertTriangle size={20} />
            </div>
            <div className="flex flex-col font-semibold text-sm sm:text-base">
              <span className={`${texthead} font-medium`}>เหตุด่วน</span>
              <motion.span className="text-lg">{countUrgent}</motion.span>
            </div>
          </div>
        </div>

        {/* ข้อความ */}
        <div
          className={`rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-md border ${bg}`}
        >
          <div className="flex gap-3 items-center">
            <div
              className={`p-3 rounded-full bg-emerald-500/10 text-emerald-500`}
            >
              <CheckCircle size={20} />
            </div>
            <div className="flex flex-col font-semibold text-sm sm:text-base">
              <span className={`${texthead} font-medium`}>ข้อความ</span>
              <motion.span className="text-lg">{countMessage}</motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 flex-1 min-h-0">
        {/* Left */}
        <div
          className={`lg:col-span-8 ${bg} rounded-xl overflow-hidden flex flex-col h-full`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 p-2">
            <div className="p-1 sm:p-3 grid grid-cols-3 sm:grid-cols-5 w-full gap-2 sm:gap-2">
              {["all", "user", "admin", "chief", "executive"].map((role, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedRole(role)}
                  className={`truncate text-center cursor-pointer rounded-md px-2 sm:px-4 py-1 text-white text-xs sm:text-sm shadow-md transition-all duration-300 active:-translate-y-1 active:scale-x-90 active:scale-y-110
                ${selectedRole === role ? "bg-yellow-500" : "bg-blue-500"}`}
                >
                  {role === "all" ? "ทั้งหมด" : role}
                </div>
              ))}
            </div>
            <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="ค้นหา..."
                className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 border w-full sm:w-${
                  Focused ? "72" : "60"
                } ${
                  theme === "dark"
                    ? "bg-gray-700 text-white focus:ring-yellow-400 border"
                    : "bg-white text-gray-800 focus:ring-blue-400 border"
                }`}
              />
            </div>
          </div>

          <div className={`border`}>
            <div
              className={`grid grid-cols-5 pl-2 sm:pl-5 py-1 m-2 text-xs sm:text-sm uppercase font-semibold tracking-wider shrink-0`}
            >
              <div className="col-span-2">ชื่อ / สายงาน</div>
              <div className="hidden sm:block">ตําเเหน่ง</div>
              <div className="hidden sm:block">เบอร์ติดต่อ</div>
              <div className="hidden sm:block">Email</div>
            </div>
          </div>

          <div
            className={`overflow-y-auto scrollbar-hide h-72 sm:h-145 ${
              isDark ? "divide-gray-800" : "divide-gray-200"
            }`}
          >
            {Message.filter(
              (e) =>
                e.Name !== name &&
                (selectedRole === "all" || e.role === selectedRole)
            ).map((e, i) => (
              <motion.div
                key={e._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <div
                  onClick={() => setSelectedUser(e)}
                  className={`grid grid-cols-5 border items-center rounded-lg pl-2 sm:pl-5 m-1 sm:m-2 py-2 cursor-pointer ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div className="col-span-2 flex items-center gap-2 sm:gap-3">
                    <img
                      src={`http://localhost:5000/uploads/Profile/${
                        e.Profile || "default.png"
                      }`}
                      alt="profile"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    {e.Name} / {e.Position}
                  </div>

                  <div className="hidden sm:block">
                    {{
                      admin: "แอดมิน",
                      user: "ช่าง",
                      chief: "หัวหน้าช่าง",
                      executive: "ผู้บริหาร",
                    }[e.role] || e.role}
                  </div>

                  <div className="hidden sm:block">{e.Phone_Number}</div>
                  <div className="hidden sm:block">{e.Email}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div
          className={`col-span-4 h-auto sm:h-178 ${bg} rounded-lg mt-3 sm:mt-0`}
        >
          {!selectedUser ? (
            <div
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } flex items-center justify-center h-full`}
            >
              <div className="flex-col text-center">
                <HiUsers size={60} className="mx-auto mb-2" />
                <p>เลือกรายชื่อจากด้านซ้ายเพื่อแสดงข้อมูล</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* ข้อมูลผู้ใช้ */}
              <div className="rounded-xl flex-1 overflow-y-auto">
                <div
                  className={`flex items-center px-4 border-b-2 py-3 gap-3 mb-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {selectedUser.Profile && (
                    <img
                      src={`http://localhost:5000/uploads/Profile/${
                        selectedUser.Profile || "default.png"
                      }`}
                      alt="profile"
                      className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">
                      {selectedUser.Name}
                    </h2>
                    <span className={subText}>
                      ตำแหน่ง: {selectedUser.Position} / สายงาน:{" "}
                      {{
                        admin: "แอดมิน",
                        user: "ช่าง",
                        chief: "หัวหน้าช่าง",
                        executive: "ผู้บริหาร",
                      }[selectedUser.role] || selectedUser.role}
                    </span>
                  </div>
                </div>

                <div className="h-60 sm:h-138 overflow-y-auto px-2 sm:px-4">
                  {messages
                    .filter(
                      (msg) =>
                        (msg.Name === selectedUser.Name &&
                          msg.requireNameinMessage === loggedInUserName) ||
                        (msg.Name === loggedInUserName &&
                          msg.requireNameinMessage === selectedUser.Name)
                    )
                    .map((msg) => (
                      <div
                        key={msg._id}
                        className={`relative mb-2 p-2 sm:p-3 rounded-xl border shadow-sm ${
                          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        {(msg.problem === "urgent" ||
                          msg.problem === "issue") && (
                          <button
                            onClick={() => markAsCommit(msg._id)}
                            className="absolute top-1 sm:top-2 right-1 sm:right-2 px-2 py-1 text-xs sm:text-sm text-white rounded-md shadow-md bg-green-500 hover:bg-green-600 transition-all duration-300"
                          >
                            รับเรื่อง
                          </button>
                        )}

                        <div className="flex items-start gap-2 sm:gap-3">
                          <img
                            src={`http://localhost:5000/uploads/Profile/${
                              "adminProfile" || "default.png"
                            }`}
                            alt="profile"
                            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <p
                              className={`text-xs sm:text-sm font-semibold ${
                                theme === "dark"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                              }`}
                            >
                              นาย :{" "}
                              <span
                                className={`${
                                  theme === "dark" ? "text-white" : "text-black"
                                }`}
                              >
                                {msg.requireNameinMessage}{" "}
                                {new Date(msg.timestamp).toLocaleString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </p>
                            <p className="text-xs sm:text-sm break-all w-[85%]">
                              <span
                                className={`font-medium ${
                                  msg.problem === "urgent"
                                    ? "text-red-500"
                                    : msg.problem === "issue"
                                    ? "text-blue-500"
                                    : ""
                                }`}
                              >
                                {msg.problem === "urgent"
                                  ? "เหตุด่วน"
                                  : msg.problem === "issue"
                                  ? "แจ้งปัญหา"
                                  : "ข้อความ"}
                              </span>
                              : {msg.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* ช่องกรอกข้อความ */}
              <div className="my-3 sm:mt-3 px-2 sm:px-4 flex gap-2 items-center">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className={`flex-1 border p-2 rounded-lg focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 text-white focus:ring-yellow-400 border"
                      : "bg-white text-gray-800 focus:ring-blue-400 border"
                  }`}
                  placeholder="พิมพ์ข้อความ..."
                />
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className={`relative px-3 py-2 text-white text-xs sm:text-sm rounded-md shadow-md transition-all duration-300 ${
                      theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                    }`}
                  >
                    ตัวเลือก
                  </button>
                  {showMenu && (
                    <div
                      className={`absolute left-0 bottom-12 mt-1 border rounded-lg shadow-lg w-32 z-50 ${
                        theme === "dark" ? "bg-black" : "bg-white"
                      }`}
                    >
                      <button
                        onClick={handleEmergency}
                        className={`w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-800 ${
                          theme === "dark" ? "" : "hover:bg-gray-200"
                        }`}
                      >
                        เหตุด่วน
                      </button>
                      <button
                        onClick={handleReport}
                        className={`w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-800 ${
                          theme === "dark" ? "" : "hover:bg-gray-200"
                        }`}
                      >
                        แจ้งปัญหา
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  className={`relative px-3 py-0.5 text-white text-xs sm:text-sm rounded-md shadow-md transition-all duration-300 ${
                    theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                  }`}
                >
                  <Send size={16} /> ส่ง
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

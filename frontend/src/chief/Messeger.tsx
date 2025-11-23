import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { AlertTriangle, CheckCircle, MessageSquare, Send } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import * as jwt_decode from "jwt-decode";

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

export default function Messager() {
  const { theme } = useTheme();
  const [Message, setMessage] = useState<typeMessage[]>([]);
  const [messages, setMessages] = useState<typeMessage[]>([]);
  const [selectedUser, setSelectedUser] = useState<typeMessage | null>(null);
  const [Focused, setFocused] = useState(false);
  const [text, setText] = useState("");
  const [name, setName] = useState("Chief");
  const [showMenu, setShowMenu] = useState(false);
  const [problemType, setProblemType] = useState("");

  const token = localStorage.getItem("token");
  let loggedInUserName = "ไม่ทราบชื่อ";
  if (token) {
    try {
      const decoded: any = (jwt_decode as any)(token);
      loggedInUserName = decoded.Name || "ไม่ทราบชื่อ";
    } catch (err) {
      console.error("JWT decode error:", err);
    }
  }

  // Motion counts
  const countIssueMV = useMotionValue(0);
  const countUrgentMV = useMotionValue(0);
  const countMessageMV = useMotionValue(0);

  const countIssue = useTransform(countIssueMV, Math.round);
  const countUrgent = useTransform(countUrgentMV, Math.round);
  const countMessage = useTransform(countMessageMV, Math.round);

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

    animate(countIssueMV, issueCount, { duration: 0.5 });
    animate(countUrgentMV, urgentCount, { duration: 0.5 });
    animate(countMessageMV, messageCount, { duration: 0.5 });
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
        setName(response.data.Name || "ไม่ระบุชื่อ");
      } catch (err) {
        console.error("Sidebar fetch error:", err);
      }
    };
    fetchData();
    fetchMessagess();
    fetchMessages();
  }, []);

  useEffect(() => {
    updateCounts(messages);
  }, [messages]);

  const isDark = theme === "dark";
  const primaryText = isDark ? "text-yellow-500" : "text-blue-500";
  const subText = isDark ? "text-gray-400" : "text-gray-500";
  const bg = isDark ? "bg-gray-900" : "shadow-sm bg-white";

  return (
    <div className={`max-w-380 mx-auto container p-5 min-h-screen`}>
      {/* Header */}
      <div className="mb-6 shrink-0">
        <h1 className={`text-2xl font-semibold mb-1 ${primaryText}`}>
          ภาพรวมข้อความจากช่าง
        </h1>
        <p className={`${subText} text-sm`}>
          จัดการและติดตามข้อความแจ้งเตือนทั้งหมดในระบบ
        </p>
      </div>

      {/* Cards */}
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
            <motion.span>{countIssue}</motion.span>
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
            <motion.span>{countUrgent}</motion.span>
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
            <motion.span>{countMessage}</motion.span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6 flex-1 min-h-0">
        {/* Left */}
        <div
          className={`lg:col-span-8 ${bg} rounded-xl overflow-hidden flex flex-col h-full`}
        >
          <div className="flex 5 justify-between items-center">
            <div className="p-2 grid grid-cols-3 w-fit gap-3">
              {["ทั้งหมด", "ช่าง", "หัวหน้าช่าง"].map((e, i) => (
                <div
                  key={i}
                  className={`border text-center px-2 rounded-full py-1 text-white ${
                    theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                  }`}
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
                className={`pl-10 pr-3 py-1 rounded-xl transition-all duration-300 border ${
                  theme === "dark"
                    ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border"
                    : "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border"
                } ${Focused ? "w-72" : "w-60"}`}
              />
            </div>
          </div>

          <div
            className={`grid grid-cols-12 ${
              isDark ? "bg-gray-900/30" : "bg-gray-50"
            } p-4 text-xs uppercase font-semibold tracking-wider ${subText} shrink-0`}
          >
            <div className="col-span-6">ชื่อ / ตำแหน่ง</div>
            <div className="col-span-3 text-center hidden sm:block">สถานะ</div>
            <div className="col-span-3 text-end hidden sm:block">จัดการ</div>
          </div>

          <div
            className={`divide-y overflow-y-auto overscroll-contain flex-1 ${
              isDark ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            {Message.filter((e) => e.Name !== name).map((e) => (
              <div
                key={e._id}
                onClick={() => setSelectedUser(e)}
                className={`grid grid-cols-12 px-4 py-2 cursor-pointer`}
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

        {/* Right */}
        <div className={`col-span-4 h-165 ${bg} rounded-lg px-4`}>
          {!selectedUser ? (
            <p className={subText}>➤ เลือกรายชื่อจากด้านซ้ายเพื่อแสดงข้อมูล</p>
          ) : (
            <div className="h-158 flex flex-col">
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
                  <div>
                    <h2 className="text-lg font-semibold items-center">
                      {selectedUser.Name}
                    </h2>
                    <span className={subText}>
                      ตำแหน่ง: {selectedUser.Position} / สายงาน:{" "}
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                {messages
                  .filter(
                    (msg) =>
                      msg?.ID === selectedUser?._id ||
                      msg?.requireNameinMessage === loggedInUserName
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
                        {msg.problem}
                      </span>
                      <br />
                      {(msg.problem === "urgent" ||
                        msg.problem === "issue") && (
                        <button
                          onClick={() => markAsCommit(msg._id)}
                          className="mt-1 px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                        >
                          เปลี่ยนเป็น commit
                        </button>
                      )}
                    </div>
                  ))}
              </div>

              {/* ช่องกรอกข้อความ */}
              <div className="mt-3 flex gap-2 items-center relative">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="พิมพ์ข้อความ..."
                />
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="px-3 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition"
                  >
                    ตัวเลือก
                  </button>
                  {showMenu && (
                    <div className="absolute left-0 bottom-12 mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg w-32 z-50">
                      <button
                        onClick={handleEmergency}
                        className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-t-lg"
                      >
                        เหตุด่วน
                      </button>
                      <button
                        onClick={handleReport}
                        className="w-full text-left px-4 py-2 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-b-lg"
                      >
                        แจ้งปัญหา
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={sendMessage}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                >
                  <Send size={16} />
                  ส่ง
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

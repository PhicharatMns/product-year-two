import { useTheme } from "@/components/theme-provider";
import { FileText, AlertCircle, Bell, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

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

const Header = ({
  textHeader,
  textHeaderLow,
  bgHeader,
}: {
  textHeader: string;
  textHeaderLow: string;
  bgHeader: string;
}) => {
  const { theme } = useTheme();

  const dataHeader = [
    {
      totalreports: "งานทั้งหมด",
      value: "1",
      icon: <FileText size={24} />,
      bg: theme === "dark" ? "bg-yellow-900/40" : "bg-yellow-100",
      color: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
    },
    {
      totalreports: "แจ้งปัญหา",
      value: "1",
      icon: <AlertCircle size={24} />,
      bg: theme === "dark" ? "bg-red-900/40" : "bg-red-100",
      color: theme === "dark" ? "text-red-400" : "text-red-600",
    },
    {
      totalreports: "เหตุด่วน",
      value: "1",
      icon: <Bell size={24} />,
      bg: theme === "dark" ? "bg-orange-900/40" : "bg-orange-100",
      color: theme === "dark" ? "text-orange-400" : "text-orange-600",
    },
    {
      totalreports: "จำนวนอุปกรณ์ทั้งหมด",
      value: "1",
      icon: <Cpu size={24} />,
      bg: theme === "dark" ? "bg-blue-900/40" : "bg-blue-100",
      color: theme === "dark" ? "text-blue-400" : "text-blue-600",
    },
  ];

  return (
    <div>
      <div className="text-3xl font-semibold mb-1">
        <span className={`${textHeader}`}>รายงาน</span>{" "}
        <span className={`${textHeaderLow}`}>ผู้บริหาร</span>
      </div>
      <p className="text-sm">ติดตามสถานะรายงานเเละงานต่าง</p>
      <div className="grid grid-cols-4 gap-5">
        {dataHeader.map((e, i) => {
          return (
            <div
              key={i}
              className={`flex ${bgHeader} items-center gap-2 p-5 border rounded-lg my-5`}
            >
              <div className={`${e.color} ${e.bg} p-2 rounded-full`}>
                {e.icon}
              </div>
              <div className="pl-3 font-semibold">
                <p className={`${textHeader}`}>{e.totalreports}</p>
                <p className="text-lg"> {e.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Centraldata = ({
  bgHeader,
  Message,
}: {
  bgHeader: string;
  Message: typeMessage[];
}) => {
  // const totalProblem = Message.filter((e) => e.problem === "issue").length;
  // const totalReport = Message.filter((e) => e.problem === "report").length;
  // const totalUrgent = Message.filter((e) => e.problem === "urgent").length;
  // // const totalDevice = Message.length; // ถ้าต้องการจำนวนทั้งหมด

  const items = [
    {
      title: "งานทั้งหมด",
      border: "border-t-4 border-t-red-500",
      filter: (m: typeMessage) => true, // ใส่ filter
    },
    {
      title: "แจ้งปัญหา",
      border: "border-t-4 border-t-yellow-500",
      filter: (m: typeMessage) => m.problem === "issue",
    },
    {
      title: "เหตุด่วน",
      border: "border-t-4 border-t-orange-500",
      filter: (m: typeMessage) => m.problem === "urgent",
    },
    {
      title: "จำนวนอุปกรณ์ทั้งหมด",
      border: "border-t-4 border-t-blue-500",
      filter: (m: typeMessage) => true, // ถ้าอยากแสดงทั้งหมด
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-4  gap-5 h-170 ">
        {items.map((e, i) => (
          <div key={i} className={`border ${bgHeader} rounded-t-lg`}>
            <div
              className={`flex justify-between px-4 p-3 items-center rounded-lg ${e.border}`}
            >
              <p className="font-semibold">{e.title}</p>
              <p>{Message.filter(e.filter).length}</p> {/* แสดงจำนวน */}
            </div>
            <div className="border-t">
              {Message.filter(e.filter).map((msg, idx) => (
                <div key={idx} className="border rounded-lg my-3 mx-4 p-3">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{msg.message}</p>
                    <p
                      className={`text-xs rounded-full px-2 ${
                        msg.problem === "issue"
                          ? "bg-yellow-500 text-white"
                          : msg.problem === "urgent"
                          ? "bg-red-500 text-white"
                          : msg.problem === "report"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {msg.problem}
                    </p>
                  </div>
                  <p className="text-sm">
                    ส่งโดย : <span>{msg.Name}</span>
                  </p>
                  <p className="text-xs">
                    {new Date(msg.timestamp)
                      .toISOString()
                      .replace("T", " ")
                      .substring(0, 16)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Getpaperexecutive() {
  const { theme } = useTheme();

  const [Message, setMessage] = useState<typeMessage[]>([]);

  const fetchDataMessage = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/message/all-public");
      const data = await res.json();
      setMessage(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDataMessage();
  }, []);

  const textHeader = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const textHeaderLow = theme === "dark" ? "text-white" : "text-yellow-500";
  const bgHeader = theme === "dark" ? "bg-gray-900" : "bg-white shadow-sm";
  return (
    <div className="container mx-auto w-380 p-5">
      <Header
        bgHeader={bgHeader}
        textHeader={textHeader}
        textHeaderLow={textHeaderLow}
      />{" "}
      <Centraldata Message={Message} bgHeader={bgHeader} />
    </div>
  );
}

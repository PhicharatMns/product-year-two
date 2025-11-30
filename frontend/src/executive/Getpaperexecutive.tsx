import { useTheme } from "@/components/theme-provider";
import { FileText, AlertCircle, Bell, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

type typeMessage = {
  kind: "message";
  _id: string;
  Name: string;
  Nickname: string;
  Profile: string;
  role: string;
  Position: string;
  requireNameinMessage: string;
  message?: string;
  problem?: string;
  ID?: string;
  requesterName?: string;
};

type typeJob = {
  kind: "job";
  id: string;
  title: string;
  status: string;
};

type AddItemType = {
  kind: "item";
  id: string;
  name: string;
  quantity: number;
  jobId: string;
};


const Header = ({
  textHeader,
  textHeaderLow,
  bgHeader,
  job = [],
  message = [],
  items = [],
}: {
  textHeader: string;
  textHeaderLow: string;
  bgHeader: string;
  job?: typeJob[];
  message?: typeMessage[];
  items?: AddItemType[];
}) => {
  const { theme } = useTheme();

  const dataHeader = [
    {
      totalreports: "งานทั้งหมด",
      value: job.length,
      icon: <FileText size={24} />,
      bg: theme === "dark" ? "bg-yellow-900/40" : "bg-yellow-100",
      color: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
    },
    {
      totalreports: "แจ้งปัญหา",
      value: message.filter((m) => m.problem === "issue").length,
      icon: <AlertCircle size={24} />,
      bg: theme === "dark" ? "bg-red-900/40" : "bg-red-100",
      color: theme === "dark" ? "text-red-400" : "text-red-600",
    },
    {
      totalreports: "เหตุด่วน",
      value: message.filter((m) => m.problem === "urgent").length ?? 0,
      icon: <Bell size={24} />,
      bg: theme === "dark" ? "bg-orange-900/40" : "bg-orange-100",
      color: theme === "dark" ? "text-orange-400" : "text-orange-600",
    },
    {
      totalreports: "จำนวนขอเบิกของ",
      value: items.length,
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
  items,
  bgLow,
  job,
}: {
  bgHeader: string;
  bgLow: string;
  Message: typeMessage[];
  items: AddItemType[];
  job: typeJob[];
}) => {
  const cards = [
    {
      title: "งานทั้งหมด",
      border: "border-t-4 border-t-red-500",
      filter: (m: typeJob) => true,
      type: "job",          // 👈 เปลี่ยนเป็น job
    },
    {
      title: "แจ้งปัญหา",
      border: "border-t-4 border-t-yellow-500",
      filter: (m: typeMessage) => m.problem === "issue",
      type: "message",
    },
    {
      title: "เหตุด่วน",
      border: "border-t-4 border-t-orange-500",
      filter: (m: typeMessage) => m.problem === "urgent",
      type: "message",
    },
    {
      title: "จำนวนขอเบิกของ",
      border: "border-t-4 border-t-blue-500",
      filter: (m: AddItemType) => true,
      type: "item",
    },
  ];

  // ฟังก์ชันเลือก data ถูกชุด
  const getData = (card: any) => {
    if (card.type === "message") return (Message ?? []).filter(card.filter);
    if (card.type === "item") return (items ?? []).filter(card.filter);
    if (card.type === "job") return (job ?? []).filter(card.filter);
    return [];
  };


  return (
    <div>
      <div className="grid grid-cols-4 gap-5 h-170">
        {cards.map((e, i) => {
          const data = getData(e); //  ใช้ฟังก์ชันเลือก data ให้ถูก

          return (
            <div key={i} className={`border ${bgHeader} rounded-t-lg`}>
              <div className={`flex justify-between px-4 p-3 items-center rounded-lg ${e.border}`}>
                <p className="font-semibold">{e.title}</p>
                <p>{data.length}</p>
              </div>

              <div className="border-t max-h-150 scrollbar-hide bg-w overflow-y-auto">
                {data.map((msg: any, idx) => (

                  <div key={idx} className={`border ${bgLow} rounded-lg my-3 mx-4 p-3`}>
                    {e.type === "message" ? (
                      <>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">{msg.message}</p>
                          <p
                            className={`text-xs rounded-full px-2 ${msg.problem === "issue"
                                ? "bg-yellow-500 text-white"
                                : msg.problem === "urgent"
                                  ? "bg-red-500 text-white"
                                  : msg.problem === "report"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 text-black"
                              }`}
                          >
                            {msg.problem === "issue"
                              ? "มีปัญหา"
                              : msg.problem === "urgent"
                                ? "ด่วน"
                                : msg.problem === "report"
                                  ? "รายงาน"
                                  : "-"}
                          </p>
                              
                        </div>
                        <p className="text-sm">ส่งโดย: {msg.Name}</p>
                        <p className="text-xs">
                          {new Date(msg.timestamp).toISOString().replace("T", " ").substring(0, 16)}
                        </p>
                      </>
                    ) : e.type === "item" ? (
                      <>
                        <p>ผู้ขอ: {msg.requesterName}</p>
                        <p>ขอเบิก : {msg.name}</p>
                        <p>จำนวน: {msg.quantity}</p>
                        <p>สถานะ  : {msg.status}</p>
                        <p className='truncate'>คำอธิบาย: {msg.description}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">{msg.jobName}</p>
                        <p>ชื่องาน : {msg.Worksheet}</p>
                        <p>สถานะงาน: {msg.Status}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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

  const [items, setItems] = useState<AddItemType[]>([]);
  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/additem"); // ดึงทั้งหมด
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const [job, setjob] = useState<typeJob[]>([]);
  const fetchJob = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employees');
      const data = await res.json()
      setjob(data)
    } catch (err) {
      console.error(err)
    }
  }

  const [fade, setFade] = useState(false);
  useEffect(() => {
    const timser = setTimeout(() => setFade(true), 100)
    return () => clearTimeout(timser);
  }, [])

  useEffect(() => {
    fetchJob()
    fetchDataMessage();
    fetchItems()
  }, []);

  const textHeader = theme === "dark" ? "text-yellow-500" : "text-blue-500";
  const textHeaderLow = theme === "dark" ? "text-white" : "text-yellow-500";
  const bgHeader = theme === "dark" ? "bg-gray-900" : "bg-white shadow-sm";
  const bgLow = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100 shadow-sm'
  return (
    <div className={`container duration-500 mx-auto w-380 p-5 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <Header
        job={job ?? []}
        message={Message ?? []}   // ต้องเป็น array
        items={items ?? []}       // ต้องเป็น array
        bgHeader={bgHeader}
        textHeader={textHeader}
        textHeaderLow={textHeaderLow}
      />{" "}
      <Centraldata job={job} bgLow={bgLow} items={items} Message={Message} bgHeader={bgHeader} />
    </div>
  );
}

import { useTheme } from "@/components/theme-provider";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Tradesman {
  _id: string;
  Profile: string;
  Name: string;
  Position: string;
  Phone_Number: string;
  Email: string;
  Start_data: string;
}

export default function Editacc() {
  const [showModal, setshowModal] = useState(false);
  const [showdeleted, setshowdeleted] = useState(false)
  const { theme } = useTheme();
  const [dataTradesman, setDataTradesman] = useState<Tradesman[]>([]);
  const [selectedTradesman, setSelectedTradesman] = useState<Tradesman | null>(null);

  // แยก state สำหรับแต่ละ input
  const [Name, setName] = useState("");
  const [Nickname, setNickname] = useState("");
  const [ID, setID] = useState("");
  const [Phone_Number, setPhone_Number] = useState("");
  const [Email, setEmail] = useState("");
  const [Position, setPosition] = useState("");
  const [Birthday, setBirthday] = useState("");
  const [Start_data, setStart_data] = useState("");
  const [username, setUsername] = useState("");
  const [passwork, setpasswork] = useState("");
  const [Address, setAddress] = useState("");
  const [Profile, setProfile] = useState<File | null>(null);

  // ส่งข้อมูลไป backend
  const handleSubmit = async () => {
    console.log("Form submitted"); // ตรวจว่า form ทำงานจริง
    try {
      const data = new FormData();
      data.append("Name", Name);
      data.append("Nickname", Nickname);
      data.append("ID", ID);
      data.append("Phone_Number", Phone_Number);
      data.append("Email", Email);
      data.append("Position", Position);
      data.append("Birthday", Birthday);
      data.append("Start_data", Start_data);
      data.append("username", username);
      data.append("passwork", passwork);
      data.append("Address", Address);
      if (Profile) data.append("Profile", Profile);

      const res = await axios.post(
        "http://localhost:5000/api/login/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log(res.data);
      alert("เพิ่มช่างสำเร็จ");
      setshowModal(false);

      // รีเซ็ต field
      setName("");
      setNickname("");
      setID("");
      setPhone_Number("");
      setEmail("");
      setPosition("");
      setBirthday("");
      setStart_data("");
      setUsername("");
      setpasswork("");
      setAddress("");
      setProfile(null);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  const openDeleteModal = (tradesman: Tradesman) => {
    setSelectedTradesman(tradesman);
    setshowdeleted(true);
  };

  //ลบข้อมูล
  const confirmDelete = async () => {
    if (!selectedTradesman) return;

    try {
      await axios.delete(`http://localhost:5000/api/login/${selectedTradesman._id}`, {
        withCredentials: true,
      });
      setDataTradesman(dataTradesman.filter(item => item._id !== selectedTradesman._id));
    } catch (err) {
      console.error(err);
    } finally {
      setshowdeleted(false);
      setSelectedTradesman(null);
    }
  };

  // useEffect(() => {
  //   const fetchTradesman = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5000/api/tradesman", {
  //         withCredentials: true,
  //       });
  //       setDataTradesman(res.data); // res.data ต้องเป็น array ของ tradesman
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchTradesman();
  // }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/login/all-tradesman", {
        withCredentials: true,
      })
      .then((res) => setDataTradesman(res.data))
      .catch((err) => console.error(err));
  }, []);

  const Bg_border = theme === "dark" ? "bg-yellow-500" : "";
  const texthaeder =
    theme === "dark"
      ? "text-yellow-500 border-b-4 border-yellow-500"
      : "border-b-4 border-blue-200";
  const bg = theme === "dark" ? "bg-black/10" : "";
  const texthead = theme === "dark" ? "text-yellow-300" : "text-blue-700";

  return (
    <div className="w-max-380 p-4 mx-auto container pt-10">
      <div className={`mx-auto container rounded-2xl shadow-xl p-6 ${bg}`}>
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <p className={`text-3xl font-bold ${texthead}`}>
            จัดการบัญชี{" "}
            <span
              className={theme === "dark" ? "text-white" : "text-yellow-500"}
            >
              ช่าง
            </span>
          </p>
          <button
            onClick={() => setshowModal(true)}
            className={`border p-2 rounded-xl bg-blue-500 text-white cursor-pointer ${Bg_border}`}
          >
            เพิ่มช่าง
          </button>
        </div>

        {/* Table Header */}
        <div
          className={`grid grid-cols-7 gap-5 text-center font-semibold text-lg text-blue-500 mb-3 ${texthaeder}`}
        >
          <p>รูป</p>
          <p>ชื่อ</p>
          <p>ตำแหน่ง</p>
          <p>เบอร์โทรศัพท์</p>
          <p>เมล</p>
          <p>วันที่สมัคร</p>
          <p>การจัดการ</p>
        </div>

        {/* Table Rows */}
        <div className="space-y-1">
          {dataTradesman.map((event) => (
            <div
              key={event._id}
              className={`grid grid-cols-7 gap-5 items-center border rounded-xl bg transition-all duration-200 shadow-sm py-2`}
            >
              <img
                src={`http://localhost:5000/uploads/Profile/${event.Profile}`}
                alt="profile"
                className="w-10 h-10 object-cover rounded-full mx-auto border-2 border-blue-300 shadow-sm"
              />
              <p
                className={`text-center font-medium ${theme === "dark" ? "text-yellow-500" : "text-gray-800"
                  }`}
              >
                {event.Name}
              </p>
              <p className={`text-center`}>{event.Position}</p>
              <p className={`text-center `}>{event.Phone_Number}</p>
              <p className={`text-center`}>{event.Email}</p>
              <p
                className={`text-center font-medium ${theme === "dark" ? "text-yellow-500" : "text-gray-800"
                  }`}
              >
                {new Date(event.Start_data).toLocaleDateString("th-TH")}
              </p>
              <div className="flex justify-center gap-2">
                <button
                  //   onClick={() => handleDelete(event._id)}
                  onClick={() => openDeleteModal(event)}
                  className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all shadow-md"
                >
                  ลบ
                </button>
                <button
                  //  onClick={() => openEditModal(event)}
                  className="bg-orange-400 text-white px-5 py-2 rounded-full hover:bg-orange-500 transition-all shadow-md"
                >
                  แก้ไข
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <form onSubmit={handleSubmit}>
          <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
            <div
              className={`rounded-2xl shadow-2xl p-8 w-[900px] border transition-colors duration-500 ${theme === "dark"
                ? "bg-gray-800 border-gray-700 text-yellow-500"
                : "bg-white border-blue-200 text-blue-500"
                }`}
            >
              <div className="mb-6 border-b pb-3">
                <h2 className={`text-2xl font-bold ${texthead}`}>
                  {/* {edit ? "แก้ไขช่าง" : "เพิ่มช่างเข้าระบบ"} */}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p>ชื่อนามสกุล</p>
                  <input
                    type="text"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <p>ชื่อเล่น</p>
                  <input
                    type="text"
                    value={Nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <p>เลขบัตรประชาชน</p>
                  <input
                    type="text"
                    value={ID}
                    onChange={(e) => setID(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <p>เบอร์โทรศัพท์</p>
                  <input
                    type="text"
                    value={Phone_Number}
                    onChange={(e) => setPhone_Number(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <p>Email</p>
                  <input
                    type="text"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <p>ตำแหน่ง</p>
                  <input
                    type="text"
                    value={Position}
                    onChange={(e) => setPosition(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <p>วันเกิด</p>
                  <input
                    type="date"
                    value={Birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <p>วันที่เริ่มงาน</p>
                  <input
                    type="date"
                    value={Start_data}
                    onChange={(e) => setStart_data(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <p>User</p>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <p>รหัสผ่าน</p>
                  <input
                    type="text"
                    value={passwork}
                    onChange={(e) => setpasswork(e.target.value)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div className="col-span-2">
                  <p>ที่อยู่</p>
                  <textarea
                    value={Address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
                <div className="col-span-2">
                  <p>รูปภาพพนักงาน</p>
                  <input
                    type="file"
                    onChange={(e) => setProfile(e.target.files?.[0] || null)}
                    className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  />
                </div>
              </div>

              <div className="ml-auto w-fit mt-5 flex gap-3">
                <button
                  onClick={() => setshowModal(false)}
                  className="border rounded-xl p-2 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="border rounded-xl bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {showdeleted && selectedTradesman && (
        <div className='fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50'>
          <div className={`rounded-2xl shadow-2xl p-8 w-[400px] border ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-lg mb-4">
              คุณต้องการลบช่าง <span className={`font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-blue-500'}`}>{selectedTradesman.Name}</span> ใช่หรือไม่
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setshowdeleted(false)}
                className="border px-4 py-2 cursor-pointer rounded-lg"
              >
                ยกเลิก
              </button>
              <form onSubmit={(e) => {
                e.preventDefault(); // ป้องกันรีเฟรช
                confirmDelete();    // เรียกฟังก์ชันลบ
              }} >
                <button
                  type='submit'
                  className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  ลบ
                </button>
              </form>
            </div>
          </div>
        </div>
      )
      }

    </div >
  );
}

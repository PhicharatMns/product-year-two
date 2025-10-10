import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";

export default function Editacc() {
  interface Tradesman {
    _id: string;
    Name: string;
    Nickname: string;
    ID: string;
    Birthday: string;
    Address: string;
    Phone_Number: string;
    Email: string;
    Profile: string;
    Position: string;
    Start_data: string;
  }

  const [dataTradesman, setdataTradesman] = useState<Tradesman[]>([]);
  const [showModal, setshowModal] = useState(false);
  const [edit, setedit] = useState(false);
  const [selectedTradesman, setSelectedTradesman] = useState<Tradesman | null>(
    null
  );

  // Data state
  const [Name, setName] = useState("");
  const [Nickname, setNickname] = useState("");
  const [ID, setID] = useState("");
  const [Birthday, setBirthday] = useState("");
  const [Address, setAddress] = useState("");
  const [Phone_Number, setPhone_Number] = useState("");
  const [Email, setEmail] = useState("");
  const [Profile, setProfile] = useState<File | null>(null);
  const [Position, setPosition] = useState("");
  const [Start_data, setStart_data] = useState("");

  // editId เก็บ id ของ tradesman ที่กำลังแก้ไข
  const [editId, setEditId] = useState<string | null>(null);

  const openEditModal = (tradesman: Tradesman) => {
    setSelectedTradesman(tradesman);
    setedit(true);
    setEditId(tradesman._id);
    setName(tradesman.Name);
    setNickname(tradesman.Nickname);
    setID(tradesman.ID);
    setBirthday(tradesman.Birthday.split("T")[0]);
    setAddress(tradesman.Address);
    setPhone_Number(tradesman.Phone_Number);
    setEmail(tradesman.Email);
    setPosition(tradesman.Position);
    setStart_data(tradesman.Start_data.split("T")[0]);
    setProfile(null);
    setshowModal(true);
  };

  const resetForm = () => {
    setName("");
    setNickname("");
    setID("");
    setBirthday("");
    setAddress("");
    setPhone_Number("");
    setEmail("");
    setPosition("");
    setStart_data("");
    setProfile(null);
    setSelectedTradesman(null);
    setEditId(null);
    setedit(false);
    setshowModal(false);
  };

  const handleUpdate = async () => {
    if (!editId) return;

    try {
      const formData = new FormData();
      formData.append("Name", Name);
      formData.append("Nickname", Nickname);
      formData.append("ID", ID);
      formData.append("Birthday", Birthday);
      formData.append("Address", Address);
      formData.append("Phone_Number", Phone_Number);
      formData.append("Email", Email);
      formData.append("Position", Position);
      formData.append("Start_data", Start_data);
      if (Profile) formData.append("Profile", Profile);

      await fetch(`http://localhost:5000/api/tradesman/${editId}`, {
        method: "PUT",
        body: formData,
      });

      fetchTradesman();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("Name", Name);
      formData.append("Nickname", Nickname);
      formData.append("ID", ID);
      formData.append("Birthday", Birthday);
      formData.append("Address", Address);
      formData.append("Phone_Number", Phone_Number);
      formData.append("Email", Email);
      formData.append("Position", Position);
      formData.append("Start_data", Start_data);
      if (Profile) formData.append("Profile", Profile);

      await fetch("http://localhost:5000/api/tradesman", {
        method: "POST",
        body: formData,
      });

      fetchTradesman();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTradesman = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tradesman");
      const data: Tradesman[] = await res.json();
      setdataTradesman(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/tradesman/${id}`, {
        method: "DELETE",
      });
      fetchTradesman();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTradesman();
  }, []);

  const { theme } = useTheme();
  const Bg_border = theme === 'dark' ? 'bg-yellow-500' : ''
  const texthaeder = theme === 'dark' ? 'text-yellow-500 border-b-4 border-yellow-500' : 'border-b-4 border-blue-200'
  const bg = theme === 'dark' ? 'bg-black/10' : '';
  const text = theme === 'dark' ? 'text-white' : ';'
  const texthead = theme === "dark" ? "text-yellow-300 " : "text-blue-700"

  return (
    <div className="min-h-screen  py-10 flex justify-center">
      <div className={`mx-auto container  rounded-2xl shadow-xl p-6 ${bg}`}>
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <p className={`text-3xl font-bold text-blue-700 ${texthead}`}>
            จัดการบัญชี<span className={`${theme === 'dark' ? 'text-white' : 'text-yellow-500'}`}>ช่าง</span>
          </p>
          <div>
            <button
              onClick={() => {
                setshowModal(true);
              }}
              className={`border p-2 rounded-xl bg-blue-500 text-white cursor-pointer ${Bg_border}`}
            >
              เพิ่มช่าง
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className={`grid grid-cols-7 gap-5 text-center font-semibold text-lg text-blue-500  pb-2 mb-3 ${texthaeder}`}>
          <p>รูป</p>
          <p>ชื่อ</p>
          <p className="text-center">ตำแหน่ง</p>
          <p className="text-center">เบอร์โทรศัพท์</p>
          <p className="text-center">เมล</p>
          <p className="text-center">วันที่สมัคร</p>
          <p className="text-center">การจัดการ</p>
        </div>

        {/* Table Rows */}
        <div className="space-y-3">
          {dataTradesman.map((event) => (
            <div
              key={event._id}
              className="grid grid-cols-7 gap-5 items-center border border-blue-100 rounded-xl  bg-blue-50/40 hover:bg-blue-100 transition-all duration-200 shadow-sm py-4 px-2"
            >
              <img
                src={`http://localhost:5000/uploads/Tradesman/${event.Profile}`}
                alt="profile"
                className="w-16 h-16 object-cover rounded-full mx-auto border-2 border-blue-300 shadow-sm"
              />
              <p className={`text-center font-medium text-gray-800 ${theme === 'dark' ? 'text-yellow-500' : ''}`}>
                {event.Name}
              </p>
              <p className={`text-center text-blue-700 ${text}`}>{event.Position}</p>
              <p className={`text-center text-blue-700 ${text}`}>{event.Phone_Number}</p>
              <p className={`text-center text-blue-700 ${text}`}>{event.Email}</p>
              <p className={`text-center font-medium text-gray-800 ${theme === 'dark' ? 'text-yellow-500' : ''}`}>
                {new Date(event.Start_data).toLocaleDateString("th-TH")}
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all shadow-md"
                >
                  ลบ
                </button>
                <button
                  onClick={() => openEditModal(event)}
                  className="bg-orange-400 duration-300 text-white px-5 py-2 rounded-full hover:bg-orange-500 transition-all shadow-md"
                >
                  เเก้ไข
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {
        showModal && (
          <div className={`fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 `}>
            <div
              className={`rounded-2xl shadow-2xl p-8 w-[900px] border border-blue-200 transition-colors duration-500  
    ${theme === 'dark' ? 'text-yellow-500 font-semibold' : 'text-black'} 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-black/40'}
  `}
            >
              <div className="mb-6 border-b border-blue-200 pb-3">
                <h2 className="text-2xl font-bold text-blue-700">
                  {edit ? "แก้ไขช่าง" : "เพิ่มช่างเข้าระบบ"}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p>ชื่อนามสกุล</p>
                  <input
                    type="text"
                    value={Name}
                    placeholder={selectedTradesman?.Name || ""}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                  />
                </div>
                <div>
                  <p>ชื่อเล่น</p>
                  <input
                    type="text"
                    value={Nickname}
                    placeholder={selectedTradesman?.Nickname || ""}
                    onChange={(e) => setNickname(e.target.value)}
                    className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                  />
                </div>
                <div>
                  <p>เลขบัตรประชาชน</p>
                  <input
                    type="text"
                    value={ID}
                    placeholder={selectedTradesman?.ID || ""}
                    onChange={(e) => setID(e.target.value)}
                    className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                  />
                </div>
                <div>
                  <p>เบอร์โทรศัพท์</p>
                  <input
                    type="text"
                    value={Phone_Number}
                    placeholder={selectedTradesman?.Phone_Number || ""}
                    onChange={(e) => setPhone_Number(e.target.value)}
                    className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                  />
                </div>
                <div>
                  <p>Email</p>
                  <input
                    type="email"
                    value={Email}
                    placeholder={selectedTradesman?.Email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                  />
                </div>
                <div>
                  <p>ตำแหน่ง</p>
                  <input
                    type="text"
                    value={Position}
                    placeholder={selectedTradesman?.Position || ""}
                    onChange={(e) => setPosition(e.target.value)}
                    className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                  />
                </div>
                <div>
                  <p>วันเกิด</p>
                  <input
                    type="date"
                    value={Birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                  />
                </div>
                <div>
                  <p>วันที่เริ่มงาน</p>
                  <input
                    type="date"
                    value={Start_data}
                    onChange={(e) => setStart_data(e.target.value)}
                    className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <p>ที่อยู่</p>
                  <textarea
                    value={Address}
                    placeholder={selectedTradesman?.Address || ""}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <p>รูปภาพพนักงาน</p>
                  <input
                    type="file"
                    onChange={(e) => setProfile(e.target.files?.[0] || null)}
                    className="w-full mt-2 border border-blue-200 rounded-lg px-3 py-2 bg-blue-50 cursor-pointer"
                  />
                </div>
              </div>

              <div className="ml-auto w-fit mt-5 flex gap-3">
                <button
                  onClick={resetForm}
                  className="border rounded-xl p-2 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={edit ? handleUpdate : handleSave}
                  className="border rounded-xl text-blue-500 hover:bg-blue-500 hover:text-white duration-300 cursor-pointer p-2"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        )
      }
      {
        edit &&
        dataTradesman.map((event, index) => {
          return (
            <div
              key={index}
              className={`fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50`}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-[900px] border border-blue-200">
                <div className="mb-6 border-b border-blue-200 pb-3">
                  <h2 className={`text-2xl font-bold text-blue-700 `}>
                    เพิ่มช่างเข้าระบบ
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p>ชื่อนามสกุล</p>
                    <input
                      type="text"
                      placeholder={event.Name}
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                    />
                  </div>

                  <div>
                    <p>ชื่อเล่น</p>
                    <input
                      type="text"
                      placeholder={event.Nickname}
                      value={Nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                    />
                  </div>

                  <div>
                    <p>เลขบัตรประชาชน</p>
                    <input
                      type="text"
                      placeholder={event.ID}
                      value={ID}
                      onChange={(e) => setID(e.target.value)}
                      className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                    />
                  </div>

                  <div>
                    <p>เบอร์โทรศัพท์</p>
                    <input
                      type="text"
                      placeholder={event.Phone_Number}
                      value={Phone_Number}
                      onChange={(e) => setPhone_Number(e.target.value)}
                      className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                    />
                  </div>

                  <div>
                    <p>Email</p>
                    <input
                      type="email"
                      placeholder={event.Email}
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                    />
                  </div>

                  <div>
                    <p>ตำแหน่ง</p>
                    <input
                      type="text"
                      placeholder={event.Position}
                      value={Position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                    />
                  </div>

                  <div>
                    <p>วันเกิด</p>
                    <input
                      type="date"
                      value={Birthday || event.Birthday || ""}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                    />
                  </div>

                  <div>
                    <p>วันที่เริ่มงาน</p>
                    <input
                      type="date"
                      value={Start_data || event.Start_data || ""}
                      onChange={(e) => setStart_data(e.target.value)}
                      className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                    />
                  </div>

                  <div className="col-span-2">
                    <p>ที่อยู่</p>
                    <textarea
                      value={Address}
                      placeholder={event.Address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none mt-2"
                    />
                  </div>

                  <div className="col-span-2">
                    <p>รูปภาพพนักงาน</p>
                    <input
                      type="file"
                      onChange={(e) => setProfile(e.target.files?.[0] || null)}
                      className="w-full mt-2 border border-blue-200 rounded-lg px-3 py-2 bg-blue-50 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="ml-auto w-fit mt-5 flex gap-3">
                  <button
                    onClick={() => setedit(false)}
                    className="border rounded-xl p-2 cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="border rounded-xl text-blue-500 hover:bg-blue-500 hover:text-white duration-300 cursor-pointer p-2"
                  >
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          );
        })
      }
    </div >
  );
}

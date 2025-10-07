import { useEffect, useState } from "react";

const Editacc: React.FC = () => {
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

  // Fetch tradesman
  const fetchTradesman = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tradesman");
      const data: Tradesman[] = await res.json();
      setdataTradesman(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTradesman();
  }, []);

  // Delete tradesman
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

  // Save tradesman
  const handleSave = async () => {
    try {
      if (Profile) {
        // ส่ง FormData ถ้ามีไฟล์
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
        formData.append("Profile", Profile);

        await fetch("http://localhost:5000/api/tradesman", {
          method: "POST",
          body: formData,
        });
      } else {
        // ส่ง JSON ถ้าไม่มีไฟล์
        const newTradesman = {
          Name,
          Nickname,
          ID,
          Birthday,
          Address,
          Phone_Number,
          Email,
          Position,
          Start_data,
        };

        await fetch("http://localhost:5000/api/tradesman", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTradesman),
        });
      }

      // Reset modal & refresh data
      setshowModal(false);
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
      fetchTradesman();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-10 flex justify-center">
      <div className="mx-auto container bg-white rounded-2xl shadow-xl p-6">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-3xl font-bold text-blue-700">
            จัดการบัญชี<span className="text-yellow-500">ช่าง</span>
          </p>
          <div>
            <button
              onClick={() => setshowModal(true)}
              className="border p-2 rounded-xl bg-blue-500 text-white cursor-pointer"
            >
              เพิ่มช่าง
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-5 text-center font-semibold text-lg text-blue-800 border-b-4 border-blue-200 pb-2 mb-2">
          <p>รูป</p>
          <p>ชื่อ</p>
          <p className="text-center">ตำแหน่ง</p>
          <p className="text-center">เบอร์โทรศัพท์</p>
          <p className="text-center">วันที่สมัคร</p>
          <p className="text-center">การจัดการ</p>
        </div>

        {/* Table Rows */}
        <div className="space-y-3">
          {dataTradesman.map((event) => (
            <div
              key={event._id}
              className="grid grid-cols-6 gap-5 items-center border border-blue-100 rounded-xl  bg-blue-50/40 hover:bg-blue-100 transition-all duration-200 shadow-sm py-4 px-2"
            >
              <img
                src={`http://localhost:5000/uploads/Tradesman/${event.Profile}`}
                alt="profile"
                className="w-16 h-16 object-cover rounded-full mx-auto border-2 border-blue-300 shadow-sm"
              />
              <p className="text-center font-medium text-gray-800">
                {event.Name}
              </p>
              <p className="text-center text-blue-700">{event.Position}</p>
              <p className="text-center text-blue-600">{event.Phone_Number}</p>
              <p className="text-center text-gray-600">
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
                  onClick={() => setedit(true)}
                  className="bg-orange-400 duration-300 text-white px-5 py-2 rounded-full hover:bg-orange-500 transition-all shadow-md"
                >
                  เเก้ไช
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[900px] border border-blue-200">
            <div className="mb-6 border-b border-blue-200 pb-3">
              <h2 className="text-2xl font-bold text-blue-700">
                เพิ่มช่างเข้าระบบ
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <p>ชื่อนามสกุล</p>
                <input
                  type="text"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                />
              </div>

              <div>
                <p>ชื่อเล่น</p>
                <input
                  type="text"
                  value={Nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                />
              </div>

              <div>
                <p>เลขบัตรประชาชน</p>
                <input
                  type="text"
                  value={ID}
                  onChange={(e) => setID(e.target.value)}
                  className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                />
              </div>

              <div>
                <p>เบอร์โทรศัพท์</p>
                <input
                  type="text"
                  value={Phone_Number}
                  onChange={(e) => setPhone_Number(e.target.value)}
                  className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                />
              </div>

              <div>
                <p>Email</p>
                <input
                  type="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-blue-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                />
              </div>

              <div>
                <p>ตำแหน่ง</p>
                <input
                  type="text"
                  value={Position}
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
                onClick={() => setshowModal(false)}
                className="border rounded-xl p-2 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="border rounded-xl text-blue-500 hover:bg-blue-500 hover:text-white duration-300 cursor-pointer p-2"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
      {edit && (
        <div className='fixed inset-0 flex justify-between items-center bg-black/40 backdrop-blur-md z-50'>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[95%] mx-auto mb:w-[700px] lg:w-[900px] border border-blue-300 overflow-y-auto">
            <div className="mb-6 border-b border-blue-200 pb-3">
              <p className="text-2xl font-bold text-blue-700">เพิ่มช่างเข้าระบบ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editacc;

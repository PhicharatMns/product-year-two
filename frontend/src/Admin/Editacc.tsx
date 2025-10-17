import { useTheme } from "@/components/theme-provider";
import { useState } from "react";

export default function Editacc() {
  const [showModal, setshowModal] = useState(false);

  const { theme } = useTheme();
  const Bg_border = theme === "dark" ? "bg-yellow-500" : "";
  const texthaeder =
    theme === "dark"
      ? "text-yellow-500 border-b-4 border-yellow-500"
      : "border-b-4 border-blue-200";
  const bg = theme === "dark" ? "bg-black/10" : "";
  const texthead = theme === "dark" ? "text-yellow-300" : "text-blue-700";

  return (
    <div className="min-h-screen py-10 flex justify-center">
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
          {/* {dataTradesman.map((event) => (
            <div
              key={event._id}
              className={`grid grid-cols-7 gap-5 items-center border rounded-xl bg transition-all duration-200 shadow-sm py-2 ${cardBg}`}
            >
              <img
                src={`http://localhost:5000/uploads/Tradesman/${event.Profile}`}
                alt="profile"
                className="w-10 h-10 object-cover rounded-full mx-auto border-2 border-blue-300 shadow-sm"
              />
              <p
                className={`text-center font-medium ${
                  theme === "dark" ? "text-yellow-500" : "text-gray-800"
                }`}
              >
                {event.Name}
              </p>
              <p className={`text-center ${text}`}>{event.Position}</p>
              <p className={`text-center ${text}`}>{event.Phone_Number}</p>
              <p className={`text-center ${text}`}>{event.Email}</p>
              <p
                className={`text-center font-medium ${
                  theme === "dark" ? "text-yellow-500" : "text-gray-800"
                }`}
              >
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
                  className="bg-orange-400 text-white px-5 py-2 rounded-full hover:bg-orange-500 transition-all shadow-md"
                >
                  แก้ไข
                </button>
              </div>
            </div>
          ))} */}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
          <div
            className={`rounded-2xl shadow-2xl p-8 w-[900px] border transition-colors duration-500 ${
              theme === "dark"
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
                  //  value={Name}
                  //  onChange={(e) => setName(e.target.value)}
                  //  placeholder={selectedTradesman?.Name || ""}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div>
                <p>ชื่อเล่น</p>
                <input
                  type="text"
                  //    value={Nickname}
                  //   onChange={(e) => setNickname(e.target.value)}
                  //   placeholder={selectedTradesman?.Nickname || ""}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div>
                <p>เลขบัตรประชาชน</p>
                <input
                  type="text"
                  //  value={ID}
                  //  onChange={(e) => setID(e.target.value)}
                  //  placeholder={selectedTradesman?.ID || ""}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div>
                <p>เบอร์โทรศัพท์</p>
                <input
                  type="text"
                  //  value={Phone_Number}
                  //  onChange={(e) => setPhone_Number(e.target.value)}
                  //  placeholder={selectedTradesman?.Phone_Number || ""}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div>
                <p>Email</p>
                <input
                  type="email"
                  //   value={Email}
                  //    onChange={(e) => setEmail(e.target.value)}
                  //    placeholder={selectedTradesman?.Email || ""}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div>
                <p>ตำแหน่ง</p>
                <input
                  type="text"
                  //  value={Position}
                  //  onChange={(e) => setPosition(e.target.value)}
                  //   placeholder={selectedTradesman?.Position || ""}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div>
                <p>วันเกิด</p>
                <input
                  type="date"
                  //  value={Birthday}
                  //  onChange={(e) => setBirthday(e.target.value)}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div>
                <p>วันที่เริ่มงาน</p>
                <input
                  type="date"
                  //  value={Start_data}
                  //  onChange={(e) => setStart_data(e.target.value)}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div>
                <p>User</p>
                <input
                  type="text"
                  // value={username}
                  //  onChange={(e) => setUsername(e.target.value)}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div>
                <p>รหัสผ่าน</p>
                <input
                  type="text"
                  //   value={passwork}
                  //  onChange={(e) => setPasswork(e.target.value)}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div className="col-span-2">
                <p>ที่อยู่</p>
                <textarea
                  //  value={Address}
                  //  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
              <div className="col-span-2">
                <p>รูปภาพพนักงาน</p>
                <input
                  type="file"
                  // onChange={(e) => setProfile(e.target.files?.[0] || null)}
                  className={`border w-full p-2 rounded-lg focus:ring-2 outline-none mt-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                />
              </div>
            </div>

            <div className="ml-auto w-fit mt-5 flex gap-3">
              <button
                // onClick={resetForm}
                className="border rounded-xl p-2 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                // onClick={handleSubmit}
                className="border rounded-xl bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

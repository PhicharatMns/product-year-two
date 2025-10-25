export default function Withdraw() {
  return (
<div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 mt-12">
  {/* หัวข้อใหญ่ */}
  <p className="text-4xl font-extrabold text-center text-gray-900 mb-8">เบิกของ</p>

  {/* ปุ่มวันที่ / เวลา */}
  <div className="flex justify-start mb-6">
    <button className="border border-gray-300 rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 shadow-sm transition">
      วันที่ / เวลา
    </button>
  </div>

  {/* ตารางแนวนอน */}
  <div className="overflow-x-auto mb-6">
    <table className="min-w-full border-4 border-gray-500 rounded-lg overflow-hidden shadow-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border-b border-r border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-900">
            รายการ
          </th>
          <th className="border-b border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-900">
            จำนวนเงิน
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="even:bg-gray-50 hover:bg-gray-100 transition">
            <td className="border-b border-r border-gray-300 px-6 py-4">
              <input
                type="text"
                defaultValue={`รายการ ${i + 1}`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </td>
            <td className="border-b border-gray-300 px-6 py-4">
              <input
                type="number"
                defaultValue="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 font-medium text-right focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* ข้อความ */}
  <div className="mb-2 font-medium text-gray-800">
    ข้อความ : <span className="text-red-600">*</span>
  </div>
  <textarea
    className="border border-gray-300 w-full h-32 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    placeholder="พิมพ์ข้อความ..."
  ></textarea>

  {/* ปุ่มส่งข้อความ */}
  <div className="flex justify-start mt-6">
    <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition">
      ส่งข้อความ
    </button>
  </div>
</div>

  )
}

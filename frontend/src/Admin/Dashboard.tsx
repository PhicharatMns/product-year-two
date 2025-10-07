export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ===================== ส่วนหัว ===================== */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700">Company Growth Selling</h1>
          <p className="text-gray-400 mt-1">Lorem ipsum dolor sit amet</p>
        </div>

        {/* ===================== กราฟจำลอง ===================== */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-2xl font-semibold text-gray-700">1,560</p>
              <p className="text-gray-400 text-sm">Profile Views</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-700">780</p>
              <p className="text-gray-400 text-sm">Unique Visitors</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-700">1,560</p>
              <p className="text-gray-400 text-sm">Profile Views</p>
            </div>
          </div>

          {/* พื้นที่กราฟจำลอง */}
          <div className="h-56 bg-gradient-to-t from-blue-100 to-white rounded-xl flex items-center justify-center text-blue-400 font-medium">
            (Chart View Placeholder)
          </div>
        </div>

        {/* ===================== การ์ดข้อมูล 4 ใบ ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Information A", price: "$1,234.00", docs: "360 Document", color: "from-orange-400 to-orange-500" },
            { title: "Information B", price: "$2,345.00", docs: "380 Document", color: "from-blue-400 to-blue-500" },
            { title: "Information C", price: "$3,456.00", docs: "360 Document", color: "from-purple-400 to-purple-500" },
            { title: "Information D", price: "$4,567.00", docs: "360 Document", color: "from-green-400 to-green-500" },
          ].map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition duration-200`}
            >
              <p className={`font-semibold text-gray-700 mb-2`}>{item.title}</p>
              <p className="text-2xl font-bold text-gray-800">{item.price}</p>
              <p className="text-sm text-gray-400 mt-1">{item.docs}</p>
              <div
                className={`h-2 mt-3 bg-gradient-to-r ${item.color} rounded-full`}
              ></div>
            </div>
          ))}
        </div>

        {/* ===================== ตารางข้อมูล ===================== */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Data Information Company
            </h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg">
              + Create Data
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-sm text-gray-500 flex gap-4">
              <span className="font-semibold text-blue-500 border-b-2 border-blue-500 pb-1">All Invoice</span>
              <span>Paid</span>
              <span>Pending</span>
              <span>Overdue</span>
            </div>
            <input
              type="text"
              placeholder="Search by name, email..."
              className="ml-auto border rounded-lg px-3 py-1.5 text-sm w-64"
            />
          </div>

          <table className="w-full text-left border-t">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-3">Name</th>
                <th>Status</th>
                <th>Role</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "John Doe", role: "Product Designer", email: "email@gmail.com" },
                { name: "Ahn Doe", role: "Product Manager", email: "email@gmail.com" },
                { name: "Bella Doe", role: "Frontend Developer", email: "email@gmail.com" },
                { name: "Christy Doe", role: "Backend Developer", email: "email@gmail.com" },
              ].map((user, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 text-gray-700">
                  <td className="py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    {user.name}
                  </td>
                  <td>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td className="flex gap-2">
                    <button className="text-gray-400 hover:text-blue-500">✏️</button>
                    <button className="text-gray-400 hover:text-red-500">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">Previous</button>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className={`px-3 py-1 rounded-lg ${
                    num === 1 ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

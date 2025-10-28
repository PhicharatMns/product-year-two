import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
  LineChart,
  BarChart,
} from "recharts";
import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { useEffect } from "react"


// #region Sample data
const data = [
  {
    name: "มกราคม",
    งาน: 120,
    เหลือ: 15,
  },
  {
    name: "กุมภาพันธ์",
    งาน: 95,
    เหลือ: 8,
  },
  {
    name: "มีนาคม",
    งาน: 110,
    เหลือ: 12,
  },
  {
    name: "เมษายน",
    งาน: 130,
    เหลือ: 20,
  },
  {
    name: "พฤษภาคม",
    งาน: 125,
    เหลือ: 10,
  },
  {
    name: "มิถุนายน",
    งาน: 140,
    เหลือ: 18,
  },
];

// #endregion
const DashboardExecutive = () => {
  const count = useMotionValue(0)
  const rounded = useTransform(() => Math.round(count.get()))

  useEffect(() => {
    const controls = animate(count, 100, { duration: 5 })
    return () => controls.stop()
  }, [])

  return (
    <div className="w-max-380 p-6 mx-auto container pt-10">
      <div className="p-5 ">
        <p className="text-3xl  font-extrabold mb-5 ">Dashboard <span>ผู้บริหาร</span></p>
        {/* ข้อมูล */}
        <div className='grid grid-cols-4 gap-5 my-5'>
          <div className="border rounded-xl h-35 text-white bg-blue-300 p-4 text-xl">
            <p>งานทั้งหมดในเดือน ตุลา</p>
            <p className="mt-5 text-2xl text-le flex gap-2 font-extrabold"> <motion.pre >{rounded}</motion.pre>งาน</p>
          </div>
          <div className="border rounded-xl h-35 text-white bg-blue-500 p-4 text-xl">
            <p>งานที่กําลังดําเนินการ</p>
            <p className="mt-5 text-2xl text-le flex gap-2 font-extrabold"> <motion.pre >{rounded}</motion.pre>งาน</p>
          </div>
          <div className="border rounded-xl h-35 text-white bg-blue-600 p-4 text-xl">
            <p>งานที่ล่าช้า</p>
            <p className="mt-5 text-2xl text-le flex gap-2 font-extrabold"> <motion.pre >{rounded}</motion.pre>งาน</p>
          </div>
          <div className="border rounded-xl h-35 text-white bg-blue-700 p-4 text-xl">
            <p>รายการขอเบิกวัสดุ</p>
            <p className="mt-5 text-2xl text-le flex gap-2 font-extrabold"> <motion.pre >{rounded}</motion.pre>งาน</p>
          </div>
        </div>
        {/* กราฟ */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <p className="my-2 text-xl font-extrabold">งานทั้งหมด</p>
            <ResponsiveContainer width='100%' height={400}>
              <ComposedChart data={data}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" scale="band" />
                <YAxis width={40} />
                <Tooltip />
                <Legend />
                <Bar dataKey="งาน" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="งาน" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div>
            <p className="my-2 text-xl font-extrabold">งานทั้งหมด</p>
            <ResponsiveContainer width='100%' height={400}>
              <BarChart
                data={data}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#05339C" width={40} />
                <YAxis yAxisId="right" orientation="right" stroke="#FCB53B" width={40} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="งาน" fill="#05339C" />
                <Bar yAxisId="right" dataKey="เหลือ" fill="#FCB53B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div >


      </div>
    </div>
  );
};

export default DashboardExecutive;

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



// #region Sample data
const data = [
  {
    name: "Page A",
    uv: 590,
    pv: 800,
    amt: 1400,
    cnt: 490,
  },
  {
    name: "Page B",
    uv: 868,
    pv: 967,
    amt: 1506,
    cnt: 590,
  },
  {
    name: "Page C",
    uv: 1397,
    pv: 1098,
    amt: 989,
    cnt: 350,
  },
  {
    name: "Page D",
    uv: 1480,
    pv: 1200,
    amt: 1228,
    cnt: 480,
  },
  {
    name: "Page E",
    uv: 1520,
    pv: 1108,
    amt: 1100,
    cnt: 460,
  },
  {
    name: "Page F",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
];

// #endregion
const DashboardExecutive = () => {
  return (
    <div className="w-max-380 p-6 mx-auto container pt-10">
      <div className="p-5 ">
        <p className="text-3xl  font-extrabold mb-8 ">Dashboard <span>ผู้บริหาร</span></p>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <ResponsiveContainer width='100%' height={400}>
              <ComposedChart data={data}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" scale="band" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="uv" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="uv" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div>
            <BarChart
              data={data}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" width="auto" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" width="auto" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="pv" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="uv" fill="#82ca9d" />
            </BarChart>
          </div>
        </div >
      </div>
    </div>
  );
};

export default DashboardExecutive;

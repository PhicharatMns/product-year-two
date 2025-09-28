import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./sighup/Register";
import Home from "./Admin/Home";
import Login from "./sighup/Login";
import Searchpastjobs from "./Admin/Searchpastjobs";
import Dashboard from "./Admin/Dashboard";
import Editacc from "./Admin/Editacc";

// import Sidebar from "./component/sidebar";
// import AddEmployee from "./AddEmployee";
// import EmployeeList from "./EmployeeList";


// ปวดขี้ ไอ้เหี้ย
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* <Sidebar /> */}

        <div className="flex-1 ">
          <Routes>
            {/* <Route path="/" element={<AddEmployee />} /> */}
            {/* <Route path="/list" element={<EmployeeList />} /> */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Homepath" element={<Home />} />
            <Route path="/Searchpastjobs" element={<Searchpastjobs />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Editacc" element={<Editacc />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

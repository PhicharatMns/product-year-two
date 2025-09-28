import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./sighup/Register";
import Home from "./Admin/Home";
import Login from "./sighup/Login";
// import Sidebar from "./component/sidebar";
// import AddEmployee from "./AddEmployee";
// import EmployeeList from "./EmployeeList";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* <Sidebar /> */}

        <div className="flex-1 ">
          <Routes>
            {/* <Route path="/" element={<AddEmployee />} /> */}
            {/* <Route path="/list" element={<EmployeeList />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Homepath" element={<Home />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

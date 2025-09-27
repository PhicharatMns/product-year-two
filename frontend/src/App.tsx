import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import Login from "./component/Login";
// import AddEmployee from "./AddEmployee";
// import EmployeeList from "./EmployeeList";

export default function App() {
  return (
    <BrowserRouter>
      {/* flex แบ่งสองฝั่ง */}
      <div className="flex min-h-screen">
        {/* Sidebar ฝั่งซ้าย */}
        <Sidebar />

        {/* Content ฝั่งขวา */}
        <div className="flex-1 ">
          <Routes>
            {/* <Route path="/" element={<AddEmployee />} /> */}
            {/* <Route path="/list" element={<EmployeeList />} /> */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

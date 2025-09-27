import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Sidebar from "./component/sidebar";
// import AddEmployee from "./AddEmployee";
// import EmployeeList from "./EmployeeList";

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        {/* <Route path="/" element={<AddEmployee />} />
        <Route path="/list" element={<EmployeeList />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

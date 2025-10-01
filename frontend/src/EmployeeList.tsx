import React, { useEffect, useState } from "react";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  gender?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  salary: number;
  profileImage?: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // โหลดพนักงานทั้งหมด
  const loadEmployees = async () => {
    const res = await fetch("http://localhost:5000/api/employees");
    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // ลบพนักงาน
  const deleteEmployee = async (id: string) => {
    if (!window.confirm("Are you sure to delete?")) return;
    await fetch(`http://localhost:5000/api/employees/${id}`, { method: "DELETE" });
    loadEmployees();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>

      {employees.map((emp) => (
        <div key={emp._id} className="mb-4 border p-2 flex items-center">
          {emp.profileImage && (
            <img
              src={`http://localhost:5000/uploads/${emp.profileImage}`}
              alt={`${emp.firstName} ${emp.lastName}`}
              className="w-16 h-16 object-cover mr-4"
            />
          )}
          <div className="flex-1">
            <p><strong>Name:</strong> {emp.firstName} {emp.lastName}</p>
            <p><strong>Gender:</strong> {emp.gender}</p>
            <p><strong>Email:</strong> {emp.email}</p>
            <p><strong>Phone:</strong> {emp.phone}</p>
            <p><strong>Position:</strong> {emp.position}</p>
            <p><strong>Department:</strong> {emp.department}</p>
            <p><strong>Hire Date:</strong> {emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : ''}</p>
            <p><strong>Salary:</strong> {emp.salary}</p>
          </div>
          <button
            onClick={() => deleteEmployee(emp._id)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

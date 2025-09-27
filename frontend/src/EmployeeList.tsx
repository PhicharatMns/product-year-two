import React, { useEffect, useState } from "react";

interface Employee {
  _id: string;
  name: string;
  salary: number;
  image?: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // โหลดพนักงาน
  const loadEmployees = async () => {
    const res = await fetch("http://localhost:5000/api/employees");
    setEmployees(await res.json());
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // ลบพนักงาน
  const deleteEmployee = async (id: string) => {
    await fetch(`http://localhost:5000/api/employees/${id}`, { method: "DELETE" });
    loadEmployees();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>

      {employees.map(({ _id, name, salary, image }) => (
        <div key={_id} className="mb-4 border p-2 flex items-center">
          {image && (
            <img
              src={`http://localhost:5000/uploads/${image}`}
              alt={name}
              className="w-16 h-16 object-cover mr-4"
            />
          )}
          <div className="flex-1">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Salary:</strong> {salary}</p>
          </div>
          <button
            onClick={() => deleteEmployee(_id)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;

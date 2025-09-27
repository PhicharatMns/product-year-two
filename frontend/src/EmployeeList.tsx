import React, { useEffect, useState } from "react";

interface Employee {
  _id: string;
  name: string;
  salary: number;
  image?: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const data: Employee[] = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/employees/${id}`, { method: "DELETE" });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      <ul>
        {employees.map((emp) => (
          <li key={emp._id} className="mb-4 border p-2 flex items-center">
            {emp.image && (
              <img
                src={`http://localhost:5000/uploads/${emp.image}`}
                alt={emp.name}
                className="w-16 h-16 object-cover mr-4"
              />
            )}
            <div className="flex-1">
              <p><strong>Name:</strong> {emp.name}</p>
              <p><strong>Salary:</strong> {emp.salary}</p>
            </div>
            <button
              onClick={() => handleDelete(emp._id)}
              className="bg-red-500 text-white px-2 py-1"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;

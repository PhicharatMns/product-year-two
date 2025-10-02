import React, { useEffect, useState } from "react";

interface Employees {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  dateJoined?: string;
  status?: string;
  image?: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employees[]>([]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const data: Employees[] = await res.json();
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
        {employees.map(emp => (
          <li key={emp._id} className="mb-4 border p-2 flex items-center flex-wrap">
            {emp.image && <img src={`http://localhost:5000/uploads/${emp.image}`} alt={emp.firstName} className="w-16 h-16 object-cover mr-4 mb-2" />}
            <div className="flex-1 min-w-[200px]">
              <p><strong>Name:</strong> {emp.firstName} {emp.lastName}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Phone:</strong> {emp.phone}</p>
              <p><strong>Position:</strong> {emp.position}</p>
              <p><strong>Department:</strong> {emp.department}</p>
              <p><strong>Status:</strong> {emp.status}</p>
              <p><strong>Date Joined:</strong> {emp.dateJoined?.split("T")[0]}</p>
            </div>
            <button onClick={() => handleDelete(emp._id)} className="bg-red-500 text-white px-2 py-1 h-fit mb-2">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;

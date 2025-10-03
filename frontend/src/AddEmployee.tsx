import React, { useState } from "react";

const AddEmployee: React.FC = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("Active");
  const [list, setList] = useState("");
  const [dateReceived, setDateReceived] = useState("");
  const [dateToClose, setDateToClose] = useState("");
  const [dateJoined, setDateJoined] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [manage, setManage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      JobTitle: jobTitle,
      Details: details,
      Status: status,
      List: list,
      DateReceived: dateReceived,
      DatetoClose: dateToClose,
      dateJoined,
      Manage: manage,
    };

    try {
      const res = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      alert(data.message);

      // Reset form
      setJobTitle("");
      setDetails("");
      setStatus("Active");
      setList("");
      setDateReceived("");
      setDateToClose("");
      setDateJoined(new Date().toISOString().split("T")[0]);
      setManage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Employee</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          required
          className="border p-2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Resigned">Resigned</option>
        </select>
        <input
          type="text"
          placeholder="List"
          value={list}
          onChange={(e) => setList(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Date Received"
          value={dateReceived}
          onChange={(e) => setDateReceived(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Date to Close"
          value={dateToClose}
          onChange={(e) => setDateToClose(e.target.value)}
          className="border p-2"
        />
        <input
          type="date"
          value={dateJoined}
          onChange={(e) => setDateJoined(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Manage"
          value={manage}
          onChange={(e) => setManage(e.target.value)}
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 col-span-2"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;

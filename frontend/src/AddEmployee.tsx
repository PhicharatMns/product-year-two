import React, { useState } from "react";

const AddEmployee: React.FC = () => {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (salary === "") return alert("Salary is required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("salary", salary.toString());
    if (image) formData.append("image", image);

    try {
      await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        body: formData,
      });
      setName("");
      setSalary("");
      setImage(null);
      alert("Employee added!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Employee</h1>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Salary"
          value={salary}
          onChange={(e) =>
            setSalary(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
          className="border p-2"
        />
        <input type="file" onChange={handleImageChange} className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;

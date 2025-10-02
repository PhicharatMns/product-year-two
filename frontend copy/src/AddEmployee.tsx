import React, { useState } from "react";

const AddEmployee: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("Active");
  const [dateJoined, setDateJoined] = useState(new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("position", position);
    formData.append("department", department);
    formData.append("status", status);
    formData.append("dateJoined", dateJoined);
    if (image) formData.append("image", image);

    try {
      await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        body: formData,
      });
      alert("Employee added!");
      // reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPosition("");
      setDepartment("");
      setStatus("Active");
      setDateJoined(new Date().toISOString().split("T")[0]);
      setImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Employee</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="border p-2" />
        <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required className="border p-2" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border p-2" />
        <input type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="border p-2" />
        <input type="text" placeholder="Position" value={position} onChange={e => setPosition(e.target.value)} className="border p-2" />
        <input type="text" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} className="border p-2" />
        <input type="date" value={dateJoined} onChange={e => setDateJoined(e.target.value)} className="border p-2" />
        <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Resigned">Resigned</option>
        </select>
        <input type="file" onChange={handleImageChange} className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 col-span-2">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;

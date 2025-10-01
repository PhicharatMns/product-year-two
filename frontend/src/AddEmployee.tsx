import React, { useState } from "react";

export default function AddEmployee() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [salary, setSalary] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !lastName || salary === "") {
      return alert("Please fill required fields");
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("position", position);
    formData.append("department", department);
    formData.append("hireDate", hireDate);
    formData.append("salary", salary.toString());
    if (image) formData.append("image", image);

    try {
      await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        body: formData,
      });
      setFirstName("");
      setLastName("");
      setGender("");
      setEmail("");
      setPhone("");
      setPosition("");
      setDepartment("");
      setHireDate("");
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-2"
        />
        <input
          type="date"
          placeholder="Hire Date"
          value={hireDate}
          onChange={(e) => setHireDate(e.target.value)}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Salary"
          value={salary}
          onChange={(e) =>
            setSalary(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="border p-2"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
          Add Employee
        </button>
      </form>
    </div>
  );
}

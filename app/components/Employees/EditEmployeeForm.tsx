//app/components/Employees/EditEmployeeForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function EditEmployeeForm({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...employee, password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/employees/${employee.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/employees");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        className="input input-bordered w-full"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="input input-bordered w-full"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="New Password (leave blank to keep current)"
        className="input input-bordered w-full"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <select
        className="select select-bordered w-full"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="employee">Employee</option>
        <option value="admin">Admin</option>
      </select>
      <button className="btn btn-primary w-full" type="submit">
        Save Changes
      </button>
    </form>
  );
}

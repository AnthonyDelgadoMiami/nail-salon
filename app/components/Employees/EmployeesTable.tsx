//app/components/Employees/EmployeesTable
"use client";
import Link from "next/link";
import { useState } from "react";
  

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface Props {
  employees: User[];
}

export default function EmployeesTable({ employees: initialEmployees }: Props) {
  const [employees, setEmployees] = useState<User[]>(initialEmployees);

  async function deleteEmployee(id: number) {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>{emp.createdAt.toDateString()}</td>
              <td className="text-right space-x-2">
                <Link href={`/employees/${emp.id}`} className="btn btn-sm btn-ghost">
                  View Details
                </Link>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() =>
                    window.location.href = `/employees/${emp.id}/edit`
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => deleteEmployee(emp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

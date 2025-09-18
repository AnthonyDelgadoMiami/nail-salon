//app/employees/page.tsx
import { PrismaClient } from "@prisma/client";
import EmployeesTable from "../components/Employees/EmployeesTable";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function EmployeesPage() {
  const employees = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Link href="/employees/new" className="btn btn-primary">
          + New Employee
        </Link>
      </div>
      <EmployeesTable employees={employees} />
    </div>
  );
}

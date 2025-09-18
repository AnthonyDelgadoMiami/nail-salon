//app/employees/[id]/edit/page.tsx
import { PrismaClient } from "@prisma/client";
import EditEmployeeForm from "../../../components/Employees/EditEmployeeForm";

const prisma = new PrismaClient();

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const employee = await prisma.user.findUnique({ where: { id: parseInt(params.id, 10) } });

  if (!employee) return <div>Employee not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
      <EditEmployeeForm employee={employee} />
    </div>
  );
}

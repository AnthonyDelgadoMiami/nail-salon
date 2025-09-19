import { getUser, getEmployeeAppointments } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppointmentHistoryCard from "@/app/components/Clients/AppointmentHistoryCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeAppointmentsPage({ params }: PageProps) {
  const { id } = await params;
  const employee = await getUser(Number(id));

  if (!employee) {
    notFound();
  }

  const appointments = await getEmployeeAppointments(Number(id));

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/employees/${employee.id}`} className="btn btn-ghost">
          ← Back to Employee
        </Link>
        <h1 className="text-3xl font-bold">
          Appointments for {employee.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Appointments</div>
          <div className="stat-value text-3xl">{appointments.length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl font-bold text-gray-500 mb-4">
              No appointments found
            </div>
            <p className="text-gray-400 mb-6">
              This employee doesn’t have any appointment history yet.
            </p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <AppointmentHistoryCard
              key={appointment.id}
              appointment={appointment}
            />
          ))
        )}
      </div>
    </div>
  );
}

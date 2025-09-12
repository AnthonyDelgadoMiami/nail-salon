// app/appointments/page.tsx
import CalendarView from "@/app/components/Appointments/CalendarView";
import { getAppointments } from "@/lib/db";

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-primary">
          Appointment Calendar
        </h1>
      </div>

      <CalendarView appointments={appointments} />
    </div>
  );
}
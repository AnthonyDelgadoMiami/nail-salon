// app/appointments/page.tsx
import CalendarView from "@/app/components/Appointments/CalendarView";
import { getAppointments } from "@/lib/db";

export default async function AppointmentsPage() {
  // Get all appointments for the calendar view
  const appointments = await getAppointments();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointment Calendar</h1>
      </div>
      
      <CalendarView appointments={appointments} />
    </div>
  );
}
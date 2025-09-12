// app/clients/[id]/history/page.tsx
import { getClient, getClientAppointments } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppointmentHistoryCard from "@/app/components/Clients/AppointmentHistoryCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientHistoryPage({ params }: PageProps) {
  const { id } = await params;
  const client = await getClient(Number(id));
  
  if (!client) {
    notFound();
  }

  function isUpcoming(appointment: any) {
    const startTime = new Date(appointment.date);
    const durationMinutes = appointment.duration ?? appointment.service?.duration ?? 0;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    return endTime > new Date();
  }

  const appointments = await getClientAppointments(Number(id));

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/clients/${client.id}`} className="btn btn-ghost">
          ← Back to Client
        </Link>
        <h1 className="text-3xl font-bold">
          Appointment History for {client.firstName} {client.lastName}
        </h1>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Appointments</div>
          <div className="stat-value text-3xl">{appointments.length}</div>
        </div>
        
      </div>

      {/* Appointment List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl font-bold text-gray-500 mb-4">No appointments found</div>
            <p className="text-gray-400 mb-6">This client doesn't have any appointment history yet.</p>
            <Link href={`/appointments/new?clientId=${client.id}`} className="btn btn-primary">
              Schedule First Appointment
            </Link>
          </div>
        ) : (
          appointments.map(appointment => (
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
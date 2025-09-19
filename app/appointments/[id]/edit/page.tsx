// app/appointments/[id]/edit/page.tsx
import AppointmentForm from '@/app/components/Appointments/AppointmentForm';
import { getClients, getServices, getUsers, getAppointment } from '@/lib/db';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAppointmentPage({ params }: PageProps) {
  const { id } = await params;
  const appointmentRaw = await getAppointment(Number(id));
  
  if (!appointmentRaw) {
    notFound();
  }

  // Ensure userId is a number (not null)
  const appointment = appointmentRaw && {
    ...appointmentRaw,
    userId: appointmentRaw.userId ?? 0, // fallback to 0 or handle appropriately
  };

  const [clients, services, users] = await Promise.all([
    getClients(),
    getServices(),
    getUsers(),
  ]);

  const staffUsers = users.filter(user => user.role !== 'admin');

  return (
    <div className="container mx-auto p-4">
      <AppointmentForm 
        appointment={appointment} 
        clients={clients} 
        services={services} 
        users={staffUsers}
      />
    </div>
  );
}
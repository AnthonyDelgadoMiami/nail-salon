// app/appointments/[id]/edit/page.tsx
import AppointmentForm from '@/app/components/Appointments/AppointmentForm';
import { getClients, getServices, getUsers, getAppointment } from '@/lib/db';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAppointmentPage({ params }: PageProps) {
  const { id } = await params;
  const appointment = await getAppointment(Number(id));
  
  if (!appointment) {
    notFound();
  }

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
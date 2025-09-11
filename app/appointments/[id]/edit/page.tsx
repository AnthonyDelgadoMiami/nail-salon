// app/appointments/[id]/edit/page.tsx
import AppointmentForm from '@/app/components/Appointments/AppointmentForm';
import { getAppointment, getClients, getServices } from '@/lib/db';
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

  const [clients, services] = await Promise.all([
    getClients(),
    getServices()
  ]);

  return (
    <div className="container mx-auto p-4">
      <AppointmentForm 
        appointment={appointment} 
        clients={clients} 
        services={services} 
      />
    </div>
  );
}
// app/appointments/new/page.tsx
import AppointmentForm from '@/app/components/Appointments/AppointmentForm';
import { getClients, getServices } from '@/lib/db';

export default async function NewAppointmentPage() {
  const [clients, services] = await Promise.all([
    getClients(),
    getServices()
  ]);

  return (
    <div className="container mx-auto p-4">
      <AppointmentForm clients={clients} services={services} />
    </div>
  );
}
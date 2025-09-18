// app/appointments/new/page.tsx
import AppointmentForm from '@/app/components/Appointments/AppointmentForm';
import { getClients, getServices, getUsers } from '@/lib/db';

export default async function NewAppointmentPage() {
  const [clients, services, users] = await Promise.all([
    getClients(),
    getServices(),
    getUsers()
  ]);

  const staffUsers = users.filter(user => user.role !== 'admin');

  return (
    <div className="container mx-auto p-4">
      <AppointmentForm clients={clients} services={services} users={staffUsers} />
    </div>
  );
}
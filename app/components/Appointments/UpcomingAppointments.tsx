// app/components/Appointments/UpcomingAppointments.tsx
import { getAppointmentsInDateRange } from '@/lib/db';
import { getDateRange } from '@/lib/dateUtils';
import AppointmentCard from './AppointmentCard';

interface UpcomingAppointmentsProps {
  days?: number;
  maxItems?: number;
}

export default async function UpcomingAppointments({ 
  days = 3, 
  maxItems = 10 
}: UpcomingAppointmentsProps) {
  try {
    const { start, end } = getDateRange(days);
    const appointments = await getAppointmentsInDateRange(start, end);

    const now = new Date();
    const upcomingAppointments = appointments.filter(appointment => {
      const startTime = new Date(appointment.date); 
      const durationMinutes = appointment.duration ?? appointment.service?.duration ?? 0;
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
      return endTime > now;
    });

    if (upcomingAppointments.length === 0) {
      return (
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body text-center">
            <p className="text-gray-500">
              No appointments scheduled for the next {days} days
            </p>
          </div>
        </div>
      );
    }

    const displayedAppointments = maxItems 
      ? upcomingAppointments.slice(0, maxItems) 
      : upcomingAppointments;

    return (
      <div>
        <h2 className="text-lg font-bold mb-4">Upcoming Appointments</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayedAppointments.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return (
      <div className="card bg-base-100 border border-error shadow-sm">
        <div className="card-body text-center">
          <p className="text-error font-medium">Failed to load appointments</p>
        </div>
      </div>
    );
  }
}

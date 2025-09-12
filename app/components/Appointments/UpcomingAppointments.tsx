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
        <div className="text-center py-4">
          <p className="text-gray-500">No appointments scheduled for the next {days} days</p>
        </div>
      );
    }

    // Limit the number of items if specified
    const displayedAppointments = maxItems 
      ? upcomingAppointments.slice(0, maxItems) 
      : upcomingAppointments;

    return (
      <div className="space-y-3">
        {displayedAppointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return (
      <div className="text-center py-4">
        <p className="text-error">Failed to load appointments</p>
      </div>
    );
  }
}
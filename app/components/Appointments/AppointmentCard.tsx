// app/components/Appointments/AppointmentCard.tsx
import Link from 'next/link';

interface Appointment {
  id: number;
  date: Date;
  client: {
    firstName: string;
    lastName: string;
  };
  service: {
    name: string;
  };
}

interface AppointmentCardProps {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() &&
           date.getMonth() === tomorrow.getMonth() &&
           date.getFullYear() === tomorrow.getFullYear();
  };

  const getDateDisplay = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return formatDate(date);
  };

  return (
    <div className="card card-compact bg-base-100 shadow-md border border-base-300 hover:shadow-lg transition-shadow">
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary">
              {formatTime(appointment.date)}
            </span>
            <span className="text-xs text-gray-500">
              {getDateDisplay(appointment.date)}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm">
              {appointment.client.firstName} {appointment.client.lastName}
            </h3>
            <p className="text-xs text-gray-600">{appointment.service.name}</p>
          </div>
          <Link 
            href={`/appointments/${appointment.id}`}
            className="btn btn-xs btn-outline btn-primary"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
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
  status: string;
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "CONFIRMED":
        return <span className="badge badge-success badge-sm">Confirmed</span>;
      case "SCHEDULED":
        return <span className="badge badge-info badge-sm">Scheduled</span>;
      case "COMPLETED":
        return <span className="badge badge-primary badge-sm">Completed</span>;
      case "CANCELLED":
        return <span className="badge badge-error badge-sm">Cancelled</span>;
      case "NO_SHOW":
        return <span className="badge badge-warning badge-sm">No Show</span>;
      default:
        return <span className="badge badge-neutral badge-sm">{status}</span>;
    }
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
          {getStatusBadge(appointment.status)}
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
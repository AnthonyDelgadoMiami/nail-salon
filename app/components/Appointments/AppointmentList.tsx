// app/components/Appointments/AppointmentList.tsx
import Link from 'next/link';

interface Appointment {
  id: number;
  date: string;
  clientId: number;
  serviceId: number;
  status: string;
  notes: string | null;
  client: {
    id: number;
    firstName: string;
    lastName: string;
  };
  service: {
    id: number;
    name: string;
    duration: number;
    price: number;
  };
}

interface AppointmentListProps {
  appointments: Appointment[];
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "CONFIRMED":
        return <span className="badge badge-success">{status}</span>;
      case "SCHEDULED":
        return <span className="badge badge-info">{status}</span>;
      case "COMPLETED":
        return <span className="badge badge-primary">{status}</span>;
      case "CANCELLED":
        return <span className="badge badge-error">{status}</span>;
      case "NO_SHOW":
        return <span className="badge badge-warning">{status}</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl font-bold text-gray-500 mb-4">No appointments</div>
        <p className="text-gray-400">No appointments scheduled for this date</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Time</th>
            <th>Client</th>
            <th>Service</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.id}>
              <td>
                <div className="font-bold">{formatTime(appointment.date)}</div>
                <div className="text-sm text-gray-500">{formatDate(appointment.date)}</div>
              </td>
              <td>
                {appointment.client.firstName} {appointment.client.lastName}
              </td>
              <td>{appointment.service.name}</td>
              <td>{appointment.service.duration} min</td>
              <td>{getStatusBadge(appointment.status)}</td>
              <td>
                <Link 
                  href={`/appointments/${appointment.id}`} 
                  className="btn btn-sm btn-info mr-2"
                >
                  View
                </Link>
                <Link 
                  href={`/appointments/${appointment.id}/edit`}
                  className="btn btn-sm btn-warning"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
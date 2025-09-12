// app/components/Clients/AppointmentHistoryCard.tsx
import Link from 'next/link';

interface Appointment {
  id: number;
  date: Date;
  clientId: number;
  serviceId: number;
  duration: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  service: {
    id: number;
    name: string;
    duration: number;
    price: number;
  };
}

interface AppointmentHistoryCardProps {
  appointment: Appointment;
}

export default function AppointmentHistoryCard({ appointment }: AppointmentHistoryCardProps) {
  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const datetime = formatDateTime(appointment.date);

  // Status logic: check if appointment has ended
  const startTime = new Date(appointment.date);
  const durationMinutes = appointment.duration ?? appointment.service?.duration ?? 0;
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
  const isUpcoming = endTime > new Date();

  const isPastAppointment = new Date(appointment.date) < new Date();

  return (
    <div className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow`}>
      <div className="card-body p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left side - Appointment details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="card-title text-lg">
                {appointment.service.name}
              </h3>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs font-semibold align-middle ${
                  isUpcoming
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isUpcoming ? "Upcoming" : "Completed"}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold">Date:</span> {datetime.date}
              </div>
              <div>
                <span className="font-semibold">Time:</span> {datetime.time}
              </div>
              <div>
                <span className="font-semibold">Duration:</span> {appointment.duration} min
              </div>
              <div>
                <span className="font-semibold">Price:</span> ${appointment.service.price.toFixed(2)}
              </div>
            </div>

            {appointment.notes && (
              <div className="mt-3">
                <span className="font-semibold">Notes:</span>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col gap-2">
            <Link 
              href={`/appointments/${appointment.id}`}
              className="btn btn-sm btn-outline"
            >
              View Details
            </Link>
            {!isPastAppointment && (
              <Link 
                href={`/appointments/${appointment.id}/edit`}
                className="btn btn-sm btn-warning"
              >
                Reschedule
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
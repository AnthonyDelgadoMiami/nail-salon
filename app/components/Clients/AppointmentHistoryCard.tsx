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
    <div className="card bg-base-100 shadow-lg rounded-lg hover:shadow-xl transition-shadow">
      <div className="card-body p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Appointment Details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h3 className="card-title text-lg">{appointment.service.name}</h3>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  isUpcoming ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                }`}
              >
                {isUpcoming ? "Upcoming" : "Completed"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
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
                <p className="text-sm text-gray-600 mt-1 line-clamp-2 sm:line-clamp-none">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:gap-2 mt-3 sm:mt-0">
            <Link
              href={`/appointments/${appointment.id}`}
              className="btn btn-sm btn-outline w-full sm:w-auto"
            >
              View Details
            </Link>
            {!isPastAppointment && (
              <Link
                href={`/appointments/${appointment.id}/edit`}
                className="btn btn-sm btn-warning w-full sm:w-auto mt-2 sm:mt-0"
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
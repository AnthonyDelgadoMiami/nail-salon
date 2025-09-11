// app/components/Dashboard/QuickStats.tsx
import { getAppointmentsInDateRange, getClientCount, getServiceCount } from '@/lib/db';
import { getDateRange } from '@/lib/dateUtils';

export default async function QuickStats() {
  const today = new Date();
  const { start, end } = getDateRange(0); // Today only
  
  const [todayAppointments, clientCount, serviceCount] = await Promise.all([
    getAppointmentsInDateRange(start, end),
    getClientCount(),
    getServiceCount()
  ]);

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      description: "Scheduled for today",
      link: "/appointments",
      color: "text-primary"
    },
    {
      title: "Total Clients",
      value: clientCount,
      description: "In your database",
      link: "/clients",
      color: "text-secondary"
    },
    {
      title: "Services",
      value: serviceCount,
      description: "Available services",
      link: "/services",
      color: "text-accent"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <h3 className="card-title text-sm font-semibold">{stat.title}</h3>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.description}</p>
            <div className="card-actions justify-end">
              <a href={stat.link} className="btn btn-xs btn-ghost">View →</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
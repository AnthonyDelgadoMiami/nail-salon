import { getAppointmentsInDateRange, getClientCount, getServiceCount } from "@/lib/db";
import { getDateRange } from "@/lib/dateUtils";
import Link from "next/link";

export default async function QuickStats() {
  const { start, end } = getDateRange(0); // Today only

  const [todayAppointments, clientCount, serviceCount] = await Promise.all([
    getAppointmentsInDateRange(start, end),
    getClientCount(),
    getServiceCount(),
  ]);

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      description: "Scheduled for today",
      link: "/appointments",
      color: "text-primary",
      border: "border-primary",
    },
    {
      title: "Total Clients",
      value: clientCount,
      description: "In your database",
      link: "/clients",
      color: "text-secondary",
      border: "border-secondary",
    },
    {
      title: "Services",
      value: serviceCount,
      description: "Available services",
      link: "/services",
      color: "text-accent",
      border: "border-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`card bg-base-100 shadow-md border-t-4 ${stat.border}`}
        >
          <div className="card-body p-6">
            <h3 className="card-title text-sm font-semibold">
              {stat.title}
            </h3>
            <p className={`text-4xl font-extrabold ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-sm text-gray-500">{stat.description}</p>
            <div className="card-actions justify-end mt-3">
              <Link
                href={stat.link}
                className="btn btn-xs btn-ghost hover:text-primary"
              >
                View →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

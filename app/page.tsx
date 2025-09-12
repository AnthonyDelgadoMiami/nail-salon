import Link from "next/link";
import UpcomingAppointments from "./components/Appointments/UpcomingAppointments";
import QuickStats from "./components/Dashboard/QuickStats";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-16 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-primary animate-fade-in">
              Nail Salon Manager
            </h1>
            <p className="py-6 text-lg text-gray-600">
              Manage your clients and appointments with ease. Designed
              specifically for Vietnamese nail salon owners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/clients" className="btn btn-primary rounded-full px-6">
                Manage Clients
              </Link>
              <Link href="/appointments" className="btn btn-secondary rounded-full px-6">
                View Appointments
              </Link>
              <Link href="/services" className="btn btn-accent rounded-full px-6">
                Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="container mx-auto px-4">
        <QuickStats />
      </div>

      {/* Upcoming Appointments Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
              <h2 className="card-title text-2xl font-bold">
                Upcoming Appointments
              </h2>
              <span className="badge badge-info badge-lg">Next 3 days</span>
            </div>

            <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              <UpcomingAppointments days={3} maxItems={15} />
            </div>

            <div className="card-actions justify-end mt-6 gap-3">
              <Link href="/appointments" className="btn btn-outline btn-sm rounded-full">
                View All
              </Link>
              <Link href="/appointments/new" className="btn btn-primary btn-sm rounded-full">
                + New Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

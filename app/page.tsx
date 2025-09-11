// app/page.tsx
import Link from "next/link";
import UpcomingAppointments from "./components/Appointments/UpcomingAppointments";
import QuickStats from "./components/Dashboard/QuickStats";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-12">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Nail Salon Manager</h1>
            <p className="py-6">
              Manage your clients and appointments with ease. Designed specifically for Vietnamese nail salon owners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/clients" className="btn btn-primary">Manage Clients</Link>
              <Link href="/appointments" className="btn btn-secondary">View Appointments</Link>
              <Link href="/services" className="btn btn-accent">Services</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="container mx-auto px-4">
        <QuickStats />
      </div>

      {/* Upcoming Appointments Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-2xl font-bold">Upcoming Appointments</h2>
              <span className="badge badge-info">Next 3 days</span>
            </div>
            
            <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              <UpcomingAppointments days={3} maxItems={15} />
            </div>
            
            <div className="card-actions justify-end mt-4 gap-2">
              <Link href="/appointments" className="btn btn-outline btn-sm">
                View All Appointments
              </Link>
              <Link href="/appointments/new" className="btn btn-primary btn-sm">
                Schedule New Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
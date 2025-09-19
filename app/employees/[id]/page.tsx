// app/employees/[id]/page.tsx
import { getUser, getEmployeeStats } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const employee = await getUser(Number(id));

  if (!employee) {
    notFound();
  }

  // Get employee statistics (appointment count, etc.)
  const stats = await getEmployeeStats(Number(id));

  console.log(stats)

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Details</h1>
        <Link href={`/employees/${employee.id}/edit`} className="btn btn-warning">
          Edit Employee
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Info Card */}
        <div className="card bg-base-100 shadow-xl lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-2xl">{employee.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-sm">Email</label>
                  <p className="text-base">{employee.email}</p>
                </div>
                
                <div>
                  <label className="font-semibold text-sm">Role</label>
                  <span className={`badge ${employee.role === 'admin' ? 'badge-primary' : 'badge-secondary'} capitalize`}>
                    {employee.role}
                  </span>
                </div>
                
                <div>
                  <label className="font-semibold text-sm">Member Since</label>
                  <p className="text-base">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-sm">Last Updated</label>
                  <p className="text-base">
                    {new Date(employee.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <label className="font-semibold text-sm">Status</label>
                  <span className="badge badge-success">Active</span>
                </div>
                
                <div>
                  <label className="font-semibold text-sm">Employee ID</label>
                  <p className="text-base">#{employee.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Statistics</h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="stat-value text-primary">{stats.totalAppointments}</div>
                <div className="stat-title">Total Appointments</div>
              </div>
              
              <div className="text-center">
                <div className="stat-value text-secondary">{stats.thisMonthAppointments}</div>
                <div className="stat-title">This Month</div>
              </div>
              
              <div className="text-center">
                <div className="stat-value text-accent">{stats.todayAppointments}</div>
                <div className="stat-title">Today</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card bg-base-100 shadow-xl mt-6">
        <div className="card-body">
          <h3 className="card-title">Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link href={`/appointments?employee=${employee.id}`} className="btn btn-primary">
              View All Appointments
            </Link>
            <Link href={`/employees/${employee.id}/schedule`} className="btn btn-secondary">
              View Schedule
            </Link>
            <Link href={`/employees/${employee.id}/performance`} className="btn btn-info">
              Performance Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
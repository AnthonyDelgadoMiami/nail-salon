// app/appointments/[id]/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Appointment {
  id: number;
  date: string;
  clientId: number;
  serviceId: number;
  duration: number;
  status: string;
  notes: string | null;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
  };
  service: {
    id: number;
    name: string;
    description: string | null;
    duration: number;
    price: number;
  };
}

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        if (params.id) {
          const response = await fetch(`/api/appointments/${params.id}`);
          
          if (response.ok) {
            const appointmentData = await response.json();
            setAppointment(appointmentData);
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to fetch appointment');
          }
        }
      } catch (err) {
        setError('An error occurred while fetching the appointment');
        console.error('Error fetching appointment:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [params.id]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (response.ok) {
        // Refresh the page to show updated status
        router.refresh();
        // Reload appointment data
        const updatedAppointment = await response.json();
        setAppointment(updatedAppointment);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update appointment');
      }
    } catch (err) {
      setError('An error occurred while updating the appointment');
      console.error('Error updating appointment:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Redirect to appointments list after successful deletion
        router.push('/appointments');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete appointment');
      }
    } catch (err) {
      setError('An error occurred while deleting the appointment');
      console.error('Error deleting appointment:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
          <span>{error || 'Appointment not found'}</span>
        </div>
        <Link href="/appointments" className="btn btn-primary mt-4">
          Back to Appointments
        </Link>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString()
    };
  };

  const datetime = formatDateTime(appointment.date);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "CONFIRMED":
        return <span className="badge badge-success">Confirmed</span>;
      case "SCHEDULED":
        return <span className="badge badge-info">Scheduled</span>;
      case "COMPLETED":
        return <span className="badge badge-primary">Completed</span>;
      case "CANCELLED":
        return <span className="badge badge-error">Cancelled</span>;
      case "NO_SHOW":
        return <span className="badge badge-warning">No Show</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointment Details</h1>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Appointment #{appointment.id}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Appointment Information</h3>
              <div className="space-y-2">
                <p><strong>Date:</strong> {datetime.date}</p>
                <p><strong>Time:</strong> {datetime.time}</p>
                <p><strong>Duration:</strong> {appointment.duration} minutes</p>
                <p><strong>Status:</strong> {getStatusBadge(appointment.status)}</p>
                <p><strong>Service:</strong> {appointment.service.name}</p>
                <p><strong>Price:</strong> ${appointment.service.price.toFixed(2)}</p>
                {appointment.service.description && (
                  <p><strong>Description:</strong> {appointment.service.description}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Client Information</h3>
              <div className="space-y-2">
                <p><strong>Client:</strong> {appointment.client.firstName} {appointment.client.lastName}</p>
                <p><strong>Phone:</strong> {appointment.client.phone}</p>
                {appointment.client.email && (
                  <p><strong>Email:</strong> {appointment.client.email}</p>
                )}
                <Link 
                  href={`/clients/${appointment.client.id}`}
                  className="btn btn-sm btn-outline mt-2"
                >
                  View Client Details
                </Link>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Notes</h3>
              <div className="bg-base-200 p-4 rounded-lg">
                <p>{appointment.notes}</p>
              </div>
            </div>
          )}

          <div className="card-actions justify-between mt-8">
            
            <div className="flex gap-2">
              <Link 
                href={`/appointments/${appointment.id}/edit`}
                className="btn btn-warning"
              >
                Edit Appointment
              </Link>
              <button 
                onClick={handleDelete}
                className="btn btn-outline btn-error"
              >
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/appointments" className="btn btn-ghost">
          ← Back to Appointments
        </Link>
      </div>
    </div>
  );
}
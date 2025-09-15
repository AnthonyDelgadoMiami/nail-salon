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
  price: number;
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
            const data = await response.json();
            setAppointment(data);
          } else {
            const errorData = await response.json();
            setError(errorData.error || "Failed to fetch appointment");
          }
        }
      } catch (err) {
        setError("An error occurred while fetching the appointment");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAppointment();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const response = await fetch(`/api/appointments/${params.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/appointments");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete appointment");
      }
    } catch (err) {
      setError("An error occurred while deleting the appointment");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="alert alert-error shadow-lg">
          <span>{error || "Appointment not found"}</span>
        </div>
        <Link href="/appointments" className="btn btn-primary mt-6 w-full">
          Back to Appointments
        </Link>
      </div>
    );
  }

  const date = new Date(appointment.date);
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Appointment Details</h1>
        <Link href="/appointments" className="btn btn-ghost">
          ← Back
        </Link>
      </div>

      {/* Main Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body space-y-6">
          <h2 className="card-title text-lg">
            Appointment #{appointment.id}
          </h2>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Appointment Info */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Appointment Info</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Date:</strong> {dateString}
                </p>
                <p>
                  <strong>Time:</strong> {timeString}
                </p>
                <p>
                  <strong>Duration:</strong> {appointment.duration} min
                </p>
                <p>
                  <strong>Service:</strong>{" "}
                  <span className="badge badge-primary badge-sm">
                    {appointment.service ? appointment.service.name : 'Custom'}
                  </span>
                </p>
                <p>
                  <strong>Price:</strong> ${appointment.price.toFixed(2)}
                </p>
                {appointment.service?.description && (
                  <p>
                    <strong>Description:</strong> {appointment.service.description}
                  </p>
                )}
              </div>
            </div>

            {/* Client Info */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Client Info</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Name:</strong> {appointment.client.firstName}{" "}
                  {appointment.client.lastName}
                </p>
                <p>
                  <strong>Phone:</strong> {appointment.client.phone}
                </p>
                {appointment.client.email && (
                  <p>
                    <strong>Email:</strong> {appointment.client.email}
                  </p>
                )}
                <Link
                  href={`/clients/${appointment.client.id}`}
                  className="btn btn-sm btn-outline mt-3"
                >
                  View Client
                </Link>
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Notes</h3>
              <div className="bg-base-200 p-4 rounded-lg text-sm">
                {appointment.notes}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t">
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-start">
              <Link
                href={`/appointments/${appointment.id}/edit`}
                className="btn btn-warning"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-error btn-outline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/components/Appointments/AppointmentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TimeSelect from './TimeSelect';
import ClientSearch from './ClientSearch';

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
}

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

interface Appointment {
  id: number;
  date: Date;
  clientId: number;
  serviceId: number;
  duration: number;
  notes: string | null;
  client: Client;
  service: Service;
}

interface AppointmentFormProps {
  appointment?: Appointment;
  clients: Client[];
  services: Service[];
}

export default function AppointmentForm({ appointment, clients, services }: AppointmentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultClientId = searchParams.get('clientId');
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    clientId: defaultClientId || '',
    serviceId: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill form if editing an existing appointment
  useEffect(() => {
    if (appointment) {
      const date = new Date(appointment.date);
      setFormData({
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5), // Gets "HH:MM" format
        clientId: appointment.clientId.toString(),
        serviceId: appointment.serviceId.toString(),
        notes: appointment.notes || ''
      });
    }
  }, [appointment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
  };

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({
      ...prev,
      clientId
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      const url = appointment ? `/api/appointments/${appointment.id}` : '/api/appointments';
      const method = appointment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateTime.toISOString(),
          clientId: parseInt(formData.clientId),
          serviceId: parseInt(formData.serviceId),
          notes: formData.notes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save appointment');
      }

      // Show success message
      setSuccess(appointment ? 'Appointment updated successfully!' : 'Appointment scheduled successfully!');
      
      // Redirect to appointments list after a short delay
      setTimeout(() => {
        router.push('/appointments');
        router.refresh();
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {appointment ? `Edit Appointment #${appointment.id}` : 'Schedule New Appointment'}
      </h2>
      
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4">
          <span>{success}</span>
          <span className="loading loading-dots loading-sm ml-2"></span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date *</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input input-bordered"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Time *</span>
              </label>
              <TimeSelect
                value={formData.time}
                onChange={handleTimeChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Client *</span>
              </label>
              <ClientSearch
                clients={clients}
                value={formData.clientId}
                onChange={handleClientChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Service *</span>
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                className="select select-bordered"
                required
                disabled={isSubmitting}
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} (${service.price}) - {service.duration}min
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Notes</span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="textarea textarea-bordered h-24"
                placeholder="Any special notes for this appointment..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (appointment ? 'Updating...' : 'Scheduling...') 
                : (appointment ? 'Update Appointment' : 'Schedule Appointment')
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
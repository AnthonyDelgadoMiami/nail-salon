// app/components/Appointments/AppointmentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TimeSelect from './TimeSelect';
import ClientSearch from './ClientSearch';
import UserSearch from './UserSearch';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

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
  serviceId: number | null;
  duration: number;
  price: number;
  notes: string | null;
  userId: number;
  client: Client;
  service: Service | null;
  user: User;
}

interface AppointmentFormProps {
  appointment?: Appointment;
  clients: Client[];
  services: Service[];
  users: User[];
}

interface WalkInClientData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface CustomServiceData {
  duration: number;
  price: number;
}

export default function AppointmentForm({ appointment, clients, services, users }: AppointmentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultClientId = searchParams.get('clientId');
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    clientId: defaultClientId || '',
    serviceId: '',
    userId: '',
    notes: ''
  });
  
  const [walkInClient, setWalkInClient] = useState<WalkInClientData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  const [customService, setCustomService] = useState<CustomServiceData>({
    duration: 30,
    price: 0
  });
  
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [isCustomService, setIsCustomService] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<{phone?: string; email?: string}>({});

  // Pre-fill form if editing an existing appointment
  useEffect(() => {
    if (appointment) {
      const date = new Date(appointment.date);
      
      // Check if this is a custom service (serviceId is null)
      const isCustom = appointment.serviceId === null;
      
      setFormData({
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5),
        clientId: appointment.clientId.toString(),
        serviceId: isCustom ? '' : appointment.serviceId?.toString() || '',
        userId: appointment.userId.toString(),
        notes: appointment.notes || ''
      });

      // If it's a custom service, set custom service data
      if (isCustom) {
        setIsCustomService(true);
        setCustomService({
          duration: appointment.duration,
          price: appointment.price
        });
      }
    }
  }, [appointment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserChange = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      userId
    }));
  };

  const handleWalkInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWalkInClient(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate if phone/email already exists
    if (name === 'phone' || name === 'email') {
      validateWalkInClient({ ...walkInClient, [name]: value });
    }
  };

  const validateWalkInClient = (clientData: WalkInClientData) => {
    const errors: {phone?: string; email?: string} = {};
    
    // Check if phone already exists
    if (clientData.phone && clients.some(client => client.phone === clientData.phone)) {
      errors.phone = 'This phone number is already registered to an existing client';
    }
    
    // Check if email already exists (if email is provided)
    if (clientData.email && clients.some(client => client.email && client.email.toLowerCase() === clientData.email.toLowerCase())) {
      errors.email = 'This email is already registered to an existing client';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCustomServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomService(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' ? Number(value) : value
    }));
  };

  const handleClientChange = (clientId: string) => {
    if (clientId === 'walk-in') {
      setIsWalkIn(true);
      setFormData(prev => ({ ...prev, clientId: '' }));
      // Clear validation errors when switching to walk-in
      setValidationErrors({});
    } else {
      setIsWalkIn(false);
      setFormData(prev => ({ ...prev, clientId }));
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    
    if (value === 'custom') {
      setIsCustomService(true);
      setFormData(prev => ({ ...prev, serviceId: '' }));
    } else {
      setIsCustomService(false);
      setFormData(prev => ({ ...prev, serviceId: value }));
    }
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate walk-in client data if it's a walk-in
      if (isWalkIn) {
        // Validate required fields
        if (!walkInClient.firstName || !walkInClient.lastName || !walkInClient.phone) {
          throw new Error('First name, last name, and phone are required for walk-in clients');
        }

        // Validate that phone/email doesn't already exist
        const isValid = validateWalkInClient(walkInClient);
        if (!isValid) {
          throw new Error('Please fix the validation errors before submitting');
        }
      }

      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      const url = appointment ? `/api/appointments/${appointment.id}` : '/api/appointments';
      const method = appointment ? 'PUT' : 'POST';

      // Prepare request data
      let requestData: any = {
        date: dateTime.toISOString(),
        notes: formData.notes,
        userId: parseInt(formData.userId)
      };

      // Add service data based on custom or existing service
      if (isCustomService) {
        // Validate custom service data
        if (customService.duration <= 0 || customService.price < 0) {
          throw new Error('Custom service requires positive duration and non-negative price');
        }
        requestData.customService = customService;
      } else {
        if (!formData.serviceId) {
          throw new Error('Please select a service');
        }
        requestData.serviceId = parseInt(formData.serviceId);
      }

      // Add client data based on walk-in or existing client
      if (isWalkIn) {
        requestData.walkInClient = walkInClient;
      } else {
        if (!formData.clientId) {
          throw new Error('Please select a client');
        }
        requestData.clientId = parseInt(formData.clientId);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
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
              <label className="label font-semibold">
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
              <label className="label font-semibold">
                <span className="label-text">Time *</span>
              </label>
              <TimeSelect
                value={formData.time}
                onChange={handleTimeChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Client Selection */}
            <div className="form-control md:col-span-2">
              <label className="label font-semibold">
                <span>Client *</span>
              </label>
              <ClientSearch
                clients={clients}
                value={formData.clientId}
                onChange={handleClientChange}
                disabled={isSubmitting}
                showWalkInOption={true}
                isWalkIn={isWalkIn}
              />
            </div>

            {/* Walk-In Client Form */}
            {isWalkIn && (
              <div className="md:col-span-2 border-l-4 border-primary pl-4 mt-2">
                <h3 className="font-semibold text-lg mb-4">Walk-In Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">First Name *</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={walkInClient.firstName}
                      onChange={handleWalkInChange}
                      className="input input-bordered"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Name *</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={walkInClient.lastName}
                      onChange={handleWalkInChange}
                      className="input input-bordered"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone *</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={walkInClient.phone}
                      onChange={handleWalkInChange}
                      className="input input-bordered"
                      required
                      disabled={isSubmitting}
                    />
                    {validationErrors.phone && (
                      <div className="text-error text-sm mt-1">{validationErrors.phone}</div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={walkInClient.email}
                      onChange={handleWalkInChange}
                      className="input input-bordered"
                      disabled={isSubmitting}
                    />
                    {validationErrors.email && (
                      <div className="text-error text-sm mt-1">{validationErrors.email}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label font-semibold">
                <span className="label-text">Service *</span>
              </label>
              <select
                name="serviceId"
                value={isCustomService ? 'custom' : formData.serviceId}
                onChange={handleServiceChange}
                className="select select-bordered"
                required={!isCustomService}
                disabled={isSubmitting}
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} (${service.price}) - {service.duration}min
                  </option>
                ))}
                <option value="custom">➕ Custom Service</option>
              </select>
            </div>

            {/* Custom Service Form */}
            {isCustomService && (
              <div className="md:col-span-2 border-l-4 border-secondary pl-4 mt-2">
                <h3 className="font-semibold text-lg mb-4">Custom Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Duration (minutes) *</span>
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={customService.duration}
                      onChange={handleCustomServiceChange}
                      className="input input-bordered"
                      min="1"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Price ($) *</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={customService.price}
                      onChange={handleCustomServiceChange}
                      className="input input-bordered"
                      min="0"
                      step="0.01"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label font-semibold">
                <span className="label-text">Staff Member *</span>
              </label>
              <UserSearch
                users={users}
                value={formData.userId}
                onChange={handleUserChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label font-semibold">
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
              disabled={isSubmitting || Object.keys(validationErrors).length > 0}
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
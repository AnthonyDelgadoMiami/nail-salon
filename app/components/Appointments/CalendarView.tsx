// app/components/Appointments/CalendarView.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Appointment {
  id: number;
  date: Date;
  clientId: number;
  serviceId: number;
  duration: number;
  notes: string | null;
  client: {
    id: number;
    firstName: string;
    lastName: string;
  };
  service: {
    id: number;
    name: string;
    duration: number;
    price: number;
  };
}

interface CalendarViewProps {
  appointments: Appointment[];
}

interface Day {
  date: Date;
  isToday: boolean;
  isPast: boolean;
  appointments: Appointment[];
}

interface TimeSlot {
  time: string;
  displayTime: string;
  hour: number;
  minute: number;
}

export default function CalendarView({ appointments }: CalendarViewProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Day[]>([]);

  // Generate time slots from 6 AM to 8 PM
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    for (let hour = 6; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2023-01-01T${timeString}`).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        slots.push({ time: timeString, displayTime, hour, minute });
      }
    }
    return slots;
  }, []);

  // Generate week days (Monday to Sunday) with all appointments
  useEffect(() => {
    const generateWeek = () => {
      const days: Day[] = [];
      const current = new Date(currentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today for comparison
      
      // Find Monday of the current week
      const dayOfWeek = current.getDay();
      const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const monday = new Date(current.setDate(diff));
      
      for (let i = 0; i < 7; i++) { // Monday to Sunday
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        
        const dayAppointments = appointments.filter(appt => {
          const apptDate = new Date(appt.date);
          return apptDate.toDateString() === day.toDateString();
        });
        
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        
        days.push({
          date: new Date(day),
          isToday: day.toDateString() === new Date().toDateString(),
          isPast: dayStart < today,
          appointments: dayAppointments
        });
      }
      
      setWeekDays(days);
    };
    
    generateWeek();
  }, [currentDate, appointments]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const handleAppointmentClick = (appointmentId: number) => {
    router.push(`/appointments/${appointmentId}`);
  };

  const handleDeleteAppointment = async (appointmentId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the appointment click
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to show updated calendar
        router.refresh();
      } else {
        alert('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('An error occurred while canceling the appointment');
    }
  };

  const formatDateRange = () => {
    if (weekDays.length === 0) return '';
    
    const firstDay = weekDays[0].date;
    const lastDay = weekDays[6].date;
    
    const isSameMonth = firstDay.getMonth() === lastDay.getMonth();
    const isSameYear = firstDay.getFullYear() === lastDay.getFullYear();
    
    if (isSameMonth && isSameYear) {
      return `${firstDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${lastDay.getDate()}, ${lastDay.getFullYear()}`;
    } else if (isSameYear) {
      return `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${lastDay.getFullYear()}`;
    } else {
      return `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  const calculateAppointmentPosition = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date);
    const startHours = appointmentDate.getHours();
    const startMinutes = appointmentDate.getMinutes();
    const duration = appointment.service.duration; // in minutes
    
    // Calculate top position (6 AM = 0, 8 PM = 14 hours * 2 = 28 rows)
    const top = ((startHours - 6) * 2) + (startMinutes / 30);
    
    // Calculate height based on duration
    const height = duration / 30; // Each 30 minutes = 1 row
    
    return { top, height };
  };

  const isAppointmentPast = (appointmentDate: Date) => {
    return new Date(appointmentDate) < new Date();
  };

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={navigateToToday}
          className="btn btn-outline btn-sm"
        >
          Today
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigateWeek('prev')}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-semibold">{formatDateRange()}</h2>
          
          <button 
            onClick={() => navigateWeek('next')}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        
        <Link href="/appointments/new" className="btn btn-primary btn-sm">
          New Appointment
        </Link>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 min-w-[1000px]">
          {/* Time column */}
          <div className="border-r border-gray-200">
            <div className="h-12 border-b border-gray-200 flex items-center justify-center font-semibold">
              Time
            </div>
            {timeSlots.map((slot, index) => (
              <div
                key={slot.time}
                className="h-12 border-b border-gray-200 flex items-start justify-end pr-2 text-xs text-gray-500 pt-1"
              >
                {index % 2 === 0 ? slot.displayTime : ''}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className={`relative border-r border-gray-200 last:border-r-0 ${
              day.isPast ? 'bg-gray-50' : ''
            }`}>
              {/* Day header */}
              <div className={`h-12 border-b border-gray-200 flex flex-col items-center justify-center font-semibold ${
                day.isToday ? 'bg-blue-50 text-blue-600' : ''
              } ${day.isPast ? 'text-gray-400' : ''}`}>
                <div className="text-sm">{day.date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-xs">{day.date.getDate()}</div>
              </div>

              {/* Time slots */}
              <div className="relative">
                {timeSlots.map((slot, slotIndex) => (
                  <div
                    key={slot.time}
                    className="h-12 border-b border-gray-200 relative"
                  >
                    {/* Hour line */}
                    {slot.minute === 0 && (
                      <div className="absolute top-0 left-0 right-0 border-t border-gray-300"></div>
                    )}
                    
                    {/* Half-hour line */}
                    {slot.minute === 30 && (
                      <div className="absolute top-0 left-2 right-2 border-t border-gray-100"></div>
                    )}
                  </div>
                ))}

                {/* Appointments */}
                {day.appointments.map((appointment) => {
                  const { top, height } = calculateAppointmentPosition(appointment);
                  const appointmentDate = new Date(appointment.date);
                  const endTime = new Date(appointmentDate.getTime() + appointment.service.duration * 60000);
                  const isPast = isAppointmentPast(appointment.date);
                  
                  return (
                    <div
                      key={appointment.id}
                      onClick={() => handleAppointmentClick(appointment.id)}
                      className={`absolute left-1 right-1 rounded p-1 cursor-pointer border-l-4 overflow-hidden hover:opacity-80 transition-opacity ${
                        isPast 
                          ? 'bg-gray-100 border-gray-400 text-gray-600' 
                          : 'bg-blue-50 border-blue-500'
                      }`}
                      style={{
                        top: `${top * 3}rem`,
                        height: `${height * 3}rem`,
                        zIndex: 10
                      }}
                    >
                      <div className="text-xs font-medium whitespace-nowrap overflow-hidden">
                        {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xs font-semibold whitespace-nowrap overflow-hidden">
                        {appointment.client.firstName} {appointment.client.lastName}
                      </div>
                      <div className="text-xs whitespace-nowrap overflow-hidden">
                        {appointment.service.name}
                      </div>
                      <div className="text-xs whitespace-nowrap overflow-hidden">
                        {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {isPast && (
                        <div className="absolute top-1 right-1 text-xs text-gray-500" title="Completed appointment">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-50 border-l-4 border-blue-500"></div>
          <span>Upcoming Appointments</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 border-l-4 border-gray-400"></div>
          <span>Completed Appointments</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-sm text-gray-600">
        <p>• Click on any appointment to view details</p>
      </div>
    </div>
  );
}
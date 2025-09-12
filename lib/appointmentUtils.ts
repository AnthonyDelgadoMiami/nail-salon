// lib/appointmentUtils.ts
export function isAppointmentCompleted(appointmentDate: Date | string): boolean {
  const appointmentTime = new Date(appointmentDate);
  const now = new Date();
  return appointmentTime < now;
}

export function shouldAutoComplete(appointment: {
  date: Date | string;
  status: string;
}): boolean {
  const isPast = isAppointmentCompleted(appointment.date);
  const isEligibleStatus = ['SCHEDULED', 'CONFIRMED'].includes(appointment.status);
  return isPast && isEligibleStatus;
}

export function isAppointmentPast(date: Date | string): boolean {
  return new Date(date) < new Date();
}

export function isAppointmentUpcoming(date: Date | string): boolean {
  return new Date(date) >= new Date();
}
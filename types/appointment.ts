// types/appointment.ts
export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

export interface Appointment {
  id: number;
  date: Date;
  clientId: number;
  serviceId: number;
  userId: number;
  duration: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  client: Client;
  service: Service;
}
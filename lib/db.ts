// lib/db.ts
import { prisma } from './prisma'

// Client operations

export const getClient = async (id: number) => {
  return await prisma.client.findUnique({
    where: { id }
  })
}

export const deleteClient = async (id: number) => {
  return await prisma.client.delete({
    where: { id }
  })
}

// Appointment operations
export const getAppointments = async (date?: Date) => {
  try {
    const whereClause = date ? {
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999))
      }
    } : {};

    return await prisma.appointment.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        },
      },
      orderBy: { date: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

export const createAppointment = async (data: {
  date: Date;
  clientId: number;
  serviceId: number;
  userId: number;
  duration: number; 
  price: number;
  notes?: string;
}) => {
  try {
    return await prisma.appointment.create({
      data: {
        date: data.date,
        clientId: data.clientId,
        serviceId: data.serviceId,
        userId: data.userId,
        duration: data.duration,
        price: data.price,
        notes: data.notes || null
      },
      include: {
        client: true,
        service: true
      }
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export const updateAppointment = async (id: number, data: {
  date?: Date
  clientId?: number
  serviceId?: number
  notes?: string
}) => {
  return await prisma.appointment.update({
    where: { id },
    data,
    include: {
      client: true,
      service: true
    }
  })
}

export const deleteAppointment = async (id: number) => {
  return await prisma.appointment.delete({
    where: { id }
  })
}

export const deleteService = async (id: number) => {
  return await prisma.service.delete({
    where: { id }
  })
}

export async function createClient(data: {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  notes?: string;
}) {
  try {
    return await prisma.client.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || null,
        notes: data.notes || null
      }
    });
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function updateClient(
  id: number, 
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    notes?: string;
  }
) {
  try {
    return await prisma.client.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || null,
        notes: data.notes || null
      }
    });
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

export async function getAppointment(id: number) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        },
        user: { 
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    return appointment;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return null;
  }
}

export async function getServices() {
  try {
    return await prisma.service.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getService(id: number) {
  try {
    return await prisma.service.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

export async function createService(data: {
  name: string;
  description?: string;
  duration: number;
  price: number;
}) {
  try {
    return await prisma.service.create({
      data: {
        name: data.name,
        description: data.description || null,
        duration: data.duration,
        price: data.price
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

export async function updateService(
  id: number, 
  data: {
    name?: string;
    description?: string;
    duration?: number;
    price?: number;
  }
) {
  try {
    return await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        duration: data.duration,
        price: data.price
      }
    });
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

export async function getAppointmentsInDateRange(startDate: Date, endDate: Date) {
  try {
    return await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        }
      },
      orderBy: { date: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching appointments in date range:', error);
    return [];
  }
}

export async function getClientCount(): Promise<number> {
  try {
    return await prisma.client.count();
  } catch (error) {
    console.error('Error counting clients:', error);
    return 0;
  }
}

export async function getServiceCount(): Promise<number> {
  try {
    return await prisma.service.count();
  } catch (error) {
    console.error('Error counting services:', error);
    return 0;
  }
}

export async function getClients() {
  try {
    return await prisma.client.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        notes: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { lastName: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

export async function getClientAppointments(clientId: number) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        clientId: clientId
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            price: true
          }
        },
        user: { 
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        date: 'desc' // Most recent first
      }
    });

    return appointments;
  } catch (error) {
    console.error('Error fetching client appointments:', error);
    return [];
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' }
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUser(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getEmployeeStats(employeeId: number) {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const [totalAppointments, thisMonthAppointments, todayAppointments] = await Promise.all([
      prisma.appointment.count({
        where: { userId: employeeId }
      }),
      prisma.appointment.count({
        where: {
          userId: employeeId,
          date: {
            gte: startOfMonth,
            lt: today
          }
        }
      }),
      prisma.appointment.count({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay,
            lt: endOfDay
          }
        }
      })
    ]);

    
    return {
      totalAppointments,
      thisMonthAppointments,
      todayAppointments
    };
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    return {
      totalAppointments: 0,
      thisMonthAppointments: 0,
      todayAppointments: 0
    };
  }
}

export async function getEmployeeAppointments(userId: number) {
  return prisma.appointment.findMany({
    where: { userId },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          description: true,
          duration: true,
          price: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });
}
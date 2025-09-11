// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toUTCDate } from '@/lib/dateUtils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    console.log('API called with date param:', dateParam);
    
    let whereClause = {};
    
    if (dateParam) {
      // Parse the date correctly - use UTC to avoid timezone issues
      const date = new Date(dateParam + 'T00:00:00Z'); // Set to UTC midnight
      
      // Handle invalid dates
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        );
      }
      
      // Set to start of day in UTC (00:00:00)
      const startOfDay = new Date(date);
      
      // Set to end of day in UTC (23:59:59.999)
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      console.log('UTC Date range for filtering:', startOfDay.toISOString(), 'to', endOfDay.toISOString());
      
      whereClause = {
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      };
    }

    const appointments = await prisma.appointment.findMany({
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
        }
      },
      orderBy: { date: 'asc' }
    });

    console.log('Found appointments:', appointments.length);
    
    // Log the actual dates of appointments for debugging
    if (appointments.length > 0) {
      console.log('Appointment dates:', appointments.map(a => ({
        id: a.id,
        date: a.date.toISOString(),
        client: a.client.firstName + ' ' + a.client.lastName
      })));
    }
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, clientId, serviceId, status, notes } = body;

    console.log('Creating appointment with data:', body);

    // Validate required fields
    if (!date || !clientId || !serviceId) {
      return NextResponse.json(
        { error: 'Date, client, and service are required' },
        { status: 400 }
      );
    }

    // Validate date format
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Get service to get duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Check if the appointment time is available
    const appointmentEnd = new Date(appointmentDate.getTime() + service.duration * 60000);

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        OR: [
          {
            date: {
              lte: appointmentDate,
              gte: appointmentEnd
            }
          },
          {
            date: {
              lt: appointmentEnd,
              gt: appointmentDate
            }
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: 'Time slot is not available. Please choose a different time.' },
        { status: 409 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        clientId,
        serviceId,
        duration: service.duration,
        status: status || 'SCHEDULED',
        notes: notes || null
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
      }
    });

    console.log('Appointment created successfully:', appointment);

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
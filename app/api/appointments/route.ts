// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toUTCDate } from '@/lib/dateUtils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    console.log('Fetching appointments for date:', dateParam);
    
    let whereClause = {};
    
    if (dateParam) {
      // Parse the date correctly
      const date = new Date(dateParam + 'T00:00:00Z');
      
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        );
      }
      
      // Set to start and end of day in UTC
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
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

    console.log('Found', appointments.length, 'appointments');
    
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
    const { date, clientId, serviceId, notes, walkInClient, customService } = body;

    console.log('Received appointment data:', body);

    // Validate required fields
    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    let finalClientId = clientId;
    let finalServiceId = serviceId;
    let finalDuration = 0;
    let finalPrice = 0;

    // Handle walk-in client creation
    if (walkInClient) {
      console.log('Processing walk-in client:', walkInClient);
      
      // Validate walk-in client data
      if (!walkInClient.firstName || !walkInClient.lastName || !walkInClient.phone) {
        return NextResponse.json(
          { error: 'First name, last name, and phone are required for walk-in clients' },
          { status: 400 }
        );
      }

      // Check if client with same phone already exists
      const existingClient = await prisma.client.findUnique({
        where: { phone: walkInClient.phone }
      });

      if (existingClient) {
        // Use existing client
        finalClientId = existingClient.id.toString();
      } else {
        // Create new client
        const newClient = await prisma.client.create({
          data: {
            firstName: walkInClient.firstName,
            lastName: walkInClient.lastName,
            phone: walkInClient.phone,
            email: walkInClient.email || null
          }
        });
        finalClientId = newClient.id.toString();
      }
    }

    // Handle custom service
    if (customService) {
      console.log('Processing custom service:', customService);
      
      // Validate custom service data
      if (customService.duration <= 0 || customService.price < 0) {
        return NextResponse.json(
          { error: 'Custom service requires positive duration and non-negative price' },
          { status: 400 }
        );
      }
      
      // For custom services
      finalDuration = customService.duration;
      finalPrice = customService.price;
      finalServiceId = null; // No service ID for custom services
    } else {
      // Get service details for regular services
      if (!serviceId) {
        return NextResponse.json(
          { error: 'Service is required' },
          { status: 400 }
        );
      }

      const service = await prisma.service.findUnique({
        where: { id: parseInt(serviceId) }
      });

      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }
      
      finalServiceId = parseInt(serviceId);
      finalDuration = service.duration;
      finalPrice = service.price;
    }

    // Validate client exists
    if (!finalClientId) {
      return NextResponse.json(
        { error: 'Client is required' },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: parseInt(finalClientId) }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Check for time conflicts
    const appointmentDate = new Date(date);
    const appointmentEnd = new Date(appointmentDate.getTime() + finalDuration * 60000);

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

    // For custom services, add info to notes
    let finalNotes = notes || '';
    // if (customService) {
    //   const customServiceInfo = `Custom Service - $${customService.price} - ${customService.duration}min`;
    //   finalNotes = finalNotes ? `${customServiceInfo}\n\n${finalNotes}` : customServiceInfo;
    // }

    console.log('Creating appointment with:', {
      date: appointmentDate,
      clientId: parseInt(finalClientId),
      serviceId: finalServiceId,
      duration: finalDuration,
      price: finalPrice,
      notes: finalNotes
    });

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        clientId: parseInt(finalClientId),
        serviceId: finalServiceId,
        duration: finalDuration,
        price: finalPrice,
        notes: finalNotes || null,
      },
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
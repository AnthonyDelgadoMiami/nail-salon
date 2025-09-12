// app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
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
            description: true,
            duration: true,
            price: true
          }
        }
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { date, clientId, serviceId, notes } = body;

    console.log('Updating appointment:', id, 'with data:', body);

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

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: Number(id) }
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
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

    // Check for time conflicts (excluding the current appointment)
    const appointmentEnd = new Date(appointmentDate.getTime() + service.duration * 60000);

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        AND: [
          {
            NOT: {
              id: Number(id) // Exclude the current appointment
            }
          },
          {
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
        ]
      }
    });

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: 'Time slot is not available. Please choose a different time.' },
        { status: 409 }
      );
    }

    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        date: appointmentDate,
        clientId,
        serviceId,
        duration: service.duration,
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

    console.log('Appointment updated successfully:', updatedAppointment);

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Add this DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Check if appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(id) }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Delete the appointment
    await prisma.appointment.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
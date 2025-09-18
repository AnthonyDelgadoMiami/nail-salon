// app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(params.id) },
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
        },
        user: { // Add this include
          select: {
            id: true,
            name: true,
            email: true,
            role: true
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
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { date, clientId, serviceId, notes, walkInClient, customService } = body;
    const appointmentId = parseInt(params.id);

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

    // Handle walk-in client updates (if needed)
    if (walkInClient) {
      // ... (similar logic to POST)
    }

    // Handle custom service
    if (customService) {
      // Validate custom service data
      if (customService.duration <= 0 || customService.price < 0) {
        return NextResponse.json(
          { error: 'Custom service requires positive duration and non-negative price' },
          { status: 400 }
        );
      }
      
      finalDuration = customService.duration;
      finalPrice = customService.price;
      finalServiceId = null;
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

    // Check for time conflicts (excluding the current appointment)
    const appointmentDate = new Date(date);
    const appointmentEnd = new Date(appointmentDate.getTime() + finalDuration * 60000);

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        id: { not: appointmentId },
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

    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date: appointmentDate,
        clientId: parseInt(finalClientId),
        serviceId: finalServiceId,
        duration: finalDuration,
        price: finalPrice,
        notes: notes || null,
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

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
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
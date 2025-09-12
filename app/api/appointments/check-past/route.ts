// app/api/appointments/check-past/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const now = new Date();
    
    // Find all scheduled/confirmed appointments that have passed
    const pastAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          lt: now // appointment time is less than current time
        },
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

    // Update all past appointments to COMPLETED status
    const updateResult = await prisma.appointment.updateMany({
      where: {
        date: {
          lt: now
        },
      },
      data: {
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: `Updated ${updateResult.count} past appointments to COMPLETED status`,
      updatedAppointments: updateResult.count,
      pastAppointments: pastAppointments.length
    });
  } catch (error) {
    console.error('Error updating past appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
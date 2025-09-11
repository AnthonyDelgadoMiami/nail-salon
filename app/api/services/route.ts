// app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, duration, price } = body;

    // Validate required fields
    if (!name || !duration || !price) {
      return NextResponse.json(
        { error: 'Name, duration, and price are required' },
        { status: 400 }
      );
    }

    // Check if service with same name already exists
    const existingService = await prisma.service.findFirst({
      where: { name }
    });

    if (existingService) {
      return NextResponse.json(
        { error: 'A service with this name already exists' },
        { status: 409 }
      );
    }

    // Create the new service
    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        duration: parseInt(duration),
        price: parseFloat(price)
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, notes } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'First name, last name, and phone are required' },
        { status: 400 }
      );
    }

    // Check if client with same phone already exists
    const existingClient = await prisma.client.findUnique({
      where: { phone }
    });

    if (existingClient) {
      return NextResponse.json(
        { error: 'A client with this phone number already exists' },
        { status: 409 }
      );
    }

    // Create the new client
    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        phone,
        email: email || null,
        notes: notes || null
      }
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
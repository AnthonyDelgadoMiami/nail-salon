//app/api/employees/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const id = parseInt(params.id, 10);

  const updateData: any = {
    name: data.name,
    email: data.email,
    role: data.role,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const employee = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(employee);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

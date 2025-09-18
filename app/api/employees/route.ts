//app/api/employees/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  const employees = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const data = await req.json();
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const employee = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "employee",
    },
  });

  return NextResponse.json(employee);
}

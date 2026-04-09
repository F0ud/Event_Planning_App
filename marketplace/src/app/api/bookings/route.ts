import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    const bookings = await prisma.booking.findMany({
      where: { guestId: userId },
      include: {
        experience: {
          include: {
            host: {
              select: { name: true, image: true },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const { experienceId, date, guests, totalPrice } = await request.json();

    if (!experienceId || !date || !guests || !totalPrice) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Verify the experience exists
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    if (guests > experience.maxGroupSize) {
      return NextResponse.json(
        { error: `Maximum group size is ${experience.maxGroupSize}` },
        { status: 400 }
      );
    }

    // Prevent hosts from booking their own experience
    if (experience.hostId === userId) {
      return NextResponse.json(
        { error: "You cannot book your own experience" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        experienceId,
        guestId: userId,
        date: new Date(date),
        guests,
        totalPrice,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

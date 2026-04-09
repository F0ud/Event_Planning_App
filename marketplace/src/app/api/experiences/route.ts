import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const priceRange = searchParams.get("price");
    const location = searchParams.get("location");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const where: Record<string, unknown> = { published: true };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (priceRange) {
      if (priceRange === "200+") {
        where.price = { gte: 200 };
      } else {
        const [min, max] = priceRange.split("-").map(Number);
        where.price = { gte: min, lte: max };
      }
    }

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        include: {
          host: {
            select: { id: true, name: true, image: true, verified: true },
          },
          _count: { select: { bookings: true, reviews: true } },
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.experience.count({ where }),
    ]);

    return NextResponse.json({
      experiences,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
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

    const body = await request.json();
    const {
      title,
      description,
      category,
      price,
      duration,
      maxGroupSize,
      location,
      images,
    } = body;

    if (!title || !description || !category || !price || !duration || !maxGroupSize || !location) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSuffix = Date.now().toString(36);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const experience = await prisma.experience.create({
      data: {
        title,
        slug,
        description,
        category,
        price: parseFloat(price),
        duration: parseInt(duration),
        maxGroupSize: parseInt(maxGroupSize),
        location,
        images: images ?? [],
        hostId: userId,
      },
    });

    // Upgrade user to HOST role if they aren't already
    await prisma.user.update({
      where: { id: userId },
      data: { role: "HOST" },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// GET /api/items - Fetch all items for the current user
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.item.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// POST /api/items - Create a new item
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      quantity,
      notes,
      imageUrl,
      locationId,
    } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Item name is required" },
        { status: 400 }
      );
    }

    if (!locationId || typeof locationId !== "string") {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    const resolvedQuantity =
      quantity === undefined || quantity === null || quantity === ""
        ? 1
        : Number(quantity);

    if (!Number.isInteger(resolvedQuantity) || resolvedQuantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be a positive whole number" },
        { status: 400 }
      );
    }

    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        userId: session.user.id,
      },
    });

    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    const item = await prisma.item.create({
      data: {
        userId: session.user.id,
        locationId,
        name: name.trim(),
        description:
          typeof description === "string" && description.trim().length > 0
            ? description.trim()
            : null,
        category:
          typeof category === "string" && category.trim().length > 0
            ? category.trim()
            : null,
        quantity: resolvedQuantity,
        notes:
          typeof notes === "string" && notes.trim().length > 0
            ? notes.trim()
            : null,
        imageUrl:
          typeof imageUrl === "string" && imageUrl.trim().length > 0
            ? imageUrl.trim()
            : null,
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
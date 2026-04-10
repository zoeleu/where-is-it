import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

async function verifyOwnership(itemId: string, userId: string) {
  return prisma.item.findFirst({
    where: {
      id: itemId,
      userId,
    },
  });
}

// GET /api/items/[id] - Fetch a single item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const item = await prisma.item.findFirst({
      where: {
        id,
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
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

// PUT /api/items/[id] - Update an item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingItem = await verifyOwnership(id, session.user.id);

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found or unauthorized" },
        { status: 404 }
      );
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

    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      return NextResponse.json(
        { error: "Item name must be a non-empty string" },
        { status: 400 }
      );
    }

    if (quantity !== undefined && quantity !== null && quantity !== "") {
      const parsedQuantity = Number(quantity);

      if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
        return NextResponse.json(
          { error: "Quantity must be a positive whole number" },
          { status: 400 }
        );
      }
    }

    if (locationId !== undefined) {
      if (typeof locationId !== "string" || locationId.trim().length === 0) {
        return NextResponse.json(
          { error: "Location must be a valid string" },
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
    }

    const updateData: {
      name?: string;
      description?: string | null;
      category?: string | null;
      quantity?: number;
      notes?: string | null;
      imageUrl?: string | null;
      locationId?: string;
    } = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) {
      updateData.description =
        typeof description === "string" && description.trim().length > 0
          ? description.trim()
          : null;
    }
    if (category !== undefined) {
      updateData.category =
        typeof category === "string" && category.trim().length > 0
          ? category.trim()
          : null;
    }
    if (quantity !== undefined && quantity !== null && quantity !== "") {
      updateData.quantity = Number(quantity);
    }
    if (notes !== undefined) {
      updateData.notes =
        typeof notes === "string" && notes.trim().length > 0
          ? notes.trim()
          : null;
    }
    if (imageUrl !== undefined) {
      updateData.imageUrl =
        typeof imageUrl === "string" && imageUrl.trim().length > 0
          ? imageUrl.trim()
          : null;
    }
    if (locationId !== undefined) updateData.locationId = locationId;

    const updatedItem = await prisma.item.update({
      where: { id },
      data: updateData,
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id] - Delete an item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingItem = await verifyOwnership(id, session.user.id);

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.item.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
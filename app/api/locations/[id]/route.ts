import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Helper function to verify ownership
async function verifyOwnership(locationId: string, userId: string) {
  const location = await prisma.location.findFirst({
    where: {
      id: locationId,
      userId: userId,
    },
  });

  return location;
}

// GET /api/locations/[id] - Fetch a single location with its items
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const location = await verifyOwnership(id, session.user.id);

    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    const locationWithDetails = await prisma.location.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({
      ...locationWithDetails,
      itemCount: locationWithDetails?._count.items || 0,
      _count: undefined,
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    );
  }
}

// PUT /api/locations/[id] - Update a location
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership before updating
    const location = await verifyOwnership(id, session.user.id);

    if (!location) {
      return NextResponse.json(
        { error: "Location not found or unauthorized" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    // Validate provided fields
    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      return NextResponse.json(
        { error: "Location name must be a non-empty string" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description || null;

    const updatedLocation = await prisma.location.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({
      ...updatedLocation,
      itemCount: updatedLocation._count.items,
      _count: undefined,
    });
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}

// DELETE /api/locations/[id] - Delete a location
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership before deleting
    const location = await verifyOwnership(id, session.user.id);

    if (!location) {
      return NextResponse.json(
        { error: "Location not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the location (cascading delete will handle items)
    await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting location:", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}

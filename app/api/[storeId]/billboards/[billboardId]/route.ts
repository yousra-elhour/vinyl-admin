import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const billBoard = await prismadb.billBoard.findUnique({
      where: {
        id: params.billboardId,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(billBoard);
  } catch (err) {
    console.log("[BILLBOARD_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl, color, productId, cover, description } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!cover) {
      return new NextResponse("Cover is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!color) {
      return new NextResponse("Color is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const billBoard = await prismadb.billBoard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
        color,
        productId,
        cover,
        description,
      },
    });

    return NextResponse.json(billBoard);
  } catch (err) {
    console.log("[BILLBOARD_PATCH]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billBoard = await prismadb.billBoard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billBoard);
  } catch (err) {
    console.log("[BILLBOARD_DELETE]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

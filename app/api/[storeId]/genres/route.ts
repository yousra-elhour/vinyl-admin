import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
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

    const genre = await prismadb.genre.create({
      data: {
        name,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(genre);
  } catch (error) {
    console.log("[GENRES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store is is required", { status: 403 });
    }

    const genres = await prismadb.genre.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(genres);
  } catch (error) {
    console.log("[GENRES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

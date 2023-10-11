import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { genreId: string } }
) {
  try {
    if (!params.genreId) {
      return new NextResponse("Genre ID is required", { status: 400 });
    }

    const genre = await prismadb.genre.findUnique({
      where: {
        id: params.genreId,
      },
    });

    return NextResponse.json(genre);
  } catch (err) {
    console.log("[GENRE_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; genreId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.genreId) {
      return new NextResponse("genre ID is required", { status: 400 });
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
    const genre = await prismadb.genre.updateMany({
      where: {
        id: params.genreId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(genre);
  } catch (err) {
    console.log("[GENRE_PATCH]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; genreId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.genreId) {
      return new NextResponse("Genre ID is required", { status: 400 });
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

    const genre = await prismadb.genre.deleteMany({
      where: {
        id: params.genreId,
      },
    });

    return NextResponse.json(genre);
  } catch (err) {
    console.log("[GENRE_DELETE]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

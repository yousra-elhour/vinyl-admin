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

    const {
      artist,
      imageUrl,
      album,
      description,
      price,
      isFeatured,
      isArchived,
      isSpotify,
      genreId,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!artist) {
      return new NextResponse("Artist is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!genreId) {
      return new NextResponse("GenreId is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!album) {
      return new NextResponse("album is required", { status: 400 });
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

    const product = await prismadb.product.create({
      data: {
        artist,
        album,
        imageUrl,
        price,
        description,
        genreId,
        isFeatured,
        isArchived,
        isSpotify,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const genreId = searchParams.get("genreId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;
    const isSpotify = searchParams.get("isSpotify") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const searchKeyword = searchParams.get("search") || undefined;

    if (!params.storeId) {
      return new NextResponse("Store is is required", { status: 403 });
    }

    // Build the query based on search criteria
    const prismaQuery = {
      where: {
        storeId: params.storeId,
        genreId,
        isFeatured: isFeatured ? true : undefined,
        isSpotify: isSpotify ? true : undefined,
        isArchived: false,
        ...(searchKeyword
          ? {
              OR: [
                { artist: { contains: searchKeyword } },
                { album: { contains: searchKeyword } },
                { description: { contains: searchKeyword } },
              ],
            }
          : {}),
      },

      include: {
        genre: true,
      },
    };

    let products = await prismadb.product.findMany(prismaQuery);

    if (sort === "highToLow") {
      products = products.sort(
        (a, b) =>
          parseFloat(b.price.toString()) - parseFloat(a.price.toString())
      ); // Sort by price high to low
    } else if (sort === "lowToHigh") {
      products = products.sort(
        (a, b) =>
          parseFloat(a.price.toString()) - parseFloat(b.price.toString())
      ); // Sort by price low to high
    } else {
      products = products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

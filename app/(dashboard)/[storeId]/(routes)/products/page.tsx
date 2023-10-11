import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    include: {
      genre: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    album: item.album,
    artist: item.artist,
    genre: item.genre.name,
    price: formatter.format(item.price.toNumber()),
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    isSpotify: item.isSpotify,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;

import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: { id: params.productId },
  });

  const genres = await prismadb.genre.findMany({
    where: { storeId: params.storeId },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} genres={genres} />
      </div>
    </div>
  );
};

export default ProductPage;

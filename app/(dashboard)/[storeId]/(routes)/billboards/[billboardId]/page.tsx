import prismadb from "@/lib/prismadb";
import BillBoardForm from "./components/billboard-form";

const BillBoardPage = async ({
  params,
}: {
  params: { billboardId: string; storeId: string };
}) => {
  const billBoard = await prismadb.billBoard.findUnique({
    where: { id: params.billboardId },
  });

  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardForm initialData={billBoard} products={products} />
      </div>
    </div>
  );
};

export default BillBoardPage;

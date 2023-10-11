import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billBoard.findMany({
    where: { storeId: params.storeId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  console.log("billboard", billboards);
  const formattedBillBoards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    product: item.product.album,
    color: item.color,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillBoards} />
      </div>
    </div>
  );
};

export default BillboardsPage;

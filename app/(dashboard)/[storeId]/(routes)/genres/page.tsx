import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { GenresClient } from "./components/client";
import { GenresColumn } from "./components/columns";

const GenresPage = async ({ params }: { params: { storeId: string } }) => {
  const genres = await prismadb.genre.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedGenres: GenresColumn[] = genres.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <GenresClient data={formattedGenres} />
      </div>
    </div>
  );
};

export default GenresPage;

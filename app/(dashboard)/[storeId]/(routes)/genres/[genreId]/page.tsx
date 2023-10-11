import prismadb from "@/lib/prismadb";
import GenreForm from "./components/genre-form";

const GenresPage = async ({ params }: { params: { genreId: string } }) => {
  const genre = await prismadb.genre.findUnique({
    where: { id: params.genreId },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <GenreForm initialData={genre} />
      </div>
    </div>
  );
};

export default GenresPage;

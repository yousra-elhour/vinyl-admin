"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { GenresColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface GenresClientProps {
  data: GenresColumn[];
}

export const GenresClient = ({ data }: GenresClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Genres (${data.length})`}
          description="Manage genres for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/genres/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name"></DataTable>

      <Heading title="API" description="API calls for Genres" />
      <Separator />
      <ApiList entityName="genres" entityIdName="genreId" />
    </>
  );
};

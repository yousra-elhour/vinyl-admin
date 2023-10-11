"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-actions";

export type ProductColumn = {
  id: string;
  album: string;
  artist: string;
  genre: string;
  isFeatured: boolean;
  isSpotify: boolean;
  isArchived: boolean;
  price: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "artist",
    header: "Artist",
  },
  {
    accessorKey: "album",
    header: "Album",
  },

  {
    accessorKey: "genre",
    header: "Genre",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isSpotify",
    header: "Spotify",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },

  // {
  //   id: "",
  //   cell: ({ row }) => <Color data={row.original} />,
  // },
];

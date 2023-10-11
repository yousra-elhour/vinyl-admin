"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-actions";
import { Color } from "./color";

export type BillboardColumn = {
  id: string;
  label: string;
  color: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "Color",
    cell: ({ row }) => <Color data={row.original} />,
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

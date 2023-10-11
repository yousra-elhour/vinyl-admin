"use client";

import { BillboardColumn } from "./columns";

interface ColorProps {
  data: BillboardColumn;
}

export const Color: React.FC<ColorProps> = ({ data }) => {
  return (
    <>
      <div
        className="border p-4 rounded-full w-4 h-4"
        style={{ backgroundColor: data.color }}
      />
    </>
  );
};

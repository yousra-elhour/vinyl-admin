"use client";

import { Store } from "@prisma/client";
import Link from "next/link";

interface LogoProps {
  item: Store;
}

const Logo = ({ item }: LogoProps) => {
  const test = () => {
    console.log(item);
  };

  return (
    <Link href="/" onClick={test} className="font-header text-xl">
      {item.name.toUpperCase()}
    </Link>
  );
};

export default Logo;

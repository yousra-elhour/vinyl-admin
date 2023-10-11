import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import Logo from "@/components/ui/logo";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Logo item={store} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

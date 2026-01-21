import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NavBar from "@/app/(dashboard)/_components/NavBar";
import SideNav from "./_components/SideNav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <NavBar />
      {/* Main Content */}
      <main className="max-w mx-auto px-4 sm:px-6 lg:px-0 py-8 pt-24">
        <div className="flex">
          <SideNav />
          <div className="w-full overflow-x-auto bg-accent">
            <div className="sm:h[(calc(99vh-60px)] overflow-auto">
              <div className="w-full flex justify-center mx-auto overflow-auto h-[calc(100vh-120px)]">
                <div className="w-full md:max-w-6xl">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

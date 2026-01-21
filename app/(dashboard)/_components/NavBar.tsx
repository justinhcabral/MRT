import { auth } from "@/auth";
import { User } from "lucide-react";
import LogoutButton from "@/app/(dashboard)/_components/LogoutButton";
import { redirect } from "next/navigation";

export default async function NavBar() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <nav className="fixed w-full bg-white border-b border-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">MRT Admin</h1>
          </div>
          {/* User Section */}
          <div className="flex items-center gap-6">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {session.user.role === "SUPER_ADMIN"
                    ? "Super Admin"
                    : "Station Manager"}
                </p>
              </div>
            </div>
            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

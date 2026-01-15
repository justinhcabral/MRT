import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {session?.user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your MRT administration tasks
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Session Info */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Email</h3>
          <p className="text-lg font-semibold text-gray-900">
            {session?.user?.email}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Role</h3>
          <p className="text-lg font-semibold text-gray-900">
            {session?.user?.role === "SUPER_ADMIN"
              ? "Super Admin"
              : "Station Manager"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Status</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <p className="text-lg font-semibold text-gray-900">Authenticated</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">User ID</h3>
          <p className="text-sm font-mono text-gray-900 truncate">
            {session?.user?.id}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
        <p className="text-blue-100">
          You are logged in as{" "}
          <span className="font-semibold">{session?.user?.name}</span> with role{" "}
          <span className="font-semibold">
            {session?.user?.role === "SUPER_ADMIN"
              ? "Super Admin"
              : "Station Manager"}
          </span>
          . Use the Sign Out button in the top right to log out.
        </p>
      </div>
    </div>
  );
}

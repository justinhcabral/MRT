import { auth } from "@/auth";
import { logoutAction } from "@/actions/admin-auth-actions";

export default async function ManagerPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Welcome, {session?.user?.name || "Manager"}
          </p>

          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

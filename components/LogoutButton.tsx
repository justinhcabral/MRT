"use client";

import { logoutAction } from "@/actions/admin-auth-actions";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      type="button"
      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors border border-red-200"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Sign Out</span>
    </button>
  );
}

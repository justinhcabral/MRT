// components/nav-links.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have this utility

const navItems = [
  { name: "Home", href: "/admin", icon: Home },
  { name: "Stations", href: "/admin/stations", icon: MapPin },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Incidents", href: "/admin/incidents", icon: AlertTriangle },
];

export function NavLinks({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;

        // FIX: Handle nested routes correctly
        // 1. If link is EXACTLY root ("/admin"), match exactly.
        // 2. Otherwise, check if current path starts with the link.
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            title={isCollapsed ? item.name : undefined}
            // Accessibility best practice
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center rounded-lg transition-colors",
              isCollapsed ? "justify-center px-4 py-3" : "gap-3 px-4 py-3",
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

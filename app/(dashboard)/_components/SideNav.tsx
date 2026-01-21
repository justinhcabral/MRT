// components/sidenav.tsx
"use client";

import { NavLinks } from "./nav-links";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white rounded-lg shadow-sm p-4 h-fit transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      <NavLinks isCollapsed={isCollapsed} />
    </aside>
  );
}

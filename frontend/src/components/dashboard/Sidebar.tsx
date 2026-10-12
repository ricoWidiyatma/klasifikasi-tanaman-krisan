import {
  LayoutDashboard,
  Leaf,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-gray-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
          <Leaf className="h-5 w-5 text-green-600" />
        </div>

        <div>
          <h1 className="font-bold text-gray-900">
            KrisanGuard
          </h1>

          <p className="text-xs text-gray-500">
            Monitoring System
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-2 p-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Menu
        </p>

        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isActive
                ? "bg-green-50 text-green-700"
                : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;


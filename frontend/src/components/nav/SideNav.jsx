import { NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Home,
  Users,
  MessageCircle,
  Map,
  Bell,
  Settings,
  GraduationCap
} from "lucide-react";

const navItems = [
  { name: "Dashboard", to: "/dashboard", icon: Home },
  { name: "Marketplace", to: "/marketplace", icon: ShoppingBag },
  { name: "Study Groups", to: "/study-groups", icon: Users },
  { name: "Campus Maps", to: "/", icon: Map },
  { name: "Messages", to: "/messages", icon: MessageCircle },
  { name: "Notifications", to: "/", icon: Bell },
];

export default function SideNav() {
  return (
    <aside className="w-64 border-r bg-white p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-9 w-9 rounded-lg bg-black flex items-center justify-center text-white">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
        <span className="font-semibold text-lg">Campus Hub</span>
     
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
               ${isActive
                ? "bg-gray-100 text-black"
                : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <NavLink
        to="/settings"
        className="mt-6 flex items-center gap-3 text-sm text-gray-600 hover:text-black"
      >
        <Settings className="h-5 w-5" />
        Settings
      </NavLink>
    </aside>
  );
}

import { NavLink, useLocation } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { createElement, useEffect, useState } from "react";
import { fetchNotifications } from "../../api/notifications";
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
  { name: "Campus Maps", to: "/campus-maps", icon: Map },
  { name: "Messages", to: "/messages", icon: MessageCircle },
  { name: "Notifications", to: "/notifications", icon: Bell },
];

export default function SideNav() {
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const response = await fetchNotifications({ read: "false", limit: 1 });
        const count = response?.data?.meta?.unreadCount ?? 0;
        setUnreadCount(count);
      } catch {
        setUnreadCount(0);
      }
    };

    loadUnread();
  }, [location.pathname]);

  return (
    <aside className="w-64 border-r-2 bg-white p-6 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-9 w-9 rounded-lg bg-black flex items-center justify-center text-white">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
        <span className="font-semibold text-lg">Campus Hub</span>
     
      </div>

      {/* Nav */}
      <LazyMotion features={domAnimation}>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                 ${isActive
                  ? "text-black bg-gray-100"
                  : "text-gray-600 hover:text-black"
                }`
              }
            >
              {createElement(item.icon, { className: "h-5 w-5" })}
              <span className="flex-1">{item.name}</span>
              {item.name === "Notifications" && unreadCount > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-black px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </LazyMotion>

      {/* Footer */}
      <NavLink
        to="/settings"
        className="mt-auto flex items-center gap-3 text-sm text-gray-600 hover:text-black"
      >
        <Settings className="h-5 w-5" />
        Settings
      </NavLink>
    </aside>
  );
}

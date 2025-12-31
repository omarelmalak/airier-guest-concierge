import { Link, useLocation } from "react-router-dom";
import { Home, Settings, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import airierLogo from "@/assets/airier-logo.png";
import { mockUser } from "@/data/mockData";

const navItems = [
  { icon: Home, label: "Properties", path: "/properties" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  // const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
          <img src={airierLogo} className="w-full h-full object-cover" />
        </div>
        <span className="text-xl text-foreground">airier</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 mb-3">Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === "/properties" && location.pathname.startsWith("/properties"));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-item",
                isActive && "nav-item-active"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-4 border-t border-sidebar-border">
        {/* Theme Toggle */}
        {/* <div className="flex items-center justify-center bg-secondary rounded-lg p-1">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              theme === "light" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              theme === "dark" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <Moon className="w-4 h-4" />
            Dark
          </button>
        </div> */}

        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
          <img
            src={mockUser.avatar}
            alt={mockUser.name}
            className="w-10 h-10 rounded-full bg-muted"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground truncate">{mockUser.name}</p>
            <p className="text-xs text-muted-foreground">{mockUser.role} · {mockUser.propertyCount} Properties</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

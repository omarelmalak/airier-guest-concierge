import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Bell, ChevronDown } from "lucide-react";
import { mockUser } from "@/data/mockData";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-end px-6 gap-4 sticky top-0 z-10">
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-9 h-9 rounded-full bg-muted"
            />
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </header> */}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

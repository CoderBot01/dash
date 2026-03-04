import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/NotificationBell";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-md p-2 text-foreground/80 hover:bg-muted"
          aria-label="open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold tracking-wide">LEADPULZE</span>
        <NotificationBell />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] transition-transform duration-200 md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AppSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute right-3 top-3 rounded-md bg-white/10 p-2 text-white"
          aria-label="close navigation menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <main className="relative flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="absolute right-4 top-4 z-20 hidden md:block">
          <NotificationBell />
        </div>
        {children}
      </main>
    </div>
  );
}

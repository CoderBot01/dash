import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Cloud, Settings, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Leads", icon: Zap, path: "/leads" },
  { label: "Teams", icon: Users, path: "/teams" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

type AppSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const location = useLocation();
  const isProfileActive = location.pathname.startsWith("/profile");

  return (
    <aside
      className={cn(
        "relative flex h-screen w-[280px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#071434_0%,#111f45_55%,#1a2743_100%)] text-white",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_0%,rgba(110,127,255,0.18),transparent_65%)]" />

      <div className="relative flex items-center justify-between px-5 pt-8 pb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(56,189,248,0.35)]">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-semibold tracking-[0.08em] text-blue-200">LEADPULZE</span>
        </div>
        <button
          type="button"
          aria-label="collapse sidebar"
          className="rounded-md p-1.5 text-blue-200/80 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <nav className="relative flex-1 px-4 py-2">
        <div className="space-y-3">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-[linear-gradient(90deg,#6d73ff,#7c84ff)] text-white shadow-[0_0_24px_rgba(109,115,255,0.55)]"
                    : "text-blue-100/85 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-blue-200")} />
                <span className="text-[15px] leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="relative border-t border-white/10 px-4 py-6">
        <Link
          to="/profile"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-4 transition-all",
            isProfileActive
              ? "bg-[linear-gradient(90deg,#6269f4,#6d73ff)] shadow-[0_0_18px_rgba(109,115,255,0.35)]"
              : "bg-white/10 hover:bg-white/20"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/15 text-sm font-semibold text-white">
            PK
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold uppercase tracking-wide text-white">PRAVEENKUMAR</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}




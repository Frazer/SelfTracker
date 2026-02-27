import { Link, useLocation } from "wouter";
import { useLocation } from "wouter";
import { LayoutDashboard, Calendar, Settings, BarChart3, LineChart, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  const [location, setLocation] = useLocation();

  const links = [
    { href: "/SelfTracker", label: "Daily Log", icon: Calendar },
    { href: "/SelfTracker/stats", label: "Statistics", icon: BarChart3 },
    { href: "/SelfTracker/history", label: "History", icon: LineChart },
    { href: "/SelfTracker/categories", label: "Categories", icon: Settings },
    { href: "/SelfTracker/settings", label: "App Settings", icon: Smartphone },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border/50 bg-background/50 backdrop-blur-xl p-6">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold font-display text-xl">
          R
        </div>
        <h1 className="font-display font-bold text-xl tracking-tight">Reflect</h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href} className={cn(
              "nav-item",
              isActive && "active"
            )}>
            <a
              key={link.href}
              href={`#${link.href}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                setLocation(link.href);
              }}
              className={cn("nav-item", isActive && "active")}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
            </a>
          );
        })}
      </nav>

      <div className="mt-auto px-4 py-4 rounded-xl bg-secondary/30 border border-white/5">
        <p className="text-xs text-muted-foreground">
          "The unexamined life is not worth living."
        </p>
        <p className="text-xs text-muted-foreground mt-1 font-semibold">— Socrates</p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [location] = useLocation();
  const [location, setLocation] = useLocation();

  // mobile nav should also only list /SelfTracker-prefixed links
  const links = [
    { href: "/SelfTracker", label: "Log", icon: Calendar },
    { href: "/SelfTracker/stats", label: "Stats", icon: BarChart3 },
    { href: "/SelfTracker/history", label: "History", icon: LineChart },
    { href: "/SelfTracker/categories", label: "Track", icon: Settings },
    { href: "/SelfTracker/settings", label: "App", icon: Smartphone },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 backdrop-blur-xl px-6 py-3 z-50">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href} className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}>
            <a
              key={link.href}
              href={`#${link.href}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                setLocation(link.href);
              }}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current/20")} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

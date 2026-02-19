import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar, MobileNav } from "@/components/layout/sidebar";

import DailyLog from "@/pages/daily-log";
import Categories from "@/pages/categories";
import Stats from "@/pages/stats";
import History from "@/pages/history";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 font-sans text-foreground">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 md:p-12 overflow-x-hidden w-full">
        <Switch>
          <Route path="/" component={DailyLog} />
          <Route path="/categories" component={Categories} />
          <Route path="/stats" component={Stats} />
          <Route path="/history" component={History} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <MobileNav />
    </div>
  );
}

function App() {
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 20 && now.getMinutes() === 0) {
        const today = now.toISOString().split('T')[0];
        const entries = JSON.parse(localStorage.getItem('reflection_entries') || '[]');
        const hasLoggedToday = entries.some((e: any) => e.date === today);
        
        if (!hasLoggedToday && Notification.permission === "granted") {
          new Notification("Time to Reflect", {
            body: "Take a moment to log your daily scores.",
            icon: "/favicon.png"
          });
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;

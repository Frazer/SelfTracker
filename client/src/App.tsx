import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar, MobileNav } from "@/components/layout/sidebar";
import { useAppData } from "@/hooks/use-app-data";
import { useLocalStorage } from "@/hooks/use-local-storage";

import DailyLog from "@/pages/daily-log";
import Categories from "@/pages/categories";
import Stats from "@/pages/stats";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  const { categories } = useAppData();
  const [location, setLocation] = useLocation();
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage("first_visit", true);

  useEffect(() => {
    if (isFirstVisit) {
      setIsFirstVisit(false);
      setLocation("/categories");
      setLocation("/SelfTracker/categories");
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 font-sans text-foreground">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 md:p-12 overflow-x-hidden w-full">
        <Switch>
          <Route path="/" component={DailyLog} />
          <Route path="/categories" component={Categories} />
          <Route path="/stats" component={Stats} />
          <Route path="/history" component={History} />
          <Route path="/settings" component={Settings} />
          <Route path="/SelfTracker" component={DailyLog} />
          <Route path="/SelfTracker/categories" component={Categories} />
          <Route path="/SelfTracker/stats" component={Stats} />
          <Route path="/SelfTracker/history" component={History} />
          <Route path="/SelfTracker/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <MobileNav />
    </div>
  );
}

function App() {
  const [notificationTime, setNotificationTime] = useLocalStorage("notification_time", "20:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const [hour, minute] = notificationTime.split(':').map(Number);
      
      if (now.getHours() === hour && now.getMinutes() === minute) {
        const today = now.toISOString().split('T')[0];
        const entries = JSON.parse(localStorage.getItem('app-entries') || '[]');
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
  }, [notificationTime]);

  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;

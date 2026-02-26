import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bell, Smartphone, Share, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [notificationTime, setNotificationTime] = useLocalStorage("notification_time", "20:00");
  const [isStandalone, setIsStandalone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone);
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support desktop notifications.",
        variant: "destructive"
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast({
        title: "Notifications enabled",
        description: "You will now receive a daily reminder at your chosen time."
      });
    }
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 md:pb-0">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-lg">Customize your reflection experience.</p>
      </header>

      {!isStandalone && (isIOS || isAndroid) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Install as App
            </CardTitle>
            <CardDescription>
              For the best experience and to receive notifications, install this app on your home screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {isIOS ? (
              <div className="flex items-start gap-3">
                <div className="bg-background p-2 rounded-lg border border-border">
                  <Share className="w-4 h-4" />
                </div>
                <p>Tap the <strong>Share</strong> button in Safari and select <strong>'Add to Home Screen'</strong>.</p>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="bg-background p-2 rounded-lg border border-border">
                  <Info className="w-4 h-4" />
                </div>
                <p>Tap the menu icon (three dots) in Chrome and select <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Daily Reminders
          </CardTitle>
          <CardDescription>
            Set a time to reflect on your day. We recommend the end of the day.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Notification Time</label>
              <Input 
                type="time" 
                value={notificationTime} 
                onChange={(e) => setNotificationTime(e.target.value)}
                className="bg-secondary/20 h-12 text-lg"
              />
            </div>
            <Button 
              variant="outline" 
              className="h-12 px-6"
              onClick={requestPermission}
            >
              Enable Notifications
            </Button>
          </div>
          
          {Notification.permission === "denied" && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <Info className="w-3 h-3" /> Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
          
          <div className="bg-secondary/20 p-4 rounded-xl text-sm text-muted-foreground">
            <p>Reflecting at the end of each day helps you recognize patterns in your behavior and celebrate small wins.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

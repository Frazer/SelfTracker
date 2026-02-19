import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";
import { Slider } from "@/components/ui/slider-custom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DailyLog() {
  const { categories, getEntryValue, setEntryValue } = useAppData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  // Determine greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const isToday = format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 md:pb-0">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {isToday ? greeting : "Daily Log"}
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your daily habits and reflections.
            </p>
          </div>
          <div className="hidden md:block">
            {/* Optional: Add a motivational quote or simple stat here */}
          </div>
        </div>

        <div className="flex items-center justify-between bg-secondary/30 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
          <Button variant="ghost" size="icon" onClick={handlePrevDay} className="hover:bg-background/50">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2 font-medium text-lg">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span>{format(currentDate, "EEEE, MMMM do, yyyy")}</span>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextDay} 
            disabled={isToday}
            className={cn("hover:bg-background/50", isToday && "opacity-30 cursor-not-allowed")}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDate.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4"
          >
            {categories.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-secondary/10">
                <p className="text-muted-foreground">No categories set up yet.</p>
                <Button variant="link" className="text-primary mt-2" onClick={() => window.location.href = "/categories"}>
                  Go to Settings to add categories
                </Button>
              </div>
            ) : (
              categories.map((category) => {
                const score = getEntryValue(currentDate, category.id) ?? 0;
                return (
                  <div 
                    key={category.id} 
                    className="group bg-card/40 hover:bg-card/80 border border-border/50 hover:border-border transition-all duration-300 rounded-2xl p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full shadow-[0_0_10px]" 
                          style={{ backgroundColor: category.color, boxShadow: `0 0 12px ${category.color}40` }} 
                        />
                        <h3 className="font-medium text-lg text-foreground">{category.name}</h3>
                      </div>
                      <span className="font-mono text-xl font-bold text-primary tabular-nums">
                        {score}<span className="text-muted-foreground text-sm font-normal">/10</span>
                      </span>
                    </div>

                    <Slider
                      value={[score]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={([val]) => setEntryValue(currentDate, category.id, val)}
                      className="py-2"
                      color={category.color}
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-3 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

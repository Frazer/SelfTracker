import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save, CheckCircle2 } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";
import { Slider } from "@/components/ui/slider-custom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function DailyLog() {
  const { categories, getEntryValue, setEntryValue } = useAppData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showGuided, setShowGuided] = useState(false);
  const [guidedStep, setGuidedStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { width, height } = useWindowSize();

  const dateStr = format(currentDate, "yyyy-MM-dd");
  const isToday = dateStr === format(new Date(), "yyyy-MM-dd");

  // compute list of categories that still need scoring for the current date
  const remainingCategories = categories.filter(
    (c) => getEntryValue(currentDate, c.id) === undefined
  );

  // if nothing remains, the user has already scored today
  const hasStartedToday = remainingCategories.length === 0;

  const hour = new Date().getHours();
  const isAfterFour = hour >= 16; // pop up only after 4pm

  useEffect(() => {
    if (
      isToday &&
      !hasStartedToday &&
      categories.length > 0 &&
      isAfterFour
    ) {
      setShowGuided(true);
    }
  }, [isToday, hasStartedToday, categories.length, isAfterFour]);

  const handlePrevDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  // if the set of remaining categories changes (e.g. user scores one manually), restart the guided step
  useEffect(() => {
    if (guidedStep >= remainingCategories.length) {
      setGuidedStep(0);
    }
  }, [remainingCategories.length, guidedStep]);

  // reuse previously computed `hour` for greeting
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const currentCategory = remainingCategories[guidedStep];

  const handleGuidedNext = () => {
    if (guidedStep < remainingCategories.length - 1) {
      setGuidedStep(prev => prev + 1);
    } else {
      setShowGuided(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 md:pb-0">
      {showSuccess && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}
      
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
          {showSuccess && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4 bg-primary/10 rounded-3xl border border-primary/20"
            >
              <CheckCircle2 className="w-16 h-16 text-primary animate-bounce" />
              <h2 className="text-2xl font-bold text-primary">Great job reflecting today!</h2>
            </motion.div>
          )}

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
                  </div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Dialog open={showGuided} onOpenChange={setShowGuided}>
        <DialogContent className="sm:max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Ready to score your day?</DialogTitle>
            <DialogDescription>
              Take a moment to reflect on your performance for today.
            </DialogDescription>
          </DialogHeader>
          
          {currentCategory && (
            <div className="py-8 space-y-8">
              <div className="text-center space-y-2">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-4" 
                  style={{ backgroundColor: currentCategory.color, boxShadow: `0 0 20px ${currentCategory.color}40` }}
                />
                <h3 className="text-2xl font-bold">{currentCategory.name}</h3>
                <p className="text-muted-foreground italic">How would you rate this today?</p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center">
                  <span className="text-6xl font-bold text-primary font-mono">
                    {getEntryValue(currentDate, currentCategory.id) ?? 0}
                  </span>
                </div>
                <Slider
                  value={[getEntryValue(currentDate, currentCategory.id) ?? 0]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={([val]) => setEntryValue(currentDate, currentCategory.id, val)}
                  color={currentCategory.color}
                  className="py-4"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button className="w-full h-12 text-lg" onClick={handleGuidedNext}>
              {guidedStep < remainingCategories.length - 1 ? "Next Category" : "Finish Reflection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

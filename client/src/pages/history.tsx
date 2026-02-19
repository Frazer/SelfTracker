import { useMemo, useState } from "react";
import { useAppData } from "@/hooks/use-app-data";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { cn } from "@/lib/utils";

export default function History() {
  const { entries, categories } = useAppData();
  const [days, setDays] = useState(14);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

  const chartData = useMemo(() => {
    if (categories.length === 0) return [];

    const end = new Date();
    const start = subDays(end, days);
    const dateRange = eachDayOfInterval({ start, end });

    return dateRange.map(date => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayData: any = {
        date: format(date, "MMM dd"),
        fullDate: dateStr,
      };

      categories.forEach(category => {
        const entry = entries.find(e => e.categoryId === category.id && e.date === dateStr);
        dayData[category.id] = entry ? entry.score : null; // null to break the line if no data
      });

      return dayData;
    });
  }, [entries, categories, days]);

  const activeCategories = selectedCategory === "all" 
    ? categories 
    : categories.filter(c => c.id === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 md:pb-0 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">History Trends</h1>
          <p className="text-muted-foreground text-lg">
            Visualize your daily progress over time.
          </p>
        </div>
        
        <div className="flex gap-2 bg-secondary/30 p-1 rounded-lg border border-border/50">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-all",
                days === d ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {d} Days
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm border transition-all",
            selectedCategory === "all" 
              ? "bg-foreground text-background border-foreground font-medium" 
              : "bg-transparent border-border text-muted-foreground hover:border-foreground/50"
          )}
        >
          All Categories
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm border transition-all flex items-center gap-2",
              selectedCategory === c.id 
                ? "bg-card border-primary text-primary shadow-sm" 
                : "bg-transparent border-border text-muted-foreground hover:border-foreground/50"
            )}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-[400px] bg-card/40 border border-border/50 rounded-2xl p-4 md:p-8 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              domain={[0, 10]}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ fontSize: '13px' }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {activeCategories.map((category) => (
              <Line
                key={category.id}
                type="monotone"
                dataKey={category.id}
                name={category.name}
                stroke={category.color}
                strokeWidth={3}
                dot={{ r: 4, fill: category.color, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useAppData } from "@/hooks/use-app-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { format, parse, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { motion } from "framer-motion";

export default function Stats() {
  const { entries, categories } = useAppData();
  const [timeRange, setTimeRange] = useState<number>(6); // Months

  // Compute monthly averages
  const chartData = useMemo(() => {
    if (categories.length === 0) return [];

    const now = new Date();
    const start = subMonths(now, timeRange);
    const months = eachMonthOfInterval({ start, end: now });

    return months.map(monthDate => {
      const monthStr = format(monthDate, "yyyy-MM");
      
      const monthData: any = {
        name: format(monthDate, "MMM"),
        fullDate: monthStr,
      };

      categories.forEach(category => {
        // Filter entries for this category in this month
        const categoryEntries = entries.filter(e => 
          e.categoryId === category.id && 
          e.date.startsWith(monthStr)
        );

        if (categoryEntries.length > 0) {
          const sum = categoryEntries.reduce((acc, curr) => acc + curr.score, 0);
          const avg = sum / categoryEntries.length;
          monthData[category.id] = parseFloat(avg.toFixed(1));
        } else {
          monthData[category.id] = 0;
        }
      });

      return monthData;
    });
  }, [entries, categories, timeRange]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-xl shadow-xl">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any) => {
              const category = categories.find(c => c.id === entry.dataKey);
              if (!category || entry.value === 0) return null;
              return (
                <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-muted-foreground">{category.name}:</span>
                  <span className="font-medium text-foreground">{entry.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 md:pb-0 h-full flex flex-col">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Monthly Insights</h1>
        <p className="text-muted-foreground text-lg">
          Average scores per category over time.
        </p>
      </header>

      <div className="flex-1 min-h-[400px] bg-card/40 border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Average Performance</h2>
          <select 
            className="bg-background border border-border rounded-lg text-sm px-3 py-1 focus:ring-primary/20 focus:border-primary"
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
          >
            <option value={3}>Last 3 Months</option>
            <option value={6}>Last 6 Months</option>
            <option value={12}>Last Year</option>
          </select>
        </div>

        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                domain={[0, 10]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.2)' }} />
              
              {categories.map((category) => (
                <Bar 
                  key={category.id} 
                  dataKey={category.id} 
                  fill={category.color} 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                  animationDuration={1500}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(cat => {
          // Calculate overall average for this category
          const catEntries = entries.filter(e => e.categoryId === cat.id);
          const overallAvg = catEntries.length > 0 
            ? (catEntries.reduce((a, b) => a + b.score, 0) / catEntries.length).toFixed(1)
            : "-";

          return (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/40 p-4 rounded-xl border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-muted-foreground truncate">{cat.name}</span>
              </div>
              <div className="text-2xl font-bold font-display">{overallAvg}</div>
              <div className="text-xs text-muted-foreground mt-1">All-time avg</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

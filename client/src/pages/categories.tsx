import { useState, useEffect } from "react";
import { useAppData, type Category } from "@/hooks/use-app-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Trash2, Plus, Edit2, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef",
  "#f43f5e", "#64748b"
];

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAppData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 md:pb-0">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground text-lg">
            Manage what you want to track daily.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </header>

      <div className="grid gap-4">
        <AnimatePresence>
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className="bg-card/40 border border-border/50 rounded-xl p-4 flex items-center justify-between group hover:bg-card/60 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }} 
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setEditingCategory(category)}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteCategory(category.id)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {categories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
            No categories yet. Add one to get started!
          </div>
        )}
      </div>

      <CategoryDialog 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)}
        onSave={(name, color) => {
          addCategory(name, color);
          setIsAddOpen(false);
        }}
        title="Add Category"
      />

      <CategoryDialog 
        isOpen={!!editingCategory} 
        onClose={() => setEditingCategory(null)}
        initialData={editingCategory}
        onSave={(name, color) => {
          if (editingCategory) {
            updateCategory(editingCategory.id, { name, color });
            setEditingCategory(null);
          }
        }}
        title="Edit Category"
      />
    </div>
  );
}

function CategoryDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (name: string, color: string) => void;
  initialData?: Category | null;
  title: string;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [color, setColor] = useState(initialData?.color || PRESET_COLORS[0]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
      setColor(initialData?.color || PRESET_COLORS[0]);
    }
  }, [isOpen, initialData]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Workout, Reading..."
              className="bg-secondary/20 border-border/50 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Palette className="w-4 h-4" /> Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                    color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "opacity-70 hover:opacity-100"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="ghost" type="button">Cancel</Button>
          </DialogClose>
          <Button onClick={() => onSave(name, color)} disabled={!name.trim()}>
            Save Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

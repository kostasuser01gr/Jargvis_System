import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

export interface FavoriteTab {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
  order: number;
}

interface FavoritesBarProps {
  favorites: FavoriteTab[];
  activeTab: string;
  onTabSelect: (value: string) => void;
  onRemoveFavorite: (value: string) => void;
  onReorder: (favorites: FavoriteTab[]) => void;
}

export function FavoritesBar({
  favorites,
  activeTab,
  onTabSelect,
  onRemoveFavorite,
  onReorder
}: FavoritesBarProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  if (favorites.length === 0) {
    return null;
  }

  const handleDragStart = (value: string) => {
    setDraggedItem(value);
  };

  const handleDragOver = (e: React.DragEvent, targetValue: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetValue) return;

    const draggedIndex = favorites.findIndex(f => f.value === draggedItem);
    const targetIndex = favorites.findIndex(f => f.value === targetValue);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newFavorites = [...favorites];
    const [removed] = newFavorites.splice(draggedIndex, 1);
    newFavorites.splice(targetIndex, 0, removed);

    onReorder(newFavorites);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="border-b border-cyan-500/20 bg-black/40 backdrop-blur-sm">
      <ScrollArea className="w-full">
        <div className="flex items-center gap-2 px-4 py-2">
          <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <div className="flex items-center gap-1 flex-1">
            <AnimatePresence mode="popLayout">
              {favorites.map((favorite) => (
                <motion.div
                  key={favorite.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  draggable
                  onDragStart={() => handleDragStart(favorite.value)}
                  onDragOver={(e) => handleDragOver(e, favorite.value)}
                  onDragEnd={handleDragEnd}
                  className="flex-shrink-0"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTabSelect(favorite.value)}
                    className={`h-8 px-3 text-xs transition-all ${
                      activeTab === favorite.value
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                        : 'text-cyan-400 hover:bg-cyan-500/10 border border-transparent'
                    }`}
                  >
                    {favorite.icon && <span className="mr-1.5">{favorite.icon}</span>}
                    <span>{favorite.label}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(favorite.value);
                        toast.success(`Removed ${favorite.label} from favorites`);
                      }}
                      className="ml-2 hover:bg-cyan-500/20 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

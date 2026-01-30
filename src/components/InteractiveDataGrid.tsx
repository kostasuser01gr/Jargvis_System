import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Database, Zap, TrendingUp, Activity } from 'lucide-react';
import { Card } from './ui/card';

interface DataCell {
  value: number;
  intensity: number;
  active: boolean;
}

export function InteractiveDataGrid() {
  const [grid, setGrid] = useState<DataCell[][]>([]);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  useEffect(() => {
    // Initialize grid
    const rows = 8;
    const cols = 12;
    const initialGrid: DataCell[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        value: Math.random() * 100,
        intensity: Math.random(),
        active: Math.random() > 0.7
      }))
    );
    setGrid(initialGrid);

    // Animate grid
    const interval = setInterval(() => {
      setGrid(prev =>
        prev.map(row =>
          row.map(cell => ({
            ...cell,
            value: Math.max(0, Math.min(100, cell.value + (Math.random() - 0.5) * 10)),
            intensity: Math.random(),
            active: Math.random() > 0.8
          }))
        )
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-400 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Data Matrix Visualization
        </h3>
        <div className="flex items-center gap-2 text-xs text-cyan-600">
          <Activity className="w-3 h-3" />
          <span>Live Feed</span>
        </div>
      </div>

      <div className="relative">
        <div className="grid gap-1">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((cell, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                  onMouseLeave={() => setHoveredCell(null)}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                >
                  <motion.div
                    className="w-8 h-8 rounded border border-cyan-500/20 relative overflow-hidden"
                    style={{
                      backgroundColor: `rgba(34, 211, 238, ${cell.intensity * 0.3})`
                    }}
                    animate={{
                      borderColor: cell.active
                        ? 'rgba(34, 211, 238, 0.8)'
                        : 'rgba(34, 211, 238, 0.2)'
                    }}
                  >
                    {/* Value indicator */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-cyan-400/50"
                      style={{ height: `${cell.value}%` }}
                    />

                    {/* Active pulse */}
                    {cell.active && (
                      <motion.div
                        className="absolute inset-0 bg-cyan-400/30"
                        animate={{
                          opacity: [0, 0.5, 0]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Hover tooltip */}
                  {hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 border border-cyan-500/50 rounded text-xs whitespace-nowrap z-20"
                    >
                      <div className="text-cyan-400">
                        Cell [{rowIndex},{colIndex}]
                      </div>
                      <div className="text-cyan-600">
                        Value: {cell.value.toFixed(1)}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-cyan-400/10 border border-cyan-500/20" />
            <span className="text-cyan-600">Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-cyan-400/30 border border-cyan-500/50" />
            <span className="text-cyan-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-cyan-400/60 border border-cyan-500/80" />
            <span className="text-cyan-600">High Activity</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

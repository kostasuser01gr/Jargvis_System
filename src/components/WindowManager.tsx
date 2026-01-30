import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minimize2, Maximize2, Move, Grid3x3 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Window {
  id: string;
  title: string;
  component: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

interface WindowManagerProps {
  windows: Window[];
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onBringToFront: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
}

export function WindowManager({
  windows,
  onClose,
  onMinimize,
  onMaximize,
  onBringToFront,
  onUpdatePosition
}: WindowManagerProps) {
  const [draggingWindow, setDraggingWindow] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, windowId: string, window: Window) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    setDraggingWindow(windowId);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    });
    onBringToFront(windowId);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingWindow) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onUpdatePosition(draggingWindow, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDraggingWindow(null);
  };

  useEffect(() => {
    if (draggingWindow) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingWindow, dragOffset]);

  return (
    <>
      <AnimatePresence>
        {windows.map((window) => (
          !window.minimized && (
            <motion.div
              key={window.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: window.maximized ? 0 : window.position.x,
                y: window.maximized ? 0 : window.position.y
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                zIndex: window.zIndex,
                width: window.maximized ? '100vw' : window.size.width,
                height: window.maximized ? '100vh' : window.size.height,
                pointerEvents: 'auto'
              }}
              className="select-none"
            >
              <Card className="bg-gradient-to-br from-cyan-950/95 to-blue-950/95 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl h-full flex flex-col overflow-hidden">
                {/* Title Bar */}
                <div
                  className="bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border-b border-cyan-500/30 p-3 flex items-center justify-between cursor-move"
                  onMouseDown={(e) => handleMouseDown(e, window.id, window)}
                >
                  <div className="flex items-center gap-3">
                    <Move className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-cyan-400 font-mono">{window.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 window-controls">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onMinimize(window.id)}
                      className="h-7 w-7 p-0 hover:bg-cyan-500/20 text-cyan-400"
                    >
                      <Minimize2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onMaximize(window.id)}
                      className="h-7 w-7 p-0 hover:bg-cyan-500/20 text-cyan-400"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onClose(window.id)}
                      className="h-7 w-7 p-0 hover:bg-red-500/20 text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                  {window.component}
                </div>
              </Card>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Taskbar for minimized windows */}
      {windows.some(w => w.minimized) && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Card className="bg-black/90 border-cyan-500/50 backdrop-blur-xl p-2 flex items-center gap-2">
            {windows.filter(w => w.minimized).map((window) => (
              <Button
                key={window.id}
                size="sm"
                onClick={() => onMinimize(window.id)}
                className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
              >
                <Grid3x3 className="w-3 h-3 mr-2" />
                {window.title}
              </Button>
            ))}
          </Card>
        </motion.div>
      )}
    </>
  );
}

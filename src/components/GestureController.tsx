import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hand, Move, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function GestureController() {
  const [gesture, setGesture] = useState<string | null>(null);
  const [touchPoints, setTouchPoints] = useState(0);
  const lastGestureRef = useRef<string>('');
  const gestureTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchPoints(e.touches.length);
      
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        startDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        
        if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
          let detectedGesture = '';
          
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            detectedGesture = deltaX > 0 ? 'swipe-right' : 'swipe-left';
          } else {
            detectedGesture = deltaY > 0 ? 'swipe-down' : 'swipe-up';
          }
          
          if (detectedGesture !== lastGestureRef.current) {
            processGesture(detectedGesture);
            lastGestureRef.current = detectedGesture;
          }
        }
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const delta = distance - startDistance;
        if (Math.abs(delta) > 20) {
          const detectedGesture = delta > 0 ? 'pinch-out' : 'pinch-in';
          if (detectedGesture !== lastGestureRef.current) {
            processGesture(detectedGesture);
            lastGestureRef.current = detectedGesture;
          }
        }
      }
    };

    const handleTouchEnd = () => {
      setTouchPoints(0);
      
      gestureTimeoutRef.current = setTimeout(() => {
        setGesture(null);
        lastGestureRef.current = '';
      }, 1500);
    };

    // Mouse gestures for desktop
    let mouseStartX = 0;
    let mouseStartY = 0;
    let isMouseDown = false;

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      
      const deltaX = e.clientX - mouseStartX;
      const deltaY = e.clientY - mouseStartY;
      
      if (Math.abs(deltaX) > 100 || Math.abs(deltaY) > 100) {
        let detectedGesture = '';
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          detectedGesture = deltaX > 0 ? 'swipe-right' : 'swipe-left';
        } else {
          detectedGesture = deltaY > 0 ? 'swipe-down' : 'swipe-up';
        }
        
        if (detectedGesture !== lastGestureRef.current) {
          processGesture(detectedGesture);
          lastGestureRef.current = detectedGesture;
        }
        
        isMouseDown = false;
      }
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      gestureTimeoutRef.current = setTimeout(() => {
        setGesture(null);
        lastGestureRef.current = '';
      }, 1500);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
      }
    };
  }, []);

  const processGesture = (detectedGesture: string) => {
    setGesture(detectedGesture);
    
    const actions: Record<string, { message: string; icon: string }> = {
      'swipe-left': { message: 'Previous panel', icon: '←' },
      'swipe-right': { message: 'Next panel', icon: '→' },
      'swipe-up': { message: 'Scroll up', icon: '↑' },
      'swipe-down': { message: 'Scroll down', icon: '↓' },
      'pinch-in': { message: 'Zoom out', icon: '−' },
      'pinch-out': { message: 'Zoom in', icon: '+' }
    };

    const action = actions[detectedGesture];
    if (action) {
      toast.info(action.message, {
        icon: action.icon,
        duration: 2000
      });
    }
  };

  const getGestureIcon = () => {
    switch (gesture) {
      case 'swipe-left':
      case 'swipe-right':
      case 'swipe-up':
      case 'swipe-down':
        return <Move className="w-5 h-5 text-cyan-400" />;
      case 'pinch-in':
        return <ZoomOut className="w-5 h-5 text-cyan-400" />;
      case 'pinch-out':
        return <ZoomIn className="w-5 h-5 text-cyan-400" />;
      default:
        return <Hand className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-gradient-to-br from-cyan-950/90 to-blue-950/90 border border-cyan-500/50 rounded-lg p-4 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 min-w-[280px]">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={gesture ? {
                scale: [1, 1.2, 1],
                rotate: gesture?.includes('rotate') ? 360 : 0
              } : {}}
              transition={{ duration: 0.5 }}
              className="p-2 rounded-full bg-cyan-500/20"
            >
              {getGestureIcon()}
            </motion.div>
            <div className="flex-1">
              <p className="text-xs text-cyan-400">Gesture Control</p>
              <p className="text-xs text-cyan-600">
                {gesture ? gesture.replace('-', ' ').toUpperCase() : 'Active'}
              </p>
            </div>
            {touchPoints > 0 && (
              <div className="px-2 py-1 bg-cyan-500/20 rounded text-xs text-cyan-400">
                {touchPoints} touch{touchPoints > 1 ? 'es' : ''}
              </div>
            )}
          </div>

          {gesture && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-cyan-500/30 pt-3"
            >
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Swipe ←', color: gesture === 'swipe-left' },
                  { label: 'Swipe →', color: gesture === 'swipe-right' },
                  { label: 'Swipe ↑', color: gesture === 'swipe-up' },
                  { label: 'Swipe ↓', color: gesture === 'swipe-down' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`text-xs py-1 px-2 rounded text-center ${
                      item.color
                        ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                        : 'bg-cyan-950/30 text-cyan-600'
                    }`}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-3 pt-3 border-t border-cyan-500/30">
            <p className="text-xs text-cyan-700">
              Swipe or pinch to control interface
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

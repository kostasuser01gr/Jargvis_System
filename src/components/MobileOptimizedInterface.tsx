import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Home, Search, Settings, User, ChevronUp, ChevronDown } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { toast } from 'sonner';

interface MobileTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  badge?: number;
}

export function MobileOptimizedInterface({ tabs, activeTab, onTabChange }: {
  tabs: MobileTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bottomNavVisible, setBottomNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setBottomNavVisible(false);
      } else {
        setBottomNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (direction === 'left' && currentIndex < tabs.length - 1) {
      onTabChange(tabs[currentIndex + 1].id);
    } else if (direction === 'right' && currentIndex > 0) {
      onTabChange(tabs[currentIndex - 1].id);
    }
  };

  if (!isMobile) {
    return null; // Don't render on desktop
  }

  return (
    <div className="md:hidden">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="flex items-center justify-between p-4">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-cyan-400">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-black/95 border-cyan-500/30">
              <div className="space-y-4 mt-8">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 border border-cyan-500/50'
                        : 'bg-black/40 border border-cyan-500/20'
                    }`}
                    onClick={() => {
                      onTabChange(tab.id);
                      setMenuOpen(false);
                    }}
                  >
                    {tab.icon}
                    <span className="text-cyan-300">{tab.label}</span>
                    {tab.badge && (
                      <Badge className="ml-auto bg-cyan-500/20 text-cyan-400">
                        {tab.badge}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-cyan-400 font-bold">JARVIS</h1>

          <Button variant="ghost" size="sm" className="text-cyan-400">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-20 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find(t => t.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {bottomNavVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-cyan-500/20"
          >
            <div className="flex items-center justify-around p-2">
              {tabs.slice(0, 5).map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  className={`flex flex-col items-center gap-1 h-auto py-2 ${
                    activeTab === tab.id
                      ? 'text-cyan-400'
                      : 'text-cyan-600'
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.icon}
                  <span className="text-[10px]">{tab.label}</span>
                  {tab.badge && (
                    <Badge className="absolute -top-1 -right-1 bg-cyan-500/20 text-cyan-400 text-[8px] px-1">
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      {lastScrollY > 300 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-24 right-4 z-40"
        >
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded-full w-12 h-12 bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}

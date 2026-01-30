import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from './ui/button';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulate system notifications
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'System Online',
        message: 'All systems initialized successfully',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'info',
        title: 'Security Scan Complete',
        message: 'No threats detected. System secure.',
        timestamp: new Date(Date.now() - 60000)
      }
    ];

    setNotifications(initialNotifications);

    // Add random notifications
    const interval = setInterval(() => {
      const messages = [
        { type: 'info' as const, title: 'Network Status', message: 'Connection optimal' },
        { type: 'success' as const, title: 'Backup Complete', message: 'All data backed up successfully' },
        { type: 'info' as const, title: 'Performance', message: 'System running at peak efficiency' }
      ];

      const random = messages[Math.floor(Math.random() * messages.length)];
      
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...random,
        timestamp: new Date()
      };

      setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-24 z-50 p-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors"
      >
        <Bell className="w-5 h-5 text-cyan-400" />
        {notifications.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 text-black text-xs rounded-full flex items-center justify-center"
          >
            {notifications.length}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-20 right-6 z-50 w-96 max-h-[600px] bg-gradient-to-br from-black to-cyan-950/20 border border-cyan-500/50 rounded-lg backdrop-blur-xl shadow-2xl shadow-cyan-500/20 overflow-hidden"
          >
            <div className="p-4 border-b border-cyan-500/30">
              <div className="flex items-center justify-between">
                <h3 className="text-cyan-400">Notifications</h3>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-cyan-400 hover:bg-cyan-500/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-cyan-600">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-cyan-300 mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-cyan-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-cyan-700 mt-1">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => removeNotification(notification.id)}
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 h-6 w-6 text-cyan-600 hover:text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-cyan-500/30">
                <Button
                  onClick={() => setNotifications([])}
                  variant="ghost"
                  className="w-full text-cyan-400 hover:bg-cyan-500/10 text-sm"
                >
                  Clear All
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

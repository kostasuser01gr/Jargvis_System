import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle, AlertTriangle, Info, AlertCircle, Filter, CheckCheck, Settings, Archive, Trash2, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  archived: boolean;
  category?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function EnhancedNotificationCenter({ position = 'top-right' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('jarvis-notifications');
    return saved ? JSON.parse(saved).map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('jarvis-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Initialize with some notifications
  useEffect(() => {
    if (notifications.length === 0) {
      const initialNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          title: 'System Online',
          message: 'All systems initialized successfully',
          timestamp: new Date(),
          read: false,
          archived: false,
          category: 'System'
        },
        {
          id: '2',
          type: 'info',
          title: 'Security Scan Complete',
          message: 'No threats detected. System secure.',
          timestamp: new Date(Date.now() - 60000),
          read: false,
          archived: false,
          category: 'Security'
        },
        {
          id: '3',
          type: 'info',
          title: 'Theme Applied',
          message: 'Cyan Matrix theme has been applied',
          timestamp: new Date(Date.now() - 120000),
          read: true,
          archived: false,
          category: 'UI'
        }
      ];
      setNotifications(initialNotifications);
    }

    // Add random notifications periodically
    const interval = setInterval(() => {
      const messages = [
        { type: 'info' as const, title: 'Network Status', message: 'Connection optimal', category: 'Network' },
        { type: 'success' as const, title: 'Backup Complete', message: 'All data backed up successfully', category: 'System' },
        { type: 'info' as const, title: 'Performance', message: 'System running at peak efficiency', category: 'Performance' },
        { type: 'warning' as const, title: 'High CPU Usage', message: 'CPU usage above 80%', category: 'Performance' }
      ];

      const random = messages[Math.floor(Math.random() * messages.length)];
      
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...random,
        timestamp: new Date(),
        read: false,
        archived: false
      };

      setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filter by read status
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read && !n.archived);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.read && !n.archived);
    } else if (filter === 'archived') {
      filtered = filtered.filter(n => n.archived);
    } else {
      filtered = filtered.filter(n => !n.archived);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(n => n.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query) ||
        n.category?.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [notifications, filter, selectedCategory, searchQuery]);

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
  const categories = useMemo(() => {
    const cats = new Set(notifications.map(n => n.category).filter(Boolean));
    return Array.from(cats);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info('Notification removed');
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true, read: true } : n));
  };

  const clearAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, archived: true, read: true })));
    toast.success('All notifications cleared');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-20 left-6';
      case 'bottom-right':
        return 'bottom-20 right-6';
      case 'bottom-left':
        return 'bottom-20 left-6';
      default:
        return 'top-20 right-6';
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
        className="fixed top-6 right-24 z-50 p-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors relative"
      >
        <Bell className="w-5 h-5 text-cyan-400" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 text-black text-xs rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
            className={`fixed ${getPositionClasses()} z-50 w-96 max-h-[700px] bg-gradient-to-br from-black to-cyan-950/20 border border-cyan-500/50 rounded-lg backdrop-blur-xl shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="p-4 border-b border-cyan-500/30 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-cyan-400 font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge className="bg-cyan-500 text-black text-xs">{unreadCount}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={markAllAsRead}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-cyan-400 hover:bg-cyan-500/20"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-cyan-400 hover:bg-cyan-500/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-black/40 border-cyan-500/30 text-cyan-300 placeholder:text-cyan-600 text-sm h-8"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                  <SelectTrigger className="h-7 text-xs bg-black/40 border-cyan-500/30 text-cyan-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                {categories.length > 0 && (
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-7 text-xs bg-black/40 border-cyan-500/30 text-cyan-300 flex-1">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-cyan-600">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-3 bg-cyan-950/30 border rounded-lg hover:border-cyan-500/40 transition-colors cursor-pointer ${
                          notification.read ? 'border-cyan-500/10 opacity-70' : 'border-cyan-500/20'
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {getIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-sm ${notification.read ? 'text-cyan-400' : 'text-cyan-300 font-semibold'}`}>
                                {notification.title}
                              </h4>
                              {notification.category && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-cyan-500/30 text-cyan-600">
                                  {notification.category}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-cyan-600 mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-cyan-700">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                            {notification.action && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="mt-2 h-6 text-xs text-cyan-400 hover:bg-cyan-500/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action?.onClick();
                                }}
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                            )}
                            <div className="flex flex-col gap-1">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  archiveNotification(notification.id);
                                }}
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-cyan-600 hover:text-cyan-400 hover:bg-cyan-500/10"
                                title="Archive"
                              >
                                <Archive className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-cyan-600 hover:text-red-400 hover:bg-red-500/10"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-cyan-500/30 flex-shrink-0 flex items-center justify-between">
                <Button
                  onClick={clearAll}
                  variant="ghost"
                  className="text-cyan-400 hover:bg-cyan-500/10 text-sm"
                >
                  Clear All
                </Button>
                <span className="text-xs text-cyan-600">
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollText, Download, Filter, Search, AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  category: string;
  message: string;
  details?: string;
}

export function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date(),
      level: 'success',
      category: 'API',
      message: 'Deployment completed successfully',
      details: 'Version 3.14.159 deployed to production'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 60000),
      level: 'info',
      category: 'Database',
      message: 'Backup completed',
      details: '2.4 GB backed up to cloud storage'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 120000),
      level: 'warning',
      category: 'Security',
      message: 'Unusual login attempt detected',
      details: 'IP: 192.168.1.1 - Location: Unknown'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 180000),
      level: 'error',
      category: 'System',
      message: 'Memory usage exceeded threshold',
      details: 'Current: 87% - Threshold: 85%'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    // Simulate real-time log updates
    const interval = setInterval(() => {
      const messages = [
        'API request processed',
        'Database query executed',
        'Cache updated',
        'User session created',
        'File uploaded successfully'
      ];
      
      const categories = ['API', 'Database', 'Cache', 'Auth', 'Storage'];
      const levels: Array<'info' | 'warning' | 'error' | 'success'> = ['info', 'success'];
      
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level: levels[Math.floor(Math.random() * levels.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      };

      setLogs(prev => [newLog, ...prev].slice(0, 100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle2 className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'error': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      default: return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50';
    }
  };

  const exportLogs = () => {
    const logText = filteredLogs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] [${log.category}] ${log.message}${log.details ? `\n  ${log.details}` : ''}`
    ).join('\n\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jarvis-logs-${Date.now()}.txt`;
    link.click();
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ScrollText className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-cyan-400">System Logs</h3>
            <p className="text-xs text-cyan-600">Real-time system monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
            Live
          </Badge>
          <Button
            size="sm"
            onClick={exportLogs}
            className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="pl-10 bg-black/60 border-cyan-500/40 text-cyan-100"
          />
        </div>
        
        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
          <SelectTrigger className="w-40 bg-black/60 border-cyan-500/40 text-cyan-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Log Entries */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-2">
          <AnimatePresence>
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.02 }}
                className="bg-black/40 border border-cyan-500/20 rounded-lg p-3 hover:border-cyan-500/50 transition-all font-mono text-sm"
              >
                <div className="flex items-start gap-3">
                  <div className={`${getLevelColor(log.level)} rounded p-1 border`}>
                    {getLevelIcon(log.level)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs text-cyan-600">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <Badge className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
                        {log.category}
                      </Badge>
                      <Badge className={`${getLevelColor(log.level)} border text-xs capitalize`}>
                        {log.level}
                      </Badge>
                    </div>
                    <div className="text-cyan-300 mb-1">{log.message}</div>
                    {log.details && (
                      <div className="text-xs text-cyan-600">{log.details}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-cyan-500/20 grid grid-cols-4 gap-4">
        {[
          { label: 'Total', count: logs.length, color: 'cyan' },
          { label: 'Errors', count: logs.filter(l => l.level === 'error').length, color: 'red' },
          { label: 'Warnings', count: logs.filter(l => l.level === 'warning').length, color: 'yellow' },
          { label: 'Success', count: logs.filter(l => l.level === 'success').length, color: 'green' }
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className={`text-2xl text-${stat.color}-400 font-mono`}>{stat.count}</div>
            <div className="text-xs text-cyan-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

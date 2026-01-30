import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Activity, Brain, Cpu, Zap, Database, Shield, Users, TrendingUp,
  Clock, Star, BarChart3, Settings, Terminal, Code, Rocket
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
// Progress component fallback if not available
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-cyan-950/30 rounded-full h-2 ${className}`}>
    <div
      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
);

interface SystemMetric {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  tab: string;
  description: string;
}

interface RecentActivity {
  id: string;
  action: string;
  time: string;
  icon: React.ReactNode;
}

export function Dashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { label: 'System Health', value: '98%', change: 2, icon: <Activity className="w-5 h-5" />, color: 'text-green-400' },
    { label: 'AI Models', value: 24, change: 3, icon: <Brain className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Quantum Qubits', value: '64/128', icon: <Cpu className="w-5 h-5" />, color: 'text-purple-400' },
    { label: 'Performance', value: '99.2%', change: 0.5, icon: <Zap className="w-5 h-5" />, color: 'text-yellow-400' },
    { label: 'Active Users', value: 12, icon: <Users className="w-5 h-5" />, color: 'text-cyan-400' },
    { label: 'Data Processed', value: '2.4TB', change: 12, icon: <Database className="w-5 h-5" />, color: 'text-emerald-400' }
  ]);

  const quickActions: QuickAction[] = [
    { id: '1', label: 'AI Assistant', icon: <Terminal />, tab: 'assistant', description: 'Start conversation' },
    { id: '2', label: 'Model Training', icon: <Brain />, tab: 'training', description: 'Train new models' },
    { id: '3', label: 'Quantum Lab', icon: <Cpu />, tab: 'quantum-advanced', description: 'Quantum computing' },
    { id: '4', label: 'Code Editor', icon: <Code />, tab: 'develop', description: 'Development tools' },
    { id: '5', label: 'Analytics', icon: <BarChart3 />, tab: 'analytics', description: 'View analytics' },
    { id: '6', label: 'Settings', icon: <Settings />, tab: 'settings', description: 'System settings' }
  ];

  const recentActivities: RecentActivity[] = [
    { id: '1', action: 'Model training completed', time: '2m ago', icon: <Brain className="w-4 h-4" /> },
    { id: '2', action: 'Quantum circuit executed', time: '5m ago', icon: <Cpu className="w-4 h-4" /> },
    { id: '3', action: 'New dataset uploaded', time: '12m ago', icon: <Database className="w-4 h-4" /> },
    { id: '4', action: 'Security scan passed', time: '1h ago', icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl text-cyan-400 mb-2">Welcome to JARVIS</h1>
        <p className="text-cyan-600">Your AI-powered development platform</p>
      </motion.div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-4 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className={`${metric.color}`}>
                  {metric.icon}
                </div>
                {metric.change !== undefined && (
                  <Badge className={`${metric.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-cyan-300 mb-1">{metric.value}</div>
              <div className="text-sm text-cyan-600">{metric.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl text-cyan-400 mb-4 flex items-center gap-2">
          <Rocket className="w-5 h-5" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={() => onNavigate?.(action.tab)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-all text-left group"
            >
              <div className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <div className="text-sm font-semibold text-cyan-300 mb-1">{action.label}</div>
              <div className="text-xs text-cyan-600">{action.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <h2 className="text-xl text-cyan-400 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-black/40 rounded border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
              >
                <div className="text-cyan-400">{activity.icon}</div>
                <div className="flex-1">
                  <div className="text-sm text-cyan-300">{activity.action}</div>
                  <div className="text-xs text-cyan-600">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Status */}
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <h2 className="text-xl text-cyan-400 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Status
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cyan-300">CPU Usage</span>
                <span className="text-cyan-400">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cyan-300">Memory</span>
                <span className="text-cyan-400">62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cyan-300">Network</span>
                <span className="text-cyan-400">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cyan-300">Storage</span>
                <span className="text-cyan-400">34%</span>
              </div>
              <Progress value={34} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* Favorites */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <h2 className="text-xl text-cyan-400 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Favorite Tools
        </h2>
        <div className="text-sm text-cyan-600">
          Pin your most-used tools here for quick access. Go to any tab and click the star icon to add it to favorites.
        </div>
      </Card>
    </div>
  );
}

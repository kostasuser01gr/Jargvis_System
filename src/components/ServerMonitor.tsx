import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Server, Cpu, HardDrive, Wifi, Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ServerMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  requests: number;
  uptime: number;
  errors: number;
}

export function ServerMonitor() {
  const [metrics, setMetrics] = useState<ServerMetrics>({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 78,
    requests: 12453,
    uptime: 0,
    errors: 3
  });

  const [cpuHistory, setCpuHistory] = useState<any[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<any[]>([]);
  const [networkHistory, setNetworkHistory] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const time = now.toLocaleTimeString();

      setMetrics(prev => {
        const newMetrics = {
          cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
          disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
          network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
          requests: prev.requests + Math.floor(Math.random() * 100),
          uptime: prev.uptime + 1,
          errors: prev.errors + (Math.random() > 0.95 ? 1 : 0)
        };

        setCpuHistory(prev => [...prev.slice(-19), { time, value: newMetrics.cpu }]);
        setMemoryHistory(prev => [...prev.slice(-19), { time, value: newMetrics.memory }]);
        setNetworkHistory(prev => [...prev.slice(-19), { time, value: newMetrics.network }]);

        return newMetrics;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const getStatusColor = (value: number) => {
    if (value > 80) return 'text-red-400';
    if (value > 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getProgressColor = (value: number) => {
    if (value > 80) return 'bg-red-400';
    if (value > 60) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-3">
              <Cpu className="w-8 h-8 text-cyan-400" />
              <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Healthy
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-cyan-600">CPU Usage</span>
                  <span className={`text-2xl font-mono ${getStatusColor(metrics.cpu)}`}>
                    {metrics.cpu.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getProgressColor(metrics.cpu)}`}
                    animate={{ width: `${metrics.cpu}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="text-xs text-cyan-600">
                8 cores @ 3.5 GHz
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-3">
              <HardDrive className="w-8 h-8 text-cyan-400" />
              <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Healthy
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-cyan-600">Memory</span>
                  <span className={`text-2xl font-mono ${getStatusColor(metrics.memory)}`}>
                    {metrics.memory.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getProgressColor(metrics.memory)}`}
                    animate={{ width: `${metrics.memory}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="text-xs text-cyan-600">
                16 GB DDR4
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-3">
              <Wifi className="w-8 h-8 text-cyan-400" />
              <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-cyan-600">Network</span>
                  <span className={`text-2xl font-mono ${getStatusColor(metrics.network)}`}>
                    {metrics.network.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getProgressColor(metrics.network)}`}
                    animate={{ width: `${metrics.network}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="text-xs text-cyan-600">
                1 Gbps bandwidth
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-3">
              <Server className="w-8 h-8 text-cyan-400" />
              <Badge className="bg-cyan-500/20 border-cyan-500/50 text-cyan-400">
                <Clock className="w-3 h-3 mr-1" />
                Online
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-cyan-600 mb-2">Uptime</div>
                <div className="text-2xl text-cyan-400 font-mono">
                  {formatUptime(metrics.uptime)}
                </div>
              </div>
              <div className="text-xs text-cyan-600">
                99.99% availability
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <h4 className="text-sm text-cyan-400 mb-4">CPU Usage</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cpuHistory}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.1)" />
              <XAxis dataKey="time" stroke="#0e7490" style={{ fontSize: '10px' }} />
              <YAxis stroke="#0e7490" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '8px'
                }} 
              />
              <Area type="monotone" dataKey="value" stroke="#22d3ee" fillOpacity={1} fill="url(#cpuGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <h4 className="text-sm text-cyan-400 mb-4">Memory Usage</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={memoryHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.1)" />
              <XAxis dataKey="time" stroke="#0e7490" style={{ fontSize: '10px' }} />
              <YAxis stroke="#0e7490" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <h4 className="text-sm text-cyan-400 mb-4">Network Traffic</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={networkHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.1)" />
              <XAxis dataKey="time" stroke="#0e7490" style={{ fontSize: '10px' }} />
              <YAxis stroke="#0e7490" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-cyan-600 mb-2">Total Requests</div>
              <div className="text-3xl text-cyan-400 font-mono">{metrics.requests.toLocaleString()}</div>
            </div>
            <Activity className="w-12 h-12 text-cyan-400 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-cyan-600 mb-2">Disk Usage</div>
              <div className="text-3xl text-cyan-400 font-mono">{metrics.disk.toFixed(1)}%</div>
            </div>
            <HardDrive className="w-12 h-12 text-cyan-400 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-cyan-600 mb-2">Errors</div>
              <div className="text-3xl text-red-400 font-mono">{metrics.errors}</div>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-400 opacity-50" />
          </div>
        </Card>
      </div>
    </div>
  );
}

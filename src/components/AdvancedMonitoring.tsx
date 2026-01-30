import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, AlertTriangle, TrendingUp, Clock, Zap, Database, Network, HardDrive, Cpu, MemoryStick, Eye, BarChart3 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  threshold: { warning: number; critical: number };
  history: Array<{ timestamp: Date; value: number }>;
}

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  source: string;
  resolved: boolean;
}

interface PerformanceMetric {
  timestamp: string;
  cpu: number;
  memory: number;
  network: number;
  disk: number;
  requests: number;
  errors: number;
}

export function AdvancedMonitoring() {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      name: 'CPU Usage',
      value: 45.2,
      unit: '%',
      trend: 'up',
      threshold: { warning: 70, critical: 90 },
      history: []
    },
    {
      name: 'Memory Usage',
      value: 62.5,
      unit: '%',
      trend: 'stable',
      threshold: { warning: 80, critical: 95 },
      history: []
    },
    {
      name: 'Network Throughput',
      value: 125.8,
      unit: 'Mbps',
      trend: 'up',
      threshold: { warning: 500, critical: 800 },
      history: []
    },
    {
      name: 'Disk I/O',
      value: 34.1,
      unit: 'MB/s',
      trend: 'down',
      threshold: { warning: 100, critical: 200 },
      history: []
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      severity: 'warning',
      message: 'CPU usage above 70%',
      timestamp: new Date(Date.now() - 3600000),
      source: 'System Monitor',
      resolved: false
    },
    {
      id: '2',
      severity: 'error',
      message: 'High error rate detected',
      timestamp: new Date(Date.now() - 1800000),
      source: 'API Gateway',
      resolved: false
    }
  ]);

  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionReplay, setSessionReplay] = useState(false);

  useEffect(() => {
    // Generate performance data
    const data: PerformanceMetric[] = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const timestamp = new Date(now);
      timestamp.setMinutes(timestamp.getMinutes() - i);
      data.push({
        timestamp: timestamp.toISOString(),
        cpu: 40 + Math.sin(i / 5) * 15 + Math.random() * 10,
        memory: 60 + Math.cos(i / 3) * 10 + Math.random() * 5,
        network: 100 + Math.random() * 50,
        disk: 30 + Math.random() * 10,
        requests: 100 + Math.random() * 50,
        errors: Math.random() * 5
      });
    }
    setPerformanceData(data);

    // Update metrics in real-time
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const change = (Math.random() - 0.5) * 2;
        const newValue = Math.max(0, Math.min(100, metric.value + change));
        return {
          ...metric,
          value: newValue,
          history: [...metric.history.slice(-29), { timestamp: new Date(), value: newValue }]
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'error': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-green-400 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-blue-400 flex items-center gap-2">
              <Activity className="w-6 h-5" />
              Advanced Monitoring & Observability
            </h3>
            <p className="text-xs text-blue-600 mt-1">Real-time performance monitoring, alerts, and analytics</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsRecording(!isRecording)}
              className={isRecording ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-blue-500/20 border-blue-500/50 text-blue-400'}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <Button
              onClick={() => setSessionReplay(!sessionReplay)}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Session Replay
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, i) => {
            const isWarning = metric.value >= metric.threshold.warning;
            const isCritical = metric.value >= metric.threshold.critical;
            
            return (
              <Card key={i} className={`bg-black/40 border-blue-500/30 p-3 ${
                isCritical ? 'border-red-500/50' : isWarning ? 'border-yellow-500/50' : ''
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-blue-600">{metric.name}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className={`text-xl font-mono mb-1 ${
                  isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {metric.value.toFixed(1)}{metric.unit}
                </div>
                <Progress 
                  value={metric.value} 
                  className={`h-2 ${
                    isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                />
              </Card>
            );
          })}
        </div>
      </Card>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="bg-black/40 border-blue-500/30">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="traces">Traces</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
              <h4 className="text-blue-400 mb-4">Performance Overview</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                  <XAxis dataKey="timestamp" stroke="#60a5fa" tickFormatter={(v) => new Date(v).toLocaleTimeString()} />
                  <YAxis stroke="#60a5fa" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #3b82f6' }} />
                  <Legend />
                  <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                  <Area type="monotone" dataKey="memory" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMemory)" name="Memory %" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
              <h4 className="text-blue-400 mb-4">Request & Error Rates</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                  <XAxis dataKey="timestamp" stroke="#60a5fa" tickFormatter={(v) => new Date(v).toLocaleTimeString()} />
                  <YAxis stroke="#60a5fa" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #3b82f6' }} />
                  <Legend />
                  <Bar dataKey="requests" fill="#3b82f6" name="Requests" />
                  <Bar dataKey="errors" fill="#ef4444" name="Errors" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-blue-400">Active Alerts ({alerts.filter(a => !a.resolved).length})</h4>
              <Badge className="bg-red-500/20 border-red-500/50 text-red-400">
                {alerts.filter(a => a.severity === 'critical' && !a.resolved).length} Critical
              </Badge>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="bg-black/40 border-blue-500/30 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <div>
                          <p className="text-sm text-blue-300 mb-1">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-blue-600">
                            <span>{alert.source}</span>
                            <span>{alert.timestamp.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      {!alert.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                          onClick={() => {
                            setAlerts(alerts.map(a => a.id === alert.id ? { ...a, resolved: true } : a));
                            toast.success('Alert resolved');
                          }}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {metrics.map((metric, i) => (
              <Card key={i} className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
                <h4 className="text-blue-400 mb-4">{metric.name}</h4>
                {metric.history.length > 0 && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={metric.history.map(h => ({ time: h.timestamp, value: h.value }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                      <XAxis dataKey="time" stroke="#60a5fa" />
                      <YAxis stroke="#60a5fa" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #3b82f6' }} />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
            <h4 className="text-blue-400 mb-4">System Logs</h4>
            <ScrollArea className="h-[500px]">
              <div className="space-y-1 font-mono text-xs">
                {Array.from({ length: 50 }, (_, i) => (
                  <div key={i} className="flex items-center gap-2 p-1 hover:bg-blue-500/10 rounded">
                    <span className="text-blue-600">[{new Date(Date.now() - (50 - i) * 60000).toLocaleTimeString()}]</span>
                    <span className="text-blue-400">INFO</span>
                    <span className="text-blue-300">System operation completed successfully</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="traces" className="mt-6">
          <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
            <h4 className="text-blue-400 mb-4">Distributed Traces</h4>
            <div className="space-y-3">
              {[
                { id: '1', service: 'API Gateway', duration: '45ms', status: 'success' },
                { id: '2', service: 'Auth Service', duration: '12ms', status: 'success' },
                { id: '3', service: 'Database', duration: '23ms', status: 'success' },
                { id: '4', service: 'Cache', duration: '2ms', status: 'success' },
              ].map((trace) => (
                <div key={trace.id} className="flex items-center gap-4 p-3 bg-black/40 rounded border border-blue-500/30">
                  <div className="flex-1">
                    <div className="text-sm text-blue-400">{trace.service}</div>
                    <div className="text-xs text-blue-600">Duration: {trace.duration}</div>
                  </div>
                  <Badge className={
                    trace.status === 'success' 
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : 'bg-red-500/20 border-red-500/50 text-red-400'
                  }>
                    {trace.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Cpu, HardDrive, Network, Activity, TrendingUp, Settings, Play, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface Optimization {
  id: string;
  name: string;
  type: 'caching' | 'batching' | 'gpu' | 'compression';
  enabled: boolean;
  improvement: number;
  status: 'active' | 'inactive';
}

interface PerformanceMetric {
  name: string;
  current: number;
  optimized: number;
  improvement: number;
  unit: string;
}

export function PerformanceOptimizations() {
  const [optimizations, setOptimizations] = useState<Optimization[]>([
    {
      id: '1',
      name: 'Model Response Caching',
      type: 'caching',
      enabled: true,
      improvement: 45,
      status: 'active'
    },
    {
      id: '2',
      name: 'Batch Processing',
      type: 'batching',
      enabled: true,
      improvement: 60,
      status: 'active'
    },
    {
      id: '3',
      name: 'GPU Acceleration',
      type: 'gpu',
      enabled: true,
      improvement: 300,
      status: 'active'
    },
    {
      id: '4',
      name: 'Model Compression',
      type: 'compression',
      enabled: false,
      improvement: 50,
      status: 'inactive'
    }
  ]);

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    { name: 'Latency', current: 120, optimized: 45, improvement: 62.5, unit: 'ms' },
    { name: 'Throughput', current: 50, optimized: 125, improvement: 150, unit: 'req/s' },
    { name: 'Memory Usage', current: 8.5, optimized: 4.2, improvement: 50.6, unit: 'GB' },
    { name: 'CPU Usage', current: 85, optimized: 45, improvement: 47.1, unit: '%' },
  ]);

  const toggleOptimization = (id: string) => {
    setOptimizations(optimizations.map(opt => 
      opt.id === id 
        ? { ...opt, enabled: !opt.enabled, status: !opt.enabled ? 'active' : 'inactive' }
        : opt
    ));
    toast.success('Optimization toggled');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'caching': return <HardDrive className="w-4 h-4" />;
      case 'batching': return <Network className="w-4 h-4" />;
      case 'gpu': return <Cpu className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'caching': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'batching': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'gpu': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      default: return 'bg-green-500/20 border-green-500/50 text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-yellow-950/20 to-amber-950/20 border-yellow-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-yellow-400 flex items-center gap-2">
              <Zap className="w-6 h-5" />
              Performance Optimizations
            </h3>
            <p className="text-xs text-yellow-600 mt-1">Caching, batching, GPU acceleration, and more</p>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <Card key={i} className="bg-black/40 border-yellow-500/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-yellow-600">{metric.name}</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-xl text-yellow-400 font-mono mb-1">
                {metric.optimized.toFixed(1)}{metric.unit}
              </div>
              <div className="text-xs text-yellow-600">
                <span className="line-through text-yellow-700">{metric.current}{metric.unit}</span>
                <span className="text-green-400 ml-2">+{metric.improvement.toFixed(1)}%</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="optimizations" className="w-full">
        <TabsList className="bg-black/40 border-yellow-500/30">
          <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
          <TabsTrigger value="caching">Caching</TabsTrigger>
          <TabsTrigger value="gpu">GPU</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="optimizations" className="mt-6">
          <Card className="bg-gradient-to-br from-yellow-950/20 to-amber-950/20 border-yellow-500/30 p-6">
            <h4 className="text-yellow-400 mb-4">Available Optimizations</h4>
            <div className="space-y-3">
              {optimizations.map((opt) => (
                <Card key={opt.id} className="bg-black/40 border-yellow-500/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${getTypeColor(opt.type)}`}>
                        {getTypeIcon(opt.type)}
                      </div>
                      <div>
                        <h5 className="text-yellow-400 mb-1">{opt.name}</h5>
                        <div className="flex items-center gap-2">
                          <Badge className={opt.status === 'active' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-gray-500/20 border-gray-500/50 text-gray-400'}>
                            {opt.status}
                          </Badge>
                          <span className="text-xs text-yellow-600">
                            {opt.improvement}% improvement
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <div className="text-sm text-yellow-400 font-mono">{opt.improvement}%</div>
                        <div className="text-xs text-yellow-600">Faster</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={opt.enabled}
                        onChange={() => toggleOptimization(opt.id)}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                  <Progress value={opt.enabled ? 100 : 0} className="h-2" />
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="caching" className="mt-6">
          <Card className="bg-gradient-to-br from-yellow-950/20 to-amber-950/20 border-yellow-500/30 p-6">
            <h4 className="text-yellow-400 mb-4">Caching Configuration</h4>
            <div className="space-y-4">
              <Card className="bg-black/40 border-yellow-500/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="text-yellow-400 mb-1">Response Caching</h5>
                    <p className="text-sm text-yellow-600">Cache model responses for faster retrieval</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Cache Size:</span>
                    <span className="text-yellow-400 font-mono">2.5 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Hit Rate:</span>
                    <span className="text-yellow-400 font-mono">87.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">TTL:</span>
                    <span className="text-yellow-400 font-mono">1 hour</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-black/40 border-yellow-500/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="text-yellow-400 mb-1">Model Caching</h5>
                    <p className="text-sm text-yellow-600">Keep frequently used models in memory</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Cached Models:</span>
                    <span className="text-yellow-400 font-mono">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Memory Used:</span>
                    <span className="text-yellow-400 font-mono">12.3 GB</span>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="gpu" className="mt-6">
          <Card className="bg-gradient-to-br from-yellow-950/20 to-amber-950/20 border-yellow-500/30 p-6">
            <h4 className="text-yellow-400 mb-4">GPU Acceleration</h4>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-black/40 border-yellow-500/30 p-4">
                <h5 className="text-yellow-400 mb-3">GPU Status</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-600">GPU Count:</span>
                    <span className="text-yellow-400 font-mono">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">GPU Model:</span>
                    <span className="text-yellow-400 font-mono">NVIDIA A100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Memory:</span>
                    <span className="text-yellow-400 font-mono">80 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Utilization:</span>
                    <span className="text-yellow-400 font-mono">78%</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-black/40 border-yellow-500/30 p-4">
                <h5 className="text-yellow-400 mb-3">Performance</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Speedup:</span>
                    <span className="text-green-400 font-mono">3.2x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Throughput:</span>
                    <span className="text-yellow-400 font-mono">125 req/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Latency:</span>
                    <span className="text-yellow-400 font-mono">45 ms</span>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-6">
          <Card className="bg-gradient-to-br from-yellow-950/20 to-amber-950/20 border-yellow-500/30 p-6">
            <h4 className="text-yellow-400 mb-4">Performance Monitoring</h4>
            <div className="space-y-4">
              {metrics.map((metric, i) => (
                <Card key={i} className="bg-black/40 border-yellow-500/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-400">{metric.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-600 text-sm line-through">{metric.current}{metric.unit}</span>
                      <span className="text-yellow-400 font-mono">{metric.optimized.toFixed(1)}{metric.unit}</span>
                      <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                        +{metric.improvement.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(metric.optimized / metric.current) * 100} className="h-2" />
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Zap, Cpu, Database, Network, Shield } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface HealthCheckItem {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'checking';
  message: string;
  responseTime: number;
  category: string;
}

export function SystemHealthCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [overallHealth, setOverallHealth] = useState(98);
  
  const [healthChecks, setHealthChecks] = useState<HealthCheckItem[]>([
    { id: '1', name: 'Core System', status: 'healthy', message: 'All systems operational', responseTime: 12, category: 'System' },
    { id: '2', name: 'Quantum Processor', status: 'healthy', message: '16 qubits online, 99.2% coherence', responseTime: 8, category: 'Quantum' },
    { id: '3', name: 'AI Models', status: 'healthy', message: '4 models loaded, ready for inference', responseTime: 15, category: 'AI' },
    { id: '4', name: 'Neural Network', status: 'healthy', message: '256 nodes active, training complete', responseTime: 10, category: 'AI' },
    { id: '5', name: 'Database', status: 'healthy', message: 'Supabase connected, 99.9% uptime', responseTime: 25, category: 'Backend' },
    { id: '6', name: 'API Endpoints', status: 'healthy', message: '12/12 endpoints responding', responseTime: 18, category: 'Backend' },
    { id: '7', name: 'Blockchain', status: 'healthy', message: 'Connected to network, synced', responseTime: 45, category: 'Blockchain' },
    { id: '8', name: 'Collaboration', status: 'healthy', message: '4 users online, low latency', responseTime: 22, category: 'Network' },
    { id: '9', name: 'Security', status: 'healthy', message: 'No threats detected, shields up', responseTime: 14, category: 'Security' },
    { id: '10', name: 'Plugins', status: 'healthy', message: '4/4 plugins active', responseTime: 9, category: 'System' },
    { id: '11', name: 'Voice Assistant', status: 'healthy', message: 'Speech recognition online', responseTime: 11, category: 'AI' },
    { id: '12', name: 'HUD Interface', status: 'healthy', message: 'Rendering at 60 FPS', responseTime: 5, category: 'System' },
    { id: '13', name: 'Data Visualization', status: 'healthy', message: 'All charts rendering', responseTime: 13, category: 'System' },
    { id: '14', name: 'Automation', status: 'healthy', message: '3 workflows running', responseTime: 16, category: 'System' },
    { id: '15', name: 'Performance', status: 'warning', message: 'Memory usage at 78%', responseTime: 7, category: 'System' },
    { id: '16', name: 'File System', status: 'healthy', message: 'All files accessible', responseTime: 19, category: 'System' },
    { id: '17', name: 'Code Editor', status: 'healthy', message: 'Syntax highlighting active', responseTime: 8, category: 'Dev' },
    { id: '18', name: 'GitHub Integration', status: 'healthy', message: 'Connected, auth valid', responseTime: 32, category: 'Dev' },
    { id: '19', name: 'Deployment', status: 'healthy', message: 'Ready to deploy', responseTime: 10, category: 'Dev' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time health monitoring
      setHealthChecks(prev => prev.map(check => {
        const random = Math.random();
        let newStatus = check.status;
        
        if (random > 0.95) {
          newStatus = 'warning';
        } else if (random > 0.98) {
          newStatus = 'critical';
        } else {
          newStatus = 'healthy';
        }
        
        return {
          ...check,
          responseTime: Math.floor(Math.random() * 50) + 5,
          status: newStatus
        };
      }));
      
      // Update overall health
      const healthy = healthChecks.filter(c => c.status === 'healthy').length;
      const warning = healthChecks.filter(c => c.status === 'warning').length;
      setOverallHealth(Math.floor((healthy / healthChecks.length) * 100 - warning * 2));
    }, 5000);

    return () => clearInterval(interval);
  }, [healthChecks.length]);

  const runHealthCheck = async () => {
    setIsChecking(true);
    toast.info('Running comprehensive health check...');
    
    // Simulate checking all systems
    for (let i = 0; i < healthChecks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setHealthChecks(prev => prev.map((check, idx) => 
        idx === i ? { ...check, status: 'checking' } : check
      ));
    }
    
    // Final results
    setTimeout(() => {
      setHealthChecks(prev => prev.map(check => ({
        ...check,
        status: Math.random() > 0.1 ? 'healthy' : 'warning'
      })));
      setIsChecking(false);
      setLastCheck(new Date());
      toast.success('Health check complete!');
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'critical': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'checking': return <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />;
      default: return <Activity className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'checking': return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'System': return <Cpu className="w-4 h-4" />;
      case 'AI': return <Zap className="w-4 h-4" />;
      case 'Backend': return <Database className="w-4 h-4" />;
      case 'Network': return <Network className="w-4 h-4" />;
      case 'Security': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const healthyCount = healthChecks.filter(c => c.status === 'healthy').length;
  const warningCount = healthChecks.filter(c => c.status === 'warning').length;
  const criticalCount = healthChecks.filter(c => c.status === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <Card className="bg-gradient-to-br from-green-950/20 to-cyan-950/20 border-green-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-green-400 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              System Health Monitor
            </h3>
            <p className="text-xs text-green-600 mt-1">Last check: {lastCheck.toLocaleTimeString()}</p>
          </div>
          <Button
            onClick={runHealthCheck}
            disabled={isChecking}
            className="bg-gradient-to-r from-green-500 to-cyan-500 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Run Check
          </Button>
        </div>

        {/* Overall Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-600">Overall System Health</span>
            <span className="text-green-400 font-mono text-2xl">{overallHealth}%</span>
          </div>
          <Progress value={overallHealth} className="h-3" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-600">Healthy</span>
            </div>
            <div className="text-2xl text-green-400 font-mono">{healthyCount}</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-yellow-600">Warning</span>
            </div>
            <div className="text-2xl text-yellow-400 font-mono">{warningCount}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-xs text-red-600">Critical</span>
            </div>
            <div className="text-2xl text-red-400 font-mono">{criticalCount}</div>
          </div>
        </div>
      </Card>

      {/* Detailed Health Checks */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <h4 className="text-cyan-400 mb-4">Component Health Status</h4>
        
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {healthChecks.map((check, index) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`bg-black/40 border rounded-lg p-4 transition-all ${
                  check.status === 'healthy' ? 'border-green-500/20' :
                  check.status === 'warning' ? 'border-yellow-500/40' :
                  check.status === 'critical' ? 'border-red-500/40' :
                  'border-cyan-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">{check.name}</span>
                        <Badge className={getStatusColor(check.status)}>
                          {check.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-cyan-700 mt-1">{check.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-cyan-600 text-xs mb-1">
                      {getCategoryIcon(check.category)}
                      <span>{check.category}</span>
                    </div>
                    <div className="text-cyan-400 font-mono text-sm">{check.responseTime}ms</div>
                  </div>
                </div>

                {/* Progress bar for response time */}
                <div className="mt-2">
                  <Progress 
                    value={Math.min((check.responseTime / 50) * 100, 100)} 
                    className="h-1"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

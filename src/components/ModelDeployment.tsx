import { useState } from 'react';
import { motion } from 'motion/react';
import { Rocket, Cloud, Server, Smartphone, Settings, Play, Pause, Trash2, ExternalLink, CheckCircle2, AlertCircle, Zap, HardDrive, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface Deployment {
  id: string;
  name: string;
  model: string;
  platform: 'cloud' | 'edge' | 'hybrid';
  status: 'deployed' | 'deploying' | 'stopped' | 'error';
  endpoint: string;
  requests: number;
  latency: number;
  uptime: number;
  region: string;
  createdAt: Date;
}

interface DeploymentConfig {
  platform: 'aws' | 'gcp' | 'azure' | 'local' | 'edge';
  region: string;
  instanceType: string;
  scaling: 'auto' | 'manual';
  minInstances: number;
  maxInstances: number;
  quantization: 'none' | 'int8' | 'int4' | 'binary';
  compression: boolean;
  caching: boolean;
}

export function ModelDeployment() {
  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: '1',
      name: 'Production API',
      model: 'JARVIS-GPT-Ultra',
      platform: 'cloud',
      status: 'deployed',
      endpoint: 'https://api.jarvis.ai/v1/models/gpt-ultra',
      requests: 125000,
      latency: 45.2,
      uptime: 99.8,
      region: 'us-east-1',
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      name: 'Edge Device',
      model: 'Vision-Pro-X',
      platform: 'edge',
      status: 'deployed',
      endpoint: 'edge://device-1234',
      requests: 5000,
      latency: 12.5,
      uptime: 98.5,
      region: 'local',
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      id: '3',
      name: 'Staging Environment',
      model: 'TimeSeries-Neural',
      platform: 'cloud',
      status: 'deploying',
      endpoint: 'https://staging.jarvis.ai/v1/models/ts-neural',
      requests: 0,
      latency: 0,
      uptime: 0,
      region: 'us-west-2',
      createdAt: new Date()
    }
  ]);

  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(deployments[0]);
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    platform: 'aws',
    region: 'us-east-1',
    instanceType: 'g4dn.xlarge',
    scaling: 'auto',
    minInstances: 1,
    maxInstances: 10,
    quantization: 'int8',
    compression: true,
    caching: true
  });

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);

  const deployModel = () => {
    setIsDeploying(true);
    setDeployProgress(0);
    
    const interval = setInterval(() => {
      setDeployProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDeploying(false);
          toast.success('Model deployed successfully!');
          
          const newDeployment: Deployment = {
            id: `deploy-${Date.now()}`,
            name: 'New Deployment',
            model: 'Custom Model',
            platform: 'cloud',
            status: 'deployed',
            endpoint: 'https://api.jarvis.ai/v1/models/new',
            requests: 0,
            latency: 0,
            uptime: 100,
            region: deploymentConfig.region,
            createdAt: new Date()
          };
          
          setDeployments([...deployments, newDeployment]);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const stopDeployment = (id: string) => {
    setDeployments(deployments.map(d => 
      d.id === id ? { ...d, status: 'stopped' as const } : d
    ));
    toast.info('Deployment stopped');
  };

  const deleteDeployment = (id: string) => {
    setDeployments(deployments.filter(d => d.id !== id));
    if (selectedDeployment?.id === id) setSelectedDeployment(null);
    toast.success('Deployment deleted');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'deploying': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'stopped': return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'cloud': return <Cloud className="w-4 h-4" />;
      case 'edge': return <Smartphone className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-rose-950/20 to-pink-950/20 border-rose-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-rose-400 flex items-center gap-2">
              <Rocket className="w-6 h-5" />
              Model Deployment & Serving
            </h3>
            <p className="text-xs text-rose-600 mt-1">Deploy models to cloud, edge, or hybrid environments</p>
          </div>
          <Button
            onClick={deployModel}
            disabled={isDeploying}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white"
          >
            <Rocket className="w-4 h-4 mr-2" />
            {isDeploying ? 'Deploying...' : 'Deploy Model'}
          </Button>
        </div>

        {/* Deployment Progress */}
        {isDeploying && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-rose-400">Deployment Progress</span>
              <span className="text-rose-400 font-mono">{deployProgress}%</span>
            </div>
            <Progress value={deployProgress} className="h-3" />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployment List */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-rose-950/20 to-pink-950/20 border-rose-500/30 p-6">
          <h4 className="text-rose-400 mb-4">Active Deployments ({deployments.length})</h4>
          
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {deployments.map((deployment) => (
                <motion.div
                  key={deployment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-black/40 border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedDeployment?.id === deployment.id
                      ? 'border-rose-500/50 bg-rose-500/10'
                      : 'border-rose-500/20 hover:border-rose-500/40'
                  }`}
                  onClick={() => setSelectedDeployment(deployment)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded bg-rose-500/20 border border-rose-500/50">
                        {getPlatformIcon(deployment.platform)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-rose-400">{deployment.name}</h4>
                          <Badge className={getStatusColor(deployment.status)}>
                            {deployment.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-rose-600 mb-1">
                          {deployment.model} • {deployment.region}
                        </div>
                        <div className="text-xs text-rose-600 font-mono">
                          {deployment.endpoint}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-rose-400 font-mono">{deployment.uptime.toFixed(1)}%</div>
                      <div className="text-xs text-rose-600">Uptime</div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-black/60 rounded p-2">
                      <div className="text-xs text-rose-600 mb-1">Requests</div>
                      <div className="text-sm text-rose-400 font-mono">{deployment.requests.toLocaleString()}</div>
                    </div>
                    <div className="bg-black/60 rounded p-2">
                      <div className="text-xs text-rose-600 mb-1">Latency</div>
                      <div className="text-sm text-rose-400 font-mono">{deployment.latency.toFixed(1)}ms</div>
                    </div>
                    <div className="bg-black/60 rounded p-2">
                      <div className="text-xs text-rose-600 mb-1">Region</div>
                      <div className="text-sm text-rose-400 font-mono">{deployment.region}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-rose-500/20">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(deployment.endpoint, '_blank');
                      }}
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Open
                    </Button>
                    {deployment.status === 'deployed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          stopDeployment(deployment.id);
                        }}
                      >
                        <Pause className="w-3 h-3 mr-2" />
                        Stop
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDeployment(deployment.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Deployment Configuration */}
        <Card className="bg-gradient-to-br from-rose-950/20 to-pink-950/20 border-rose-500/30 p-6">
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="bg-black/40 border-rose-500/30">
              <TabsTrigger value="config">Config</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-rose-600 mb-2 block">Platform</label>
                  <select
                    value={deploymentConfig.platform}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, platform: e.target.value as any })}
                    className="w-full bg-black/60 border border-rose-500/40 rounded px-3 py-2 text-rose-300"
                  >
                    <option value="aws">AWS</option>
                    <option value="gcp">Google Cloud</option>
                    <option value="azure">Azure</option>
                    <option value="local">Local</option>
                    <option value="edge">Edge Device</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-rose-600 mb-2 block">Region</label>
                  <Input
                    value={deploymentConfig.region}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, region: e.target.value })}
                    className="bg-black/60 border-rose-500/40 text-rose-100"
                  />
                </div>

                <div>
                  <label className="text-xs text-rose-600 mb-2 block">Instance Type</label>
                  <select
                    value={deploymentConfig.instanceType}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, instanceType: e.target.value })}
                    className="w-full bg-black/60 border border-rose-500/40 rounded px-3 py-2 text-rose-300"
                  >
                    <option value="g4dn.xlarge">g4dn.xlarge (GPU)</option>
                    <option value="g4dn.2xlarge">g4dn.2xlarge (GPU)</option>
                    <option value="t3.medium">t3.medium (CPU)</option>
                    <option value="t3.large">t3.large (CPU)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-rose-600 mb-2 block">Scaling</label>
                  <select
                    value={deploymentConfig.scaling}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, scaling: e.target.value as any })}
                    className="w-full bg-black/60 border border-rose-500/40 rounded px-3 py-2 text-rose-300"
                  >
                    <option value="auto">Auto Scaling</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                {deploymentConfig.scaling === 'auto' && (
                  <>
                    <div>
                      <label className="text-xs text-rose-600 mb-2 block">Min Instances</label>
                      <Input
                        type="number"
                        value={deploymentConfig.minInstances}
                        onChange={(e) => setDeploymentConfig({ ...deploymentConfig, minInstances: parseInt(e.target.value) })}
                        className="bg-black/60 border-rose-500/40 text-rose-100"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-rose-600 mb-2 block">Max Instances</label>
                      <Input
                        type="number"
                        value={deploymentConfig.maxInstances}
                        onChange={(e) => setDeploymentConfig({ ...deploymentConfig, maxInstances: parseInt(e.target.value) })}
                        className="bg-black/60 border-rose-500/40 text-rose-100"
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-rose-600 mb-2 block">Quantization</label>
                  <select
                    value={deploymentConfig.quantization}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, quantization: e.target.value as any })}
                    className="w-full bg-black/60 border border-rose-500/40 rounded px-3 py-2 text-rose-300"
                  >
                    <option value="none">None (FP32)</option>
                    <option value="int8">INT8</option>
                    <option value="int4">INT4</option>
                    <option value="binary">Binary</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/40 border border-rose-500/30 rounded">
                  <div>
                    <label className="text-sm text-rose-400">Model Compression</label>
                    <p className="text-xs text-rose-600">Reduce model size</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={deploymentConfig.compression}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, compression: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-black/40 border border-rose-500/30 rounded">
                  <div>
                    <label className="text-sm text-rose-400">Response Caching</label>
                    <p className="text-xs text-rose-600">Cache frequent requests</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={deploymentConfig.caching}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, caching: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>

                <Card className="bg-black/40 border-rose-500/30 p-3">
                  <h5 className="text-rose-400 text-sm mb-2">Optimization Benefits</h5>
                  <div className="space-y-1 text-xs text-rose-600">
                    <div className="flex justify-between">
                      <span>Size Reduction:</span>
                      <span className="text-rose-400">~{deploymentConfig.quantization === 'int8' ? '50' : deploymentConfig.quantization === 'int4' ? '75' : '0'}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed Improvement:</span>
                      <span className="text-rose-400">~{deploymentConfig.quantization === 'int8' ? '2x' : deploymentConfig.quantization === 'int4' ? '4x' : '1x'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Savings:</span>
                      <span className="text-rose-400">~{deploymentConfig.compression ? '30' : '0'}%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Globe, Server, CheckCircle2, XCircle, Clock, Zap, RefreshCw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface Deployment {
  id: string;
  environment: 'production' | 'staging' | 'development';
  status: 'deploying' | 'success' | 'failed' | 'idle';
  branch: string;
  commit: string;
  url: string;
  startedAt: Date;
  duration?: number;
  progress: number;
}

export function DeploymentCenter() {
  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: '1',
      environment: 'production',
      status: 'success',
      branch: 'main',
      commit: 'a3f2b1c',
      url: 'https://jarvis-ultimate.vercel.app',
      startedAt: new Date(Date.now() - 3600000),
      duration: 45,
      progress: 100
    },
    {
      id: '2',
      environment: 'staging',
      status: 'success',
      branch: 'develop',
      commit: 'b4e3c2d',
      url: 'https://jarvis-staging.vercel.app',
      startedAt: new Date(Date.now() - 7200000),
      duration: 38,
      progress: 100
    }
  ]);

  const [deploying, setDeploying] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);

  const deployToEnvironment = (env: 'production' | 'staging' | 'development') => {
    const newDeployment: Deployment = {
      id: Date.now().toString(),
      environment: env,
      status: 'deploying',
      branch: env === 'production' ? 'main' : 'develop',
      commit: Math.random().toString(36).substring(7),
      url: `https://jarvis-${env}.vercel.app`,
      startedAt: new Date(),
      progress: 0
    };

    setDeployments(prev => [newDeployment, ...prev]);
    setDeploying(true);
    setBuildLogs([]);

    const logs = [
      'Cloning repository...',
      'Installing dependencies...',
      'Building application...',
      'Optimizing assets...',
      'Running tests...',
      'Deploying to edge network...',
      'Invalidating cache...',
      'Deployment complete!'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setBuildLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
        
        const progress = ((index + 1) / logs.length) * 100;
        setDeployments(prev => prev.map(d => 
          d.id === newDeployment.id ? { ...d, progress } : d
        ));

        if (index === logs.length - 1) {
          setDeployments(prev => prev.map(d => 
            d.id === newDeployment.id 
              ? { ...d, status: 'success', duration: Math.floor(Math.random() * 30 + 30) }
              : d
          ));
          setDeploying(false);
          toast.success(`Successfully deployed to ${env}!`, {
            description: `Live at ${newDeployment.url}`
          });
        }
      }, index * 1500);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deploying': return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'idle': return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deploying': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'success': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'failed': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'idle': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  const getEnvColor = (env: string) => {
    switch (env) {
      case 'production': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'staging': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'development': return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Deployment Controls */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Deployment Center
            </h3>
            <p className="text-xs text-cyan-600 mt-1">Deploy to global edge network</p>
          </div>
          <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
            <Server className="w-3 h-3 mr-1" />
            Online
          </Badge>
        </div>

        {/* Environment Cards */}
        <div className="space-y-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-purple-400">Production</h4>
                <p className="text-xs text-purple-600 mt-1">main branch</p>
              </div>
              <Globe className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex items-center justify-between">
              <code className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                https://jarvis-ultimate.vercel.app
              </code>
              <Button
                size="sm"
                onClick={() => deployToEnvironment('production')}
                disabled={deploying}
                className="bg-purple-500/20 border border-purple-500/50 text-purple-400"
              >
                <Rocket className="w-3 h-3 mr-1" />
                Deploy
              </Button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-yellow-400">Staging</h4>
                <p className="text-xs text-yellow-600 mt-1">develop branch</p>
              </div>
              <Server className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="flex items-center justify-between">
              <code className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">
                https://jarvis-staging.vercel.app
              </code>
              <Button
                size="sm"
                onClick={() => deployToEnvironment('staging')}
                disabled={deploying}
                className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400"
              >
                <Rocket className="w-3 h-3 mr-1" />
                Deploy
              </Button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border border-cyan-500/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-cyan-400">Development</h4>
                <p className="text-xs text-cyan-600 mt-1">feature branches</p>
              </div>
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="flex items-center justify-between">
              <code className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                https://jarvis-dev.vercel.app
              </code>
              <Button
                size="sm"
                onClick={() => deployToEnvironment('development')}
                disabled={deploying}
                className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
              >
                <Rocket className="w-3 h-3 mr-1" />
                Deploy
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Build Logs */}
        {buildLogs.length > 0 && (
          <div className="bg-black/60 border border-cyan-500/40 rounded-lg p-4">
            <h4 className="text-sm text-cyan-400 mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Build Logs
            </h4>
            <ScrollArea className="h-32">
              <div className="space-y-1 font-mono text-xs">
                {buildLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-green-400"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </Card>

      {/* Deployment History */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400">Deployment History</h3>
            <p className="text-xs text-cyan-600 mt-1">{deployments.length} total deployments</p>
          </div>
        </div>

        <ScrollArea className="h-[520px]">
          <div className="space-y-3">
            <AnimatePresence>
              {deployments.map((deployment) => (
                <motion.div
                  key={deployment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deployment.status)}
                      <Badge className={getEnvColor(deployment.environment)}>
                        {deployment.environment}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(deployment.status)}>
                      {deployment.status}
                    </Badge>
                  </div>

                  {deployment.status === 'deploying' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2 text-xs text-cyan-600">
                        <span>Progress</span>
                        <span>{deployment.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={deployment.progress} className="h-1.5" />
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-600">Branch:</span>
                      <code className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded text-xs">
                        {deployment.branch}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-600">Commit:</span>
                      <code className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded text-xs font-mono">
                        {deployment.commit}
                      </code>
                    </div>
                    {deployment.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-600">Duration:</span>
                        <span className="text-cyan-400 text-xs">{deployment.duration}s</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-cyan-500/20">
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      {deployment.url}
                    </a>
                  </div>

                  <div className="mt-2 text-xs text-cyan-600">
                    {deployment.startedAt.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

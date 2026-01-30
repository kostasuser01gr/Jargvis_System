import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Wifi, WifiOff, Battery, Cpu, HardDrive, 
  Activity, Signal, Zap, Shield, Satellite
} from 'lucide-react';
import { Badge } from './ui/badge';

export function LiveStatusBar() {
  const [status, setStatus] = useState({
    online: true,
    battery: 87,
    cpu: 45,
    memory: 67,
    network: 98,
    satellites: 4,
    threats: 0,
    uptime: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        battery: Math.max(0, Math.min(100, prev.battery + (Math.random() - 0.51) * 0.5)),
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(85, Math.min(100, prev.network + (Math.random() - 0.5) * 3)),
        uptime: prev.uptime + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-cyan-500/30"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {status.online ? (
                <Wifi className="w-3 h-3 text-green-400" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-400" />
              )}
              <span className="text-cyan-400 font-mono">{status.network}%</span>
            </div>

            <div className="h-4 w-px bg-cyan-500/30" />

            <div className="flex items-center gap-2">
              <Satellite className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400 font-mono">{status.satellites}/4</span>
            </div>

            <div className="h-4 w-px bg-cyan-500/30" />

            <div className="flex items-center gap-2">
              <Shield className={`w-3 h-3 ${status.threats > 0 ? 'text-red-400' : 'text-green-400'}`} />
              <span className={status.threats > 0 ? 'text-red-400' : 'text-green-400'}>
                {status.threats} Threats
              </span>
            </div>
          </div>

          {/* Center Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <div className="w-16 h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    status.cpu > 80 ? 'bg-red-400' :
                    status.cpu > 60 ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`}
                  animate={{ width: `${status.cpu}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-cyan-400 font-mono w-8">{status.cpu.toFixed(0)}%</span>
            </div>

            <div className="h-4 w-px bg-cyan-500/30" />

            <div className="flex items-center gap-2">
              <HardDrive className="w-3 h-3 text-cyan-400" />
              <div className="w-16 h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    status.memory > 80 ? 'bg-red-400' :
                    status.memory > 60 ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`}
                  animate={{ width: `${status.memory}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-cyan-400 font-mono w-8">{status.memory.toFixed(0)}%</span>
            </div>

            <div className="h-4 w-px bg-cyan-500/30" />

            <div className="flex items-center gap-2">
              <Battery className="w-3 h-3 text-cyan-400" />
              <div className="w-16 h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    status.battery < 20 ? 'bg-red-400' :
                    status.battery < 50 ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`}
                  animate={{ width: `${status.battery}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-cyan-400 font-mono w-8">{status.battery.toFixed(0)}%</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
              <Activity className="w-3 h-3 mr-1" />
              Uptime: {formatUptime(status.uptime)}
            </Badge>

            <div className="h-4 w-px bg-cyan-500/30" />

            <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
              <Zap className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

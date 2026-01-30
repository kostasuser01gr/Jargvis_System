import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, Target, Radar, Database } from 'lucide-react';

export function HolographicPanels() {
  const [rotation, setRotation] = useState(0);
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
      setDataPoints(Array.from({ length: 20 }, () => Math.random() * 100));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.9 }}
      className="space-y-4"
    >
      {/* 3D Globe Visualization */}
      <div className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h3 className="text-cyan-400 text-xs uppercase tracking-wider">Global Network</h3>
        </div>
        
        <div className="relative h-48 flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Globe Outline */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="rgba(34, 211, 238, 0.3)"
              strokeWidth="1"
            />
            
            {/* Latitude Lines */}
            {[-60, -30, 0, 30, 60].map((lat, i) => (
              <ellipse
                key={`lat-${i}`}
                cx="100"
                cy="100"
                rx="80"
                ry={Math.abs(Math.cos((lat * Math.PI) / 180) * 80)}
                fill="none"
                stroke="rgba(34, 211, 238, 0.2)"
                strokeWidth="0.5"
                transform={`translate(0, ${lat * 0.8})`}
              />
            ))}
            
            {/* Longitude Lines */}
            {[0, 30, 60, 90, 120, 150].map((lon, i) => (
              <motion.ellipse
                key={`lon-${i}`}
                cx="100"
                cy="100"
                rx={Math.abs(Math.cos((lon * Math.PI) / 180) * 80)}
                ry="80"
                fill="none"
                stroke="rgba(34, 211, 238, 0.2)"
                strokeWidth="0.5"
                animate={{ rotate: rotation }}
                transition={{ duration: 0.05 }}
                style={{ transformOrigin: 'center' }}
              />
            ))}

            {/* Connection Points */}
            {[
              { x: 100, y: 40 },
              { x: 140, y: 60 },
              { x: 160, y: 100 },
              { x: 140, y: 140 },
              { x: 60, y: 140 },
              { x: 40, y: 100 }
            ].map((point, i) => (
              <motion.circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="rgba(34, 211, 238, 0.8)"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Radar Scanner */}
      <div className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Radar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-cyan-400 text-xs uppercase tracking-wider">Proximity Scan</h3>
        </div>
        
        <div className="relative h-40 flex items-center justify-center">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Radar Circles */}
            {[30, 50, 70].map((r, i) => (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={r}
                fill="none"
                stroke="rgba(34, 211, 238, 0.2)"
                strokeWidth="1"
              />
            ))}
            
            {/* Cross Lines */}
            <line x1="80" y1="10" x2="80" y2="150" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" />
            <line x1="10" y1="80" x2="150" y2="80" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" />
            
            {/* Sweeping Line */}
            <motion.line
              x1="80"
              y1="80"
              x2="80"
              y2="10"
              stroke="rgba(34, 211, 238, 0.8)"
              strokeWidth="2"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '80px 80px' }}
            />
            
            {/* Sweep Gradient */}
            <motion.path
              d="M 80 80 L 80 10 A 70 70 0 0 1 150 80 Z"
              fill="url(#radar-gradient)"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '80px 80px' }}
            />
            
            <defs>
              <radialGradient id="radar-gradient">
                <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" />
                <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
              </radialGradient>
            </defs>

            {/* Target Blips */}
            {[
              { x: 110, y: 60, size: 2 },
              { x: 60, y: 100, size: 3 },
              { x: 120, y: 110, size: 2 }
            ].map((blip, i) => (
              <motion.circle
                key={i}
                cx={blip.x}
                cy={blip.y}
                r={blip.size}
                fill="rgba(34, 211, 238, 1)"
                animate={{
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Data Stream */}
      <div className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-cyan-400" />
          <h3 className="text-cyan-400 text-xs uppercase tracking-wider">Data Stream</h3>
        </div>
        
        <div className="h-32 relative overflow-hidden">
          <svg width="100%" height="128" className="overflow-visible">
            {/* Data Bars */}
            {dataPoints.map((value, i) => (
              <motion.rect
                key={i}
                x={i * 12}
                y={128 - value}
                width="8"
                height={value}
                fill={`rgba(34, 211, 238, ${0.3 + (value / 200)})`}
                initial={{ height: 0 }}
                animate={{ height: value }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Target Lock */}
      <div className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-cyan-400" />
          <h3 className="text-cyan-400 text-xs uppercase tracking-wider">Tracking Systems</h3>
        </div>
        
        <div className="space-y-2 text-xs font-mono">
          {[
            { id: 'TGT-001', distance: '2.4 km', status: 'LOCKED' },
            { id: 'TGT-002', distance: '5.1 km', status: 'TRACKING' },
            { id: 'TGT-003', distance: '8.9 km', status: 'SCANNING' }
          ].map((target, i) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 1.2 }}
              className="flex items-center justify-between p-2 bg-black/30 border border-cyan-500/20 rounded"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  target.status === 'LOCKED' ? 'bg-green-400' :
                  target.status === 'TRACKING' ? 'bg-yellow-400' : 'bg-cyan-400'
                } animate-pulse`} />
                <span className="text-cyan-400">{target.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cyan-600">{target.distance}</span>
                <span className={`text-xs ${
                  target.status === 'LOCKED' ? 'text-green-400' :
                  target.status === 'TRACKING' ? 'text-yellow-400' : 'text-cyan-400'
                }`}>
                  {target.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

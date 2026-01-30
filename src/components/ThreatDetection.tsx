import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, AlertTriangle, Eye, Crosshair, Target, Radio } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Threat {
  id: string;
  type: 'collision' | 'security' | 'weather' | 'traffic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { x: number; y: number };
  distance: number;
  description: string;
  timestamp: Date;
}

export function ThreatDetection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [scanAngle, setScanAngle] = useState(0);
  const [threatLevel, setThreatLevel] = useState<'safe' | 'caution' | 'danger'>('safe');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = 180;

    let angle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Radar circles
      for (let r = maxRadius; r > 0; r -= 60) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.2 * (1 - r / maxRadius)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Grid lines
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const lineAngle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(lineAngle) * maxRadius,
          centerY + Math.sin(lineAngle) * maxRadius
        );
        ctx.stroke();
      }

      // Scanning beam
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
      gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.1)');
      gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, angle - 0.3, angle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw threats
      threats.forEach(threat => {
        const threatX = threat.location.x * maxRadius + centerX;
        const threatY = threat.location.y * maxRadius + centerY;

        const severityColor = {
          low: 'rgba(34, 211, 238, 0.8)',
          medium: 'rgba(234, 179, 8, 0.8)',
          high: 'rgba(249, 115, 22, 0.8)',
          critical: 'rgba(239, 68, 68, 0.8)'
        }[threat.severity];

        // Pulsing circle
        const pulseSize = 8 + Math.sin(Date.now() / 200) * 3;
        ctx.beginPath();
        ctx.arc(threatX, threatY, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = severityColor;
        ctx.fill();

        // Outer ring
        ctx.beginPath();
        ctx.arc(threatX, threatY, pulseSize + 5, 0, Math.PI * 2);
        ctx.strokeStyle = severityColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Targeting reticle
        ctx.strokeStyle = severityColor;
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const reticleAngle = (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(
            threatX + Math.cos(reticleAngle) * 15,
            threatY + Math.sin(reticleAngle) * 15
          );
          ctx.lineTo(
            threatX + Math.cos(reticleAngle) * 20,
            threatY + Math.sin(reticleAngle) * 20
          );
          ctx.stroke();
        }
      });

      // Center indicator
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(34, 211, 238, 1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      angle += 0.05;
      setScanAngle(angle);
      requestAnimationFrame(animate);
    };

    animate();
  }, [threats]);

  useEffect(() => {
    // Generate random threats
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newThreat: Threat = {
          id: Date.now().toString(),
          type: ['collision', 'security', 'weather', 'traffic'][Math.floor(Math.random() * 4)] as any,
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          location: {
            x: (Math.random() - 0.5) * 1.6,
            y: (Math.random() - 0.5) * 1.6
          },
          distance: Math.random() * 500 + 50,
          description: 'Potential threat detected in sector',
          timestamp: new Date()
        };

        setThreats(prev => [...prev, newThreat].slice(-8));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const criticalCount = threats.filter(t => t.severity === 'critical').length;
    const highCount = threats.filter(t => t.severity === 'high').length;

    if (criticalCount > 0) {
      setThreatLevel('danger');
    } else if (highCount > 0 || threats.length > 5) {
      setThreatLevel('caution');
    } else {
      setThreatLevel('safe');
    }
  }, [threats]);

  const getThreatColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      case 'high': return 'text-orange-400 border-orange-500/50 bg-orange-500/10';
      case 'critical': return 'text-red-400 border-red-500/50 bg-red-500/10';
      default: return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
    }
  };

  const getThreatLevelColor = () => {
    switch (threatLevel) {
      case 'safe': return 'text-green-400 border-green-500/50';
      case 'caution': return 'text-yellow-400 border-yellow-500/50';
      case 'danger': return 'text-red-400 border-red-500/50';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-cyan-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Threat Detection System
          </h3>
          <p className="text-xs text-cyan-600 mt-1">360° Environmental Scanning</p>
        </div>
        <motion.div
          animate={{
            scale: threatLevel === 'danger' ? [1, 1.2, 1] : 1,
            opacity: threatLevel === 'danger' ? [1, 0.5, 1] : 1
          }}
          transition={{ duration: 1, repeat: threatLevel === 'danger' ? Infinity : 0 }}
        >
          <Badge className={`${getThreatLevelColor()} uppercase`}>
            {threatLevel}
          </Badge>
        </motion.div>
      </div>

      {/* Radar Display */}
      <div className="relative mb-4">
        <div className="bg-black/60 rounded-lg p-4 flex justify-center">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>

        {/* Scanning indicator */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/80 border border-cyan-500/30 rounded px-3 py-1.5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Radio className="w-3 h-3 text-cyan-400" />
          </motion.div>
          <span className="text-xs text-cyan-400 font-mono">SCANNING</span>
        </div>
      </div>

      {/* Threat List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {threats.slice(-4).reverse().map((threat, index) => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-black/40 border border-cyan-500/20 rounded p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400 font-mono">{threat.id.slice(-6)}</span>
                </div>
                <Badge className={`${getThreatColor(threat.severity)} text-xs uppercase`}>
                  {threat.severity}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-cyan-600">Type: </span>
                  <span className="text-cyan-400 capitalize">{threat.type}</span>
                </div>
                <div>
                  <span className="text-cyan-600">Distance: </span>
                  <span className="text-cyan-400 font-mono">{threat.distance.toFixed(0)}m</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-cyan-500/20 grid grid-cols-3 gap-3 text-xs">
        <div className="text-center">
          <div className="text-cyan-600 mb-1">Active Scans</div>
          <div className="text-cyan-400 font-mono">∞</div>
        </div>
        <div className="text-center">
          <div className="text-cyan-600 mb-1">Detected</div>
          <div className="text-cyan-400 font-mono">{threats.length}</div>
        </div>
        <div className="text-center">
          <div className="text-cyan-600 mb-1">Range</div>
          <div className="text-cyan-400 font-mono">500m</div>
        </div>
      </div>
    </Card>
  );
}

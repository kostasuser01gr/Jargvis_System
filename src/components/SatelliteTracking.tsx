import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Satellite, Radio, MapPin, Signal } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface SatelliteData {
  id: string;
  name: string;
  angle: number;
  distance: number;
  signal: number;
  active: boolean;
}

export function SatelliteTracking() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [satellites, setSatellites] = useState<SatelliteData[]>([
    { id: 'SAT-01', name: 'GPS Alpha', angle: 0, distance: 100, signal: 95, active: true },
    { id: 'SAT-02', name: 'GPS Beta', angle: 2, distance: 120, signal: 88, active: true },
    { id: 'SAT-03', name: 'GPS Gamma', angle: 4, distance: 110, signal: 92, active: true },
    { id: 'SAT-04', name: 'GPS Delta', angle: 1, distance: 130, signal: 78, active: false }
  ]);
  const [connectedSats, setConnectedSats] = useState(3);
  const [accuracy, setAccuracy] = useState(98);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const earthRadius = 50;
    const orbitRadius = 150;

    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Space background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (let i = 0; i < 50; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 197.3) % canvas.height;
        const brightness = (Math.sin(frame * 0.05 + i) + 1) / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.5})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // Earth
      const earthGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, earthRadius);
      earthGradient.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
      earthGradient.addColorStop(0.7, 'rgba(34, 211, 238, 0.2)');
      earthGradient.addColorStop(1, 'rgba(34, 211, 238, 0.5)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fillStyle = earthGradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Grid lines on Earth
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * earthRadius,
          centerY + Math.sin(angle) * earthRadius
        );
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Orbit paths
      for (let r = orbitRadius - 20; r <= orbitRadius + 20; r += 20) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw satellites
      satellites.forEach((sat, index) => {
        const satAngle = sat.angle + frame * 0.01;
        const satX = centerX + Math.cos(satAngle) * orbitRadius;
        const satY = centerY + Math.sin(satAngle) * orbitRadius;

        // Connection line to Earth
        if (sat.active) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(satX, satY);
          ctx.strokeStyle = `rgba(34, 211, 238, ${sat.signal / 200})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Satellite
        ctx.beginPath();
        ctx.arc(satX, satY, 6, 0, Math.PI * 2);
        ctx.fillStyle = sat.active ? 'rgba(34, 211, 238, 0.9)' : 'rgba(100, 100, 100, 0.5)';
        ctx.fill();
        ctx.strokeStyle = sat.active ? 'rgba(34, 211, 238, 1)' : 'rgba(100, 100, 100, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Signal pulse
        if (sat.active) {
          const pulseSize = 10 + Math.sin(frame * 0.1 + index) * 5;
          ctx.beginPath();
          ctx.arc(satX, satY, pulseSize, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.3 - (pulseSize - 10) / 50})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Solar panels
        ctx.strokeStyle = sat.active ? 'rgba(251, 191, 36, 0.8)' : 'rgba(100, 100, 100, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(satX - 12, satY);
        ctx.lineTo(satX - 8, satY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(satX + 8, satY);
        ctx.lineTo(satX + 12, satY);
        ctx.stroke();

        // Label
        ctx.fillStyle = sat.active ? 'rgba(34, 211, 238, 0.9)' : 'rgba(100, 100, 100, 0.7)';
        ctx.font = '9px monospace';
        ctx.fillText(sat.id, satX + 10, satY - 10);
      });

      frame++;
      requestAnimationFrame(animate);
    };

    animate();

    // Update satellite data
    const interval = setInterval(() => {
      setSatellites(prev => prev.map(sat => ({
        ...sat,
        signal: sat.active ? Math.max(70, Math.min(100, sat.signal + (Math.random() - 0.5) * 10)) : 0,
        angle: sat.angle + 0.1
      })));

      const activeSats = satellites.filter(s => s.active).length;
      setConnectedSats(activeSats);
      setAccuracy(activeSats > 0 ? 85 + activeSats * 3 : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [satellites]);

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-cyan-400 flex items-center gap-2">
            <Satellite className="w-5 h-5" />
            Satellite Tracking System
          </h3>
          <p className="text-xs text-cyan-600 mt-1">Real-time GPS constellation</p>
        </div>
        <Badge className="bg-cyan-500/20 border-cyan-500/50 text-cyan-400">
          {connectedSats}/{satellites.length} Connected
        </Badge>
      </div>

      <div className="bg-black/60 rounded-lg border border-cyan-500/20 p-4 mb-4">
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Signal className="w-3 h-3 text-cyan-400" />
            <span className="text-xs text-cyan-600">Accuracy</span>
          </div>
          <div className="text-xl text-cyan-400 font-mono">{accuracy}%</div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-600">Signal</span>
          </div>
          <div className="text-xl text-green-400 font-mono">Strong</div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-600">Position</span>
          </div>
          <div className="text-xl text-blue-400 font-mono">Lock</div>
        </div>
      </div>

      {/* Satellite List */}
      <div className="space-y-2">
        {satellites.map(sat => (
          <div
            key={sat.id}
            className="flex items-center justify-between bg-black/40 border border-cyan-500/20 rounded p-2 text-xs"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${sat.active ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-cyan-400 font-mono">{sat.id}</span>
              <span className="text-cyan-600">{sat.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-cyan-600">{sat.signal}%</span>
              <Badge className={sat.active ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-gray-500/20 border-gray-500/50 text-gray-400'}>
                {sat.active ? 'Active' : 'Offline'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

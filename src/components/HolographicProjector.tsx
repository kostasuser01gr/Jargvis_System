import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Scan, Layers } from 'lucide-react';
import { Card } from './ui/card';

export function HolographicProjector() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedObjects, setDetectedObjects] = useState<Array<{ x: number; y: number; type: string }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 400;

    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Holographic grid
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Scanning beam
      const scanY = (Math.sin(frame * 0.02) * 0.5 + 0.5) * canvas.height;
      const scanGradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGradient.addColorStop(0, 'rgba(34, 211, 238, 0)');
      scanGradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.5)');
      scanGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
      
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 30, canvas.width, 60);

      // Draw detected objects
      detectedObjects.forEach((obj, i) => {
        const pulseSize = 20 + Math.sin(frame * 0.1 + i) * 5;
        
        // Outer ring
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, pulseSize, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 1)';
        ctx.fill();

        // Targeting lines
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(obj.x - 30, obj.y);
        ctx.lineTo(obj.x + 30, obj.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(obj.x, obj.y - 30);
        ctx.lineTo(obj.x, obj.y + 30);
        ctx.stroke();

        // Label
        ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
        ctx.font = '10px monospace';
        ctx.fillText(obj.type, obj.x + 25, obj.y - 25);
      });

      // 3D wireframe object (rotating cube)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = 60;
      const rotX = frame * 0.02;
      const rotY = frame * 0.03;

      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ];

      const rotatedVertices = vertices.map(([x, y, z]) => {
        // Rotate around Y
        let tempX = x * Math.cos(rotY) - z * Math.sin(rotY);
        let tempZ = x * Math.sin(rotY) + z * Math.cos(rotY);
        
        // Rotate around X
        let tempY = y * Math.cos(rotX) - tempZ * Math.sin(rotX);
        tempZ = y * Math.sin(rotX) + tempZ * Math.cos(rotX);

        return {
          x: centerX + tempX * size,
          y: centerY + tempY * size,
          z: tempZ
        };
      });

      // Draw edges
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 2;
      edges.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(rotatedVertices[start].x, rotatedVertices[start].y);
        ctx.lineTo(rotatedVertices[end].x, rotatedVertices[end].y);
        ctx.stroke();
      });

      frame++;
      setScanProgress((frame % 100) / 100);
      requestAnimationFrame(animate);
    };

    animate();

    // Simulate object detection
    const detectionInterval = setInterval(() => {
      if (detectedObjects.length < 5) {
        setDetectedObjects(prev => [...prev, {
          x: Math.random() * (canvas.width - 100) + 50,
          y: Math.random() * (canvas.height - 100) + 50,
          type: ['TARGET', 'ENTITY', 'OBJECT', 'SIGNAL'][Math.floor(Math.random() * 4)]
        }]);
      } else {
        setDetectedObjects([]);
      }
    }, 3000);

    return () => {
      clearInterval(detectionInterval);
    };
  }, [detectedObjects.length]);

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-400 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Holographic Scanner
        </h3>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Scan className="w-4 h-4 text-cyan-400" />
        </motion.div>
      </div>

      <div className="relative">
        <div className="bg-black/60 rounded-lg p-4 border border-cyan-500/20">
          <canvas ref={canvasRef} className="w-full h-auto" />
        </div>

        {/* Scan overlay */}
        <div className="absolute top-6 right-6 bg-black/80 border border-cyan-500/30 rounded px-3 py-2">
          <div className="text-xs text-cyan-400 mb-1">Scan Progress</div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1 bg-cyan-950/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyan-400"
                style={{ width: `${scanProgress * 100}%` }}
              />
            </div>
            <span className="text-xs text-cyan-400 font-mono">
              {(scanProgress * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <div className="bg-cyan-950/20 border border-cyan-500/20 rounded p-2">
          <div className="text-cyan-600 mb-1">Detected</div>
          <div className="text-cyan-400 font-mono">{detectedObjects.length}</div>
        </div>
        <div className="bg-cyan-950/20 border border-cyan-500/20 rounded p-2">
          <div className="text-cyan-600 mb-1">Resolution</div>
          <div className="text-cyan-400 font-mono">1920x1080</div>
        </div>
        <div className="bg-cyan-950/20 border border-cyan-500/20 rounded p-2">
          <div className="text-cyan-600 mb-1">FPS</div>
          <div className="text-cyan-400 font-mono">60</div>
        </div>
      </div>
    </Card>
  );
}

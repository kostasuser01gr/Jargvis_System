import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap } from 'lucide-react';
import { Card } from './ui/card';

export function QuantumProcessor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qubits, setQubits] = useState(8);
  const [entanglement, setEntanglement] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    let rotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw quantum field
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.1)');
      gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.05)');
      gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw qubits
      for (let i = 0; i < qubits; i++) {
        const angle = (i / qubits) * Math.PI * 2 + rotation;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Qubit orbit
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle - 0.1, angle + 0.1);
        ctx.strokeStyle = `rgba(34, 211, 238, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Qubit
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(34, 211, 238, 1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner glow
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // Entanglement lines
        for (let j = i + 1; j < qubits; j++) {
          const angle2 = (j / qubits) * Math.PI * 2 + rotation;
          const x2 = centerX + Math.cos(angle2) * radius;
          const y2 = centerY + Math.sin(angle2) * radius;

          if (Math.random() > 0.7) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 + Math.random() * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Center core
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
      coreGradient.addColorStop(0, 'rgba(34, 211, 238, 0.8)');
      coreGradient.addColorStop(1, 'rgba(34, 211, 238, 0.2)');
      ctx.fillStyle = coreGradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(34, 211, 238, 1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      rotation += 0.01;
      requestAnimationFrame(animate);
    };

    animate();

    // Update entanglement
    const entanglementInterval = setInterval(() => {
      setEntanglement(Math.random());
    }, 1000);

    return () => clearInterval(entanglementInterval);
  }, [qubits]);

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-400 flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Quantum Processor
        </h3>
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
          className="flex items-center gap-1 text-cyan-400"
        >
          <Zap className="w-3 h-3" />
          <span className="text-xs">Processing</span>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-cyan-600">Qubits</span>
          <span className="text-cyan-400 font-mono">{qubits}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cyan-600">Entanglement</span>
          <span className="text-cyan-400 font-mono">{(entanglement * 100).toFixed(1)}%</span>
        </div>
        <div className="h-1 bg-cyan-950/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-400"
            animate={{ width: `${entanglement * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </Card>
  );
}

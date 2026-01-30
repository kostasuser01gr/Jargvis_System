import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Eye, Shield, CheckCircle, XCircle, Scan } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

export function BiometricScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanType, setScanType] = useState<'fingerprint' | 'retina' | 'face'>('fingerprint');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);
  const [biometricData, setBiometricData] = useState({
    heartRate: 72,
    temperature: 98.6,
    bloodPressure: '120/80',
    oxygenLevel: 98
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    let frame = 0;

    const drawFingerprint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Fingerprint ridges
      for (let i = 0; i < 8; i++) {
        const radius = 20 + i * 15;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.8 - i * 0.1})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add irregularities for realistic effect
        for (let angle = 0; angle < Math.PI * 2; angle += 0.5) {
          const offset = Math.sin(angle * 3 + i) * 5;
          const x = centerX + Math.cos(angle) * (radius + offset);
          const y = centerY + Math.sin(angle) * (radius + offset);
          
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34, 211, 238, 0.3)';
          ctx.fill();
        }
      }

      // Scanning line
      if (scanning) {
        const scanY = (Math.sin(frame * 0.1) * 0.5 + 0.5) * canvas.height;
        const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
        gradient.addColorStop(0, 'rgba(34, 211, 238, 0)');
        gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.6)');
        gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanY - 20, canvas.width, 40);
      }

      // Grid overlay
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Center reticle
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * 10,
          centerY + Math.sin(angle) * 10
        );
        ctx.lineTo(
          centerX + Math.cos(angle) * 25,
          centerY + Math.sin(angle) * 25
        );
        ctx.stroke();
      }

      frame++;
      requestAnimationFrame(drawFingerprint);
    };

    drawFingerprint();
  }, [scanning]);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setScanning(false);
            setAuthenticated(true);
            setTimeout(() => {
              setAuthenticated(false);
              setScanProgress(0);
            }, 3000);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [scanning]);

  useEffect(() => {
    // Update biometric data
    const interval = setInterval(() => {
      setBiometricData({
        heartRate: 70 + Math.floor(Math.random() * 10),
        temperature: 98.4 + Math.random() * 0.4,
        bloodPressure: `${118 + Math.floor(Math.random() * 5)}/${78 + Math.floor(Math.random() * 5)}`,
        oxygenLevel: 97 + Math.floor(Math.random() * 3)
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const startScan = () => {
    setScanning(true);
    setScanProgress(0);
    setAuthenticated(false);
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-cyan-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Biometric Authentication
          </h3>
          <p className="text-xs text-cyan-600 mt-1">Multi-factor security scanning</p>
        </div>
        <AnimatePresence>
          {authenticated && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-1.5"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400">Authenticated</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scan Type Selector */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant="outline"
          className={`flex-1 ${scanType === 'fingerprint' ? 'bg-cyan-500/20 border-cyan-500' : 'border-cyan-500/30'} text-cyan-400`}
          onClick={() => setScanType('fingerprint')}
        >
          <Fingerprint className="w-4 h-4 mr-2" />
          Fingerprint
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={`flex-1 ${scanType === 'retina' ? 'bg-cyan-500/20 border-cyan-500' : 'border-cyan-500/30'} text-cyan-400`}
          onClick={() => setScanType('retina')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Retina
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={`flex-1 ${scanType === 'face' ? 'bg-cyan-500/20 border-cyan-500' : 'border-cyan-500/30'} text-cyan-400`}
          onClick={() => setScanType('face')}
        >
          <Scan className="w-4 h-4 mr-2" />
          Face
        </Button>
      </div>

      {/* Scanner Display */}
      <div className="relative mb-4">
        <div className="bg-black/60 rounded-lg border border-cyan-500/20 p-4 flex justify-center">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>

        {/* Scan Status Overlay */}
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-4 right-4 bg-black/80 border border-cyan-500/30 rounded p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-cyan-400">Scanning...</span>
              <span className="text-xs text-cyan-400 font-mono">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-1" />
          </motion.div>
        )}
      </div>

      {/* Scan Button */}
      <Button
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white mb-4"
        onClick={startScan}
        disabled={scanning}
      >
        {scanning ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Scan className="w-4 h-4 mr-2" />
            </motion.div>
            Scanning...
          </>
        ) : (
          <>
            <Scan className="w-4 h-4 mr-2" />
            Start Scan
          </>
        )}
      </Button>

      {/* Biometric Data */}
      <div className="space-y-2">
        <h4 className="text-sm text-cyan-400 mb-3">Vital Signs</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/40 border border-cyan-500/20 rounded p-3">
            <div className="text-xs text-cyan-600 mb-1">Heart Rate</div>
            <div className="text-lg text-cyan-400 font-mono">{biometricData.heartRate} BPM</div>
          </div>

          <div className="bg-black/40 border border-cyan-500/20 rounded p-3">
            <div className="text-xs text-cyan-600 mb-1">Temperature</div>
            <div className="text-lg text-cyan-400 font-mono">{biometricData.temperature.toFixed(1)}°F</div>
          </div>

          <div className="bg-black/40 border border-cyan-500/20 rounded p-3">
            <div className="text-xs text-cyan-600 mb-1">Blood Pressure</div>
            <div className="text-lg text-cyan-400 font-mono">{biometricData.bloodPressure}</div>
          </div>

          <div className="bg-black/40 border border-cyan-500/20 rounded p-3">
            <div className="text-xs text-cyan-600 mb-1">O₂ Level</div>
            <div className="text-lg text-cyan-400 font-mono">{biometricData.oxygenLevel}%</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

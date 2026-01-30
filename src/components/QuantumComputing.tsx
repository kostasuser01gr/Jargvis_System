import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Activity, TrendingUp, RefreshCw, Play, Pause, RotateCcw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface QuantumBit {
  id: number;
  state: number;
  entangled: boolean;
  coherence: number;
}

export function QuantumComputing() {
  const [qubits, setQubits] = useState<QuantumBit[]>(
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      state: Math.random(),
      entangled: Math.random() > 0.5,
      coherence: 95 + Math.random() * 5
    }))
  );

  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState<string>('shor');
  const [iterations, setIterations] = useState(0);
  const [quantumAdvantage, setQuantumAdvantage] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setQubits(prev => prev.map(q => ({
          ...q,
          state: (q.state + Math.random() * 0.1) % 1,
          coherence: Math.max(90, q.coherence - Math.random() * 0.5)
        })));
        setIterations(i => i + 1);
        setQuantumAdvantage(qa => Math.min(100, qa + Math.random() * 2));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const startComputation = () => {
    setIsRunning(true);
    toast.success(`Started ${algorithm.toUpperCase()} algorithm`);
  };

  const pauseComputation = () => {
    setIsRunning(false);
    toast.info('Quantum computation paused');
  };

  const resetComputation = () => {
    setIsRunning(false);
    setIterations(0);
    setQuantumAdvantage(0);
    setQubits(qubits.map(q => ({ ...q, state: Math.random(), coherence: 100 })));
    toast.success('Quantum state reset');
  };

  const getAlgorithmName = (alg: string) => {
    const names: Record<string, string> = {
      shor: "Shor's Factorization",
      grover: "Grover's Search",
      qaoa: 'QAOA Optimization',
      vqe: 'VQE Energy',
      qft: 'Quantum Fourier Transform'
    };
    return names[alg] || alg;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-950/40 to-pink-950/40 border-purple-500/40 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Cpu className="w-8 h-8 text-purple-400" />
              <motion.div
                className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h2 className="text-purple-400">Quantum Computing Core</h2>
              <p className="text-xs text-purple-600">16-Qubit Quantum Processor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-purple-500/20 border-purple-500/50 text-purple-400">
              <Activity className="w-3 h-3 mr-1" />
              {qubits.filter(q => q.entangled).length} Entangled
            </Badge>
            <Badge className="bg-pink-500/20 border-pink-500/50 text-pink-400">
              <Zap className="w-3 h-3 mr-1" />
              {quantumAdvantage.toFixed(1)}% Advantage
            </Badge>
          </div>
        </div>

        {/* Quantum State Visualization */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {qubits.map((qubit) => (
            <motion.div
              key={qubit.id}
              className="relative aspect-square"
              animate={{
                rotateY: qubit.state * 360,
                scale: qubit.entangled ? 1.05 : 1
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={`absolute inset-0 rounded-lg ${
                qubit.entangled 
                  ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500/50' 
                  : 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20'
              } backdrop-blur-sm flex items-center justify-center`}>
                <div className="text-center">
                  <div className="text-purple-300 text-sm mb-1">Q{qubit.id}</div>
                  <div className="text-xs text-purple-600">
                    {(qubit.state * 100).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-purple-700 mt-1">
                    C: {qubit.coherence.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Entanglement lines */}
              {qubit.entangled && (
                <motion.div
                  className="absolute inset-0 border-2 border-pink-500 rounded-lg"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-purple-600 mb-2 block">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full bg-black/60 border border-purple-500/40 rounded px-3 py-2 text-purple-300 text-sm"
            >
              <option value="shor">Shor's Factorization</option>
              <option value="grover">Grover's Search</option>
              <option value="qaoa">QAOA Optimization</option>
              <option value="vqe">VQE Energy</option>
              <option value="qft">QFT</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-purple-600 mb-2 block">Iterations</label>
            <div className="bg-black/60 border border-purple-500/40 rounded px-3 py-2 text-purple-300 font-mono text-sm">
              {iterations.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="text-xs text-purple-600 mb-2 block">Avg Coherence</label>
            <div className="bg-black/60 border border-purple-500/40 rounded px-3 py-2 text-purple-300 font-mono text-sm">
              {(qubits.reduce((sum, q) => sum + q.coherence, 0) / qubits.length).toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {!isRunning ? (
            <Button
              onClick={startComputation}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Computation
            </Button>
          ) : (
            <Button
              onClick={pauseComputation}
              className="flex-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={resetComputation}
            variant="outline"
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Tabs for detailed info */}
      <Tabs defaultValue="gates" className="w-full">
        <TabsList className="bg-black/40 border border-purple-500/30">
          <TabsTrigger value="gates" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            Quantum Gates
          </TabsTrigger>
          <TabsTrigger value="circuits" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            Circuits
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gates" className="mt-4">
          <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
            <h3 className="text-purple-400 mb-4">Available Quantum Gates</h3>
            <div className="grid grid-cols-4 gap-3">
              {['H', 'X', 'Y', 'Z', 'CNOT', 'SWAP', 'T', 'S'].map((gate) => (
                <motion.div
                  key={gate}
                  whileHover={{ scale: 1.05 }}
                  className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-500/20 transition-colors"
                >
                  <div className="text-purple-300 font-mono">{gate}</div>
                  <div className="text-xs text-purple-600 mt-1">Gate</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="circuits" className="mt-4">
          <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
            <h3 className="text-purple-400 mb-4">Quantum Circuit</h3>
            <div className="space-y-2">
              {qubits.slice(0, 8).map((qubit) => (
                <div key={qubit.id} className="flex items-center gap-2">
                  <div className="w-12 text-xs text-purple-600">Q{qubit.id}</div>
                  <div className="flex-1 h-1 bg-purple-500/20 rounded relative">
                    <motion.div
                      className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded"
                      style={{ width: `${qubit.state * 100}%` }}
                      animate={{ width: `${qubit.state * 100}%` }}
                    />
                  </div>
                  <div className="w-16 text-xs text-purple-400 text-right font-mono">
                    {(qubit.state * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Fidelity', value: '99.2%', trend: '+0.3%' },
              { label: 'Gate Error', value: '0.08%', trend: '-0.02%' },
              { label: 'Readout Error', value: '1.2%', trend: '-0.1%' }
            ].map((metric, i) => (
              <Card key={i} className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-4">
                <div className="text-xs text-purple-600 mb-2">{metric.label}</div>
                <div className="text-2xl text-purple-400 font-mono mb-1">{metric.value}</div>
                <div className={`text-xs ${metric.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.trend} from baseline
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

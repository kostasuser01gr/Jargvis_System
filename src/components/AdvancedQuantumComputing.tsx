import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Network, Layers, Target, TrendingUp, Settings, Play, Pause, RotateCcw, CircuitBoard, Shield, Brain, Atom } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface QuantumBit {
  id: number;
  state: [number, number]; // [|0⟩ amplitude, |1⟩ amplitude]
  phase: number;
  entangled: number[]; // IDs of entangled qubits
  coherence: number;
  errorRate: number;
  t1: number; // Relaxation time
  t2: number; // Dephasing time
}

interface QuantumGate {
  id: string;
  type: 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'SWAP' | 'T' | 'S' | 'RX' | 'RY' | 'RZ' | 'CCX' | 'CZ' | 'CY';
  qubits: number[];
  params?: number[];
  layer: number;
}

interface QuantumCircuit {
  gates: QuantumGate[];
  depth: number;
  qubits: number;
  fidelity: number;
}

interface QuantumAlgorithm {
  id: string;
  name: string;
  description: string;
  qubits: number;
  depth: number;
  speedup: number;
  category: 'optimization' | 'ml' | 'crypto' | 'chemistry' | 'finance';
}

export function AdvancedQuantumComputing() {
  const [qubitCount, setQubitCount] = useState(64);
  const [qubits, setQubits] = useState<QuantumBit[]>([]);
  const [circuit, setCircuit] = useState<QuantumCircuit>({ gates: [], depth: 0, qubits: 64, fidelity: 99.2 });
  const [isRunning, setIsRunning] = useState(false);
  const [quantumAdvantage, setQuantumAdvantage] = useState(0);
  const [fidelity, setFidelity] = useState(99.2);
  const [errorCorrection, setErrorCorrection] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<QuantumAlgorithm | null>(null);
  const [gateFidelity, setGateFidelity] = useState(99.2);
  const [readoutError, setReadoutError] = useState(1.2);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const algorithms: QuantumAlgorithm[] = [
    {
      id: 'shor',
      name: "Shor's Factorization",
      description: 'Factor large numbers exponentially faster',
      qubits: 20,
      depth: 150,
      speedup: 1000000,
      category: 'crypto'
    },
    {
      id: 'grover',
      name: "Grover's Search",
      description: 'Quadratic speedup for unstructured search',
      qubits: 16,
      depth: 50,
      speedup: 1000,
      category: 'optimization'
    },
    {
      id: 'vqe',
      name: 'Variational Quantum Eigensolver',
      description: 'Find ground states of molecules',
      qubits: 12,
      depth: 200,
      speedup: 100,
      category: 'chemistry'
    },
    {
      id: 'qaoa',
      name: 'Quantum Approximate Optimization',
      description: 'Solve combinatorial optimization problems',
      qubits: 20,
      depth: 100,
      speedup: 10000,
      category: 'optimization'
    },
    {
      id: 'qml',
      name: 'Quantum Machine Learning',
      description: 'Quantum neural networks for pattern recognition',
      qubits: 16,
      depth: 80,
      speedup: 1000,
      category: 'ml'
    },
    {
      id: 'qgan',
      name: 'Quantum GAN',
      description: 'Generate quantum data distributions',
      qubits: 12,
      depth: 120,
      speedup: 500,
      category: 'ml'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Optimization',
      description: 'Optimize investment portfolios',
      qubits: 20,
      depth: 90,
      speedup: 5000,
      category: 'finance'
    }
  ];

  useEffect(() => {
    // Initialize qubits
    const newQubits: QuantumBit[] = Array.from({ length: qubitCount }, (_, i) => ({
      id: i,
      state: [1, 0], // Start in |0⟩ state
      phase: 0,
      entangled: [],
      coherence: 95 + Math.random() * 5,
      errorRate: 0.08,
      t1: 100 + Math.random() * 50, // microseconds
      t2: 50 + Math.random() * 30
    }));
    setQubits(newQubits);
    setCircuit(prev => ({ ...prev, qubits: qubitCount }));
  }, [qubitCount]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setQubits(prev => prev.map(q => ({
          ...q,
          coherence: Math.max(85, q.coherence - Math.random() * 0.1),
          errorRate: errorCorrection 
            ? Math.min(0.5, q.errorRate - Math.random() * 0.01)
            : Math.min(0.5, q.errorRate + Math.random() * 0.01),
          t1: Math.max(50, q.t1 - Math.random() * 0.1),
          t2: Math.max(20, q.t2 - Math.random() * 0.05)
        })));
        setQuantumAdvantage(prev => Math.min(100, prev + Math.random() * 0.5));
        setFidelity(prev => {
          const newFidelity = errorCorrection
            ? Math.min(99.9, prev + Math.random() * 0.01)
            : Math.max(90, prev - Math.random() * 0.05);
          setCircuit(prev => ({ ...prev, fidelity: newFidelity }));
          return newFidelity;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning, errorCorrection]);

  const applyGate = (gateType: QuantumGate['type'], qubitIndices: number[], params?: number[]) => {
    const newGate: QuantumGate = {
      id: `gate-${Date.now()}`,
      type: gateType,
      qubits: qubitIndices,
      params,
      layer: circuit.depth + 1
    };
    
    setCircuit(prev => ({
      ...prev,
      gates: [...prev.gates, newGate],
      depth: Math.max(prev.depth, newGate.layer)
    }));
    
    toast.success(`Applied ${gateType} gate to qubits ${qubitIndices.join(', ')}`);
  };

  const loadAlgorithm = (algorithm: QuantumAlgorithm) => {
    setSelectedAlgorithm(algorithm);
    setQubitCount(algorithm.qubits);
    setCircuit({
      gates: [],
      depth: 0,
      qubits: algorithm.qubits,
      fidelity: 99.2
    });
    toast.success(`Loaded ${algorithm.name}`);
  };

  const runAlgorithm = () => {
    if (!selectedAlgorithm) {
      toast.error('Please select an algorithm first');
      return;
    }
    setIsRunning(true);
    toast.info(`Running ${selectedAlgorithm.name}...`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'optimization': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'ml': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'crypto': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'chemistry': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'finance': return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-purple-400 flex items-center gap-2">
              <Atom className="w-6 h-5" />
              Advanced Quantum Computing (64+ Qubits)
            </h3>
            <p className="text-xs text-purple-600 mt-1">Scalable quantum processor with error correction and advanced algorithms</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              disabled={!selectedAlgorithm}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? 'Pause' : 'Run Algorithm'}
            </Button>
            <Button
              onClick={() => {
                setIsRunning(false);
                setCircuit({ gates: [], depth: 0, qubits: qubitCount, fidelity: 99.2 });
                setQuantumAdvantage(0);
              }}
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Qubit Count Control */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-purple-400">Qubit Count: {qubitCount}</label>
            <Badge className={
              qubitCount >= 64 ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' :
              qubitCount >= 32 ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
              'bg-green-500/20 border-green-500/50 text-green-400'
            }>
              {qubitCount >= 64 ? 'Large Scale' : qubitCount >= 32 ? 'Medium Scale' : 'Small Scale'}
            </Badge>
          </div>
          <Slider
            value={[qubitCount]}
            onValueChange={([value]) => setQubitCount(value)}
            min={16}
            max={128}
            step={8}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-purple-600 mt-1">
            <span>16</span>
            <span>32</span>
            <span>64</span>
            <span>96</span>
            <span>128</span>
          </div>
        </div>

        {/* Quantum Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Qubits', value: qubitCount, icon: Network, color: 'text-purple-400' },
            { label: 'Fidelity', value: `${fidelity.toFixed(2)}%`, icon: Target, color: 'text-green-400' },
            { label: 'Quantum Advantage', value: `${quantumAdvantage.toFixed(1)}%`, icon: TrendingUp, color: 'text-cyan-400' },
            { label: 'Error Rate', value: `${qubits[0]?.errorRate.toFixed(3) || 0}%`, icon: Zap, color: 'text-yellow-400' },
          ].map((metric, i) => (
            <Card key={i} className="bg-black/40 border-purple-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                <p className={`text-lg font-mono ${metric.color}`}>{metric.value}</p>
              </div>
              <p className="text-xs text-purple-600">{metric.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="algorithms" className="w-full">
        <TabsList className="bg-black/40 border-purple-500/30">
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="circuit">Circuit Builder</TabsTrigger>
          <TabsTrigger value="error-correction">Error Correction</TabsTrigger>
          <TabsTrigger value="visualization">3D Visualization</TabsTrigger>
          <TabsTrigger value="hardware">Hardware Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="algorithms" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {algorithms.map((algorithm) => (
              <Card
                key={algorithm.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedAlgorithm?.id === algorithm.id
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-black/40 border-purple-500/30 hover:border-purple-500/40'
                }`}
                onClick={() => loadAlgorithm(algorithm)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-purple-400 mb-1">{algorithm.name}</h4>
                    <p className="text-xs text-purple-600 mb-2">{algorithm.description}</p>
                  </div>
                  <Badge className={getCategoryColor(algorithm.category)}>
                    {algorithm.category}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-purple-600">Qubits:</span>
                    <div className="text-purple-400 font-mono">{algorithm.qubits}</div>
                  </div>
                  <div>
                    <span className="text-purple-600">Depth:</span>
                    <div className="text-purple-400 font-mono">{algorithm.depth}</div>
                  </div>
                  <div>
                    <span className="text-purple-600">Speedup:</span>
                    <div className="text-purple-400 font-mono">{algorithm.speedup.toLocaleString()}x</div>
                  </div>
                </div>
                {selectedAlgorithm?.id === algorithm.id && (
                  <Button
                    onClick={runAlgorithm}
                    className="w-full mt-3 bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Algorithm
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="circuit" className="mt-6">
          <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-purple-400">Quantum Circuit Builder</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600">Depth: {circuit.depth}</span>
                <span className="text-sm text-purple-600">Gates: {circuit.gates.length}</span>
              </div>
            </div>

            {/* Gate Palette */}
            <div className="mb-4">
              <h5 className="text-purple-400 mb-2 text-sm">Single Qubit Gates</h5>
              <div className="grid grid-cols-6 gap-2">
                {['H', 'X', 'Y', 'Z', 'T', 'S'].map((gate) => (
                  <Button
                    key={gate}
                    onClick={() => applyGate(gate as any, [0])}
                    className="bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
                    size="sm"
                  >
                    {gate}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-purple-400 mb-2 text-sm">Two Qubit Gates</h5>
              <div className="grid grid-cols-4 gap-2">
                {['CNOT', 'CZ', 'CY', 'SWAP'].map((gate) => (
                  <Button
                    key={gate}
                    onClick={() => applyGate(gate as any, [0, 1])}
                    className="bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
                    size="sm"
                  >
                    {gate}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-purple-400 mb-2 text-sm">Rotation Gates</h5>
              <div className="grid grid-cols-3 gap-2">
                {['RX', 'RY', 'RZ'].map((gate) => (
                  <Button
                    key={gate}
                    onClick={() => applyGate(gate as any, [0], [Math.PI / 4])}
                    className="bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
                    size="sm"
                  >
                    {gate}(θ)
                  </Button>
                ))}
              </div>
            </div>

            {/* Circuit Visualization */}
            <div className="bg-black/60 rounded p-4 border border-purple-500/30 mt-4">
              <div className="text-sm text-purple-300 font-mono space-y-1">
                {circuit.gates.length === 0 ? (
                  <div className="text-purple-600 text-center py-4">No gates added yet</div>
                ) : (
                  circuit.gates.map((gate, i) => (
                    <div key={gate.id} className="flex items-center gap-2">
                      <span className="text-purple-600">Layer {gate.layer}:</span>
                      <span className="text-purple-400">{gate.type}</span>
                      <span className="text-purple-600">on qubits [{gate.qubits.join(', ')}]</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="error-correction" className="mt-6">
          <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
            <h4 className="text-purple-400 mb-4">Quantum Error Correction</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-purple-500/30">
                <div>
                  <h5 className="text-purple-400 mb-1">Surface Code</h5>
                  <p className="text-sm text-purple-600">Topological error correction code</p>
                </div>
                <input
                  type="checkbox"
                  checked={errorCorrection}
                  onChange={(e) => {
                    setErrorCorrection(e.target.checked);
                    if (e.target.checked) {
                      setFidelity(prev => Math.min(99.9, prev + 0.5));
                      toast.success('Error correction enabled - Fidelity improved');
                    }
                  }}
                  className="w-5 h-5"
                />
              </div>

              {errorCorrection && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-600">Logical Qubits:</span>
                      <span className="text-green-400 font-mono">{Math.floor(qubitCount / 9)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-600">Physical Qubits:</span>
                      <span className="text-purple-400 font-mono">{qubitCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-600">Fidelity Improvement:</span>
                      <span className="text-green-400 font-mono">+0.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-600">Error Threshold:</span>
                      <span className="text-green-400 font-mono">1.0%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-purple-600 mb-2 block">Gate Fidelity: {gateFidelity.toFixed(2)}%</label>
                  <Slider
                    value={[gateFidelity]}
                    onValueChange={([value]) => setGateFidelity(value)}
                    min={90}
                    max={99.9}
                    step={0.1}
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-600 mb-2 block">Readout Error: {readoutError.toFixed(2)}%</label>
                  <Slider
                    value={[readoutError]}
                    onValueChange={([value]) => setReadoutError(value)}
                    min={0.1}
                    max={5}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="mt-6">
          <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
            <h4 className="text-purple-400 mb-4">3D Quantum State Visualization</h4>
            <div className="bg-black/60 rounded-lg border border-purple-500/30 p-4 h-[400px] flex items-center justify-center">
              <div className="text-center text-purple-600">
                <CircuitBoard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>3D Visualization</p>
                <p className="text-xs mt-1">Quantum state rendering coming soon</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="hardware" className="mt-6">
          <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
            <h4 className="text-purple-400 mb-4">Quantum Hardware Integration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'IBM Quantum', provider: 'IBM', qubits: 127, status: 'available' },
                { name: 'Google Quantum AI', provider: 'Google', qubits: 70, status: 'available' },
                { name: 'IonQ', provider: 'IonQ', qubits: 32, status: 'available' },
                { name: 'Rigetti', provider: 'Rigetti', qubits: 80, status: 'available' },
              ].map((hardware, i) => (
                <Card key={i} className="bg-black/40 border-purple-500/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-purple-400">{hardware.name}</h5>
                    <Badge className={
                      hardware.status === 'available' 
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
                    }>
                      {hardware.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-purple-600 space-y-1">
                    <div>Provider: {hardware.provider}</div>
                    <div>Max Qubits: {hardware.qubits}</div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
                  >
                    Connect
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

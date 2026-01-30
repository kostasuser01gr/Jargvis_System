import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Brain, Layers, TrendingUp, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Slider } from './ui/slider';

interface Neuron {
  id: string;
  x: number;
  y: number;
  layer: number;
  activation: number;
}

interface Connection {
  from: string;
  to: string;
  weight: number;
}

export function NeuralNetwork() {
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [learningRate, setLearningRate] = useState(0.5);
  const [accuracy, setAccuracy] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize neural network structure
    const layers = [4, 6, 6, 3]; // Input, hidden1, hidden2, output
    const newNeurons: Neuron[] = [];
    const newConnections: Connection[] = [];

    const width = 800;
    const height = 400;
    const layerSpacing = width / (layers.length + 1);

    layers.forEach((count, layerIndex) => {
      const layerHeight = height / (count + 1);
      for (let i = 0; i < count; i++) {
        const neuron: Neuron = {
          id: `n-${layerIndex}-${i}`,
          x: layerSpacing * (layerIndex + 1),
          y: layerHeight * (i + 1),
          layer: layerIndex,
          activation: Math.random()
        };
        newNeurons.push(neuron);

        // Create connections to previous layer
        if (layerIndex > 0) {
          const prevLayerNeurons = newNeurons.filter(n => n.layer === layerIndex - 1);
          prevLayerNeurons.forEach(prevNeuron => {
            newConnections.push({
              from: prevNeuron.id,
              to: neuron.id,
              weight: Math.random() * 2 - 1
            });
          });
        }
      }
    });

    setNeurons(newNeurons);
    setConnections(newConnections);
  }, []);

  useEffect(() => {
    // Animate neural network
    const interval = setInterval(() => {
      setNeurons(prev => prev.map(neuron => ({
        ...neuron,
        activation: Math.max(0, Math.min(1, neuron.activation + (Math.random() - 0.5) * 0.3))
      })));

      setAccuracy(prev => {
        const change = (Math.random() - 0.48) * 2;
        return Math.max(85, Math.min(99, prev + change));
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Draw neural network
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    connections.forEach(conn => {
      const fromNeuron = neurons.find(n => n.id === conn.from);
      const toNeuron = neurons.find(n => n.id === conn.to);
      if (!fromNeuron || !toNeuron) return;

      const opacity = Math.abs(conn.weight) * 0.5;
      ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
      ctx.lineWidth = Math.abs(conn.weight) * 2;
      ctx.beginPath();
      ctx.moveTo(fromNeuron.x, fromNeuron.y);
      ctx.lineTo(toNeuron.x, toNeuron.y);
      ctx.stroke();
    });

    // Draw neurons
    neurons.forEach(neuron => {
      const radius = 8 + neuron.activation * 4;
      const gradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, radius);
      gradient.addColorStop(0, `rgba(34, 211, 238, ${neuron.activation})`);
      gradient.addColorStop(1, `rgba(34, 211, 238, ${neuron.activation * 0.2})`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Glow effect
      ctx.strokeStyle = `rgba(34, 211, 238, ${neuron.activation * 0.8})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [neurons, connections]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Accuracy', value: `${accuracy.toFixed(2)}%`, icon: TrendingUp },
          { label: 'Learning Rate', value: learningRate.toFixed(2), icon: Zap },
          { label: 'Layers', value: '4', icon: Layers },
          { label: 'Parameters', value: '10.2K', icon: Brain }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-6 h-6 text-cyan-400" />
                <p className="text-xl text-cyan-400">{stat.value}</p>
              </div>
              <p className="text-xs text-cyan-600">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Neural Network Visualization */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <h3 className="text-cyan-400 mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Neural Network Topology
          </h3>
          <div className="bg-black/40 rounded-lg p-4 border border-cyan-500/20">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
            <div className="text-center p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <p className="text-cyan-400">Input Layer</p>
              <p className="text-cyan-600 mt-1">4 nodes</p>
            </div>
            <div className="text-center p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <p className="text-cyan-400">Hidden 1</p>
              <p className="text-cyan-600 mt-1">6 nodes</p>
            </div>
            <div className="text-center p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <p className="text-cyan-400">Hidden 2</p>
              <p className="text-cyan-600 mt-1">6 nodes</p>
            </div>
            <div className="text-center p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <p className="text-cyan-400">Output Layer</p>
              <p className="text-cyan-600 mt-1">3 nodes</p>
            </div>
          </div>
        </Card>

        {/* Controls */}
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <h3 className="text-cyan-400 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Training Controls
          </h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-cyan-400 mb-2 block">Learning Rate</label>
              <Slider
                value={[learningRate]}
                onValueChange={(value) => setLearningRate(value[0])}
                max={1}
                min={0.01}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-cyan-600 mt-1">{learningRate.toFixed(2)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cyan-400">Training Progress</span>
                <span className="text-cyan-400">Epoch 847/1000</span>
              </div>
              <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '84.7%' }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-cyan-500/30">
              <h4 className="text-sm text-cyan-400">Performance Metrics</h4>
              {[
                { label: 'Loss', value: '0.0234' },
                { label: 'Val Loss', value: '0.0289' },
                { label: 'Precision', value: '0.9621' },
                { label: 'Recall', value: '0.9534' }
              ].map((metric) => (
                <div key={metric.label} className="flex justify-between text-xs">
                  <span className="text-cyan-600">{metric.label}</span>
                  <span className="text-cyan-400 font-mono">{metric.value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-cyan-500/30">
              <h4 className="text-sm text-cyan-400">Network Stats</h4>
              {[
                { label: 'Active Connections', value: '78' },
                { label: 'Avg Weight', value: '0.456' },
                { label: 'Gradient Norm', value: '0.0012' },
                { label: 'Update Rate', value: '60 Hz' }
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-xs">
                  <span className="text-cyan-600">{stat.label}</span>
                  <span className="text-cyan-400 font-mono">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

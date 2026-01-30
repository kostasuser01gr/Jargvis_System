import { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Network, TrendingUp, Zap, Target, BarChart3, Play, Pause } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QMLModel {
  id: string;
  name: string;
  type: 'QNN' | 'QSVM' | 'QGAN' | 'QVQC' | 'QAE';
  qubits: number;
  layers: number;
  accuracy: number;
  trainingProgress: number;
  status: 'training' | 'ready' | 'deployed';
}

export function QuantumMachineLearning() {
  const [models, setModels] = useState<QMLModel[]>([
    {
      id: '1',
      name: 'Quantum Neural Network',
      type: 'QNN',
      qubits: 16,
      layers: 4,
      accuracy: 87.5,
      trainingProgress: 100,
      status: 'ready'
    },
    {
      id: '2',
      name: 'Quantum SVM',
      type: 'QSVM',
      qubits: 12,
      layers: 1,
      accuracy: 92.3,
      trainingProgress: 100,
      status: 'deployed'
    },
    {
      id: '3',
      name: 'Quantum GAN',
      type: 'QGAN',
      qubits: 20,
      layers: 6,
      accuracy: 0,
      trainingProgress: 45,
      status: 'training'
    }
  ]);

  const [selectedModel, setSelectedModel] = useState<QMLModel | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  const trainingData = Array.from({ length: 50 }, (_, i) => ({
    epoch: i + 1,
    loss: 1 - (i / 50) * 0.8 + Math.random() * 0.1,
    accuracy: (i / 50) * 0.9 + Math.random() * 0.05
  }));

  const startTraining = (modelId: string) => {
    setIsTraining(true);
    toast.info('Starting quantum training...');
    
    const interval = setInterval(() => {
      setModels(prev => prev.map(m => {
        if (m.id === modelId && m.trainingProgress < 100) {
          return {
            ...m,
            trainingProgress: Math.min(100, m.trainingProgress + 2),
            accuracy: m.trainingProgress < 50 ? 0 : (m.trainingProgress - 50) * 1.8
          };
        }
        return m;
      }));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setIsTraining(false);
      setModels(prev => prev.map(m => 
        m.id === modelId ? { ...m, status: 'ready' as const } : m
      ));
      toast.success('Training completed!');
    }, 25000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-violet-950/20 to-purple-950/20 border-violet-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-violet-400 flex items-center gap-2">
              <Brain className="w-6 h-5" />
              Quantum Machine Learning
            </h3>
            <p className="text-xs text-violet-600 mt-1">Quantum neural networks, QSVM, QGAN, and more</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Models', value: models.length, icon: Network },
            { label: 'Training', value: models.filter(m => m.status === 'training').length, icon: Zap },
            { label: 'Deployed', value: models.filter(m => m.status === 'deployed').length, icon: Target },
            { label: 'Avg Accuracy', value: `${Math.round(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length)}%`, icon: TrendingUp },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-violet-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-violet-400" />
                <p className="text-lg text-violet-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-violet-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="bg-black/40 border-violet-500/30">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((model) => (
              <Card
                key={model.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedModel?.id === model.id
                    ? 'bg-violet-500/20 border-violet-500/50'
                    : 'bg-black/40 border-violet-500/30 hover:border-violet-500/40'
                }`}
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-violet-400 mb-1">{model.name}</h4>
                    <Badge className="bg-violet-500/20 text-violet-400 text-[10px]">
                      {model.type}
                    </Badge>
                  </div>
                  <Badge className={
                    model.status === 'deployed' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                    model.status === 'training' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                    'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  }>
                    {model.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-violet-600">Qubits:</span>
                    <span className="text-violet-400 font-mono">{model.qubits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-violet-600">Layers:</span>
                    <span className="text-violet-400 font-mono">{model.layers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-violet-600">Accuracy:</span>
                    <span className="text-violet-400 font-mono">{model.accuracy.toFixed(1)}%</span>
                  </div>
                  {model.status === 'training' && (
                    <div>
                      <Progress value={model.trainingProgress} className="h-2" />
                      <div className="text-xs text-violet-600 mt-1">{model.trainingProgress}%</div>
                    </div>
                  )}
                </div>
                {model.status === 'training' && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      startTraining(model.id);
                    }}
                    disabled={isTraining}
                    className="w-full mt-3 bg-violet-500/20 border-violet-500/50 text-violet-400 hover:bg-violet-500/30"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continue Training
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          {selectedModel && (
            <Card className="bg-gradient-to-br from-violet-950/20 to-purple-950/20 border-violet-500/30 p-6">
              <h4 className="text-violet-400 mb-4">Training Progress: {selectedModel.name}</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trainingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" />
                  <XAxis dataKey="epoch" stroke="#a78bfa" />
                  <YAxis stroke="#a78bfa" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #8b5cf6' }} />
                  <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} name="Loss" />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <Card className="bg-gradient-to-br from-violet-950/20 to-purple-950/20 border-violet-500/30 p-6">
            <h4 className="text-violet-400 mb-4">Quantum vs Classical Performance</h4>
            <div className="space-y-4">
              {models.map((model) => (
                <div key={model.id} className="p-4 bg-black/40 rounded border border-violet-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-violet-400">{model.name}</span>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-xs text-violet-600">Quantum</div>
                        <div className="text-violet-400 font-mono">{model.accuracy.toFixed(1)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-violet-600">Classical</div>
                        <div className="text-violet-400 font-mono">{(model.accuracy * 0.7).toFixed(1)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-violet-600">Speedup</div>
                        <div className="text-green-400 font-mono">{(100 / (100 - model.accuracy)).toFixed(1)}x</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

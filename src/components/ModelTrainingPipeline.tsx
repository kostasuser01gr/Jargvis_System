import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, Settings, TrendingDown, TrendingUp, Zap, Cpu, HardDrive, Activity, Layers, Target, Gauge, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrainingConfig {
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: 'adam' | 'adamw' | 'sgd' | 'rmsprop';
  scheduler: 'cosine' | 'linear' | 'step' | 'plateau';
  warmupSteps: number;
  gradientAccumulation: number;
  mixedPrecision: boolean;
  distributedTraining: boolean;
  numGPUs: number;
}

interface TrainingMetrics {
  epoch: number;
  step: number;
  loss: number;
  learningRate: number;
  gradientNorm: number;
  throughput: number;
  memoryUsage: number;
  timestamp: Date;
}

interface HyperparameterTrial {
  id: string;
  config: TrainingConfig;
  status: 'running' | 'completed' | 'failed';
  bestLoss: number;
  progress: number;
}

export function ModelTrainingPipeline() {
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(10);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>({
    learningRate: 0.0001,
    batchSize: 32,
    epochs: 10,
    optimizer: 'adamw',
    scheduler: 'cosine',
    warmupSteps: 1000,
    gradientAccumulation: 1,
    mixedPrecision: true,
    distributedTraining: false,
    numGPUs: 1
  });

  const [metrics, setMetrics] = useState<TrainingMetrics[]>([]);
  const [hyperparameterTrials, setHyperparameterTrials] = useState<HyperparameterTrial[]>([]);
  const [currentLoss, setCurrentLoss] = useState(2.5);
  const [bestLoss, setBestLoss] = useState(2.5);
  const [learningRate, setLearningRate] = useState(0.0001);
  const [gradientNorm, setGradientNorm] = useState(0.5);
  const [throughput, setThroughput] = useState(45.2);
  const [memoryUsage, setMemoryUsage] = useState(65);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            setIsTraining(false);
            toast.success('Training completed successfully!');
            return 100;
          }
          return prev + 0.5;
        });

        // Update metrics
        const newLoss = Math.max(0.1, currentLoss - (Math.random() * 0.01));
        setCurrentLoss(newLoss);
        if (newLoss < bestLoss) setBestLoss(newLoss);
        
        setLearningRate(prev => prev * 0.9999);
        setGradientNorm(Math.max(0.1, gradientNorm + (Math.random() - 0.5) * 0.1));
        setThroughput(prev => prev + (Math.random() - 0.5) * 0.5);
        setMemoryUsage(prev => Math.min(95, prev + (Math.random() - 0.5) * 2));

        // Add metric point
        setMetrics(prev => [...prev.slice(-49), {
          epoch: currentEpoch,
          step: Math.floor(trainingProgress * 100),
          loss: newLoss,
          learningRate: learningRate,
          gradientNorm: gradientNorm,
          throughput: throughput,
          memoryUsage: memoryUsage,
          timestamp: new Date()
        }]);

        if (trainingProgress % 10 === 0) {
          setCurrentEpoch(prev => Math.min(totalEpochs, prev + 0.1));
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isTraining, trainingProgress, currentLoss, bestLoss, learningRate, gradientNorm, throughput, memoryUsage, currentEpoch, totalEpochs]);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setCurrentEpoch(0);
    setMetrics([]);
    toast.success('Training started!');
  };

  const pauseTraining = () => {
    setIsTraining(false);
    toast.info('Training paused');
  };

  const stopTraining = () => {
    setIsTraining(false);
    setTrainingProgress(0);
    toast.warning('Training stopped');
  };

  const startHyperparameterSearch = () => {
    const newTrials: HyperparameterTrial[] = Array.from({ length: 5 }, (_, i) => ({
      id: `trial-${i + 1}`,
      config: {
        ...trainingConfig,
        learningRate: 0.0001 * (0.5 + Math.random()),
        batchSize: [16, 32, 64, 128][Math.floor(Math.random() * 4)],
        optimizer: ['adam', 'adamw', 'sgd'][Math.floor(Math.random() * 3)] as any
      },
      status: 'running',
      bestLoss: 2.5 + Math.random(),
      progress: 0
    }));

    setHyperparameterTrials(newTrials);
    toast.success('Hyperparameter search started with 5 trials');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-indigo-400 flex items-center gap-2">
              <Zap className="w-6 h-5" />
              Model Training Pipeline
            </h3>
            <p className="text-xs text-indigo-600 mt-1">Distributed training with hyperparameter optimization</p>
          </div>
          <div className="flex gap-2">
            {!isTraining ? (
              <Button
                onClick={startTraining}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Training
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseTraining}
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={stopTraining}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </>
            )}
            <Button
              onClick={startHyperparameterSearch}
              variant="outline"
              className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20"
            >
              <Target className="w-4 h-4 mr-2" />
              Hyperparameter Search
            </Button>
          </div>
        </div>

        {/* Training Progress */}
        {isTraining && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-indigo-400">Training Progress</span>
                <span className="text-indigo-400 font-mono">
                  Epoch {currentEpoch.toFixed(1)}/{totalEpochs} ({trainingProgress.toFixed(1)}%)
                </span>
              </div>
              <Progress value={trainingProgress} className="h-3" />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-black/40 border-indigo-500/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-indigo-600">Current Loss</span>
                  <TrendingDown className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-xl text-indigo-400 font-mono">{currentLoss.toFixed(4)}</div>
                <div className="text-xs text-indigo-600 mt-1">Best: {bestLoss.toFixed(4)}</div>
              </Card>

              <Card className="bg-black/40 border-indigo-500/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-indigo-600">Learning Rate</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl text-indigo-400 font-mono">{learningRate.toFixed(6)}</div>
              </Card>

              <Card className="bg-black/40 border-indigo-500/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-indigo-600">Throughput</span>
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-xl text-indigo-400 font-mono">{throughput.toFixed(1)} samples/s</div>
              </Card>

              <Card className="bg-black/40 border-indigo-500/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-indigo-600">Memory</span>
                  <HardDrive className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl text-indigo-400 font-mono">{memoryUsage.toFixed(1)}%</div>
              </Card>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Configuration */}
        <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6 lg:col-span-2">
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="bg-black/40 border-indigo-500/30">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="hyperparams">Hyperparameters</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-indigo-600 mb-2 block">Learning Rate</label>
                  <Input
                    type="number"
                    value={trainingConfig.learningRate}
                    onChange={(e) => setTrainingConfig({ ...trainingConfig, learningRate: parseFloat(e.target.value) })}
                    className="bg-black/60 border-indigo-500/40 text-indigo-100"
                    step="0.0001"
                  />
                </div>

                <div>
                  <label className="text-xs text-indigo-600 mb-2 block">Batch Size</label>
                  <Input
                    type="number"
                    value={trainingConfig.batchSize}
                    onChange={(e) => setTrainingConfig({ ...trainingConfig, batchSize: parseInt(e.target.value) })}
                    className="bg-black/60 border-indigo-500/40 text-indigo-100"
                  />
                </div>

                <div>
                  <label className="text-xs text-indigo-600 mb-2 block">Epochs</label>
                  <Input
                    type="number"
                    value={trainingConfig.epochs}
                    onChange={(e) => {
                      const epochs = parseInt(e.target.value);
                      setTrainingConfig({ ...trainingConfig, epochs });
                      setTotalEpochs(epochs);
                    }}
                    className="bg-black/60 border-indigo-500/40 text-indigo-100"
                  />
                </div>

                <div>
                  <label className="text-xs text-indigo-600 mb-2 block">Optimizer</label>
                  <select
                    value={trainingConfig.optimizer}
                    onChange={(e) => setTrainingConfig({ ...trainingConfig, optimizer: e.target.value as any })}
                    className="w-full bg-black/60 border border-indigo-500/40 rounded px-3 py-2 text-indigo-300"
                  >
                    <option value="adam">Adam</option>
                    <option value="adamw">AdamW</option>
                    <option value="sgd">SGD</option>
                    <option value="rmsprop">RMSprop</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-indigo-600 mb-2 block">Scheduler</label>
                  <select
                    value={trainingConfig.scheduler}
                    onChange={(e) => setTrainingConfig({ ...trainingConfig, scheduler: e.target.value as any })}
                    className="w-full bg-black/60 border border-indigo-500/40 rounded px-3 py-2 text-indigo-300"
                  >
                    <option value="cosine">Cosine</option>
                    <option value="linear">Linear</option>
                    <option value="step">Step</option>
                    <option value="plateau">Plateau</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-indigo-600 mb-2 block">Warmup Steps</label>
                  <Input
                    type="number"
                    value={trainingConfig.warmupSteps}
                    onChange={(e) => setTrainingConfig({ ...trainingConfig, warmupSteps: parseInt(e.target.value) })}
                    className="bg-black/60 border-indigo-500/40 text-indigo-100"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hyperparams" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-indigo-600 mb-2 block">Gradient Accumulation Steps</label>
                  <Slider
                    value={[trainingConfig.gradientAccumulation]}
                    onValueChange={([value]) => setTrainingConfig({ ...trainingConfig, gradientAccumulation: value })}
                    min={1}
                    max={16}
                    step={1}
                  />
                  <div className="text-xs text-indigo-600 mt-1">{trainingConfig.gradientAccumulation} steps</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 border border-indigo-500/30 rounded">
                  <div>
                    <label className="text-sm text-indigo-400">Mixed Precision Training</label>
                    <p className="text-xs text-indigo-600">Use FP16/BF16 for faster training</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={trainingConfig.mixedPrecision}
                    onChange={(e) => setTrainingConfig({ ...trainingConfig, mixedPrecision: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 border border-indigo-500/30 rounded">
                  <div>
                    <label className="text-sm text-indigo-400">Distributed Training</label>
                    <p className="text-xs text-indigo-600">Train across multiple GPUs</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={trainingConfig.distributedTraining}
                    onChange={(e) => setTrainingConfig({ ...trainingConfig, distributedTraining: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>

                {trainingConfig.distributedTraining && (
                  <div>
                    <label className="text-xs text-indigo-600 mb-2 block">Number of GPUs</label>
                    <Slider
                      value={[trainingConfig.numGPUs]}
                      onValueChange={([value]) => setTrainingConfig({ ...trainingConfig, numGPUs: value })}
                      min={1}
                      max={8}
                      step={1}
                    />
                    <div className="text-xs text-indigo-600 mt-1">{trainingConfig.numGPUs} GPUs</div>
                  </div>
                )}

                <Button
                  onClick={startHyperparameterSearch}
                  className="w-full bg-indigo-500/20 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/30"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Start Hyperparameter Optimization
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              <div className="space-y-4">
                <Card className="bg-black/40 border-indigo-500/30 p-4">
                  <h4 className="text-indigo-400 mb-3">Training Strategies</h4>
                  <div className="space-y-2">
                    {['Curriculum Learning', 'Reinforcement Learning from Human Feedback', 'Multi-task Learning', 'Transfer Learning', 'Continual Learning'].map((strategy) => (
                      <div key={strategy} className="flex items-center justify-between p-2 bg-black/60 rounded">
                        <span className="text-sm text-indigo-300">{strategy}</span>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="mt-6">
              <div className="space-y-4">
                {metrics.length > 0 && (
                  <Card className="bg-black/40 border-indigo-500/30 p-4">
                    <h4 className="text-indigo-400 mb-4">Training Metrics</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={metrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                        <XAxis dataKey="step" stroke="#6366f1" />
                        <YAxis stroke="#6366f1" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366f1' }} />
                        <Legend />
                        <Line type="monotone" dataKey="loss" stroke="#22d3ee" strokeWidth={2} name="Loss" />
                        <Line type="monotone" dataKey="gradientNorm" stroke="#a855f7" strokeWidth={2} name="Gradient Norm" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Hyperparameter Trials */}
        <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
          <h4 className="text-indigo-400 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Hyperparameter Trials
          </h4>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {hyperparameterTrials.length === 0 ? (
                <div className="text-center text-indigo-600 py-8">
                  <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No trials running</p>
                  <p className="text-xs mt-1">Start hyperparameter search to begin</p>
                </div>
              ) : (
                hyperparameterTrials.map((trial) => (
                  <Card key={trial.id} className="bg-black/40 border-indigo-500/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-indigo-400 font-mono">{trial.id}</span>
                      <Badge className={
                        trial.status === 'completed' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                        trial.status === 'failed' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                        'bg-blue-500/20 border-blue-500/50 text-blue-400'
                      }>
                        {trial.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-indigo-600 mb-2">
                      LR: {trial.config.learningRate.toFixed(6)} | Batch: {trial.config.batchSize}
                    </div>
                    <div className="mb-2">
                      <Progress value={trial.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-indigo-600">Best Loss:</span>
                      <span className="text-indigo-400 font-mono">{trial.bestLoss.toFixed(4)}</span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}

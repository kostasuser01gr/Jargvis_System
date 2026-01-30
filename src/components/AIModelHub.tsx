import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Download, Upload, Play, Trash2, Settings, TrendingUp, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface AIModel {
  id: string;
  name: string;
  type: 'transformer' | 'cnn' | 'rnn' | 'gan' | 'diffusion';
  size: string;
  accuracy: number;
  status: 'ready' | 'training' | 'deploying' | 'inactive';
  parameters: string;
  version: string;
  lastTrained: Date;
}

export function AIModelHub() {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: '1',
      name: 'JARVIS-GPT-Ultra',
      type: 'transformer',
      size: '175B',
      accuracy: 98.7,
      status: 'ready',
      parameters: '175B',
      version: 'v4.2',
      lastTrained: new Date()
    },
    {
      id: '2',
      name: 'Vision-Pro-X',
      type: 'cnn',
      size: '50M',
      accuracy: 96.5,
      status: 'training',
      parameters: '50M',
      version: 'v2.1',
      lastTrained: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      name: 'TimeSeries-Neural',
      type: 'rnn',
      size: '25M',
      accuracy: 94.2,
      status: 'ready',
      parameters: '25M',
      version: 'v1.8',
      lastTrained: new Date(Date.now() - 172800000)
    },
    {
      id: '4',
      name: 'GAN-Creator-Pro',
      type: 'gan',
      size: '100M',
      accuracy: 92.8,
      status: 'inactive',
      parameters: '100M',
      version: 'v3.0',
      lastTrained: new Date(Date.now() - 259200000)
    }
  ]);

  const [selectedModel, setSelectedModel] = useState<AIModel | null>(models[0]);
  const [trainingProgress, setTrainingProgress] = useState(67);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'training': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'deploying': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'inactive': return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transformer': return '🔄';
      case 'cnn': return '👁️';
      case 'rnn': return '📊';
      case 'gan': return '🎨';
      case 'diffusion': return '✨';
      default: return '🤖';
    }
  };

  const deployModel = (id: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Deploying model...',
        success: 'Model deployed successfully!',
        error: 'Deployment failed'
      }
    );
  };

  const trainModel = (id: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Starting training...',
        success: 'Training started!',
        error: 'Training failed'
      }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Model List */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-blue-500/30 p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-blue-400 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Model Repository
            </h3>
            <p className="text-xs text-blue-600 mt-1">Neural network management</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Model
          </Button>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            <AnimatePresence>
              {models.map((model) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`bg-black/40 border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedModel?.id === model.id 
                      ? 'border-blue-500/50 bg-blue-500/10' 
                      : 'border-blue-500/20 hover:border-blue-500/40'
                  }`}
                  onClick={() => setSelectedModel(model)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{getTypeIcon(model.type)}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-blue-400">{model.name}</h4>
                          <Badge className={getStatusColor(model.status)}>
                            {model.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-blue-600">
                          <span>{model.type.toUpperCase()}</span>
                          <span>•</span>
                          <span>{model.parameters} params</span>
                          <span>•</span>
                          <span>{model.version}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-green-400 font-mono">{model.accuracy}%</div>
                      <div className="text-xs text-blue-600">Accuracy</div>
                    </div>
                  </div>

                  {/* Progress for training models */}
                  {model.status === 'training' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-blue-600 mb-1">
                        <span>Training Progress</span>
                        <span>{trainingProgress}%</span>
                      </div>
                      <Progress value={trainingProgress} className="h-2" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-blue-500/20">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deployModel(model.id);
                      }}
                      className="flex-1 bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
                      disabled={model.status !== 'ready'}
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Deploy
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        trainModel(model.id);
                      }}
                      className="flex-1 bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
                      disabled={model.status === 'training'}
                    >
                      <Zap className="w-3 h-3 mr-2" />
                      Train
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </Card>

      {/* Model Details */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-blue-500/30 p-6">
        {selectedModel ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-blue-400">Model Details</h4>
              <div className="text-4xl">{getTypeIcon(selectedModel.type)}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-blue-600 mb-2 block">Model Name</label>
                <div className="bg-black/60 border border-blue-500/40 rounded px-3 py-2 text-blue-100">
                  {selectedModel.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-blue-600 mb-2 block">Type</label>
                  <div className="bg-black/60 border border-blue-500/40 rounded px-3 py-2 text-blue-100 text-sm uppercase">
                    {selectedModel.type}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-blue-600 mb-2 block">Version</label>
                  <div className="bg-black/60 border border-blue-500/40 rounded px-3 py-2 text-blue-100 text-sm">
                    {selectedModel.version}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-blue-600 mb-2 block">Parameters</label>
                <div className="bg-black/60 border border-blue-500/40 rounded px-3 py-2 text-blue-100 font-mono">
                  {selectedModel.parameters}
                </div>
              </div>

              <div>
                <label className="text-xs text-blue-600 mb-2 block">Accuracy</label>
                <div className="flex items-center gap-3">
                  <Progress value={selectedModel.accuracy} className="flex-1" />
                  <span className="text-green-400 font-mono text-sm">{selectedModel.accuracy}%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-500/20 space-y-3">
                <h5 className="text-blue-400 text-sm">Performance Metrics</h5>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">Inference Speed</span>
                  <span className="text-blue-400 font-mono">127ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">F1 Score</span>
                  <span className="text-blue-400 font-mono">0.965</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">Loss</span>
                  <span className="text-blue-400 font-mono">0.042</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">Training Time</span>
                  <span className="text-blue-400 font-mono">24.5h</span>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-500/20">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-2">
                  <Download className="w-4 h-4 mr-2" />
                  Export Model
                </Button>
                <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Model
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-blue-600">
            <div className="text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a model to view details</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

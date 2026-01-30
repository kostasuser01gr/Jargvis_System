import { useState } from 'react';
import { motion } from 'motion/react';
import { FlaskConical, TrendingUp, GitBranch, Clock, CheckCircle2, XCircle, Activity, Download, Upload, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Experiment {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  metrics: {
    accuracy: number;
    loss: number;
    f1: number;
    epoch: number;
  };
  hyperparameters: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  duration: number;
  tags: string[];
}

interface ExperimentRun {
  id: string;
  experimentId: string;
  metrics: Array<{ epoch: number; loss: number; accuracy: number }>;
  hyperparameters: Record<string, any>;
  status: string;
}

export function ExperimentTracking() {
  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: 'exp-1',
      name: 'BERT Fine-tuning',
      status: 'completed',
      metrics: { accuracy: 92.5, loss: 0.15, f1: 0.91, epoch: 10 },
      hyperparameters: { learningRate: 0.0001, batchSize: 32, epochs: 10 },
      createdAt: new Date(Date.now() - 86400000),
      completedAt: new Date(Date.now() - 3600000),
      duration: 3600,
      tags: ['nlp', 'bert', 'fine-tuning']
    },
    {
      id: 'exp-2',
      name: 'ResNet-50 Training',
      status: 'running',
      metrics: { accuracy: 87.3, loss: 0.23, f1: 0.86, epoch: 5 },
      hyperparameters: { learningRate: 0.001, batchSize: 64, epochs: 20 },
      createdAt: new Date(Date.now() - 7200000),
      duration: 7200,
      tags: ['cv', 'resnet', 'image-classification']
    },
    {
      id: 'exp-3',
      name: 'GPT-3 Fine-tuning',
      status: 'failed',
      metrics: { accuracy: 0, loss: 0, f1: 0, epoch: 0 },
      hyperparameters: { learningRate: 0.0001, batchSize: 16, epochs: 5 },
      createdAt: new Date(Date.now() - 172800000),
      duration: 1800,
      tags: ['nlp', 'gpt', 'generation']
    }
  ]);

  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExperiments = experiments.filter(exp => {
    const matchesStatus = filterStatus === 'all' || exp.status === filterStatus;
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const trainingData = selectedExperiment ? Array.from({ length: 20 }, (_, i) => ({
    epoch: i + 1,
    loss: 1 - (i / 20) * 0.8 + Math.random() * 0.1,
    accuracy: (i / 20) * 0.9 + Math.random() * 0.05
  })) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'running': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'failed': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'paused': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-orange-950/20 to-amber-950/20 border-orange-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-orange-400 flex items-center gap-2">
              <FlaskConical className="w-6 h-5" />
              Experiment Tracking System
            </h3>
            <p className="text-xs text-orange-600 mt-1">MLflow integration, experiment comparison, and metrics tracking</p>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-orange-500/20 border-orange-500/50 text-orange-400 hover:bg-orange-500/30"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import from MLflow
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
            >
              <FlaskConical className="w-4 h-4 mr-2" />
              New Experiment
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Experiments', value: experiments.length, icon: FlaskConical },
            { label: 'Running', value: experiments.filter(e => e.status === 'running').length, icon: Activity },
            { label: 'Completed', value: experiments.filter(e => e.status === 'completed').length, icon: CheckCircle2 },
            { label: 'Failed', value: experiments.filter(e => e.status === 'failed').length, icon: XCircle },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-orange-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-orange-400" />
                <p className="text-lg text-orange-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-orange-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Experiments List */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-orange-950/20 to-amber-950/20 border-orange-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments..."
              className="flex-1 bg-black/60 border-orange-500/40 text-orange-100"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-black/60 border-orange-500/40 text-orange-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredExperiments.map((exp) => (
                <Card
                  key={exp.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedExperiment?.id === exp.id
                      ? 'bg-orange-500/20 border-orange-500/50'
                      : 'bg-black/40 border-orange-500/30 hover:border-orange-500/40'
                  }`}
                  onClick={() => setSelectedExperiment(exp)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-orange-400 mb-1">{exp.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(exp.status)}>
                          {exp.status}
                        </Badge>
                        {exp.tags.map(tag => (
                          <Badge key={tag} className="bg-orange-500/10 text-orange-400 text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-orange-600">
                      {exp.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  {exp.status === 'completed' && (
                    <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                      <div>
                        <span className="text-orange-600">Accuracy:</span>
                        <div className="text-orange-400 font-mono">{exp.metrics.accuracy.toFixed(2)}%</div>
                      </div>
                      <div>
                        <span className="text-orange-600">Loss:</span>
                        <div className="text-orange-400 font-mono">{exp.metrics.loss.toFixed(4)}</div>
                      </div>
                      <div>
                        <span className="text-orange-600">F1 Score:</span>
                        <div className="text-orange-400 font-mono">{exp.metrics.f1.toFixed(2)}</div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Experiment Details */}
        <Card className="bg-gradient-to-br from-orange-950/20 to-amber-950/20 border-orange-500/30 p-6">
          {selectedExperiment ? (
            <div className="space-y-4">
              <h4 className="text-orange-400 mb-4">Experiment Details</h4>
              
              <div>
                <h5 className="text-orange-400 mb-2">Metrics</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-orange-600">Accuracy:</span>
                    <span className="text-orange-400 font-mono">{selectedExperiment.metrics.accuracy.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-600">Loss:</span>
                    <span className="text-orange-400 font-mono">{selectedExperiment.metrics.loss.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-600">F1 Score:</span>
                    <span className="text-orange-400 font-mono">{selectedExperiment.metrics.f1.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-600">Epochs:</span>
                    <span className="text-orange-400 font-mono">{selectedExperiment.metrics.epoch}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-orange-400 mb-2">Hyperparameters</h5>
                <div className="space-y-1 text-sm">
                  {Object.entries(selectedExperiment.hyperparameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-orange-600">{key}:</span>
                      <span className="text-orange-400 font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {trainingData.length > 0 && (
                <div>
                  <h5 className="text-orange-400 mb-2">Training Progress</h5>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trainingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#7c2d12" />
                      <XAxis dataKey="epoch" stroke="#fb923c" />
                      <YAxis stroke="#fb923c" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #f97316' }} />
                      <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} name="Loss" />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-orange-500/20 border-orange-500/50 text-orange-400 hover:bg-orange-500/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                >
                  Compare
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-orange-600 py-8">
              <FlaskConical className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Select an experiment to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

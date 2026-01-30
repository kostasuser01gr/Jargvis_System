import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Play, BarChart3, TrendingUp, Award, AlertTriangle, CheckCircle2, XCircle, Zap, Clock, Gauge } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface Benchmark {
  id: string;
  name: string;
  category: 'language' | 'vision' | 'code' | 'reasoning' | 'math';
  status: 'pending' | 'running' | 'completed' | 'failed';
  score: number;
  maxScore: number;
  time: number;
}

interface EvaluationResult {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  perplexity: number;
  latency: number;
  throughput: number;
  memoryUsage: number;
}

export function ModelEvaluator() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [results, setResults] = useState<EvaluationResult>({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    perplexity: 0,
    latency: 0,
    throughput: 0,
    memoryUsage: 0
  });

  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([
    { id: '1', name: 'MMLU (Massive Multitask)', category: 'language', status: 'pending', score: 0, maxScore: 100, time: 0 },
    { id: '2', name: 'HellaSwag', category: 'reasoning', status: 'pending', score: 0, maxScore: 100, time: 0 },
    { id: '3', name: 'HumanEval', category: 'code', status: 'pending', score: 0, maxScore: 100, time: 0 },
    { id: '4', name: 'GSM8K', category: 'math', status: 'pending', score: 0, maxScore: 100, time: 0 },
    { id: '5', name: 'TruthfulQA', category: 'language', status: 'pending', score: 0, maxScore: 100, time: 0 },
  ]);

  const [selectedBenchmark, setSelectedBenchmark] = useState<string>('all');
  const [metricHistory, setMetricHistory] = useState<any[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEvaluating) {
      interval = setInterval(() => {
        setEvaluationProgress(prev => {
          if (prev >= 100) {
            setIsEvaluating(false);
            toast.success('Evaluation completed!');
            
            // Update results
            setResults({
              accuracy: 87.5,
              precision: 85.2,
              recall: 89.1,
              f1Score: 87.1,
              perplexity: 12.3,
              latency: 45.2,
              throughput: 23.5,
              memoryUsage: 8.2
            });

            // Update benchmarks
            setBenchmarks(prev => prev.map(b => ({
              ...b,
              status: 'completed' as const,
              score: 70 + Math.random() * 25,
              time: 120 + Math.random() * 60
            })));

            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isEvaluating]);

  const startEvaluation = () => {
    setIsEvaluating(true);
    setEvaluationProgress(0);
    setBenchmarks(prev => prev.map(b => ({ ...b, status: 'running' as const })));
    toast.info('Starting evaluation...');
  };

  const runBenchmark = (benchmarkId: string) => {
    setBenchmarks(prev => prev.map(b => 
      b.id === benchmarkId ? { ...b, status: 'running' as const } : b
    ));

    setTimeout(() => {
      setBenchmarks(prev => prev.map(b => 
        b.id === benchmarkId ? {
          ...b,
          status: 'completed' as const,
          score: 70 + Math.random() * 25,
          time: 120 + Math.random() * 60
        } : b
      ));
      toast.success('Benchmark completed!');
    }, 2000);
  };

  const benchmarkData = [
    { name: 'MMLU', score: 82.5, max: 100 },
    { name: 'HellaSwag', score: 88.3, max: 100 },
    { name: 'HumanEval', score: 75.2, max: 100 },
    { name: 'GSM8K', score: 91.7, max: 100 },
    { name: 'TruthfulQA', score: 79.4, max: 100 },
  ];

  const radarData = [
    { subject: 'Accuracy', A: results.accuracy, fullMark: 100 },
    { subject: 'Precision', A: results.precision, fullMark: 100 },
    { subject: 'Recall', A: results.recall, fullMark: 100 },
    { subject: 'F1 Score', A: results.f1Score, fullMark: 100 },
    { subject: 'Speed', A: 100 - results.latency, fullMark: 100 },
    { subject: 'Efficiency', A: 100 - results.memoryUsage * 10, fullMark: 100 },
  ];

  const filteredBenchmarks = selectedBenchmark === 'all' 
    ? benchmarks 
    : benchmarks.filter(b => b.category === selectedBenchmark);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-amber-950/20 to-orange-950/20 border-amber-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-amber-400 flex items-center gap-2">
              <Target className="w-6 h-5" />
              Model Evaluation & Benchmarking
            </h3>
            <p className="text-xs text-amber-600 mt-1">Comprehensive model testing and performance analysis</p>
          </div>
          <Button
            onClick={startEvaluation}
            disabled={isEvaluating}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            {isEvaluating ? 'Evaluating...' : 'Run Full Evaluation'}
          </Button>
        </div>

        {/* Evaluation Progress */}
        {isEvaluating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-400">Evaluation Progress</span>
              <span className="text-amber-400 font-mono">{evaluationProgress}%</span>
            </div>
            <Progress value={evaluationProgress} className="h-3" />
          </div>
        )}
      </Card>

      {/* Results Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Accuracy', value: results.accuracy.toFixed(1) + '%', icon: Award, color: 'text-green-400' },
          { label: 'F1 Score', value: results.f1Score.toFixed(2), icon: Target, color: 'text-blue-400' },
          { label: 'Latency', value: results.latency.toFixed(1) + 'ms', icon: Clock, color: 'text-yellow-400' },
          { label: 'Throughput', value: results.throughput.toFixed(1) + '/s', icon: Zap, color: 'text-purple-400' },
        ].map((metric, i) => (
          <Card key={i} className="bg-gradient-to-br from-amber-950/20 to-orange-950/20 border-amber-500/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              <p className="text-xl text-amber-400 font-mono">{metric.value}</p>
            </div>
            <p className="text-xs text-amber-600">{metric.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Benchmark Results */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-amber-950/20 to-orange-950/20 border-amber-500/30 p-6">
          <Tabs defaultValue="benchmarks" className="w-full">
            <TabsList className="bg-black/40 border-amber-500/30">
              <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="benchmarks" className="mt-6">
              <div className="mb-4 flex gap-2">
                {['all', 'language', 'vision', 'code', 'reasoning', 'math'].map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedBenchmark === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedBenchmark(cat)}
                    className={
                      selectedBenchmark === cat
                        ? 'bg-amber-500/30 text-amber-300'
                        : 'border-amber-500/30 text-amber-400'
                    }
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {filteredBenchmarks.map((benchmark) => (
                    <Card key={benchmark.id} className="bg-black/40 border-amber-500/30 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-amber-400 mb-1">{benchmark.name}</h4>
                          <Badge className={
                            benchmark.category === 'language' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                            benchmark.category === 'vision' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                            benchmark.category === 'code' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' :
                            benchmark.category === 'reasoning' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                            'bg-red-500/20 border-red-500/50 text-red-400'
                          }>
                            {benchmark.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          {benchmark.status === 'completed' ? (
                            <>
                              <div className="text-xl text-amber-400 font-mono">{benchmark.score.toFixed(1)}</div>
                              <div className="text-xs text-amber-600">/{benchmark.maxScore}</div>
                            </>
                          ) : (
                            <Badge className={
                              benchmark.status === 'running' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                              'bg-gray-500/20 border-gray-500/50 text-gray-400'
                            }>
                              {benchmark.status}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {benchmark.status === 'completed' && (
                        <div className="mb-3">
                          <Progress value={(benchmark.score / benchmark.maxScore) * 100} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-600">
                          {benchmark.status === 'completed' ? `Completed in ${benchmark.time.toFixed(0)}s` : 'Not run'}
                        </span>
                        {benchmark.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => runBenchmark(benchmark.id)}
                            className="bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Run
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="metrics" className="mt-6">
              <div className="space-y-4">
                <Card className="bg-black/40 border-amber-500/30 p-4">
                  <h4 className="text-amber-400 mb-4">Performance Metrics</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Accuracy', value: results.accuracy },
                      { name: 'Precision', value: results.precision },
                      { name: 'Recall', value: results.recall },
                      { name: 'F1 Score', value: results.f1Score },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#92400e" />
                      <XAxis dataKey="name" stroke="#f59e0b" />
                      <YAxis stroke="#f59e0b" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #f59e0b' }} />
                      <Bar dataKey="value" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="bg-black/40 border-amber-500/30 p-4">
                  <h4 className="text-amber-400 mb-4">Performance Radar</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#92400e" />
                      <PolarAngleAxis dataKey="subject" stroke="#f59e0b" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#f59e0b" />
                      <Radar name="Model" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <Card className="bg-black/40 border-amber-500/30 p-4">
                <h4 className="text-amber-400 mb-4">Benchmark Comparison</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={benchmarkData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#92400e" />
                    <XAxis dataKey="name" stroke="#f59e0b" />
                    <YAxis stroke="#f59e0b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #f59e0b' }} />
                    <Legend />
                    <Bar dataKey="score" fill="#f59e0b" name="Score" />
                    <Bar dataKey="max" fill="#92400e" name="Max" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Detailed Metrics */}
        <Card className="bg-gradient-to-br from-amber-950/20 to-orange-950/20 border-amber-500/30 p-6">
          <h4 className="text-amber-400 mb-4">Detailed Metrics</h4>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {[
                { label: 'Accuracy', value: results.accuracy.toFixed(2) + '%', icon: CheckCircle2, color: 'text-green-400' },
                { label: 'Precision', value: results.precision.toFixed(2) + '%', icon: Target, color: 'text-blue-400' },
                { label: 'Recall', value: results.recall.toFixed(2) + '%', icon: TrendingUp, color: 'text-purple-400' },
                { label: 'F1 Score', value: results.f1Score.toFixed(2), icon: Award, color: 'text-yellow-400' },
                { label: 'Perplexity', value: results.perplexity.toFixed(2), icon: Gauge, color: 'text-cyan-400' },
                { label: 'Latency', value: results.latency.toFixed(1) + 'ms', icon: Clock, color: 'text-orange-400' },
                { label: 'Throughput', value: results.throughput.toFixed(1) + ' req/s', icon: Zap, color: 'text-pink-400' },
                { label: 'Memory Usage', value: results.memoryUsage.toFixed(1) + ' GB', icon: BarChart3, color: 'text-red-400' },
              ].map((metric, i) => (
                <Card key={i} className="bg-black/40 border-amber-500/30 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <metric.icon className={`w-4 h-4 ${metric.color}`} />
                      <span className="text-sm text-amber-400">{metric.label}</span>
                    </div>
                    <span className="text-amber-300 font-mono">{metric.value}</span>
                  </div>
                  <Progress 
                    value={metric.label.includes('Latency') || metric.label.includes('Memory') 
                      ? 100 - parseFloat(metric.value) 
                      : parseFloat(metric.value)
                    } 
                    className="h-1" 
                  />
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle, Brain, BarChart3, Activity, Zap, Target, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface Anomaly {
  id: string;
  timestamp: Date;
  type: 'spike' | 'drop' | 'pattern' | 'outlier';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  value: number;
  expected: number;
}

interface TimeSeriesData {
  timestamp: string;
  value: number;
  predicted: number;
  confidence: number;
}

export function AdvancedAnalytics() {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isAutoMLRunning, setIsAutoMLRunning] = useState(false);
  const [autoMLProgress, setAutoMLProgress] = useState(0);

  useEffect(() => {
    // Generate sample time series data
    const data: TimeSeriesData[] = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const baseValue = 100 + Math.sin(i / 5) * 20;
      data.push({
        timestamp: date.toISOString().split('T')[0],
        value: baseValue + (Math.random() - 0.5) * 10,
        predicted: baseValue + Math.sin((i - 1) / 5) * 20,
        confidence: 0.85 + Math.random() * 0.1
      });
    }
    setTimeSeriesData(data);

    // Generate sample anomalies
    setAnomalies([
      {
        id: '1',
        timestamp: new Date(Date.now() - 86400000),
        type: 'spike',
        severity: 'high',
        description: 'Unusual spike in user activity',
        value: 250,
        expected: 120
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 172800000),
        type: 'drop',
        severity: 'medium',
        description: 'Significant drop in API calls',
        value: 45,
        expected: 110
      }
    ]);
  }, []);

  const runAutoML = () => {
    setIsAutoMLRunning(true);
    setAutoMLProgress(0);
    
    const interval = setInterval(() => {
      setAutoMLProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAutoMLRunning(false);
          toast.success('AutoML pipeline completed! Best model: Random Forest (Accuracy: 94.2%)');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const getAnomalyColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'spike': return <TrendingUp className="w-4 h-4" />;
      case 'drop': return <TrendingUp className="w-4 h-4 rotate-180" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-orange-950/20 to-red-950/20 border-orange-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-orange-400 flex items-center gap-2">
              <BarChart3 className="w-6 h-5" />
              Advanced Analytics & AutoML
            </h3>
            <p className="text-xs text-orange-600 mt-1">Time series forecasting, anomaly detection, and automated ML</p>
          </div>
          <Button
            onClick={runAutoML}
            disabled={isAutoMLRunning}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isAutoMLRunning ? 'Running AutoML...' : 'Run AutoML'}
          </Button>
        </div>

        {/* AutoML Progress */}
        {isAutoMLRunning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-orange-400">AutoML Progress</span>
              <span className="text-orange-400 font-mono">{autoMLProgress}%</span>
            </div>
            <Progress value={autoMLProgress} className="h-3" />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Anomalies Detected', value: anomalies.length, icon: AlertTriangle },
            { label: 'Forecast Accuracy', value: '94.2%', icon: Target },
            { label: 'Data Points', value: timeSeriesData.length, icon: Activity },
            { label: 'Models Trained', value: '12', icon: Brain },
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

      <Tabs defaultValue="forecasting" className="w-full">
        <TabsList className="bg-black/40 border-orange-500/30">
          <TabsTrigger value="forecasting">Time Series</TabsTrigger>
          <TabsTrigger value="anomaly">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="automl">AutoML</TabsTrigger>
          <TabsTrigger value="clustering">Clustering</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasting" className="mt-6">
          <Card className="bg-gradient-to-br from-orange-950/20 to-red-950/20 border-orange-500/30 p-6">
            <h4 className="text-orange-400 mb-4">Time Series Forecasting</h4>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#7c2d12" />
                <XAxis dataKey="timestamp" stroke="#f97316" />
                <YAxis stroke="#f97316" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #f97316' }} />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#f97316" fillOpacity={1} fill="url(#colorValue)" name="Actual" />
                <Area type="monotone" dataKey="predicted" stroke="#22d3ee" fillOpacity={1} fill="url(#colorPredicted)" name="Predicted" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="anomaly" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-gradient-to-br from-orange-950/20 to-red-950/20 border-orange-500/30 p-6">
              <h4 className="text-orange-400 mb-4">Anomaly Detection</h4>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={timeSeriesData.map(d => ({ x: d.value, y: d.predicted }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#7c2d12" />
                  <XAxis dataKey="x" name="Actual" stroke="#f97316" />
                  <YAxis dataKey="y" name="Predicted" stroke="#f97316" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #f97316' }} />
                  <Scatter name="Data Points" data={timeSeriesData.map(d => ({ x: d.value, y: d.predicted }))} fill="#f97316" />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-gradient-to-br from-orange-950/20 to-red-950/20 border-orange-500/30 p-6">
              <h4 className="text-orange-400 mb-4">Detected Anomalies</h4>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {anomalies.map((anomaly) => (
                    <Card key={anomaly.id} className="bg-black/40 border-orange-500/30 p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getAnomalyIcon(anomaly.type)}
                          <Badge className={getAnomalyColor(anomaly.severity)}>
                            {anomaly.severity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-orange-300 mb-2">{anomaly.description}</p>
                      <div className="text-xs text-orange-600 space-y-1">
                        <div>Value: <span className="text-orange-400 font-mono">{anomaly.value}</span></div>
                        <div>Expected: <span className="text-orange-400 font-mono">{anomaly.expected}</span></div>
                        <div>Time: <span className="text-orange-400">{anomaly.timestamp.toLocaleString()}</span></div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automl" className="mt-6">
          <Card className="bg-gradient-to-br from-orange-950/20 to-red-950/20 border-orange-500/30 p-6">
            <h4 className="text-orange-400 mb-4">AutoML Pipeline</h4>
            <div className="space-y-4">
              <Card className="bg-black/40 border-orange-500/30 p-4">
                <h5 className="text-orange-400 mb-3">Model Comparison</h5>
                <div className="space-y-2">
                  {[
                    { name: 'Random Forest', accuracy: 94.2, status: 'best' },
                    { name: 'XGBoost', accuracy: 93.8, status: 'good' },
                    { name: 'Neural Network', accuracy: 92.5, status: 'good' },
                    { name: 'Linear Regression', accuracy: 87.3, status: 'ok' },
                  ].map((model, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-black/60 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-orange-300">{model.name}</span>
                        {model.status === 'best' && (
                          <Badge className="bg-green-500/20 border-green-500/50 text-green-400 text-[10px]">
                            Best
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={model.accuracy} className="w-24 h-2" />
                        <span className="text-orange-400 font-mono text-sm">{model.accuracy}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-black/40 border-orange-500/30 p-4">
                <h5 className="text-orange-400 mb-3">Feature Engineering</h5>
                <div className="space-y-2 text-sm text-orange-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Created 12 new features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Removed 3 redundant features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Normalized all numerical features</span>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="clustering" className="mt-6">
          <Card className="bg-gradient-to-br from-orange-950/20 to-red-950/20 border-orange-500/30 p-6">
            <h4 className="text-orange-400 mb-4">Data Clustering & Segmentation</h4>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Cluster 1', size: 450, description: 'High-value customers' },
                { name: 'Cluster 2', size: 320, description: 'Regular users' },
                { name: 'Cluster 3', size: 180, description: 'New users' },
              ].map((cluster, i) => (
                <Card key={i} className="bg-black/40 border-orange-500/30 p-4">
                  <h5 className="text-orange-400 mb-2">{cluster.name}</h5>
                  <p className="text-xs text-orange-600 mb-3">{cluster.description}</p>
                  <div className="text-xl text-orange-400 font-mono mb-1">{cluster.size}</div>
                  <div className="text-xs text-orange-600">Data Points</div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

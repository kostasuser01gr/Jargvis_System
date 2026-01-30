import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Network, TrendingUp, PieChart, Activity, Globe, Layers, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  Treemap,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';

interface Visualization {
  id: string;
  name: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'radar' | 'scatter' | 'treemap' | 'funnel' | 'network' | '3d';
  description: string;
  data: any[];
}

export function AdvancedDataVisualization() {
  const [selectedViz, setSelectedViz] = useState<string>('line');
  const [dataSource, setDataSource] = useState<string>('sample');

  const sampleData = [
    { name: 'Jan', value: 400, value2: 240, value3: 200 },
    { name: 'Feb', value: 300, value2: 139, value3: 180 },
    { name: 'Mar', value: 200, value2: 980, value3: 150 },
    { name: 'Apr', value: 278, value2: 390, value3: 220 },
    { name: 'May', value: 189, value2: 480, value3: 190 },
    { name: 'Jun', value: 239, value2: 380, value3: 250 }
  ];

  const pieData = [
    { name: 'Category A', value: 400, fill: '#22d3ee' },
    { name: 'Category B', value: 300, fill: '#a855f7' },
    { name: 'Category C', value: 200, fill: '#10b981' },
    { name: 'Category D', value: 278, fill: '#f59e0b' }
  ];

  const radarData = [
    { subject: 'Speed', A: 120, B: 110, fullMark: 150 },
    { subject: 'Reliability', A: 98, B: 130, fullMark: 150 },
    { subject: 'Comfort', A: 86, B: 130, fullMark: 150 },
    { subject: 'Safety', A: 99, B: 100, fullMark: 150 },
    { subject: 'Efficiency', A: 85, B: 90, fullMark: 150 }
  ];

  const scatterData = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 100
  }));

  const treemapData = [
    { name: 'A', value: 400, fill: '#22d3ee' },
    { name: 'B', value: 300, fill: '#a855f7' },
    { name: 'C', value: 200, fill: '#10b981' },
    { name: 'D', value: 278, fill: '#f59e0b' },
    { name: 'E', value: 189, fill: '#ef4444' }
  ];

  const funnelData = [
    { name: 'Visitors', value: 1000, fill: '#22d3ee' },
    { name: 'Leads', value: 600, fill: '#a855f7' },
    { name: 'Qualified', value: 400, fill: '#10b981' },
    { name: 'Converted', value: 200, fill: '#f59e0b' }
  ];

  const COLORS = ['#22d3ee', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-indigo-400 flex items-center gap-2">
              <BarChart3 className="w-6 h-5" />
              Advanced Data Visualization
            </h3>
            <p className="text-xs text-indigo-600 mt-1">3D charts, network graphs, and advanced visualizations</p>
          </div>
          <div className="flex gap-2">
            <Select value={dataSource} onValueChange={setDataSource}>
              <SelectTrigger className="w-40 bg-black/60 border-indigo-500/40 text-indigo-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sample">Sample Data</SelectItem>
                <SelectItem value="live">Live Data</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Tabs value={selectedViz} onValueChange={setSelectedViz} className="w-full">
        <TabsList className="bg-black/40 border-indigo-500/30">
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="area">Area Chart</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          <TabsTrigger value="radar">Radar Chart</TabsTrigger>
          <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
          <TabsTrigger value="treemap">Treemap</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Chart</TabsTrigger>
          <TabsTrigger value="network">Network Graph</TabsTrigger>
          <TabsTrigger value="3d">3D Visualization</TabsTrigger>
        </TabsList>

        <TabsContent value="line" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
            <h4 className="text-indigo-400 mb-4">Line Chart</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" />
                <XAxis dataKey="name" stroke="#818cf8" />
                <YAxis stroke="#818cf8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366f1' }} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} />
                <Line type="monotone" dataKey="value2" stroke="#a855f7" strokeWidth={2} />
                <Line type="monotone" dataKey="value3" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="bar" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
            <h4 className="text-indigo-400 mb-4">Bar Chart</h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" />
                <XAxis dataKey="name" stroke="#818cf8" />
                <YAxis stroke="#818cf8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366f1' }} />
                <Legend />
                <Bar dataKey="value" fill="#22d3ee" />
                <Bar dataKey="value2" fill="#a855f7" />
                <Bar dataKey="value3" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="area" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
            <h4 className="text-indigo-400 mb-4">Area Chart</h4>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={sampleData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" />
                <XAxis dataKey="name" stroke="#818cf8" />
                <YAxis stroke="#818cf8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366f1' }} />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#22d3ee" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
            <h4 className="text-indigo-400 mb-4">Pie Chart</h4>
            <ResponsiveContainer width="100%" height={400}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366f1' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
            <h4 className="text-indigo-400 mb-4">Radar Chart</h4>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" stroke="#818cf8" />
                <PolarRadiusAxis stroke="#818cf8" />
                <Radar name="Series A" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.6} />
                <Radar name="Series B" dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366f1' }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="scatter" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
            <h4 className="text-indigo-400 mb-4">Scatter Plot</h4>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" />
                <XAxis type="number" dataKey="x" name="X" stroke="#818cf8" />
                <YAxis type="number" dataKey="y" name="Y" stroke="#818cf8" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366f1' }} />
                <Scatter name="Data Points" data={scatterData} fill="#22d3ee" />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="treemap" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
            <h4 className="text-indigo-400 mb-4">Treemap</h4>
            <ResponsiveContainer width="100%" height={400}>
              <Treemap
                data={treemapData}
                dataKey="value"
                stroke="#4c1d95"
                fill="#8884d8"
              >
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366f1' }} />
              </Treemap>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
            <h4 className="text-indigo-400 mb-4">Funnel Chart</h4>
            <ResponsiveContainer width="100%" height={400}>
              <FunnelChart>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #6366f1' }} />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                >
                  <LabelList position="right" fill="#818cf8" stroke="none" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
            <h4 className="text-indigo-400 mb-4">Network Graph</h4>
            <div className="bg-black/40 rounded-lg border border-indigo-500/20 p-4 h-[400px] flex items-center justify-center">
              <div className="text-center text-indigo-600">
                <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Network Graph Visualization</p>
                <p className="text-xs mt-1">Interactive network graph coming soon</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="3d" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30 p-6">
            <h4 className="text-indigo-400 mb-4">3D Visualization</h4>
            <div className="bg-black/40 rounded-lg border border-indigo-500/20 p-4 h-[400px] flex items-center justify-center">
              <div className="text-center text-indigo-600">
                <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>3D Data Visualization</p>
                <p className="text-xs mt-1">Three.js integration coming soon</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

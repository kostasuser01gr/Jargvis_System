import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, PieChart, TrendingUp, Download, RefreshCw, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#22d3ee', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export function DataVisualization() {
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Sample data
  const [performanceData, setPerformanceData] = useState([
    { name: 'Mon', requests: 4000, errors: 24, latency: 140 },
    { name: 'Tue', requests: 3000, errors: 13, latency: 120 },
    { name: 'Wed', requests: 2000, errors: 98, latency: 160 },
    { name: 'Thu', requests: 2780, errors: 39, latency: 130 },
    { name: 'Fri', requests: 1890, errors: 48, latency: 150 },
    { name: 'Sat', requests: 2390, errors: 38, latency: 110 },
    { name: 'Sun', requests: 3490, errors: 43, latency: 125 }
  ]);

  const [distributionData, setDistributionData] = useState([
    { name: 'API Calls', value: 400 },
    { name: 'Database', value: 300 },
    { name: 'Cache', value: 200 },
    { name: 'CDN', value: 150 },
    { name: 'Other', value: 100 }
  ]);

  const [radarData, setRadarData] = useState([
    { subject: 'Performance', A: 120, B: 110, fullMark: 150 },
    { subject: 'Security', A: 98, B: 130, fullMark: 150 },
    { subject: 'Reliability', A: 86, B: 130, fullMark: 150 },
    { subject: 'Scalability', A: 99, B: 100, fullMark: 150 },
    { subject: 'Efficiency', A: 85, B: 90, fullMark: 150 },
    { subject: 'Response', A: 65, B: 85, fullMark: 150 }
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate data refresh with slight variations
      setPerformanceData(prev => prev.map(item => ({
        ...item,
        requests: item.requests + Math.floor(Math.random() * 200 - 100),
        errors: Math.max(0, item.errors + Math.floor(Math.random() * 10 - 5))
      })));
      setRefreshing(false);
    }, 1000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ performanceData, distributionData, radarData }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jarvis-analytics-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-cyan-400">Advanced Data Visualization</h3>
              <p className="text-xs text-cyan-600">Real-time analytics dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-black/60 border-cyan-500/40 text-cyan-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Button
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              size="sm"
              onClick={handleExport}
              className="bg-blue-500/20 border border-blue-500/50 text-blue-400"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-cyan-400">Request Performance</h4>
            <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5%
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.1)" />
              <XAxis dataKey="name" stroke="#0e7490" style={{ fontSize: '12px' }} />
              <YAxis stroke="#0e7490" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="requests" 
                stroke="#22d3ee" 
                fillOpacity={1} 
                fill="url(#colorRequests)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Distribution Pie Chart */}
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-cyan-400">Resource Distribution</h4>
            <Badge className="bg-cyan-500/20 border-cyan-500/50 text-cyan-400">
              <PieChart className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '8px'
                }} 
              />
            </RePieChart>
          </ResponsiveContainer>
        </Card>

        {/* Error Rate */}
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-cyan-400">Error Rate Analysis</h4>
            <Badge className="bg-red-500/20 border-red-500/50 text-red-400">
              0.12% errors
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.1)" />
              <XAxis dataKey="name" stroke="#0e7490" style={{ fontSize: '12px' }} />
              <YAxis stroke="#0e7490" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="errors" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* System Health Radar */}
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-cyan-400">System Health Score</h4>
            <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
              Excellent
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(34, 211, 238, 0.2)" />
              <PolarAngleAxis dataKey="subject" stroke="#0e7490" style={{ fontSize: '12px' }} />
              <PolarRadiusAxis stroke="#0e7490" />
              <Radar name="Current" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
              <Radar name="Target" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Legend />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '8px'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: '2.4M', change: '+12.5%', color: 'cyan' },
          { label: 'Avg Response', value: '132ms', change: '-8.2%', color: 'green' },
          { label: 'Error Rate', value: '0.12%', change: '+0.02%', color: 'red' },
          { label: 'Uptime', value: '99.98%', change: '+0.01%', color: 'blue' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-4">
              <div className="text-xs text-cyan-600 mb-2">{stat.label}</div>
              <div className={`text-2xl text-${stat.color}-400 font-mono mb-1`}>{stat.value}</div>
              <div className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change} from last period
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

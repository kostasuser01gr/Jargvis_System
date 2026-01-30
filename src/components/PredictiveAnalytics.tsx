import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Brain, Zap, Activity, BarChart3 } from 'lucide-react';
import { Card } from './ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function PredictiveAnalytics() {
  const [demandData, setDemandData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [predictions, setPredictions] = useState({
    nextHourDemand: 0,
    revenueIncrease: 0,
    optimalPricing: 0,
    customerSatisfaction: 0
  });

  useEffect(() => {
    // Generate initial data
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    
    const demand = hours.map((hour, i) => ({
      time: hour,
      actual: 20 + Math.random() * 60,
      predicted: 25 + Math.random() * 55,
      confidence: 85 + Math.random() * 10
    }));

    const revenue = hours.map((hour, i) => ({
      time: hour,
      value: 1000 + Math.random() * 3000,
      trend: 1200 + Math.random() * 2800
    }));

    const performance = [
      { metric: 'Efficiency', value: 85, max: 100 },
      { metric: 'Response', value: 92, max: 100 },
      { metric: 'Accuracy', value: 88, max: 100 },
      { metric: 'Speed', value: 90, max: 100 },
      { metric: 'Quality', value: 95, max: 100 }
    ];

    setDemandData(demand);
    setRevenueData(revenue);
    setPerformanceData(performance);

    // Update predictions
    const interval = setInterval(() => {
      setPredictions({
        nextHourDemand: 40 + Math.random() * 30,
        revenueIncrease: 5 + Math.random() * 15,
        optimalPricing: 45 + Math.random() * 30,
        customerSatisfaction: 85 + Math.random() * 10
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI-Powered Predictive Analytics
            </h3>
            <p className="text-xs text-cyan-600 mt-1">Machine learning forecasting and insights</p>
          </div>
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-1.5"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">AI Active</span>
          </motion.div>
        </div>

        {/* Prediction Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-600">Next Hour Demand</span>
            </div>
            <div className="text-2xl text-cyan-400 font-mono">
              {predictions.nextHourDemand.toFixed(0)}%
            </div>
            <div className="text-xs text-green-400 mt-1">↑ High confidence</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-600">Revenue Increase</span>
            </div>
            <div className="text-2xl text-green-400 font-mono">
              +{predictions.revenueIncrease.toFixed(1)}%
            </div>
            <div className="text-xs text-green-400 mt-1">↑ Projected</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-600">Optimal Pricing</span>
            </div>
            <div className="text-2xl text-purple-400 font-mono">
              ${predictions.optimalPricing.toFixed(0)}
            </div>
            <div className="text-xs text-purple-400 mt-1">Per day</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-600">Satisfaction</span>
            </div>
            <div className="text-2xl text-yellow-400 font-mono">
              {predictions.customerSatisfaction.toFixed(0)}%
            </div>
            <div className="text-xs text-yellow-400 mt-1">Predicted</div>
          </motion.div>
        </div>

        {/* Demand Forecast Chart */}
        <div className="mb-6">
          <h4 className="text-sm text-cyan-400 mb-3">Demand Forecast</h4>
          <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={demandData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.1)" />
                <XAxis dataKey="time" stroke="#0e7490" style={{ fontSize: '12px' }} />
                <YAxis stroke="#0e7490" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="actual" stroke="#22d3ee" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
                <Area type="monotone" dataKey="predicted" stroke="#a78bfa" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Radar */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm text-cyan-400 mb-3">Performance Metrics</h4>
            <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="rgba(34, 211, 238, 0.2)" />
                  <PolarAngleAxis dataKey="metric" stroke="#22d3ee" style={{ fontSize: '12px' }} />
                  <PolarRadiusAxis stroke="#0e7490" style={{ fontSize: '10px' }} />
                  <Radar name="Score" dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-cyan-400 mb-3">Revenue Trend</h4>
            <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.1)" />
                  <XAxis dataKey="time" stroke="#0e7490" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#0e7490" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                      border: '1px solid rgba(34, 211, 238, 0.3)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                  <Line type="monotone" dataKey="trend" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

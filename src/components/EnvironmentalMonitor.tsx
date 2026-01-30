import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, Eye, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export function EnvironmentalMonitor() {
  const [weatherData, setWeatherData] = useState({
    temperature: 72,
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 5,
    airQuality: 85,
    precipitation: 20,
    pressure: 1013
  });

  const [conditions, setConditions] = useState<'sunny' | 'cloudy' | 'rainy' | 'stormy'>('sunny');
  const [alerts, setAlerts] = useState<Array<{ type: string; message: string }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(prev => ({
        temperature: Math.max(40, Math.min(100, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 5)),
        windSpeed: Math.max(0, Math.min(60, prev.windSpeed + (Math.random() - 0.5) * 3)),
        visibility: Math.max(0, Math.min(10, prev.visibility + (Math.random() - 0.5) * 0.5)),
        uvIndex: Math.max(0, Math.min(11, prev.uvIndex + (Math.random() - 0.5) * 0.5)),
        airQuality: Math.max(0, Math.min(100, prev.airQuality + (Math.random() - 0.5) * 3)),
        precipitation: Math.max(0, Math.min(100, prev.precipitation + (Math.random() - 0.5) * 10)),
        pressure: Math.max(980, Math.min(1040, prev.pressure + (Math.random() - 0.5) * 2))
      }));

      // Update conditions based on data
      if (weatherData.precipitation > 70) {
        setConditions('stormy');
      } else if (weatherData.precipitation > 40) {
        setConditions('rainy');
      } else if (weatherData.humidity > 70) {
        setConditions('cloudy');
      } else {
        setConditions('sunny');
      }

      // Generate alerts
      const newAlerts: Array<{ type: string; message: string }> = [];
      if (weatherData.windSpeed > 40) {
        newAlerts.push({ type: 'warning', message: 'High wind advisory' });
      }
      if (weatherData.visibility < 3) {
        newAlerts.push({ type: 'caution', message: 'Reduced visibility' });
      }
      if (weatherData.uvIndex > 8) {
        newAlerts.push({ type: 'info', message: 'High UV exposure' });
      }
      if (weatherData.airQuality < 50) {
        newAlerts.push({ type: 'warning', message: 'Poor air quality' });
      }
      setAlerts(newAlerts);
    }, 3000);

    return () => clearInterval(interval);
  }, [weatherData]);

  const getConditionIcon = () => {
    switch (conditions) {
      case 'sunny': return <Sun className="w-12 h-12 text-yellow-400" />;
      case 'cloudy': return <Cloud className="w-12 h-12 text-gray-400" />;
      case 'rainy': return <CloudRain className="w-12 h-12 text-blue-400" />;
      case 'stormy': return <CloudRain className="w-12 h-12 text-purple-400" />;
    }
  };

  const getAirQualityColor = (quality: number) => {
    if (quality > 80) return 'text-green-400';
    if (quality > 60) return 'text-yellow-400';
    if (quality > 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-cyan-400 flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Environmental Monitor
          </h3>
          <p className="text-xs text-cyan-600 mt-1">Real-time atmospheric conditions</p>
        </div>
        <Badge className="bg-cyan-500/20 border-cyan-500/50 text-cyan-400 capitalize">
          {conditions}
        </Badge>
      </div>

      {/* Main Weather Display */}
      <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: conditions === 'sunny' ? [0, 360] : 0
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {getConditionIcon()}
            </motion.div>
            <div className="mt-3">
              <div className="text-4xl text-cyan-400 font-mono">{weatherData.temperature.toFixed(1)}°F</div>
              <div className="text-sm text-cyan-600 mt-1">Feels like {(weatherData.temperature - 2).toFixed(1)}°F</div>
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="flex items-center gap-2 justify-end">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-cyan-400">{weatherData.humidity.toFixed(0)}% Humidity</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">{weatherData.windSpeed.toFixed(1)} mph</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">{weatherData.visibility.toFixed(1)} mi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-cyan-600">UV Index</span>
          </div>
          <div className="text-2xl text-cyan-400 font-mono mb-2">{weatherData.uvIndex.toFixed(1)}</div>
          <Progress 
            value={(weatherData.uvIndex / 11) * 100} 
            className="h-2"
          />
        </div>

        <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-600">Air Quality</span>
          </div>
          <div className={`text-2xl font-mono mb-2 ${getAirQualityColor(weatherData.airQuality)}`}>
            {weatherData.airQuality.toFixed(0)}
          </div>
          <Progress 
            value={weatherData.airQuality} 
            className="h-2"
          />
        </div>

        <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CloudRain className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-cyan-600">Precipitation</span>
          </div>
          <div className="text-2xl text-cyan-400 font-mono mb-2">{weatherData.precipitation.toFixed(0)}%</div>
          <Progress 
            value={weatherData.precipitation} 
            className="h-2"
          />
        </div>

        <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Thermometer className="w-4 h-4 text-red-400" />
            <span className="text-sm text-cyan-600">Pressure</span>
          </div>
          <div className="text-2xl text-cyan-400 font-mono mb-2">{weatherData.pressure.toFixed(0)}</div>
          <div className="text-xs text-cyan-600">hPa</div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm text-cyan-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" />
            Active Alerts
          </h4>
          {alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-2 p-3 rounded border ${
                alert.type === 'warning' 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : alert.type === 'caution'
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{alert.message}</span>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}

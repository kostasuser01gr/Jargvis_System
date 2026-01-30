import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Clock, CheckCircle2, AlertCircle, Play, Pause, SkipForward } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';

interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'pending' | 'failed';
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  startTime: Date;
  estimatedCompletion: Date;
  objectives: Array<{ id: string; text: string; completed: boolean }>;
}

export function MissionControl() {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'M-001',
      title: 'Cluster Optimization',
      description: 'Optimize resource distribution across compute clusters',
      status: 'active',
      progress: 67,
      priority: 'high',
      startTime: new Date(Date.now() - 3600000),
      estimatedCompletion: new Date(Date.now() + 1800000),
      objectives: [
        { id: 'O1', text: 'Analyze demand patterns', completed: true },
        { id: 'O2', text: 'Redistribute vehicles', completed: true },
        { id: 'O3', text: 'Update pricing model', completed: false },
        { id: 'O4', text: 'Notify drivers', completed: false }
      ]
    },
    {
      id: 'M-002',
      title: 'Security Audit',
      description: 'Complete system-wide security assessment',
      status: 'active',
      progress: 34,
      priority: 'critical',
      startTime: new Date(Date.now() - 7200000),
      estimatedCompletion: new Date(Date.now() + 3600000),
      objectives: [
        { id: 'O1', text: 'Scan for vulnerabilities', completed: true },
        { id: 'O2', text: 'Update firewall rules', completed: false },
        { id: 'O3', text: 'Patch systems', completed: false },
        { id: 'O4', text: 'Generate report', completed: false }
      ]
    },
    {
      id: 'M-003',
      title: 'Revenue Analysis',
      description: 'Quarterly revenue and performance analysis',
      status: 'pending',
      progress: 0,
      priority: 'medium',
      startTime: new Date(Date.now() + 3600000),
      estimatedCompletion: new Date(Date.now() + 10800000),
      objectives: [
        { id: 'O1', text: 'Collect data', completed: false },
        { id: 'O2', text: 'Run analytics', completed: false },
        { id: 'O3', text: 'Create visualizations', completed: false },
        { id: 'O4', text: 'Present findings', completed: false }
      ]
    }
  ]);

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setMissions(prev => prev.map(mission => {
        if (mission.status === 'active') {
          const newProgress = Math.min(100, mission.progress + Math.random() * 2);
          const completedCount = Math.floor((newProgress / 100) * mission.objectives.length);
          
          return {
            ...mission,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'active',
            objectives: mission.objectives.map((obj, idx) => ({
              ...obj,
              completed: idx < completedCount
            }))
          };
        }
        return mission;
      }));

      // Update time remaining
      const newTimeRemaining: Record<string, number> = {};
      missions.forEach(mission => {
        newTimeRemaining[mission.id] = Math.max(0, mission.estimatedCompletion.getTime() - Date.now());
      });
      setTimeRemaining(newTimeRemaining);
    }, 2000);

    return () => clearInterval(interval);
  }, [missions]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      case 'high': return 'text-orange-400 border-orange-500/50 bg-orange-500/10';
      case 'critical': return 'text-red-400 border-red-500/50 bg-red-500/10';
      default: return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-500/50 bg-green-500/10';
      case 'completed': return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
      case 'pending': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      case 'failed': return 'text-red-400 border-red-500/50 bg-red-500/10';
      default: return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-cyan-400 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Mission Control Center
          </h3>
          <p className="text-xs text-cyan-600 mt-1">Active operations and task management</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
            {missions.filter(m => m.status === 'active').length} Active
          </Badge>
          <Badge className="bg-blue-500/20 border-blue-500/50 text-blue-400">
            {missions.filter(m => m.status === 'completed').length} Complete
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          <AnimatePresence>
            {missions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 cursor-pointer hover:border-cyan-500/50 transition-all"
                onClick={() => setSelectedMission(mission)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={mission.status === 'active' ? {
                        rotate: 360
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center"
                    >
                      <Target className="w-5 h-5 text-cyan-400" />
                    </motion.div>
                    <div>
                      <div className="text-cyan-400 font-mono">{mission.id}</div>
                      <div className="text-sm text-cyan-200">{mission.title}</div>
                      <div className="text-xs text-cyan-600 mt-1">{mission.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(mission.status)}>
                      {mission.status === 'active' && <Play className="w-3 h-3 mr-1" />}
                      {mission.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {mission.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {mission.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {mission.status}
                    </Badge>
                    <Badge className={getPriorityColor(mission.priority)}>
                      {mission.priority}
                    </Badge>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-cyan-600">Progress</span>
                    <span className="text-cyan-400 font-mono">{mission.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={mission.progress} className="h-2" />
                </div>

                {/* Time Info */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="text-cyan-600">
                    Started: {mission.startTime.toLocaleTimeString()}
                  </div>
                  {mission.status === 'active' && timeRemaining[mission.id] && (
                    <div className="text-cyan-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(timeRemaining[mission.id])} remaining
                    </div>
                  )}
                </div>

                {/* Objectives */}
                <div className="space-y-1.5">
                  {mission.objectives.map(objective => (
                    <div
                      key={objective.id}
                      className="flex items-center gap-2 text-xs"
                    >
                      {objective.completed ? (
                        <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-cyan-500/30 flex-shrink-0" />
                      )}
                      <span className={objective.completed ? 'text-cyan-600 line-through' : 'text-cyan-400'}>
                        {objective.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-cyan-500/20 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 text-xs">
                    <Play className="w-3 h-3 mr-1" />
                    Resume
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 text-xs">
                    <Pause className="w-3 h-3 mr-1" />
                    Pause
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 text-xs">
                    <SkipForward className="w-3 h-3 mr-1" />
                    Skip
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </Card>
  );
}

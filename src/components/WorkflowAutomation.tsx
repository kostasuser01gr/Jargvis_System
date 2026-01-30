import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Workflow, Play, Pause, Plus, Trash2, Edit, Clock, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface WorkflowStep {
  id: string;
  type: 'api' | 'database' | 'condition' | 'transform' | 'notification';
  name: string;
  config: any;
}

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'active' | 'paused' | 'error';
  lastRun?: Date;
  runCount: number;
  trigger: 'manual' | 'schedule' | 'event';
}

export function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([
    {
      id: '1',
      name: 'Daily System Backup',
      description: 'Automated backup of all system data',
      steps: [
        { id: 's1', type: 'database', name: 'Export Database', config: {} },
        { id: 's2', type: 'api', name: 'Upload to Cloud', config: {} },
        { id: 's3', type: 'notification', name: 'Send Success Email', config: {} }
      ],
      status: 'active',
      lastRun: new Date(),
      runCount: 247,
      trigger: 'schedule'
    },
    {
      id: '2',
      name: 'AI Model Training',
      description: 'Train neural network with new data',
      steps: [
        { id: 's1', type: 'database', name: 'Fetch Training Data', config: {} },
        { id: 's2', type: 'transform', name: 'Preprocess Data', config: {} },
        { id: 's3', type: 'api', name: 'Train Model', config: {} }
      ],
      status: 'paused',
      runCount: 12,
      trigger: 'manual'
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
    toast.success('Workflow status updated');
  };

  const runWorkflow = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `Running ${workflow?.name}...`,
        success: `${workflow?.name} completed successfully!`,
        error: 'Workflow failed'
      }
    );

    setWorkflows(prev => prev.map(w => 
      w.id === id 
        ? { ...w, lastRun: new Date(), runCount: w.runCount + 1 }
        : w
    ));
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    toast.success('Workflow deleted');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'paused': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return '🌐';
      case 'database': return '💾';
      case 'condition': return '🔀';
      case 'transform': return '⚙️';
      case 'notification': return '📧';
      default: return '⚡';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workflow List */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <Workflow className="w-5 h-5" />
              Workflow Automation
            </h3>
            <p className="text-xs text-cyan-600 mt-1">Automate repetitive tasks</p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            <AnimatePresence>
              {workflows.map((workflow) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 transition-all cursor-pointer"
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-cyan-400">{workflow.name}</h4>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-cyan-300 mb-3">{workflow.description}</p>
                      
                      {/* Steps Preview */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {workflow.steps.map((step, i) => (
                          <div key={step.id} className="flex items-center gap-1">
                            <div className="text-xs bg-cyan-500/10 border border-cyan-500/30 rounded px-2 py-1">
                              {getTypeIcon(step.type)} {step.name}
                            </div>
                            {i < workflow.steps.length - 1 && (
                              <span className="text-cyan-600">→</span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-cyan-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {workflow.trigger}
                        </span>
                        <span>•</span>
                        <span>Runs: {workflow.runCount}</span>
                        {workflow.lastRun && (
                          <>
                            <span>•</span>
                            <span>Last: {workflow.lastRun.toLocaleTimeString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-cyan-500/20">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        runWorkflow(workflow.id);
                      }}
                      className="flex-1 bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Run Now
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWorkflow(workflow.id);
                      }}
                      className="flex-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30"
                    >
                      {workflow.status === 'active' ? (
                        <>
                          <Pause className="w-3 h-3 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWorkflow(workflow.id);
                      }}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </Card>

      {/* Workflow Details / Builder */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        {selectedWorkflow ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-cyan-400">Workflow Details</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedWorkflow(null)}
                className="border-cyan-500/30 text-cyan-400"
              >
                <Edit className="w-3 h-3 mr-2" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-cyan-600 mb-2 block">Workflow Name</label>
                <Input
                  value={selectedWorkflow.name}
                  readOnly
                  className="bg-black/60 border-cyan-500/40 text-cyan-100"
                />
              </div>

              <div>
                <label className="text-xs text-cyan-600 mb-2 block">Trigger Type</label>
                <Select value={selectedWorkflow.trigger}>
                  <SelectTrigger className="bg-black/60 border-cyan-500/40 text-cyan-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-cyan-600 mb-3 block">Workflow Steps</label>
                <ScrollArea className="h-[350px]">
                  <div className="space-y-3">
                    {selectedWorkflow.steps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-black/40 border border-cyan-500/20 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center text-cyan-400 text-xs">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-cyan-400">{step.name}</div>
                            <div className="text-xs text-cyan-600 capitalize">{step.type}</div>
                          </div>
                          <div className="text-2xl">{getTypeIcon(step.type)}</div>
                        </div>
                        {index < selectedWorkflow.steps.length - 1 && (
                          <div className="flex justify-center mt-2">
                            <div className="w-0.5 h-4 bg-cyan-500/30" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Statistics */}
              <div className="pt-4 border-t border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cyan-600">Total Runs</span>
                  <span className="text-cyan-400 font-mono">{selectedWorkflow.runCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cyan-600">Success Rate</span>
                  <span className="text-green-400 font-mono">98.7%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cyan-600">Avg Duration</span>
                  <span className="text-cyan-400 font-mono">2.4s</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-cyan-600">
            <div className="text-center">
              <Workflow className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a workflow to view details</p>
              <p className="text-xs mt-2">or create a new one</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

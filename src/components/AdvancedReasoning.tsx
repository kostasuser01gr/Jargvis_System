import { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, TreePine, Network, Sparkles, Play, Settings, TrendingUp, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface ReasoningStep {
  id: string;
  type: 'thought' | 'action' | 'result';
  content: string;
  confidence: number;
  timestamp: Date;
}

interface ReasoningPath {
  id: string;
  steps: ReasoningStep[];
  score: number;
  selected: boolean;
}

export function AdvancedReasoning() {
  const [reasoningMode, setReasoningMode] = useState<'chain' | 'tree' | 'self-consistency' | 'reflexion'>('chain');
  const [isReasoning, setIsReasoning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const [reasoningPaths, setReasoningPaths] = useState<ReasoningPath[]>([]);
  const [query, setQuery] = useState('Solve: If a train travels 120 km in 2 hours, and another train travels 180 km in 3 hours, which train is faster?');

  const startReasoning = () => {
    setIsReasoning(true);
    setCurrentStep(0);
    setReasoningSteps([]);
    setReasoningPaths([]);

    if (reasoningMode === 'chain') {
      const steps: ReasoningStep[] = [
        { id: '1', type: 'thought', content: 'Let me break down this problem step by step.', confidence: 0.9, timestamp: new Date() },
        { id: '2', type: 'action', content: 'Calculate speed of first train: 120 km / 2 hours = 60 km/h', confidence: 1.0, timestamp: new Date() },
        { id: '3', type: 'action', content: 'Calculate speed of second train: 180 km / 3 hours = 60 km/h', confidence: 1.0, timestamp: new Date() },
        { id: '4', type: 'result', content: 'Both trains travel at the same speed: 60 km/h', confidence: 1.0, timestamp: new Date() },
      ];
      
      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < steps.length) {
          setReasoningSteps(prev => [...prev, steps[stepIndex]]);
          setCurrentStep(stepIndex + 1);
          stepIndex++;
        } else {
          clearInterval(interval);
          setIsReasoning(false);
          toast.success('Reasoning completed!');
        }
      }, 1500);
    } else if (reasoningMode === 'tree') {
      const paths: ReasoningPath[] = [
        {
          id: 'path-1',
          steps: [
            { id: '1', type: 'thought', content: 'Path 1: Direct calculation approach', confidence: 0.9, timestamp: new Date() },
            { id: '2', type: 'action', content: 'Calculate both speeds directly', confidence: 0.95, timestamp: new Date() },
          ],
          score: 0.95,
          selected: true
        },
        {
          id: 'path-2',
          steps: [
            { id: '1', type: 'thought', content: 'Path 2: Ratio comparison approach', confidence: 0.85, timestamp: new Date() },
            { id: '2', type: 'action', content: 'Compare distance/time ratios', confidence: 0.9, timestamp: new Date() },
          ],
          score: 0.9,
          selected: false
        },
        {
          id: 'path-3',
          steps: [
            { id: '1', type: 'thought', content: 'Path 3: Unit conversion approach', confidence: 0.8, timestamp: new Date() },
            { id: '2', type: 'action', content: 'Convert to m/s for comparison', confidence: 0.85, timestamp: new Date() },
          ],
          score: 0.85,
          selected: false
        }
      ];
      setReasoningPaths(paths);
      setIsReasoning(false);
      toast.success('Tree of thoughts generated!');
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'thought': return <Brain className="w-4 h-4" />;
      case 'action': return <Network className="w-4 h-4" />;
      case 'result': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'thought': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'action': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'result': return 'bg-green-500/20 border-green-500/50 text-green-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-sky-950/20 to-blue-950/20 border-sky-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sky-400 flex items-center gap-2">
              <Brain className="w-6 h-5" />
              Advanced Reasoning Engine
            </h3>
            <p className="text-xs text-sky-600 mt-1">Chain-of-Thought, Tree of Thoughts, and Self-Consistency reasoning</p>
          </div>
          <Button
            onClick={startReasoning}
            disabled={isReasoning}
            className="bg-gradient-to-r from-sky-500 to-blue-500 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            {isReasoning ? 'Reasoning...' : 'Start Reasoning'}
          </Button>
        </div>

        {/* Reasoning Mode Selection */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'chain', name: 'Chain-of-Thought', icon: Network },
            { id: 'tree', name: 'Tree of Thoughts', icon: TreePine },
            { id: 'self-consistency', name: 'Self-Consistency', icon: CheckCircle2 },
            { id: 'reflexion', name: 'Reflexion', icon: Sparkles },
          ].map((mode) => (
            <Card
              key={mode.id}
              className={`p-3 cursor-pointer transition-all ${
                reasoningMode === mode.id
                  ? 'bg-sky-500/20 border-sky-500/50'
                  : 'bg-black/40 border-sky-500/30 hover:border-sky-500/40'
              }`}
              onClick={() => setReasoningMode(mode.id as any)}
            >
              <mode.icon className={`w-5 h-5 mb-2 ${reasoningMode === mode.id ? 'text-sky-400' : 'text-sky-600'}`} />
              <p className={`text-xs ${reasoningMode === mode.id ? 'text-sky-400' : 'text-sky-600'}`}>{mode.name}</p>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Input */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-sky-950/20 to-blue-950/20 border-sky-500/30 p-6">
          <Tabs defaultValue="query" className="w-full">
            <TabsList className="bg-black/40 border-sky-500/30">
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="steps">Reasoning Steps</TabsTrigger>
              <TabsTrigger value="paths">Reasoning Paths</TabsTrigger>
            </TabsList>

            <TabsContent value="query" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-sky-600 mb-2 block">Enter your query or problem</label>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-black/60 border border-sky-500/40 rounded px-3 py-2 text-sky-100 min-h-[200px]"
                    placeholder="Enter a problem or question that requires reasoning..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={startReasoning}
                    disabled={isReasoning || !query}
                    className="bg-sky-500/20 border-sky-500/50 text-sky-400 hover:bg-sky-500/30"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Analyze
                  </Button>
                  <Button
                    variant="outline"
                    className="border-sky-500/30 text-sky-400 hover:bg-sky-500/20"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="steps" className="mt-6">
              <ScrollArea className="h-[500px]">
                {reasoningSteps.length === 0 ? (
                  <div className="text-center text-sky-600 py-8">
                    <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No reasoning steps yet</p>
                    <p className="text-xs mt-1">Start reasoning to see step-by-step analysis</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reasoningSteps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-black/40 border border-sky-500/30 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`p-2 rounded ${getStepColor(step.type)}`}>
                            {getStepIcon(step.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <Badge className={getStepColor(step.type)}>
                                {step.type}
                              </Badge>
                              <span className="text-xs text-sky-600">
                                Step {index + 1} of {reasoningSteps.length}
                              </span>
                            </div>
                            <p className="text-sm text-sky-300 mb-2">{step.content}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-sky-600">Confidence:</span>
                              <Progress value={step.confidence * 100} className="flex-1 h-1" />
                              <span className="text-xs text-sky-400 font-mono">{(step.confidence * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="paths" className="mt-6">
              <ScrollArea className="h-[500px]">
                {reasoningPaths.length === 0 ? (
                  <div className="text-center text-sky-600 py-8">
                    <TreePine className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No reasoning paths generated</p>
                    <p className="text-xs mt-1">Use Tree of Thoughts mode to explore multiple paths</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reasoningPaths.map((path) => (
                      <Card
                        key={path.id}
                        className={`p-4 ${
                          path.selected
                            ? 'bg-sky-500/20 border-sky-500/50'
                            : 'bg-black/40 border-sky-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TreePine className="w-4 h-4 text-sky-400" />
                            <span className="text-sky-400 font-mono">{path.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-sky-600">Score:</span>
                            <span className="text-sky-400 font-mono">{(path.score * 100).toFixed(1)}%</span>
                            {path.selected && (
                              <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {path.steps.map((step) => (
                            <div key={step.id} className="text-xs text-sky-300 pl-4 border-l border-sky-500/30">
                              {step.content}
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Reasoning Stats & Info */}
        <Card className="bg-gradient-to-br from-sky-950/20 to-blue-950/20 border-sky-500/30 p-6">
          <h4 className="text-sky-400 mb-4">Reasoning Statistics</h4>
          
          <div className="space-y-4">
            <Card className="bg-black/40 border-sky-500/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-sky-600">Current Mode</span>
                <Badge className="bg-sky-500/20 border-sky-500/50 text-sky-400">
                  {reasoningMode === 'chain' ? 'Chain-of-Thought' :
                   reasoningMode === 'tree' ? 'Tree of Thoughts' :
                   reasoningMode === 'self-consistency' ? 'Self-Consistency' : 'Reflexion'}
                </Badge>
              </div>
            </Card>

            <Card className="bg-black/40 border-sky-500/30 p-3">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-sky-600">Steps Generated:</span>
                  <span className="text-sky-400 font-mono">{reasoningSteps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-600">Paths Explored:</span>
                  <span className="text-sky-400 font-mono">{reasoningPaths.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-600">Avg Confidence:</span>
                  <span className="text-sky-400 font-mono">
                    {reasoningSteps.length > 0
                      ? ((reasoningSteps.reduce((sum, s) => sum + s.confidence, 0) / reasoningSteps.length) * 100).toFixed(1)
                      : '0'}%
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-black/40 border-sky-500/30 p-3">
              <h5 className="text-sky-400 text-sm mb-2">Mode Capabilities</h5>
              <div className="space-y-1 text-xs text-sky-600">
                {reasoningMode === 'chain' && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Step-by-step reasoning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Linear problem solving</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>High interpretability</span>
                    </div>
                  </>
                )}
                {reasoningMode === 'tree' && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Multiple reasoning paths</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Best path selection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Exploration of alternatives</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}

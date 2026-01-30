import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play, Settings, Layers, TrendingUp, Zap, Database, Target, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface FineTuningMethod {
  id: string;
  name: string;
  description: string;
  efficiency: number;
  memoryUsage: number;
  recommended: boolean;
}

interface FineTuningConfig {
  method: 'full' | 'lora' | 'qlora' | 'adapter' | 'prompt' | 'prefix';
  baseModel: string;
  learningRate: number;
  epochs: number;
  batchSize: number;
  rank?: number;
  alpha?: number;
  targetModules: string[];
}

export function FineTuningInterface() {
  const [isFineTuning, setIsFineTuning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [config, setConfig] = useState<FineTuningConfig>({
    method: 'lora',
    baseModel: 'GPT-4',
    learningRate: 0.0001,
    epochs: 3,
    batchSize: 4,
    rank: 16,
    alpha: 32,
    targetModules: ['q_proj', 'v_proj']
  });

  const methods: FineTuningMethod[] = [
    {
      id: 'full',
      name: 'Full Fine-Tuning',
      description: 'Update all model parameters',
      efficiency: 30,
      memoryUsage: 100,
      recommended: false
    },
    {
      id: 'lora',
      name: 'LoRA (Low-Rank Adaptation)',
      description: 'Efficient fine-tuning with low-rank matrices',
      efficiency: 90,
      memoryUsage: 20,
      recommended: true
    },
    {
      id: 'qlora',
      name: 'QLoRA (Quantized LoRA)',
      description: 'Memory-efficient LoRA with quantization',
      efficiency: 95,
      memoryUsage: 10,
      recommended: true
    },
    {
      id: 'adapter',
      name: 'Adapter Layers',
      description: 'Add task-specific adapter modules',
      efficiency: 85,
      memoryUsage: 15,
      recommended: false
    },
    {
      id: 'prompt',
      name: 'Prompt Tuning',
      description: 'Learn soft prompts',
      efficiency: 80,
      memoryUsage: 5,
      recommended: false
    },
    {
      id: 'prefix',
      name: 'Prefix Tuning',
      description: 'Learn task-specific prefixes',
      efficiency: 75,
      memoryUsage: 8,
      recommended: false
    }
  ];

  const startFineTuning = () => {
    setIsFineTuning(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFineTuning(false);
          toast.success('Fine-tuning completed successfully!');
          return 100;
        }
        return prev + 1;
      });
    }, 200);
  };

  const selectedMethod = methods.find(m => m.id === config.method) || methods[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-fuchsia-950/20 to-purple-950/20 border-fuchsia-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-fuchsia-400 flex items-center gap-2">
              <Sparkles className="w-6 h-5" />
              Fine-Tuning & Customization
            </h3>
            <p className="text-xs text-fuchsia-600 mt-1">Customize models for specific tasks and domains</p>
          </div>
          <Button
            onClick={startFineTuning}
            disabled={isFineTuning}
            className="bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            {isFineTuning ? 'Fine-Tuning...' : 'Start Fine-Tuning'}
          </Button>
        </div>

        {/* Progress */}
        {isFineTuning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-fuchsia-400">Fine-Tuning Progress</span>
              <span className="text-fuchsia-400 font-mono">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Method Selection */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-fuchsia-950/20 to-purple-950/20 border-fuchsia-500/30 p-6">
          <h4 className="text-fuchsia-400 mb-4">Fine-Tuning Methods</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {methods.map((method) => (
              <Card
                key={method.id}
                className={`p-4 cursor-pointer transition-all ${
                  config.method === method.id
                    ? 'bg-fuchsia-500/20 border-fuchsia-500/50'
                    : 'bg-black/40 border-fuchsia-500/30 hover:border-fuchsia-500/40'
                }`}
                onClick={() => setConfig({ ...config, method: method.id as any })}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-fuchsia-400">{method.name}</h5>
                      {method.recommended && (
                        <Badge className="bg-green-500/20 border-green-500/50 text-green-400 text-[10px]">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-fuchsia-600">{method.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <span className="text-fuchsia-600">Efficiency:</span>
                    <div className="text-fuchsia-400 font-mono">{method.efficiency}%</div>
                  </div>
                  <div>
                    <span className="text-fuchsia-600">Memory:</span>
                    <div className="text-fuchsia-400 font-mono">{method.memoryUsage}%</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="config" className="w-full">
            <TabsList className="bg-black/40 border-fuchsia-500/30">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-fuchsia-600 mb-2 block">Base Model</label>
                  <select
                    value={config.baseModel}
                    onChange={(e) => setConfig({ ...config, baseModel: e.target.value })}
                    className="w-full bg-black/60 border border-fuchsia-500/40 rounded px-3 py-2 text-fuchsia-300"
                  >
                    <option value="GPT-4">GPT-4</option>
                    <option value="GPT-3.5">GPT-3.5 Turbo</option>
                    <option value="Claude-3">Claude 3 Opus</option>
                    <option value="Llama-3">Llama 3 70B</option>
                    <option value="Gemini">Gemini Ultra</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-fuchsia-600 mb-2 block">Learning Rate</label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={config.learningRate}
                      onChange={(e) => setConfig({ ...config, learningRate: parseFloat(e.target.value) })}
                      className="bg-black/60 border-fuchsia-500/40 text-fuchsia-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-fuchsia-600 mb-2 block">Epochs</label>
                    <Input
                      type="number"
                      value={config.epochs}
                      onChange={(e) => setConfig({ ...config, epochs: parseInt(e.target.value) })}
                      className="bg-black/60 border-fuchsia-500/40 text-fuchsia-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-fuchsia-600 mb-2 block">Batch Size</label>
                    <Input
                      type="number"
                      value={config.batchSize}
                      onChange={(e) => setConfig({ ...config, batchSize: parseInt(e.target.value) })}
                      className="bg-black/60 border-fuchsia-500/40 text-fuchsia-100"
                    />
                  </div>
                </div>

                {(config.method === 'lora' || config.method === 'qlora') && (
                  <>
                    <div>
                      <label className="text-xs text-fuchsia-600 mb-2 block">Rank: {config.rank}</label>
                      <Slider
                        value={[config.rank || 16]}
                        onValueChange={([value]) => setConfig({ ...config, rank: value })}
                        min={4}
                        max={64}
                        step={4}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-fuchsia-600 mb-2 block">Alpha: {config.alpha}</label>
                      <Slider
                        value={[config.alpha || 32]}
                        onValueChange={([value]) => setConfig({ ...config, alpha: value })}
                        min={8}
                        max={128}
                        step={8}
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-fuchsia-600 mb-2 block">Target Modules</label>
                  <div className="space-y-2">
                    {['q_proj', 'v_proj', 'k_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'].map((module) => (
                      <div key={module} className="flex items-center justify-between p-2 bg-black/40 rounded">
                        <span className="text-sm text-fuchsia-300">{module}</span>
                        <input
                          type="checkbox"
                          checked={config.targetModules.includes(module)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig({ ...config, targetModules: [...config.targetModules, module] });
                            } else {
                              setConfig({ ...config, targetModules: config.targetModules.filter(m => m !== module) });
                            }
                          }}
                          className="w-4 h-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Method Info & Stats */}
        <Card className="bg-gradient-to-br from-fuchsia-950/20 to-purple-950/20 border-fuchsia-500/30 p-6">
          <h4 className="text-fuchsia-400 mb-4">Method Details</h4>
          
          <div className="space-y-4">
            <Card className="bg-black/40 border-fuchsia-500/30 p-4">
              <h5 className="text-fuchsia-400 mb-2">{selectedMethod.name}</h5>
              <p className="text-xs text-fuchsia-600 mb-3">{selectedMethod.description}</p>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-fuchsia-600">Efficiency</span>
                    <span className="text-fuchsia-400">{selectedMethod.efficiency}%</span>
                  </div>
                  <Progress value={selectedMethod.efficiency} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-fuchsia-600">Memory Usage</span>
                    <span className="text-fuchsia-400">{selectedMethod.memoryUsage}%</span>
                  </div>
                  <Progress value={selectedMethod.memoryUsage} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="bg-black/40 border-fuchsia-500/30 p-4">
              <h5 className="text-fuchsia-400 mb-3">Training Stats</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-fuchsia-600">Estimated Time:</span>
                  <span className="text-fuchsia-400 font-mono">~{config.epochs * 2}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fuchsia-600">Memory Required:</span>
                  <span className="text-fuchsia-400 font-mono">~{selectedMethod.memoryUsage * 2}GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fuchsia-600">Parameters to Update:</span>
                  <span className="text-fuchsia-400 font-mono">
                    {config.method === 'full' ? '100%' : config.method === 'lora' ? '~0.1%' : '~0.05%'}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-black/40 border-fuchsia-500/30 p-4">
              <h5 className="text-fuchsia-400 mb-3">Use Cases</h5>
              <div className="space-y-1 text-xs text-fuchsia-600">
                {config.method === 'lora' || config.method === 'qlora' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Domain-specific fine-tuning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Task adaptation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Style customization</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Full model customization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Maximum performance</span>
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

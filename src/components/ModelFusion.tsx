import { useState } from 'react';
import { motion } from 'motion/react';
import { Merge, Plus, Trash2, Play, Settings, Zap, Brain } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface Model {
  id: string;
  name: string;
  weight: number;
  capabilities: string[];
}

interface FusionConfig {
  id: string;
  name: string;
  models: Model[];
  strategy: 'ensemble' | 'weighted' | 'cascade' | 'mixture';
  status: 'ready' | 'training' | 'deployed';
}

export function ModelFusion() {
  const [availableModels] = useState([
    { id: 'gpt-4', name: 'GPT-4 Turbo', capabilities: ['Text', 'Code', 'Analysis'] },
    { id: 'claude-3', name: 'Claude 3 Opus', capabilities: ['Reasoning', 'Code', 'Long Context'] },
    { id: 'gemini', name: 'Gemini Ultra', capabilities: ['Multimodal', 'Code', 'Vision'] },
    { id: 'llama-3', name: 'Llama 3 70B', capabilities: ['Text', 'Multilingual'] },
    { id: 'mistral', name: 'Mixtral 8x7B', capabilities: ['Text', 'Efficient'] },
    { id: 'gpt-4v', name: 'GPT-4 Vision', capabilities: ['Vision', 'Multimodal'] }
  ]);

  const [fusionConfigs, setFusionConfigs] = useState<FusionConfig[]>([
    {
      id: '1',
      name: 'Supreme Intelligence',
      models: [
        { id: 'gpt-4', name: 'GPT-4 Turbo', weight: 40, capabilities: ['Text', 'Code'] },
        { id: 'claude-3', name: 'Claude 3 Opus', weight: 35, capabilities: ['Reasoning'] },
        { id: 'gemini', name: 'Gemini Ultra', weight: 25, capabilities: ['Multimodal'] }
      ],
      strategy: 'weighted',
      status: 'deployed'
    },
    {
      id: '2',
      name: 'Code Master',
      models: [
        { id: 'gpt-4', name: 'GPT-4 Turbo', weight: 50, capabilities: ['Code'] },
        { id: 'claude-3', name: 'Claude 3 Opus', weight: 50, capabilities: ['Code'] }
      ],
      strategy: 'ensemble',
      status: 'ready'
    }
  ]);

  const [selectedConfig, setSelectedConfig] = useState<FusionConfig | null>(fusionConfigs[0]);
  const [newFusionName, setNewFusionName] = useState('');
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);

  const addModelToFusion = (model: any) => {
    const newModel: Model = {
      id: model.id,
      name: model.name,
      weight: 100 / (selectedModels.length + 1),
      capabilities: model.capabilities
    };
    
    // Rebalance weights
    const rebalanced = selectedModels.map(m => ({
      ...m,
      weight: 100 / (selectedModels.length + 1)
    }));
    
    setSelectedModels([...rebalanced, newModel]);
    toast.success(`Added ${model.name} to fusion`);
  };

  const removeModelFromFusion = (id: string) => {
    const filtered = selectedModels.filter(m => m.id !== id);
    const rebalanced = filtered.map(m => ({
      ...m,
      weight: filtered.length > 0 ? 100 / filtered.length : 0
    }));
    setSelectedModels(rebalanced);
    toast.info('Model removed from fusion');
  };

  const updateModelWeight = (id: string, weight: number) => {
    setSelectedModels(prev => prev.map(m =>
      m.id === id ? { ...m, weight } : m
    ));
  };

  const createFusion = () => {
    if (!newFusionName || selectedModels.length < 2) {
      toast.error('Please name your fusion and add at least 2 models');
      return;
    }

    const newFusion: FusionConfig = {
      id: Date.now().toString(),
      name: newFusionName,
      models: selectedModels,
      strategy: 'weighted',
      status: 'ready'
    };

    setFusionConfigs([...fusionConfigs, newFusion]);
    setNewFusionName('');
    setSelectedModels([]);
    toast.success('Fusion model created successfully!');
  };

  const deployFusion = (id: string) => {
    setFusionConfigs(prev => prev.map(f =>
      f.id === id ? { ...f, status: 'deployed' as const } : f
    ));
    toast.success('Fusion model deployed!');
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'ensemble': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'weighted': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'cascade': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'mixture': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Fusion Builder */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-purple-400 flex items-center gap-2">
              <Merge className="w-5 h-5" />
              Model Fusion Builder
            </h3>
            <p className="text-xs text-purple-600 mt-1">Combine multiple AI models</p>
          </div>
        </div>

        {/* Fusion Name */}
        <div className="mb-6">
          <label className="text-xs text-purple-600 mb-2 block">Fusion Name</label>
          <Input
            value={newFusionName}
            onChange={(e) => setNewFusionName(e.target.value)}
            placeholder="e.g., Supreme Intelligence"
            className="bg-black/60 border-purple-500/40 text-purple-100"
          />
        </div>

        {/* Available Models */}
        <div className="mb-6">
          <label className="text-xs text-purple-600 mb-2 block">Available Models</label>
          <div className="grid grid-cols-2 gap-2">
            {availableModels.map((model) => (
              <Button
                key={model.id}
                onClick={() => addModelToFusion(model)}
                disabled={selectedModels.some(m => m.id === model.id)}
                variant="outline"
                size="sm"
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
              >
                <Plus className="w-3 h-3 mr-2" />
                {model.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Models */}
        {selectedModels.length > 0 && (
          <div className="mb-6">
            <label className="text-xs text-purple-600 mb-2 block">
              Selected Models ({selectedModels.length})
            </label>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {selectedModels.map((model) => (
                  <Card key={model.id} className="bg-black/40 border-purple-500/30 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-purple-400 text-sm">{model.name}</h4>
                        <div className="flex gap-1 mt-1">
                          {model.capabilities.map((cap, i) => (
                            <Badge key={i} className="bg-purple-500/20 text-purple-400 text-[10px]">
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => removeModelFromFusion(model.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-purple-600">Weight</span>
                        <span className="text-purple-400 font-mono">{model.weight.toFixed(0)}%</span>
                      </div>
                      <Slider
                        value={[model.weight]}
                        onValueChange={([value]) => updateModelWeight(model.id, value)}
                        max={100}
                        step={5}
                        className="mb-2"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Create Button */}
        <Button
          onClick={createFusion}
          disabled={selectedModels.length < 2}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          <Zap className="w-4 h-4 mr-2" />
          Create Fusion Model
        </Button>
      </Card>

      {/* Existing Fusions */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
        <h4 className="text-purple-400 mb-4">Active Fusions</h4>
        
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {fusionConfigs.map((config) => (
              <Card
                key={config.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedConfig?.id === config.id
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-black/40 border-purple-500/20 hover:border-purple-500/40'
                }`}
                onClick={() => setSelectedConfig(config)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-purple-400">{config.name}</h5>
                  <Badge className={
                    config.status === 'deployed' 
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                  }>
                    {config.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  {config.models.map((model, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-purple-600">{model.name}</span>
                      <span className="text-purple-400 font-mono">{model.weight.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>

                <Badge className={getStrategyColor(config.strategy)}>
                  {config.strategy}
                </Badge>

                {config.status !== 'deployed' && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deployFusion(config.id);
                    }}
                    size="sm"
                    className="w-full mt-3 bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
                  >
                    <Play className="w-3 h-3 mr-2" />
                    Deploy
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

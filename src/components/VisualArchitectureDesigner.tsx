import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, Plus, Trash2, Settings, Eye, Download, Upload, Save, Play, Zap, Network, Box, GitBranch } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface Layer {
  id: string;
  type: 'embedding' | 'transformer' | 'attention' | 'feedforward' | 'normalization' | 'conv' | 'lstm' | 'output';
  name: string;
  parameters: number;
  position: { x: number; y: number };
  connections: string[];
  config: {
    hiddenSize?: number;
    numHeads?: number;
    dropout?: number;
    activation?: string;
    kernelSize?: number;
    stride?: number;
  };
}

interface Architecture {
  id: string;
  name: string;
  layers: Layer[];
  totalParameters: number;
  estimatedMemory: number;
}

export function VisualArchitectureDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [architectures, setArchitectures] = useState<Architecture[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [newArchitectureName, setNewArchitectureName] = useState('');

  const layerTemplates = [
    { type: 'embedding' as const, name: 'Embedding', icon: '📝', defaultParams: 512 },
    { type: 'transformer' as const, name: 'Transformer', icon: '🔄', defaultParams: 2048 },
    { type: 'attention' as const, name: 'Attention', icon: '👁️', defaultParams: 1024 },
    { type: 'feedforward' as const, name: 'Feedforward', icon: '⚡', defaultParams: 4096 },
    { type: 'normalization' as const, name: 'Layer Norm', icon: '📊', defaultParams: 512 },
    { type: 'conv' as const, name: 'Convolution', icon: '🔲', defaultParams: 256 },
    { type: 'lstm' as const, name: 'LSTM', icon: '🔄', defaultParams: 512 },
    { type: 'output' as const, name: 'Output', icon: '🎯', defaultParams: 1000 },
  ];

  const architectureTemplates = [
    {
      name: 'GPT-Style Transformer',
      layers: [
        { type: 'embedding' as const, name: 'Token Embedding', parameters: 50257 * 768 },
        { type: 'transformer' as const, name: 'Transformer Block 1', parameters: 124800000 },
        { type: 'transformer' as const, name: 'Transformer Block 2', parameters: 124800000 },
        { type: 'transformer' as const, name: 'Transformer Block 3', parameters: 124800000 },
        { type: 'output' as const, name: 'Output Head', parameters: 768 * 50257 },
      ]
    },
    {
      name: 'BERT-Style Encoder',
      layers: [
        { type: 'embedding' as const, name: 'Word Embedding', parameters: 30522 * 768 },
        { type: 'transformer' as const, name: 'Encoder Block 1', parameters: 124800000 },
        { type: 'transformer' as const, name: 'Encoder Block 2', parameters: 124800000 },
        { type: 'output' as const, name: 'Classification Head', parameters: 768 * 2 },
      ]
    },
    {
      name: 'Hybrid CNN-Transformer',
      layers: [
        { type: 'conv' as const, name: 'Conv Layer 1', parameters: 32000 },
        { type: 'conv' as const, name: 'Conv Layer 2', parameters: 64000 },
        { type: 'transformer' as const, name: 'Transformer Block', parameters: 124800000 },
        { type: 'output' as const, name: 'Output', parameters: 768 * 1000 },
      ]
    }
  ];

  const addLayer = (template: typeof layerTemplates[0]) => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      type: template.type,
      name: `${template.name} ${layers.length + 1}`,
      parameters: template.defaultParams,
      position: { x: 100 + layers.length * 200, y: 200 },
      connections: [],
      config: {
        hiddenSize: template.defaultParams,
        numHeads: template.type === 'attention' || template.type === 'transformer' ? 8 : undefined,
        dropout: 0.1,
        activation: 'gelu',
      }
    };
    setLayers([...layers, newLayer]);
    toast.success(`Added ${template.name} layer`);
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
    if (selectedLayer?.id === id) setSelectedLayer(null);
    toast.info('Layer removed');
  };

  const updateLayer = (id: string, updates: Partial<Layer>) => {
    setLayers(layers.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const loadTemplate = (template: typeof architectureTemplates[0]) => {
    const newLayers: Layer[] = template.layers.map((t, i) => ({
      id: `layer-${Date.now()}-${i}`,
      type: t.type,
      name: t.name,
      parameters: t.parameters,
      position: { x: 100 + i * 200, y: 200 },
      connections: i > 0 ? [template.layers[i - 1].name] : [],
      config: {
        hiddenSize: Math.sqrt(t.parameters),
        dropout: 0.1,
        activation: 'gelu',
      }
    }));
    setLayers(newLayers);
    toast.success(`Loaded ${template.name} architecture`);
  };

  const saveArchitecture = () => {
    if (!newArchitectureName) {
      toast.error('Please enter an architecture name');
      return;
    }

    const totalParams = layers.reduce((sum, l) => sum + l.parameters, 0);
    const architecture: Architecture = {
      id: `arch-${Date.now()}`,
      name: newArchitectureName,
      layers: layers,
      totalParameters: totalParams,
      estimatedMemory: totalParams * 4 / 1024 / 1024 / 1024 // GB
    };

    setArchitectures([...architectures, architecture]);
    setNewArchitectureName('');
    toast.success('Architecture saved!');
  };

  const calculateTotalParameters = () => {
    return layers.reduce((sum, l) => sum + l.parameters, 0);
  };

  const calculateMemory = () => {
    return (calculateTotalParameters() * 4 / 1024 / 1024 / 1024).toFixed(2);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    layers.forEach((layer, index) => {
      if (index > 0) {
        const prevLayer = layers[index - 1];
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(prevLayer.position.x + 50, prevLayer.position.y + 25);
        ctx.lineTo(layer.position.x + 50, layer.position.y + 25);
        ctx.stroke();
      }
    });

    // Draw layers
    layers.forEach((layer) => {
      const isSelected = selectedLayer?.id === layer.id;
      const gradient = ctx.createLinearGradient(
        layer.position.x, layer.position.y,
        layer.position.x + 100, layer.position.y + 50
      );
      
      if (isSelected) {
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)');
      } else {
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(layer.position.x, layer.position.y, 100, 50);
      
      ctx.strokeStyle = isSelected ? 'rgba(99, 102, 241, 1)' : 'rgba(99, 102, 241, 0.5)';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.strokeRect(layer.position.x, layer.position.y, 100, 50);

      // Layer name
      ctx.fillStyle = '#a5b4fc';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(layer.name.substring(0, 12), layer.position.x + 50, layer.position.y + 20);
      
      // Parameters
      ctx.fillStyle = '#6366f1';
      ctx.font = '10px monospace';
      ctx.fillText(`${(layer.parameters / 1000).toFixed(0)}K`, layer.position.x + 50, layer.position.y + 35);
    });
  }, [layers, selectedLayer]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-violet-950/20 to-purple-950/20 border-violet-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-violet-400 flex items-center gap-2">
              <Network className="w-6 h-5" />
              Visual Architecture Designer
            </h3>
            <p className="text-xs text-violet-600 mt-1">Drag-and-drop neural network builder</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-violet-500/50 text-violet-400 hover:bg-violet-500/20"
              onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
            >
              <Eye className="w-4 h-4 mr-2" />
              {viewMode === '2d' ? '3D View' : '2D View'}
            </Button>
            <Button
              variant="outline"
              className="border-violet-500/50 text-violet-400 hover:bg-violet-500/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              className="border-violet-500/50 text-violet-400 hover:bg-violet-500/20"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* Architecture Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-black/40 border-violet-500/30 p-3">
            <div className="text-xs text-violet-600 mb-1">Total Layers</div>
            <div className="text-xl text-violet-400 font-mono">{layers.length}</div>
          </Card>
          <Card className="bg-black/40 border-violet-500/30 p-3">
            <div className="text-xs text-violet-600 mb-1">Total Parameters</div>
            <div className="text-xl text-violet-400 font-mono">{(calculateTotalParameters() / 1000000).toFixed(2)}M</div>
          </Card>
          <Card className="bg-black/40 border-violet-500/30 p-3">
            <div className="text-xs text-violet-600 mb-1">Estimated Memory</div>
            <div className="text-xl text-violet-400 font-mono">{calculateMemory()} GB</div>
          </Card>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Layer Palette */}
        <Card className="bg-gradient-to-br from-violet-950/20 to-purple-950/20 border-violet-500/30 p-6">
          <h4 className="text-violet-400 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Layer Palette
          </h4>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {layerTemplates.map((template) => (
                <Button
                  key={template.type}
                  onClick={() => addLayer(template)}
                  variant="outline"
                  className="w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/20 justify-start"
                >
                  <span className="mr-2">{template.icon}</span>
                  {template.name}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-6 pt-6 border-t border-violet-500/20">
            <h4 className="text-violet-400 mb-4 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Templates
            </h4>
            <div className="space-y-2">
              {architectureTemplates.map((template) => (
                <Button
                  key={template.name}
                  onClick={() => loadTemplate(template)}
                  variant="outline"
                  className="w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/20 text-sm"
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Canvas Area */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-violet-950/20 to-purple-950/20 border-violet-500/30 p-6">
          <div className="bg-black/40 rounded-lg border border-violet-500/20 p-4 overflow-auto" style={{ height: '600px' }}>
            <canvas
              ref={canvasRef}
              width={1200}
              height={500}
              className="cursor-pointer"
              onClick={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const clickedLayer = layers.find(l => 
                  x >= l.position.x && x <= l.position.x + 100 &&
                  y >= l.position.y && y <= l.position.y + 50
                );
                
                setSelectedLayer(clickedLayer || null);
              }}
            />
            {layers.length === 0 && (
              <div className="flex items-center justify-center h-full text-violet-600">
                <div className="text-center">
                  <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No layers added</p>
                  <p className="text-xs mt-1">Add layers from the palette</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Layer Properties & Saved Architectures */}
        <Card className="bg-gradient-to-br from-violet-950/20 to-purple-950/20 border-violet-500/30 p-6">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="bg-black/40 border-violet-500/30">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="mt-4">
              {selectedLayer ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-violet-600 mb-2 block">Layer Name</label>
                    <Input
                      value={selectedLayer.name}
                      onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
                      className="bg-black/60 border-violet-500/40 text-violet-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-violet-600 mb-2 block">Parameters</label>
                    <Input
                      type="number"
                      value={selectedLayer.parameters}
                      onChange={(e) => updateLayer(selectedLayer.id, { parameters: parseInt(e.target.value) })}
                      className="bg-black/60 border-violet-500/40 text-violet-100"
                    />
                  </div>

                  {(selectedLayer.type === 'transformer' || selectedLayer.type === 'attention') && (
                    <div>
                      <label className="text-xs text-violet-600 mb-2 block">Attention Heads</label>
                      <Input
                        type="number"
                        value={selectedLayer.config.numHeads || 8}
                        onChange={(e) => updateLayer(selectedLayer.id, {
                          config: { ...selectedLayer.config, numHeads: parseInt(e.target.value) }
                        })}
                        className="bg-black/60 border-violet-500/40 text-violet-100"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-violet-600 mb-2 block">Dropout</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedLayer.config.dropout || 0.1}
                      onChange={(e) => updateLayer(selectedLayer.id, {
                        config: { ...selectedLayer.config, dropout: parseFloat(e.target.value) }
                      })}
                      className="bg-black/60 border-violet-500/40 text-violet-100"
                    />
                  </div>

                  <Button
                    onClick={() => removeLayer(selectedLayer.id)}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Layer
                  </Button>
                </div>
              ) : (
                <div className="text-center text-violet-600 py-8">
                  <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select a layer to edit</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Input
                    value={newArchitectureName}
                    onChange={(e) => setNewArchitectureName(e.target.value)}
                    placeholder="Architecture name"
                    className="bg-black/60 border-violet-500/40 text-violet-100 mb-2"
                  />
                  <Button
                    onClick={saveArchitecture}
                    disabled={!newArchitectureName || layers.length === 0}
                    className="w-full bg-violet-500/20 border-violet-500/50 text-violet-400 hover:bg-violet-500/30"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Architecture
                  </Button>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {architectures.map((arch) => (
                      <Card key={arch.id} className="bg-black/40 border-violet-500/30 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-violet-400 text-sm">{arch.name}</h5>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setLayers(arch.layers)}
                            className="border-violet-500/30 text-violet-400"
                          >
                            Load
                          </Button>
                        </div>
                        <div className="text-xs text-violet-600">
                          {arch.layers.length} layers • {(arch.totalParameters / 1000000).toFixed(2)}M params
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

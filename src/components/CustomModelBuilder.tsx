import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Layers, Database, Zap, Save, Play, Settings } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface LayerConfig {
  id: string;
  type: 'transformer' | 'attention' | 'feedforward' | 'embedding' | 'normalization';
  parameters: number;
  dropout: number;
}

export function CustomModelBuilder() {
  const [modelName, setModelName] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [architecture, setArchitecture] = useState<'transformer' | 'cnn' | 'rnn' | 'hybrid'>('transformer');
  const [parameters, setParameters] = useState([7]);
  const [contextLength, setContextLength] = useState([8]);
  const [layers, setLayers] = useState<LayerConfig[]>([
    { id: '1', type: 'embedding', parameters: 512, dropout: 0.1 },
    { id: '2', type: 'transformer', parameters: 2048, dropout: 0.1 },
    { id: '3', type: 'attention', parameters: 1024, dropout: 0.1 }
  ]);

  const [trainingConfig, setTrainingConfig] = useState({
    learningRate: 0.0001,
    batchSize: 32,
    epochs: 10,
    optimizer: 'adamw'
  });

  const addLayer = (type: LayerConfig['type']) => {
    const newLayer: LayerConfig = {
      id: Date.now().toString(),
      type,
      parameters: type === 'transformer' ? 2048 : 1024,
      dropout: 0.1
    };
    setLayers([...layers, newLayer]);
    toast.success(`Added ${type} layer`);
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
    toast.info('Layer removed');
  };

  const updateLayer = (id: string, field: string, value: number) => {
    setLayers(prev => prev.map(l =>
      l.id === id ? { ...l, [field]: value } : l
    ));
  };

  const saveModel = () => {
    if (!modelName) {
      toast.error('Please enter a model name');
      return;
    }

    const model = {
      name: modelName,
      description: modelDescription,
      architecture,
      parameters: `${parameters[0]}B`,
      contextLength: `${contextLength[0]}K`,
      layers: layers.length,
      layerConfig: layers,
      trainingConfig
    };

    console.log('Saving model:', model);
    toast.success('Model configuration saved!');
  };

  const startTraining = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 3000)),
      {
        loading: 'Starting model training...',
        success: 'Training started successfully!',
        error: 'Training failed to start'
      }
    );
  };

  const getLayerColor = (type: string) => {
    switch (type) {
      case 'transformer': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'attention': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'feedforward': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'embedding': return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
      case 'normalization': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      default: return 'bg-pink-500/20 border-pink-500/50 text-pink-400';
    }
  };

  const totalParams = layers.reduce((sum, layer) => sum + layer.parameters, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-purple-400 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Custom Model Builder
            </h3>
            <p className="text-xs text-purple-600 mt-1">Design and train your own AI model</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={saveModel}
              className="bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={startTraining}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Train
            </Button>
          </div>
        </div>

        <Tabs defaultValue="config" className="w-full">
          <TabsList className="bg-black/40 border border-purple-500/30">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="config" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-purple-600 mb-2 block">Model Name</label>
                  <Input
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g., MyCustomGPT"
                    className="bg-black/60 border-purple-500/40 text-purple-100"
                  />
                </div>

                <div>
                  <label className="text-xs text-purple-600 mb-2 block">Description</label>
                  <Textarea
                    value={modelDescription}
                    onChange={(e) => setModelDescription(e.target.value)}
                    placeholder="Describe your model..."
                    className="bg-black/60 border-purple-500/40 text-purple-100"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-xs text-purple-600 mb-2 block">Architecture Type</label>
                  <select
                    value={architecture}
                    onChange={(e) => setArchitecture(e.target.value as any)}
                    className="w-full bg-black/60 border border-purple-500/40 rounded px-3 py-2 text-purple-300"
                  >
                    <option value="transformer">Transformer</option>
                    <option value="cnn">CNN</option>
                    <option value="rnn">RNN</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-purple-600 mb-2 block">
                    Parameters: {parameters[0]}B
                  </label>
                  <Slider
                    value={parameters}
                    onValueChange={setParameters}
                    min={1}
                    max={200}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-purple-700 mt-1">
                    <span>1B</span>
                    <span>200B</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-purple-600 mb-2 block">
                    Context Length: {contextLength[0]}K tokens
                  </label>
                  <Slider
                    value={contextLength}
                    onValueChange={setContextLength}
                    min={1}
                    max={128}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-purple-700 mt-1">
                    <span>1K</span>
                    <span>128K</span>
                  </div>
                </div>

                <Card className="bg-black/60 border-purple-500/30 p-4">
                  <h5 className="text-purple-400 text-sm mb-3">Model Stats</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-purple-600">Total Layers:</span>
                      <span className="text-purple-400 font-mono">{layers.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-600">Total Parameters:</span>
                      <span className="text-purple-400 font-mono">{(totalParams / 1000000000).toFixed(2)}B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-600">Memory Required:</span>
                      <span className="text-purple-400 font-mono">{(totalParams * 4 / 1000000000).toFixed(1)}GB</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h4 className="text-purple-400 mb-4">Layer Configuration</h4>
                <div className="space-y-3 max-h-[500px] overflow-auto">
                  {layers.map((layer, index) => (
                    <Card key={layer.id} className="bg-black/40 border-purple-500/30 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-purple-600 font-mono">#{index + 1}</div>
                          <Badge className={getLayerColor(layer.type)}>
                            {layer.type}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => removeLayer(layer.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-purple-600 mb-1 block">
                            Parameters: {layer.parameters}
                          </label>
                          <Slider
                            value={[layer.parameters]}
                            onValueChange={([value]) => updateLayer(layer.id, 'parameters', value)}
                            min={128}
                            max={4096}
                            step={128}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-purple-600 mb-1 block">
                            Dropout: {layer.dropout.toFixed(2)}
                          </label>
                          <Slider
                            value={[layer.dropout * 100]}
                            onValueChange={([value]) => updateLayer(layer.id, 'dropout', value / 100)}
                            min={0}
                            max={50}
                            step={5}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-purple-400 mb-4">Add Layers</h4>
                <div className="space-y-2">
                  {['transformer', 'attention', 'feedforward', 'embedding', 'normalization'].map((type) => (
                    <Button
                      key={type}
                      onClick={() => addLayer(type as LayerConfig['type'])}
                      variant="outline"
                      className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30 p-6">
                <h4 className="text-purple-400 mb-4">Training Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-purple-600 mb-2 block">Learning Rate</label>
                    <Input
                      type="number"
                      value={trainingConfig.learningRate}
                      onChange={(e) => setTrainingConfig({
                        ...trainingConfig,
                        learningRate: parseFloat(e.target.value)
                      })}
                      step="0.0001"
                      className="bg-black/60 border-purple-500/40 text-purple-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-purple-600 mb-2 block">Batch Size</label>
                    <Input
                      type="number"
                      value={trainingConfig.batchSize}
                      onChange={(e) => setTrainingConfig({
                        ...trainingConfig,
                        batchSize: parseInt(e.target.value)
                      })}
                      className="bg-black/60 border-purple-500/40 text-purple-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-purple-600 mb-2 block">Epochs</label>
                    <Input
                      type="number"
                      value={trainingConfig.epochs}
                      onChange={(e) => setTrainingConfig({
                        ...trainingConfig,
                        epochs: parseInt(e.target.value)
                      })}
                      className="bg-black/60 border-purple-500/40 text-purple-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-purple-600 mb-2 block">Optimizer</label>
                    <select
                      value={trainingConfig.optimizer}
                      onChange={(e) => setTrainingConfig({
                        ...trainingConfig,
                        optimizer: e.target.value
                      })}
                      className="w-full bg-black/60 border border-purple-500/40 rounded px-3 py-2 text-purple-300"
                    >
                      <option value="adamw">AdamW</option>
                      <option value="adam">Adam</option>
                      <option value="sgd">SGD</option>
                      <option value="rmsprop">RMSprop</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card className="bg-black/40 border-purple-500/30 p-6">
                <h4 className="text-purple-400 mb-4">Dataset</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-400">
                    <Database className="w-4 h-4 mr-2" />
                    Upload Training Data
                  </Button>
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-400">
                    <Database className="w-4 h-4 mr-2" />
                    Use Existing Dataset
                  </Button>
                  
                  <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded">
                    <h5 className="text-purple-400 text-sm mb-2">Estimated Training Time</h5>
                    <div className="text-2xl text-purple-400 font-mono">~24 hours</div>
                    <p className="text-xs text-purple-600 mt-2">
                      Based on {parameters[0]}B parameters and {trainingConfig.epochs} epochs
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="mt-6">
            <Card className="bg-black/40 border-purple-500/30 p-6">
              <h4 className="text-purple-400 mb-4">Model Summary</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600">Name:</span>
                    <div className="text-purple-400">{modelName || 'Unnamed Model'}</div>
                  </div>
                  <div>
                    <span className="text-purple-600">Architecture:</span>
                    <div className="text-purple-400">{architecture}</div>
                  </div>
                  <div>
                    <span className="text-purple-600">Parameters:</span>
                    <div className="text-purple-400 font-mono">{parameters[0]}B</div>
                  </div>
                  <div>
                    <span className="text-purple-600">Context Length:</span>
                    <div className="text-purple-400 font-mono">{contextLength[0]}K</div>
                  </div>
                  <div>
                    <span className="text-purple-600">Total Layers:</span>
                    <div className="text-purple-400 font-mono">{layers.length}</div>
                  </div>
                  <div>
                    <span className="text-purple-600">Training Epochs:</span>
                    <div className="text-purple-400 font-mono">{trainingConfig.epochs}</div>
                  </div>
                </div>

                <div>
                  <span className="text-purple-600 text-sm">Description:</span>
                  <p className="text-purple-400 mt-1">{modelDescription || 'No description provided'}</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

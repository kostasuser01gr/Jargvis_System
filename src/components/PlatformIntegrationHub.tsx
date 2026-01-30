import { useState } from 'react';
import { motion } from 'motion/react';
import { Cloud, Plug, Check, X, RefreshCw, Settings, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface Platform {
  id: string;
  name: string;
  category: 'cloud' | 'database' | 'ai' | 'dev' | 'design';
  connected: boolean;
  status: 'active' | 'inactive' | 'error';
  apiKey?: string;
  features: string[];
  icon: string;
}

export function PlatformIntegrationHub() {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'vercel',
      name: 'Vercel',
      category: 'cloud',
      connected: true,
      status: 'active',
      features: ['Deployment', 'Edge Functions', 'Analytics', 'CDN'],
      icon: '▲'
    },
    {
      id: 'supabase',
      name: 'Supabase',
      category: 'database',
      connected: true,
      status: 'active',
      features: ['PostgreSQL', 'Auth', 'Storage', 'Realtime'],
      icon: '⚡'
    },
    {
      id: 'neon',
      name: 'Neon',
      category: 'database',
      connected: false,
      status: 'inactive',
      features: ['Serverless Postgres', 'Branching', 'Autoscaling'],
      icon: '🌙'
    },
    {
      id: 'openai',
      name: 'OpenAI',
      category: 'ai',
      connected: true,
      status: 'active',
      features: ['GPT-4', 'DALL-E', 'Whisper', 'Embeddings'],
      icon: '🤖'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      category: 'ai',
      connected: true,
      status: 'active',
      features: ['Claude 3', 'Long Context', 'Function Calling'],
      icon: '🧠'
    },
    {
      id: 'google-ai',
      name: 'Google AI',
      category: 'ai',
      connected: false,
      status: 'inactive',
      features: ['Gemini', 'PaLM', 'Vertex AI'],
      icon: '🔷'
    },
    {
      id: 'github',
      name: 'GitHub',
      category: 'dev',
      connected: true,
      status: 'active',
      features: ['Repos', 'Actions', 'Copilot', 'Codespaces'],
      icon: '📦'
    },
    {
      id: 'cursor',
      name: 'Cursor',
      category: 'dev',
      connected: true,
      status: 'active',
      features: ['AI Code Editor', 'Chat', 'Autocomplete'],
      icon: '💻'
    },
    {
      id: 'vscode',
      name: 'VS Code',
      category: 'dev',
      connected: true,
      status: 'active',
      features: ['Extensions', 'Debugging', 'Git Integration'],
      icon: '📝'
    },
    {
      id: 'figma',
      name: 'Figma',
      category: 'design',
      connected: false,
      status: 'inactive',
      features: ['Design Import', 'Component Sync', 'Tokens'],
      icon: '🎨'
    },
    {
      id: 'vercel-v0',
      name: 'Vercel v0',
      category: 'ai',
      connected: true,
      status: 'active',
      features: ['AI UI Generation', 'Chat', 'Component Library'],
      icon: '✨'
    },
    {
      id: 'replicate',
      name: 'Replicate',
      category: 'ai',
      connected: false,
      status: 'inactive',
      features: ['Model Hosting', 'API Access', 'Custom Models'],
      icon: '🔄'
    }
  ]);

  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const toggleConnection = (id: string) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id === id) {
        const newConnected = !p.connected;
        toast.success(`${p.name} ${newConnected ? 'connected' : 'disconnected'}`);
        return {
          ...p,
          connected: newConnected,
          status: newConnected ? 'active' as const : 'inactive' as const
        };
      }
      return p;
    }));
  };

  const connectPlatform = (id: string) => {
    if (!apiKeyInput) {
      toast.error('Please enter an API key');
      return;
    }

    setPlatforms(prev => prev.map(p =>
      p.id === id ? { ...p, connected: true, status: 'active' as const, apiKey: apiKeyInput } : p
    ));
    setApiKeyInput('');
    toast.success('Platform connected successfully!');
  };

  const testConnection = (id: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Testing connection...',
        success: 'Connection successful!',
        error: 'Connection failed'
      }
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cloud': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'database': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'ai': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'dev': return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
      case 'design': return 'bg-pink-500/20 border-pink-500/50 text-pink-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const categories = ['all', 'cloud', 'database', 'ai', 'dev', 'design'];
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPlatforms = platforms.filter(p => 
    selectedCategory === 'all' || p.category === selectedCategory
  );

  const connectedCount = platforms.filter(p => p.connected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <Cloud className="w-6 h-6" />
              Platform Integration Hub
            </h3>
            <p className="text-xs text-cyan-600 mt-1">
              {connectedCount}/{platforms.length} platforms connected
            </p>
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                  : 'border-cyan-500/30 text-cyan-400'}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlatforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-4 cursor-pointer transition-all ${
                selectedPlatform?.id === platform.id
                  ? 'bg-cyan-500/20 border-cyan-500/50'
                  : platform.connected
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-black/40 border-cyan-500/20'
              } hover:border-cyan-500/60`}
              onClick={() => setSelectedPlatform(platform)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{platform.icon}</div>
                    <div>
                      <h4 className="text-cyan-400">{platform.name}</h4>
                      <Badge className={getCategoryColor(platform.category)}>
                        {platform.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {platform.connected ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {platform.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="text-xs text-cyan-600 flex items-center gap-1">
                      <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={
                    platform.status === 'active' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                    platform.status === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                    'bg-gray-500/20 border-gray-500/50 text-gray-400'
                  }>
                    {platform.status}
                  </Badge>
                  <Switch
                    checked={platform.connected}
                    onCheckedChange={() => toggleConnection(platform.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Platform Details */}
      {selectedPlatform && (
        <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{selectedPlatform.icon}</div>
              <div>
                <h4 className="text-cyan-400">{selectedPlatform.name}</h4>
                <Badge className={getCategoryColor(selectedPlatform.category)}>
                  {selectedPlatform.category}
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => testConnection(selectedPlatform.id)}
              variant="outline"
              className="border-cyan-500/30 text-cyan-400"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-cyan-400 mb-3">Features</h5>
              <div className="space-y-2">
                {selectedPlatform.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-cyan-500" />
                    <span className="text-cyan-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-cyan-400 mb-3">Configuration</h5>
              {!selectedPlatform.connected ? (
                <div className="space-y-3">
                  <Input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter API Key..."
                    className="bg-black/60 border-cyan-500/40 text-cyan-100"
                  />
                  <Button
                    onClick={() => connectPlatform(selectedPlatform.id)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  >
                    <Plug className="w-4 h-4 mr-2" />
                    Connect Platform
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cyan-600">Status</span>
                    <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cyan-600">API Key</span>
                    <span className="text-cyan-400 font-mono">••••••••••••</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-cyan-500/30 text-cyan-400"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Settings
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.slice(1).map((cat) => {
          const count = platforms.filter(p => p.category === cat && p.connected).length;
          const total = platforms.filter(p => p.category === cat).length;
          return (
            <Card key={cat} className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-4">
              <div className="text-xs text-cyan-600 mb-2 capitalize">{cat}</div>
              <div className="text-2xl text-cyan-400 font-mono">{count}/{total}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

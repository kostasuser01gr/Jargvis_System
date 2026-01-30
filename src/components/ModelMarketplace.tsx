import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Star, Download, Zap, DollarSign, Lock, Unlock, Filter, Search, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'LLM' | 'Vision' | 'Audio' | 'Multimodal' | 'Code' | 'Embedding';
  pricing: 'free' | 'paid' | 'freemium';
  parameters: string;
  context: string;
  rating: number;
  downloads: number;
  description: string;
  capabilities: string[];
  installed: boolean;
}

export function ModelMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPricing, setFilterPricing] = useState<string>('all');

  const [models, setModels] = useState<AIModel[]>([
    // OpenAI Models
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      type: 'LLM',
      pricing: 'paid',
      parameters: '175B+',
      context: '128K tokens',
      rating: 4.9,
      downloads: 5000000,
      description: 'Most advanced language model with enhanced reasoning',
      capabilities: ['Text Generation', 'Code', 'Analysis', 'Creative Writing'],
      installed: true
    },
    {
      id: 'gpt-4-vision',
      name: 'GPT-4 Vision',
      provider: 'OpenAI',
      type: 'Multimodal',
      pricing: 'paid',
      parameters: '175B+',
      context: '128K tokens',
      rating: 4.9,
      downloads: 3500000,
      description: 'Advanced vision and language understanding',
      capabilities: ['Image Analysis', 'OCR', 'Visual Q&A', 'Description'],
      installed: true
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      type: 'LLM',
      pricing: 'freemium',
      parameters: '175B',
      context: '16K tokens',
      rating: 4.7,
      downloads: 8000000,
      description: 'Fast and efficient language model',
      capabilities: ['Text Generation', 'Chat', 'Summarization'],
      installed: true
    },
    {
      id: 'whisper',
      name: 'Whisper',
      provider: 'OpenAI',
      type: 'Audio',
      pricing: 'free',
      parameters: '1.5B',
      context: 'N/A',
      rating: 4.8,
      downloads: 2500000,
      description: 'Speech recognition and transcription',
      capabilities: ['Speech-to-Text', 'Translation', 'Transcription'],
      installed: true
    },
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      provider: 'OpenAI',
      type: 'Vision',
      pricing: 'paid',
      parameters: 'N/A',
      context: 'N/A',
      rating: 4.8,
      downloads: 1800000,
      description: 'Advanced image generation',
      capabilities: ['Image Generation', 'Creative', 'High Resolution'],
      installed: false
    },
    
    // Anthropic Models
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      type: 'LLM',
      pricing: 'paid',
      parameters: '200B+',
      context: '200K tokens',
      rating: 4.9,
      downloads: 2000000,
      description: 'Most intelligent Claude model with superior reasoning',
      capabilities: ['Complex Reasoning', 'Code', 'Analysis', 'Long Context'],
      installed: true
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      type: 'LLM',
      pricing: 'paid',
      parameters: '100B+',
      context: '200K tokens',
      rating: 4.8,
      downloads: 1500000,
      description: 'Balanced intelligence and speed',
      capabilities: ['Text Generation', 'Code', 'Analysis'],
      installed: false
    },
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      type: 'LLM',
      pricing: 'freemium',
      parameters: '50B+',
      context: '200K tokens',
      rating: 4.7,
      downloads: 3000000,
      description: 'Fast and cost-effective',
      capabilities: ['Quick Responses', 'Chat', 'Summarization'],
      installed: true
    },

    // Google Models
    {
      id: 'gemini-ultra',
      name: 'Gemini Ultra',
      provider: 'Google',
      type: 'Multimodal',
      pricing: 'paid',
      parameters: '1.5T+',
      context: '1M tokens',
      rating: 4.9,
      downloads: 2500000,
      description: 'Most capable multimodal AI model',
      capabilities: ['Text', 'Image', 'Video', 'Audio', 'Code'],
      installed: true
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      type: 'Multimodal',
      pricing: 'freemium',
      parameters: '500B+',
      context: '128K tokens',
      rating: 4.8,
      downloads: 4000000,
      description: 'Versatile multimodal model',
      capabilities: ['Text', 'Image', 'Code', 'Analysis'],
      installed: true
    },

    // Meta Models
    {
      id: 'llama-3-70b',
      name: 'Llama 3 70B',
      provider: 'Meta',
      type: 'LLM',
      pricing: 'free',
      parameters: '70B',
      context: '8K tokens',
      rating: 4.7,
      downloads: 5500000,
      description: 'Open-source powerhouse',
      capabilities: ['Text Generation', 'Code', 'Multilingual'],
      installed: true
    },
    {
      id: 'llama-3-8b',
      name: 'Llama 3 8B',
      provider: 'Meta',
      type: 'LLM',
      pricing: 'free',
      parameters: '8B',
      context: '8K tokens',
      rating: 4.6,
      downloads: 7000000,
      description: 'Efficient open-source model',
      capabilities: ['Text Generation', 'Chat', 'Fast'],
      installed: true
    },

    // Mistral AI
    {
      id: 'mistral-large',
      name: 'Mistral Large',
      provider: 'Mistral AI',
      type: 'LLM',
      pricing: 'paid',
      parameters: '70B+',
      context: '32K tokens',
      rating: 4.7,
      downloads: 1200000,
      description: 'Powerful European AI model',
      capabilities: ['Text Generation', 'Code', 'Multilingual'],
      installed: false
    },
    {
      id: 'mixtral-8x7b',
      name: 'Mixtral 8x7B',
      provider: 'Mistral AI',
      type: 'LLM',
      pricing: 'free',
      parameters: '47B',
      context: '32K tokens',
      rating: 4.8,
      downloads: 3000000,
      description: 'Open-source mixture of experts',
      capabilities: ['Text Generation', 'Code', 'Efficient'],
      installed: true
    },

    // Cohere
    {
      id: 'command-r-plus',
      name: 'Command R+',
      provider: 'Cohere',
      type: 'LLM',
      pricing: 'paid',
      parameters: '104B',
      context: '128K tokens',
      rating: 4.7,
      downloads: 800000,
      description: 'Enterprise-focused language model',
      capabilities: ['Text Generation', 'RAG', 'Enterprise'],
      installed: false
    },

    // Stability AI
    {
      id: 'stable-diffusion-xl',
      name: 'Stable Diffusion XL',
      provider: 'Stability AI',
      type: 'Vision',
      pricing: 'free',
      parameters: '3.5B',
      context: 'N/A',
      rating: 4.8,
      downloads: 6000000,
      description: 'Open-source image generation',
      capabilities: ['Image Generation', 'Style Transfer', 'Inpainting'],
      installed: true
    },

    // Code-specific Models
    {
      id: 'codex',
      name: 'Codex',
      provider: 'OpenAI',
      type: 'Code',
      pricing: 'paid',
      parameters: '12B',
      context: '8K tokens',
      rating: 4.8,
      downloads: 3500000,
      description: 'Specialized code generation',
      capabilities: ['Code Generation', 'Code Completion', 'Debugging'],
      installed: true
    },
    {
      id: 'copilot',
      name: 'GitHub Copilot',
      provider: 'GitHub/OpenAI',
      type: 'Code',
      pricing: 'paid',
      parameters: 'N/A',
      context: 'N/A',
      rating: 4.7,
      downloads: 4000000,
      description: 'AI pair programmer',
      capabilities: ['Code Completion', 'Code Generation', 'IDE Integration'],
      installed: true
    },

    // Embedding Models
    {
      id: 'text-embedding-ada',
      name: 'Ada Embeddings',
      provider: 'OpenAI',
      type: 'Embedding',
      pricing: 'paid',
      parameters: 'N/A',
      context: '8K tokens',
      rating: 4.6,
      downloads: 2000000,
      description: 'Text embeddings for semantic search',
      capabilities: ['Embeddings', 'Search', 'Similarity'],
      installed: true
    }
  ]);

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || model.type === filterType;
    const matchesPricing = filterPricing === 'all' || model.pricing === filterPricing;
    return matchesSearch && matchesType && matchesPricing;
  });

  const installModel = (id: string) => {
    setModels(prev => prev.map(m => 
      m.id === id ? { ...m, installed: true } : m
    ));
    toast.success('Model installed successfully!');
  };

  const uninstallModel = (id: string) => {
    setModels(prev => prev.map(m => 
      m.id === id ? { ...m, installed: false } : m
    ));
    toast.success('Model uninstalled');
  };

  const getPricingBadge = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'paid': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'freemium': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  const getPricingIcon = (pricing: string) => {
    switch (pricing) {
      case 'free': return <Unlock className="w-3 h-3" />;
      case 'paid': return <Lock className="w-3 h-3" />;
      case 'freemium': return <Zap className="w-3 h-3" />;
      default: return <DollarSign className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-purple-400 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI Model Marketplace
            </h3>
            <p className="text-xs text-purple-600 mt-1">
              {models.length} models available • {models.filter(m => m.installed).length} installed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
              {models.filter(m => m.pricing === 'free').length} Free
            </Badge>
            <Badge className="bg-orange-500/20 border-orange-500/50 text-orange-400">
              {models.filter(m => m.pricing === 'paid').length} Paid
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-600" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models..."
              className="pl-10 bg-black/60 border-purple-500/40 text-purple-100"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-black/60 border border-purple-500/40 rounded px-3 py-2 text-purple-300 text-sm"
          >
            <option value="all">All Types</option>
            <option value="LLM">LLM</option>
            <option value="Vision">Vision</option>
            <option value="Audio">Audio</option>
            <option value="Multimodal">Multimodal</option>
            <option value="Code">Code</option>
            <option value="Embedding">Embedding</option>
          </select>

          <select
            value={filterPricing}
            onChange={(e) => setFilterPricing(e.target.value)}
            className="bg-black/60 border border-purple-500/40 rounded px-3 py-2 text-purple-300 text-sm"
          >
            <option value="all">All Pricing</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Model Grid */}
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className={`p-4 transition-all ${
                    model.installed 
                      ? 'bg-purple-500/10 border-purple-500/40' 
                      : 'bg-black/40 border-purple-500/20'
                  } hover:border-purple-500/60`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-purple-400 mb-1">{model.name}</h4>
                        <p className="text-xs text-purple-600">{model.provider}</p>
                      </div>
                      <Badge className={getPricingBadge(model.pricing)}>
                        {getPricingIcon(model.pricing)}
                        <span className="ml-1">{model.pricing}</span>
                      </Badge>
                    </div>

                    <p className="text-xs text-purple-700 mb-3">{model.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-purple-600">Type:</span>
                        <div className="text-purple-400">{model.type}</div>
                      </div>
                      <div>
                        <span className="text-purple-600">Params:</span>
                        <div className="text-purple-400 font-mono">{model.parameters}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3 text-xs">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{model.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-600">
                        <Download className="w-3 h-3" />
                        <span>{(model.downloads / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {model.capabilities.slice(0, 3).map((cap, i) => (
                        <Badge key={i} className="bg-purple-500/20 border-purple-500/30 text-purple-400 text-[10px]">
                          {cap}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      onClick={() => model.installed ? uninstallModel(model.id) : installModel(model.id)}
                      className={`w-full ${
                        model.installed
                          ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      }`}
                      size="sm"
                    >
                      {model.installed ? 'Uninstall' : 'Install'}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Models', value: models.length, icon: Brain },
          { label: 'Installed', value: models.filter(m => m.installed).length, icon: Download },
          { label: 'Free Models', value: models.filter(m => m.pricing === 'free').length, icon: Unlock },
          { label: 'Providers', value: new Set(models.map(m => m.provider)).size, icon: TrendingUp }
        ].map((stat, i) => (
          <Card key={i} className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-600">{stat.label}</span>
            </div>
            <div className="text-2xl text-purple-400 font-mono">{stat.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

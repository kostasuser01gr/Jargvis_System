import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Puzzle, Download, Play, Pause, Settings, Trash2, Star, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  enabled: boolean;
  downloads: number;
  rating: number;
  size: string;
}

export function PluginManager() {
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: '1',
      name: 'Advanced Analytics Pro',
      description: 'Enhanced data visualization and reporting capabilities',
      version: '2.4.1',
      author: 'Stark Industries',
      category: 'Analytics',
      enabled: true,
      downloads: 15420,
      rating: 4.8,
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'AI Voice Enhancer',
      description: 'Natural language processing improvements for voice commands',
      version: '1.9.3',
      author: 'JARVIS Team',
      category: 'AI',
      enabled: true,
      downloads: 12890,
      rating: 4.9,
      size: '5.1 MB'
    },
    {
      id: '3',
      name: 'Security Scanner',
      description: 'Real-time vulnerability detection and threat analysis',
      version: '3.2.0',
      author: 'Shield Security',
      category: 'Security',
      enabled: false,
      downloads: 8765,
      rating: 4.7,
      size: '3.8 MB'
    },
    {
      id: '4',
      name: 'Code Optimizer',
      description: 'Automated code optimization and performance tuning',
      version: '1.5.2',
      author: 'Dev Tools Inc',
      category: 'Development',
      enabled: true,
      downloads: 6543,
      rating: 4.6,
      size: '1.9 MB'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Analytics', 'AI', 'Security', 'Development'];

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const togglePlugin = (id: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
    const plugin = plugins.find(p => p.id === id);
    toast.success(`${plugin?.name} ${plugin?.enabled ? 'disabled' : 'enabled'}`);
  };

  const installPlugin = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Installing plugin...',
        success: 'Plugin installed successfully!',
        error: 'Installation failed'
      }
    );
  };

  const uninstallPlugin = (id: string) => {
    setPlugins(prev => prev.filter(p => p.id !== id));
    toast.success('Plugin uninstalled');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Puzzle className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-purple-400">Plugin Manager</h3>
              <p className="text-xs text-purple-600">{plugins.length} plugins installed</p>
            </div>
          </div>
          <Button
            onClick={installPlugin}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Install New
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins..."
            className="flex-1 bg-black/60 border-purple-500/40 text-purple-100"
          />
          <div className="flex gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat 
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                  : 'border-purple-500/30 text-purple-400'}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Plugin Grid */}
        <ScrollArea className="h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredPlugins.map((plugin, index) => (
                <motion.div
                  key={plugin.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`p-4 transition-all ${
                    plugin.enabled 
                      ? 'bg-purple-500/10 border-purple-500/40' 
                      : 'bg-black/40 border-purple-500/20'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg flex items-center justify-center">
                          <Puzzle className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-purple-400">{plugin.name}</h4>
                            <Badge className="bg-purple-500/20 border-purple-500/50 text-purple-400 text-xs">
                              v{plugin.version}
                            </Badge>
                          </div>
                          <p className="text-xs text-purple-600 mb-2">{plugin.description}</p>
                          <div className="flex items-center gap-3 text-xs text-purple-700">
                            <span>{plugin.author}</span>
                            <span>•</span>
                            <span>{plugin.category}</span>
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={plugin.enabled}
                        onCheckedChange={() => togglePlugin(plugin.id)}
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-3 text-xs">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{plugin.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-600">
                        <Download className="w-3 h-3" />
                        <span>{plugin.downloads.toLocaleString()}</span>
                      </div>
                      <div className="text-purple-600">{plugin.size}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-purple-500/20">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs border-purple-500/30 text-purple-400"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => uninstallPlugin(plugin.id)}
                        className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Plugins', value: plugins.length, icon: Puzzle },
          { label: 'Active', value: plugins.filter(p => p.enabled).length, icon: Play },
          { label: 'Inactive', value: plugins.filter(p => !p.enabled).length, icon: Pause },
          { label: 'Avg Rating', value: '4.7', icon: Star }
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

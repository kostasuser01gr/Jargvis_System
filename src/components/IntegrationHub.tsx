import { useState } from 'react';
import { motion } from 'motion/react';
import { Plug, MessageSquare, FileText, CreditCard, CheckCircle2, XCircle, Settings, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  category: 'communication' | 'productivity' | 'payment' | 'storage' | 'other';
  description: string;
  connected: boolean;
  icon: string;
  status: 'active' | 'inactive' | 'error';
}

export function IntegrationHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'slack',
      name: 'Slack',
      category: 'communication',
      description: 'Send notifications and updates to Slack channels',
      connected: true,
      icon: '💬',
      status: 'active'
    },
    {
      id: 'discord',
      name: 'Discord',
      category: 'communication',
      description: 'Integrate with Discord servers',
      connected: false,
      icon: '🎮',
      status: 'inactive'
    },
    {
      id: 'notion',
      name: 'Notion',
      category: 'productivity',
      description: 'Sync models and results to Notion pages',
      connected: true,
      icon: '📝',
      status: 'active'
    },
    {
      id: 'obsidian',
      name: 'Obsidian',
      category: 'productivity',
      description: 'Export notes and documentation',
      connected: false,
      icon: '🔗',
      status: 'inactive'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'payment',
      description: 'Process payments for marketplace models',
      connected: true,
      icon: '💳',
      status: 'active'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      category: 'payment',
      description: 'Alternative payment processing',
      connected: false,
      icon: '💰',
      status: 'inactive'
    },
    {
      id: 's3',
      name: 'AWS S3',
      category: 'storage',
      description: 'Store models and datasets in S3',
      connected: true,
      icon: '☁️',
      status: 'active'
    },
    {
      id: 'gcs',
      name: 'Google Cloud Storage',
      category: 'storage',
      description: 'Store models in GCS buckets',
      connected: false,
      icon: '📦',
      status: 'inactive'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            connected: !integration.connected,
            status: !integration.connected ? 'active' : 'inactive'
          }
        : integration
    ));
    const integration = integrations.find(i => i.id === id);
    toast.success(`${integration?.name} ${!integration?.connected ? 'connected' : 'disconnected'}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'productivity': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'payment': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'storage': return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const filteredIntegrations = selectedCategory === 'all'
    ? integrations
    : integrations.filter(i => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-pink-950/20 to-rose-950/20 border-pink-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-pink-400 flex items-center gap-2">
              <Plug className="w-6 h-5" />
              Integration Hub
            </h3>
            <p className="text-xs text-pink-600 mt-1">Connect with external services and platforms</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Integrations', value: integrations.length, icon: Plug },
            { label: 'Connected', value: integrations.filter(i => i.connected).length, icon: CheckCircle2 },
            { label: 'Active', value: integrations.filter(i => i.status === 'active').length, icon: Zap },
            { label: 'Categories', value: 4, icon: Settings },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-pink-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-pink-400" />
                <p className="text-lg text-pink-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-pink-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="bg-black/40 border-pink-500/30">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="mt-6">
          <Card className="bg-gradient-to-br from-pink-950/20 to-rose-950/20 border-pink-500/30 p-6">
            <div className="flex gap-2 mb-4">
              {['all', 'communication', 'productivity', 'payment', 'storage'].map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className={
                    selectedCategory === cat
                      ? 'bg-pink-500/30 text-pink-300'
                      : 'border-pink-500/30 text-pink-400'
                  }
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="bg-black/40 border-pink-500/30 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <h5 className="text-pink-400 mb-1">{integration.name}</h5>
                        <Badge className={getCategoryColor(integration.category)}>
                          {integration.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-pink-300 mb-3">{integration.description}</p>
                  <Button
                    onClick={() => toggleIntegration(integration.id)}
                    className={`w-full ${
                      integration.connected
                        ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {integration.connected ? (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <Card className="bg-gradient-to-br from-pink-950/20 to-rose-950/20 border-pink-500/30 p-6">
            <h4 className="text-pink-400 mb-4">Webhook Configuration</h4>
            <div className="space-y-4">
              <Card className="bg-black/40 border-pink-500/30 p-4">
                <h5 className="text-pink-400 mb-3">Create Webhook</h5>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-pink-600 mb-2 block">Webhook URL</label>
                    <Input
                      placeholder="https://your-app.com/webhook"
                      className="bg-black/60 border-pink-500/40 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-pink-600 mb-2 block">Events</label>
                    <div className="space-y-2">
                      {['model.trained', 'model.deployed', 'model.failed', 'dataset.uploaded'].map((event) => (
                        <div key={event} className="flex items-center gap-2">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm text-pink-300">{event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-pink-500/20 border-pink-500/50 text-pink-400 hover:bg-pink-500/30">
                    Create Webhook
                  </Button>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card className="bg-gradient-to-br from-pink-950/20 to-rose-950/20 border-pink-500/30 p-6">
            <h4 className="text-pink-400 mb-4">API Keys Management</h4>
            <div className="space-y-3">
              {[
                { name: 'OpenAI API', key: 'sk-...****', lastUsed: '2 hours ago' },
                { name: 'Anthropic API', key: 'sk-ant-...****', lastUsed: '1 day ago' },
                { name: 'Stripe API', key: 'sk_live_...****', lastUsed: '5 minutes ago' },
              ].map((api, i) => (
                <Card key={i} className="bg-black/40 border-pink-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-pink-400 mb-1">{api.name}</h5>
                      <p className="text-xs text-pink-600 font-mono">{api.key}</p>
                      <p className="text-xs text-pink-600 mt-1">Last used: {api.lastUsed}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-500/30 text-pink-400 hover:bg-pink-500/20"
                      >
                        <Settings className="w-3 h-3 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

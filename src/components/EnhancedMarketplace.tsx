import { useState } from 'react';
import { motion } from 'motion/react';
import { Store, Upload, DollarSign, Star, Download, Eye, Settings, TrendingUp, Users, Award, Shield, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface MarketplaceModel {
  id: string;
  name: string;
  author: string;
  description: string;
  category: string;
  price: number;
  license: 'open-source' | 'commercial' | 'freemium';
  rating: number;
  downloads: number;
  revenue: number;
  status: 'published' | 'draft' | 'pending';
  tags: string[];
  createdAt: Date;
}

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  modelsSold: number;
  averagePrice: number;
}

export function EnhancedMarketplace() {
  const [myModels, setMyModels] = useState<MarketplaceModel[]>([
    {
      id: '1',
      name: 'JARVIS-CodeGen-Pro',
      author: 'You',
      description: 'Advanced code generation model with 98% accuracy',
      category: 'Code Generation',
      price: 49.99,
      license: 'commercial',
      rating: 4.8,
      downloads: 1250,
      revenue: 62487.50,
      status: 'published',
      tags: ['code', 'generation', 'ai'],
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      name: 'Text-Analyzer-Base',
      author: 'You',
      description: 'Basic text analysis model',
      category: 'NLP',
      price: 0,
      license: 'open-source',
      rating: 4.5,
      downloads: 5670,
      revenue: 0,
      status: 'published',
      tags: ['nlp', 'text', 'analysis'],
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      id: '3',
      name: 'Vision-Detector-Ultra',
      author: 'You',
      description: 'Premium vision detection model',
      category: 'Computer Vision',
      price: 99.99,
      license: 'freemium',
      rating: 4.9,
      downloads: 890,
      revenue: 89011.10,
      status: 'published',
      tags: ['vision', 'detection', 'premium'],
      createdAt: new Date(Date.now() - 259200000)
    }
  ]);

  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue: 151498.60,
    monthlyRevenue: 45230.50,
    modelsSold: 2810,
    averagePrice: 53.91
  });

  const [publishForm, setPublishForm] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    license: 'open-source' as const,
    tags: ''
  });

  const publishModel = () => {
    if (!publishForm.name || !publishForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newModel: MarketplaceModel = {
      id: `model-${Date.now()}`,
      name: publishForm.name,
      author: 'You',
      description: publishForm.description,
      category: publishForm.category || 'General',
      price: publishForm.price,
      license: publishForm.license,
      rating: 0,
      downloads: 0,
      revenue: 0,
      status: 'pending',
      tags: publishForm.tags.split(',').map(t => t.trim()),
      createdAt: new Date()
    };

    setMyModels([newModel, ...myModels]);
    setPublishForm({
      name: '',
      description: '',
      category: '',
      price: 0,
      license: 'open-source',
      tags: ''
    });
    toast.success('Model submitted for review!');
  };

  const getLicenseColor = (license: string) => {
    switch (license) {
      case 'open-source': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'commercial': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'freemium': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-amber-950/20 to-yellow-950/20 border-amber-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-amber-400 flex items-center gap-2">
              <Store className="w-6 h-5" />
              Enhanced Model Marketplace
            </h3>
            <p className="text-xs text-amber-600 mt-1">Publish, license, and monetize your AI models</p>
          </div>
          <Button
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Publish Model
          </Button>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: `$${revenueStats.totalRevenue.toLocaleString()}`, icon: DollarSign },
            { label: 'Monthly Revenue', value: `$${revenueStats.monthlyRevenue.toLocaleString()}`, icon: TrendingUp },
            { label: 'Models Sold', value: revenueStats.modelsSold.toLocaleString(), icon: Download },
            { label: 'Avg Price', value: `$${revenueStats.averagePrice.toFixed(2)}`, icon: Award },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-amber-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-amber-400" />
                <p className="text-lg text-amber-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-amber-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="my-models" className="w-full">
        <TabsList className="bg-black/40 border-amber-500/30">
          <TabsTrigger value="my-models">My Models</TabsTrigger>
          <TabsTrigger value="publish">Publish New</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="licensing">Licensing</TabsTrigger>
        </TabsList>

        <TabsContent value="my-models" className="mt-6">
          <Card className="bg-gradient-to-br from-amber-950/20 to-yellow-950/20 border-amber-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-amber-400">Published Models ({myModels.length})</h4>
            </div>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {myModels.map((model) => (
                  <Card key={model.id} className="bg-black/40 border-amber-500/30 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="text-amber-400">{model.name}</h5>
                          <Badge className={getLicenseColor(model.license)}>
                            {model.license}
                          </Badge>
                          <Badge className={
                            model.status === 'published' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                            model.status === 'pending' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                            'bg-gray-500/20 border-gray-500/50 text-gray-400'
                          }>
                            {model.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-amber-300 mb-2">{model.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {model.tags.map((tag, i) => (
                            <Badge key={i} className="bg-amber-500/10 text-amber-400 text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-amber-600">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            {model.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {model.downloads.toLocaleString()}
                          </span>
                          {model.revenue > 0 && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ${model.revenue.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xl text-amber-400 font-mono mb-1">
                          {model.price === 0 ? 'Free' : `$${model.price.toFixed(2)}`}
                        </div>
                        <div className="text-xs text-amber-600">Price</div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-amber-500/20">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                      >
                        <Settings className="w-3 h-3 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="publish" className="mt-6">
          <Card className="bg-gradient-to-br from-amber-950/20 to-yellow-950/20 border-amber-500/30 p-6">
            <h4 className="text-amber-400 mb-4">Publish New Model</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-amber-600 mb-2 block">Model Name *</label>
                <Input
                  value={publishForm.name}
                  onChange={(e) => setPublishForm({ ...publishForm, name: e.target.value })}
                  placeholder="Enter model name"
                  className="bg-black/60 border-amber-500/40 text-amber-100"
                />
              </div>

              <div>
                <label className="text-xs text-amber-600 mb-2 block">Description *</label>
                <textarea
                  value={publishForm.description}
                  onChange={(e) => setPublishForm({ ...publishForm, description: e.target.value })}
                  placeholder="Describe your model..."
                  className="w-full bg-black/60 border border-amber-500/40 rounded px-3 py-2 text-amber-100 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-amber-600 mb-2 block">Category</label>
                  <Input
                    value={publishForm.category}
                    onChange={(e) => setPublishForm({ ...publishForm, category: e.target.value })}
                    placeholder="e.g., NLP, Vision, Code"
                    className="bg-black/60 border-amber-500/40 text-amber-100"
                  />
                </div>

                <div>
                  <label className="text-xs text-amber-600 mb-2 block">Price ($)</label>
                  <Input
                    type="number"
                    value={publishForm.price}
                    onChange={(e) => setPublishForm({ ...publishForm, price: parseFloat(e.target.value) || 0 })}
                    className="bg-black/60 border-amber-500/40 text-amber-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-amber-600 mb-2 block">License</label>
                <select
                  value={publishForm.license}
                  onChange={(e) => setPublishForm({ ...publishForm, license: e.target.value as any })}
                  className="w-full bg-black/60 border border-amber-500/40 rounded px-3 py-2 text-amber-300"
                >
                  <option value="open-source">Open Source (Free)</option>
                  <option value="commercial">Commercial (Paid)</option>
                  <option value="freemium">Freemium (Free + Paid tiers)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-amber-600 mb-2 block">Tags (comma-separated)</label>
                <Input
                  value={publishForm.tags}
                  onChange={(e) => setPublishForm({ ...publishForm, tags: e.target.value })}
                  placeholder="e.g., nlp, text, analysis"
                  className="bg-black/60 border-amber-500/40 text-amber-100"
                />
              </div>

              <Button
                onClick={publishModel}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Publish Model
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-gradient-to-br from-amber-950/20 to-yellow-950/20 border-amber-500/30 p-6">
            <h4 className="text-amber-400 mb-4">Marketplace Analytics</h4>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-black/40 border-amber-500/30 p-4">
                <h5 className="text-amber-400 mb-3">Revenue Trends</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-600">This Month:</span>
                    <span className="text-amber-400 font-mono">${revenueStats.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-600">Last Month:</span>
                    <span className="text-amber-400 font-mono">$38,450.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-600">Growth:</span>
                    <span className="text-green-400 font-mono">+17.5%</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-black/40 border-amber-500/30 p-4">
                <h5 className="text-amber-400 mb-3">Top Performers</h5>
                <div className="space-y-2 text-sm">
                  {myModels
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 3)
                    .map((model, i) => (
                      <div key={model.id} className="flex justify-between">
                        <span className="text-amber-600">{i + 1}. {model.name}</span>
                        <span className="text-amber-400 font-mono">${model.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="licensing" className="mt-6">
          <Card className="bg-gradient-to-br from-amber-950/20 to-yellow-950/20 border-amber-500/30 p-6">
            <h4 className="text-amber-400 mb-4">License Management</h4>
            <div className="space-y-4">
              <Card className="bg-black/40 border-amber-500/30 p-4">
                <h5 className="text-amber-400 mb-2">Open Source License</h5>
                <p className="text-sm text-amber-600 mb-3">Free to use, modify, and distribute</p>
                <Button variant="outline" className="border-amber-500/30 text-amber-400">
                  <FileText className="w-4 h-4 mr-2" />
                  View License Template
                </Button>
              </Card>

              <Card className="bg-black/40 border-amber-500/30 p-4">
                <h5 className="text-amber-400 mb-2">Commercial License</h5>
                <p className="text-sm text-amber-600 mb-3">Paid license with usage restrictions</p>
                <Button variant="outline" className="border-amber-500/30 text-amber-400">
                  <Shield className="w-4 h-4 mr-2" />
                  Configure License Terms
                </Button>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

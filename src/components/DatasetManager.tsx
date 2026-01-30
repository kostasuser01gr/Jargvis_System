import { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Upload, Download, Trash2, Eye, Settings, FileText, Image, Video, Music, CheckCircle2, AlertCircle, BarChart3, Filter, Search, Tag, Layers } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface Dataset {
  id: string;
  name: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'multimodal';
  size: number;
  samples: number;
  status: 'ready' | 'processing' | 'error';
  version: string;
  createdAt: Date;
  tags: string[];
  quality: number;
  format: string;
}

interface DataSample {
  id: string;
  content: string;
  label?: string;
  metadata?: Record<string, any>;
}

export function DatasetManager() {
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: '1',
      name: 'Common Crawl Text',
      type: 'text',
      size: 125000000000, // 125 GB
      samples: 50000000,
      status: 'ready',
      version: 'v1.0',
      createdAt: new Date(Date.now() - 86400000),
      tags: ['nlp', 'text', 'web'],
      quality: 95,
      format: 'JSONL'
    },
    {
      id: '2',
      name: 'ImageNet Subset',
      type: 'image',
      size: 50000000000, // 50 GB
      samples: 1000000,
      status: 'ready',
      version: 'v2.1',
      createdAt: new Date(Date.now() - 172800000),
      tags: ['vision', 'classification'],
      quality: 98,
      format: 'TFRecord'
    },
    {
      id: '3',
      name: 'Audio Speech Dataset',
      type: 'audio',
      size: 10000000000, // 10 GB
      samples: 50000,
      status: 'processing',
      version: 'v1.5',
      createdAt: new Date(Date.now() - 3600000),
      tags: ['speech', 'asr'],
      quality: 92,
      format: 'WAV'
    }
  ]);

  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(datasets[0]);
  const [samples, setSamples] = useState<DataSample[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success('Dataset uploaded successfully!');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const deleteDataset = (id: string) => {
    setDatasets(datasets.filter(d => d.id !== id));
    if (selectedDataset?.id === id) setSelectedDataset(null);
    toast.success('Dataset deleted');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'image': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'audio': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'video': return 'bg-red-500/20 border-red-500/50 text-red-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  const filteredDatasets = datasets.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border-emerald-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-emerald-400 flex items-center gap-2">
              <Database className="w-6 h-5" />
              Dataset Management System
            </h3>
            <p className="text-xs text-emerald-600 mt-1">Upload, manage, and prepare training data</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Dataset'}
            </Button>
            <Button
              variant="outline"
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-400">Uploading dataset...</span>
              <span className="text-emerald-400 font-mono">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search datasets..."
              className="bg-black/60 border-emerald-500/40 text-emerald-100 pl-10"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dataset List */}
        <Card className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border-emerald-500/30 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-emerald-400">Datasets ({filteredDatasets.length})</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400">
                <Filter className="w-3 h-3 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredDatasets.map((dataset) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-black/40 border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedDataset?.id === dataset.id
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-emerald-500/20 hover:border-emerald-500/40'
                  }`}
                  onClick={() => setSelectedDataset(dataset)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${getTypeColor(dataset.type)}`}>
                        {getTypeIcon(dataset.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-emerald-400">{dataset.name}</h4>
                          <Badge className={getTypeColor(dataset.type)}>
                            {dataset.type}
                          </Badge>
                          <Badge className={
                            dataset.status === 'ready' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                            dataset.status === 'processing' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                            'bg-red-500/20 border-red-500/50 text-red-400'
                          }>
                            {dataset.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-emerald-600">
                          <span>{formatSize(dataset.size)}</span>
                          <span>•</span>
                          <span>{dataset.samples.toLocaleString()} samples</span>
                          <span>•</span>
                          <span>{dataset.format}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-emerald-400 font-mono">{dataset.quality}%</div>
                      <div className="text-xs text-emerald-600">Quality</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dataset.tags.map((tag, i) => (
                      <Badge key={i} className="bg-emerald-500/10 text-emerald-400 text-[10px]">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-emerald-500/20">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info('Viewing dataset samples...');
                      }}
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    >
                      <Settings className="w-3 h-3 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDataset(dataset.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Dataset Details & Tools */}
        <Card className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border-emerald-500/30 p-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="bg-black/40 border-emerald-500/30">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              {selectedDataset ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-emerald-600 mb-2 block">Dataset Name</label>
                    <div className="bg-black/60 border border-emerald-500/40 rounded px-3 py-2 text-emerald-100">
                      {selectedDataset.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-emerald-600 mb-2 block">Type</label>
                      <div className="bg-black/60 border border-emerald-500/40 rounded px-3 py-2 text-emerald-100 text-sm uppercase">
                        {selectedDataset.type}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-emerald-600 mb-2 block">Version</label>
                      <div className="bg-black/60 border border-emerald-500/40 rounded px-3 py-2 text-emerald-100 text-sm">
                        {selectedDataset.version}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-emerald-600 mb-2 block">Size</label>
                    <div className="bg-black/60 border border-emerald-500/40 rounded px-3 py-2 text-emerald-100 font-mono">
                      {formatSize(selectedDataset.size)}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-emerald-600 mb-2 block">Samples</label>
                    <div className="bg-black/60 border border-emerald-500/40 rounded px-3 py-2 text-emerald-100 font-mono">
                      {selectedDataset.samples.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-emerald-600 mb-2 block">Quality Score</label>
                    <div className="flex items-center gap-3">
                      <Progress value={selectedDataset.quality} className="flex-1" />
                      <span className="text-emerald-400 font-mono text-sm">{selectedDataset.quality}%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-emerald-500/20">
                    <h5 className="text-emerald-400 text-sm mb-3">Data Quality Checks</h5>
                    <div className="space-y-2">
                      {['No duplicates detected', 'Format validation passed', 'Label consistency: 98%', 'Metadata complete'].map((check, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-emerald-600">{check}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-emerald-600 py-8">
                  <div className="text-center">
                    <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select a dataset to view details</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tools" className="mt-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 justify-start"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Data Augmentation
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Quality Analysis
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 justify-start"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Auto Labeling
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Preprocessing
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Dataset
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

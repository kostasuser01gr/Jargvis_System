import { useState } from 'react';
import { motion } from 'motion/react';
import { Wrench, Plus, Play, Settings, Code, Calculator, Search, Globe, Database, FileText, Image, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'calculation' | 'search' | 'code' | 'data' | 'web' | 'image' | 'custom';
  parameters: ToolParameter[];
  enabled: boolean;
  usageCount: number;
}

interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  description: string;
  default?: any;
}

interface ToolExecution {
  id: string;
  tool: string;
  input: Record<string, any>;
  output: any;
  timestamp: Date;
  success: boolean;
}

export function ToolUseFramework() {
  const [tools, setTools] = useState<Tool[]>([
    {
      id: 'calculator',
      name: 'Calculator',
      description: 'Perform mathematical calculations',
      category: 'calculation',
      parameters: [
        { name: 'expression', type: 'string', required: true, description: 'Mathematical expression to evaluate' }
      ],
      enabled: true,
      usageCount: 1250
    },
    {
      id: 'web-search',
      name: 'Web Search',
      description: 'Search the web for information',
      category: 'search',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Search query' },
        { name: 'maxResults', type: 'number', required: false, description: 'Maximum results', default: 10 }
      ],
      enabled: true,
      usageCount: 890
    },
    {
      id: 'code-executor',
      name: 'Code Executor',
      description: 'Execute code in various languages',
      category: 'code',
      parameters: [
        { name: 'code', type: 'string', required: true, description: 'Code to execute' },
        { name: 'language', type: 'string', required: true, description: 'Programming language' }
      ],
      enabled: true,
      usageCount: 567
    },
    {
      id: 'database-query',
      name: 'Database Query',
      description: 'Query databases',
      category: 'data',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'SQL query' },
        { name: 'database', type: 'string', required: true, description: 'Database name' }
      ],
      enabled: true,
      usageCount: 432
    },
    {
      id: 'image-processor',
      name: 'Image Processor',
      description: 'Process and analyze images',
      category: 'image',
      parameters: [
        { name: 'imageUrl', type: 'string', required: true, description: 'URL or path to image' },
        { name: 'operation', type: 'string', required: true, description: 'Operation to perform' }
      ],
      enabled: true,
      usageCount: 234
    }
  ]);

  const [executions, setExecutions] = useState<ToolExecution[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(tools[0]);
  const [toolInputs, setToolInputs] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);

  const executeTool = () => {
    if (!selectedTool) return;

    // Validate required parameters
    const requiredParams = selectedTool.parameters.filter(p => p.required);
    const missingParams = requiredParams.filter(p => !toolInputs[p.name]);
    
    if (missingParams.length > 0) {
      toast.error(`Missing required parameters: ${missingParams.map(p => p.name).join(', ')}`);
      return;
    }

    setIsExecuting(true);
    
    // Simulate tool execution
    setTimeout(() => {
      let output: any;
      
      switch (selectedTool.id) {
        case 'calculator':
          try {
            // Safe expression evaluation without eval
            const sanitized = toolInputs.expression.replace(/[^0-9+\-*/().\s]/g, '');
            // Use Function constructor as safer alternative (still limited)
            const result = new Function('return ' + sanitized)();
            output = { result: result, expression: toolInputs.expression };
          } catch (e) {
            output = { error: 'Invalid expression' };
          }
          break;
        case 'web-search':
          output = {
            results: [
              { title: 'Result 1', url: 'https://example.com/1', snippet: 'Relevant information...' },
              { title: 'Result 2', url: 'https://example.com/2', snippet: 'More information...' }
            ],
            query: toolInputs.query
          };
          break;
        case 'code-executor':
          output = { result: 'Code executed successfully', output: 'Hello, World!', language: toolInputs.language };
          break;
        default:
          output = { result: 'Tool executed successfully', input: toolInputs };
      }

      const execution: ToolExecution = {
        id: `exec-${Date.now()}`,
        tool: selectedTool.name,
        input: toolInputs,
        output,
        timestamp: new Date(),
        success: !output.error
      };

      setExecutions([execution, ...executions]);
      setTools(tools.map(t => t.id === selectedTool.id ? { ...t, usageCount: t.usageCount + 1 } : t));
      setIsExecuting(false);
      toast.success(`${selectedTool.name} executed successfully!`);
    }, 1000);
  };

  const createCustomTool = () => {
    toast.info('Custom tool creation interface coming soon!');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'calculation': return <Calculator className="w-4 h-4" />;
      case 'search': return <Search className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'web': return <Globe className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'calculation': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'search': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'code': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'data': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'web': return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
      case 'image': return 'bg-pink-500/20 border-pink-500/50 text-pink-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-lime-950/20 to-green-950/20 border-lime-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lime-400 flex items-center gap-2">
              <Wrench className="w-6 h-5" />
              Tool Use & Function Calling Framework
            </h3>
            <p className="text-xs text-lime-600 mt-1">Enable AI models to call external tools and functions</p>
          </div>
          <Button
            onClick={createCustomTool}
            className="bg-gradient-to-r from-lime-500 to-green-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Custom Tool
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Available Tools', value: tools.length, icon: Wrench },
            { label: 'Total Executions', value: executions.length, icon: Play },
            { label: 'Active Tools', value: tools.filter(t => t.enabled).length, icon: Zap },
            { label: 'Success Rate', value: executions.length > 0 ? ((executions.filter(e => e.success).length / executions.length) * 100).toFixed(0) + '%' : '100%', icon: CheckCircle2 },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-lime-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-lime-400" />
                <p className="text-lg text-lime-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-lime-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool Library */}
        <Card className="bg-gradient-to-br from-lime-950/20 to-green-950/20 border-lime-500/30 p-6">
          <h4 className="text-lime-400 mb-4">Tool Library</h4>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {tools.map((tool) => (
                <Card
                  key={tool.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedTool?.id === tool.id
                      ? 'bg-lime-500/20 border-lime-500/50'
                      : 'bg-black/40 border-lime-500/30 hover:border-lime-500/40'
                  }`}
                  onClick={() => {
                    setSelectedTool(tool);
                    setToolInputs({});
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      <div className={`p-2 rounded ${getCategoryColor(tool.category)}`}>
                        {getCategoryIcon(tool.category)}
                      </div>
                      <div>
                        <h5 className="text-lime-400 mb-1">{tool.name}</h5>
                        <p className="text-xs text-lime-600">{tool.description}</p>
                      </div>
                    </div>
                    <Badge className={tool.enabled ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-gray-500/20 border-gray-500/50 text-gray-400'}>
                      {tool.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-lime-600 mt-2">
                    <span>{tool.usageCount} uses</span>
                    <Badge className={getCategoryColor(tool.category)}>
                      {tool.category}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Tool Execution */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-lime-950/20 to-green-950/20 border-lime-500/30 p-6">
          <Tabs defaultValue="execute" className="w-full">
            <TabsList className="bg-black/40 border-lime-500/30">
              <TabsTrigger value="execute">Execute</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="composition">Composition</TabsTrigger>
            </TabsList>

            <TabsContent value="execute" className="mt-6">
              {selectedTool ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lime-400 mb-2">{selectedTool.name}</h4>
                    <p className="text-sm text-lime-600 mb-4">{selectedTool.description}</p>
                  </div>

                  <div className="space-y-4">
                    {selectedTool.parameters.map((param) => (
                      <div key={param.name}>
                        <label className="text-xs text-lime-600 mb-2 block">
                          {param.name} {param.required && <span className="text-red-400">*</span>}
                          <span className="text-lime-700 ml-2">({param.type})</span>
                        </label>
                        {param.type === 'boolean' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={toolInputs[param.name] || false}
                              onChange={(e) => setToolInputs({ ...toolInputs, [param.name]: e.target.checked })}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-lime-300">{param.description}</span>
                          </div>
                        ) : param.type === 'number' ? (
                          <Input
                            type="number"
                            value={toolInputs[param.name] || param.default || ''}
                            onChange={(e) => setToolInputs({ ...toolInputs, [param.name]: parseFloat(e.target.value) || param.default })}
                            placeholder={param.description}
                            className="bg-black/60 border-lime-500/40 text-lime-100"
                          />
                        ) : (
                          <Input
                            value={toolInputs[param.name] || param.default || ''}
                            onChange={(e) => setToolInputs({ ...toolInputs, [param.name]: e.target.value })}
                            placeholder={param.description}
                            className="bg-black/60 border-lime-500/40 text-lime-100"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={executeTool}
                    disabled={isExecuting}
                    className="w-full bg-lime-500/20 border-lime-500/50 text-lime-400 hover:bg-lime-500/30"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isExecuting ? 'Executing...' : 'Execute Tool'}
                  </Button>
                </div>
              ) : (
                <div className="text-center text-lime-600 py-8">
                  <Wrench className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select a tool to execute</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <ScrollArea className="h-[500px]">
                {executions.length === 0 ? (
                  <div className="text-center text-lime-600 py-8">
                    <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No executions yet</p>
                    <p className="text-xs mt-1">Execute a tool to see history</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {executions.map((exec) => (
                      <Card key={exec.id} className="bg-black/40 border-lime-500/30 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="text-lime-400">{exec.tool}</h5>
                              {exec.success ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            <p className="text-xs text-lime-600">
                              {exec.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-lime-600">Input:</span>
                            <pre className="text-lime-300 mt-1 bg-black/60 p-2 rounded overflow-auto">
                              {JSON.stringify(exec.input, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="text-lime-600">Output:</span>
                            <pre className="text-lime-300 mt-1 bg-black/60 p-2 rounded overflow-auto">
                              {JSON.stringify(exec.output, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="composition" className="mt-6">
              <div className="space-y-4">
                <Card className="bg-black/40 border-lime-500/30 p-4">
                  <h5 className="text-lime-400 mb-3">Tool Composition</h5>
                  <p className="text-sm text-lime-600 mb-4">
                    Chain multiple tools together to create complex workflows
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full border-lime-500/30 text-lime-400 hover:bg-lime-500/20"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Tool Chain
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-lime-500/30 text-lime-400 hover:bg-lime-500/20"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Parallel Execution
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-lime-500/30 text-lime-400 hover:bg-lime-500/20"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Conditional Logic
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

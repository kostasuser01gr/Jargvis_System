import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Workflow, Play, Save, Trash2, Settings, Plus, GitBranch, Zap, CheckCircle2, AlertCircle, Clock, Repeat } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'loop' | 'delay' | 'webhook';
  label: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  connections: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  status: 'draft' | 'active' | 'paused' | 'error';
  lastRun?: Date;
  runCount: number;
  successRate: number;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Omit<WorkflowNode, 'id' | 'position'>[];
}

export function WorkflowAutomationBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const nodeTypes = [
    { type: 'trigger', label: 'Trigger', icon: Zap, color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' },
    { type: 'action', label: 'Action', icon: Play, color: 'bg-blue-500/20 border-blue-500/50 text-blue-400' },
    { type: 'condition', label: 'Condition', icon: GitBranch, color: 'bg-green-500/20 border-green-500/50 text-green-400' },
    { type: 'loop', label: 'Loop', icon: Repeat, color: 'bg-purple-500/20 border-purple-500/50 text-purple-400' },
    { type: 'delay', label: 'Delay', icon: Clock, color: 'bg-orange-500/20 border-orange-500/50 text-orange-400' },
    { type: 'webhook', label: 'Webhook', icon: Zap, color: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' },
  ];

  const templates: WorkflowTemplate[] = [
    {
      id: 'model-training',
      name: 'Model Training Pipeline',
      description: 'Automated model training workflow',
      category: 'AI/ML',
      nodes: [
        { type: 'trigger', label: 'Dataset Uploaded', config: {}, connections: [] },
        { type: 'action', label: 'Preprocess Data', config: {}, connections: [] },
        { type: 'action', label: 'Train Model', config: {}, connections: [] },
        { type: 'condition', label: 'Accuracy > 90%?', config: {}, connections: [] },
        { type: 'action', label: 'Deploy Model', config: {}, connections: [] },
      ]
    },
    {
      id: 'data-pipeline',
      name: 'Data Processing Pipeline',
      description: 'ETL workflow for data processing',
      category: 'Data',
      nodes: [
        { type: 'trigger', label: 'New Data Arrives', config: {}, connections: [] },
        { type: 'action', label: 'Validate Data', config: {}, connections: [] },
        { type: 'action', label: 'Transform Data', config: {}, connections: [] },
        { type: 'action', label: 'Load to Database', config: {}, connections: [] },
      ]
    }
  ];

  const addNode = (type: WorkflowNode['type'], label: string) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      label,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      config: {},
      connections: []
    };
    setNodes([...nodes, newNode]);
    toast.success(`Added ${label} node`);
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedNode?.id === id) setSelectedNode(null);
    toast.info('Node deleted');
  };

  const saveWorkflow = () => {
    if (!selectedWorkflow) {
      const newWorkflow: Workflow = {
        id: `workflow-${Date.now()}`,
        name: 'New Workflow',
        description: '',
        nodes,
        status: 'draft',
        runCount: 0,
        successRate: 100
      };
      setWorkflows([...workflows, newWorkflow]);
      setSelectedWorkflow(newWorkflow);
      toast.success('Workflow saved!');
    } else {
      setWorkflows(workflows.map(w => 
        w.id === selectedWorkflow.id 
          ? { ...w, nodes, name: selectedWorkflow.name, description: selectedWorkflow.description }
          : w
      ));
      toast.success('Workflow updated!');
    }
  };

  const runWorkflow = () => {
    if (nodes.length === 0) {
      toast.error('Add nodes to workflow first');
      return;
    }
    setIsRunning(true);
    toast.info('Workflow started...');
    
    setTimeout(() => {
      setIsRunning(false);
      toast.success('Workflow completed successfully!');
    }, 3000);
  };

  const loadTemplate = (template: WorkflowTemplate) => {
    const newNodes: WorkflowNode[] = template.nodes.map((node, i) => ({
      ...node,
      id: `node-${Date.now()}-${i}`,
      position: { x: 100 + i * 200, y: 200 }
    }));
    setNodes(newNodes);
    toast.success(`Loaded ${template.name} template`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border-emerald-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-emerald-400 flex items-center gap-2">
              <Workflow className="w-6 h-5" />
              Workflow Automation Builder
            </h3>
            <p className="text-xs text-emerald-600 mt-1">Visual workflow designer with automation capabilities</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={saveWorkflow}
              className="bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={runWorkflow}
              disabled={isRunning || nodes.length === 0}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Workflow'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Nodes', value: nodes.length, icon: GitBranch },
            { label: 'Workflows', value: workflows.length, icon: Workflow },
            { label: 'Active', value: workflows.filter(w => w.status === 'active').length, icon: CheckCircle2 },
            { label: 'Success Rate', value: workflows.length > 0 ? `${Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%` : '100%', icon: Zap },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-emerald-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-emerald-400" />
                <p className="text-lg text-emerald-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-emerald-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Node Palette */}
        <Card className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border-emerald-500/30 p-6">
          <h4 className="text-emerald-400 mb-4">Node Palette</h4>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {nodeTypes.map((nodeType) => (
                <Button
                  key={nodeType.type}
                  onClick={() => addNode(nodeType.type as WorkflowNode['type'], nodeType.label)}
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 justify-start"
                >
                  <nodeType.icon className="w-4 h-4 mr-2" />
                  {nodeType.label}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-6 pt-6 border-t border-emerald-500/20">
            <h4 className="text-emerald-400 mb-4">Templates</h4>
            <div className="space-y-2">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="p-3 bg-black/40 border-emerald-500/30 cursor-pointer hover:border-emerald-500/50 transition-all"
                  onClick={() => loadTemplate(template)}
                >
                  <h5 className="text-emerald-400 text-sm mb-1">{template.name}</h5>
                  <p className="text-xs text-emerald-600">{template.description}</p>
                  <Badge className="bg-emerald-500/10 text-emerald-400 text-[10px] mt-2">
                    {template.category}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </Card>

        {/* Canvas Area */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border-emerald-500/30 p-6">
          <h4 className="text-emerald-400 mb-4">Workflow Canvas</h4>
          <div
            ref={canvasRef}
            className="bg-black/40 rounded-lg border border-emerald-500/20 p-4 overflow-auto relative"
            style={{ height: '600px', minHeight: '600px' }}
          >
            {nodes.length === 0 ? (
              <div className="flex items-center justify-center h-full text-emerald-600">
                <div className="text-center">
                  <Workflow className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No nodes added</p>
                  <p className="text-xs mt-1">Add nodes from the palette</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {nodes.map((node) => {
                  const NodeIcon = nodeTypes.find(nt => nt.type === node.type)?.icon || Workflow;
                  const nodeColor = nodeTypes.find(nt => nt.type === node.type)?.color || 'bg-gray-500/20 border-gray-500/50 text-gray-400';
                  
                  return (
                    <motion.div
                      key={node.id}
                      drag
                      dragMomentum={false}
                      onDragEnd={(e, info) => {
                        setNodes(nodes.map(n =>
                          n.id === node.id
                            ? { ...n, position: { x: n.position.x + info.offset.x, y: n.position.y + info.offset.y } }
                            : n
                        ));
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute p-4 rounded-lg cursor-move border-2 ${
                        selectedNode?.id === node.id
                          ? 'ring-2 ring-emerald-500 ring-offset-2'
                          : ''
                      } ${nodeColor}`}
                      style={{
                        left: node.position.x,
                        top: node.position.y,
                        minWidth: '150px'
                      }}
                      onClick={() => setSelectedNode(node)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <NodeIcon className="w-4 h-4" />
                        <span className="font-semibold text-sm">{node.label}</span>
                      </div>
                      <div className="text-xs opacity-75">{node.type}</div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Node Properties & Workflows */}
        <Card className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border-emerald-500/30 p-6">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="bg-black/40 border-emerald-500/30">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="mt-4">
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-emerald-600 mb-2 block">Node Label</label>
                    <Input
                      value={selectedNode.label}
                      onChange={(e) => setNodes(nodes.map(n =>
                        n.id === selectedNode.id ? { ...n, label: e.target.value } : n
                      ))}
                      className="bg-black/60 border-emerald-500/40 text-emerald-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-emerald-600 mb-2 block">Node Type</label>
                    <div className="bg-black/60 border border-emerald-500/40 rounded px-3 py-2 text-emerald-100 text-sm">
                      {selectedNode.type}
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteNode(selectedNode.id)}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Node
                  </Button>
                </div>
              ) : (
                <div className="text-center text-emerald-600 py-8">
                  <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select a node to edit</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="workflows" className="mt-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {workflows.map((workflow) => (
                    <Card
                      key={workflow.id}
                      className={`p-3 cursor-pointer transition-all ${
                        selectedWorkflow?.id === workflow.id
                          ? 'bg-emerald-500/20 border-emerald-500/50'
                          : 'bg-black/40 border-emerald-500/30 hover:border-emerald-500/40'
                      }`}
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        setNodes(workflow.nodes);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-emerald-400 text-sm">{workflow.name}</h5>
                        <Badge className={
                          workflow.status === 'active' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                          workflow.status === 'paused' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                          workflow.status === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                          'bg-gray-500/20 border-gray-500/50 text-gray-400'
                        }>
                          {workflow.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-emerald-600 mb-2">{workflow.description}</p>
                      <div className="flex items-center justify-between text-xs text-emerald-600">
                        <span>{workflow.nodes.length} nodes</span>
                        <span>{workflow.runCount} runs</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

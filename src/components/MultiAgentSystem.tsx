import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, MessageSquare, Play, Pause, Settings, Brain, Code, Search, Sparkles, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'active' | 'thinking';
  capabilities: string[];
  messages: number;
  tasksCompleted: number;
}

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
}

export function MultiAgentSystem() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'CodeMaster',
      role: 'Code Generation & Review',
      status: 'active',
      capabilities: ['Code Generation', 'Code Review', 'Debugging'],
      messages: 45,
      tasksCompleted: 12
    },
    {
      id: '2',
      name: 'ResearchBot',
      role: 'Research & Analysis',
      status: 'thinking',
      capabilities: ['Web Search', 'Data Analysis', 'Report Generation'],
      messages: 23,
      tasksCompleted: 8
    },
    {
      id: '3',
      name: 'CreativeAI',
      role: 'Creative Content',
      status: 'idle',
      capabilities: ['Writing', 'Design', 'Ideation'],
      messages: 67,
      tasksCompleted: 15
    },
    {
      id: '4',
      name: 'DataAnalyst',
      role: 'Data Processing',
      status: 'active',
      capabilities: ['Data Analysis', 'Visualization', 'Insights'],
      messages: 34,
      tasksCompleted: 9
    }
  ]);

  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage || !selectedAgent) return;

    const message: AgentMessage = {
      id: `msg-${Date.now()}`,
      from: 'User',
      to: selectedAgent.name,
      message: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success(`Message sent to ${selectedAgent.name}`);

    // Simulate agent response
    setTimeout(() => {
      const response: AgentMessage = {
        id: `msg-${Date.now()}`,
        from: selectedAgent.name,
        to: 'User',
        message: `I understand. I'll work on that task using my ${selectedAgent.capabilities[0]} capabilities.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'thinking': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('Code')) return <Code className="w-4 h-4" />;
    if (role.includes('Research')) return <Search className="w-4 h-4" />;
    if (role.includes('Creative')) return <Sparkles className="w-4 h-4" />;
    return <Brain className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-teal-950/20 to-cyan-950/20 border-teal-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-teal-400 flex items-center gap-2">
              <Users className="w-6 h-5" />
              Multi-Agent System
            </h3>
            <p className="text-xs text-teal-600 mt-1">Orchestrate multiple AI agents for complex tasks</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-teal-500/50 text-teal-400 hover:bg-teal-500/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <Button
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Orchestration
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Active Agents', value: agents.filter(a => a.status === 'active').length, icon: Activity },
            { label: 'Total Messages', value: agents.reduce((sum, a) => sum + a.messages, 0), icon: MessageSquare },
            { label: 'Tasks Completed', value: agents.reduce((sum, a) => sum + a.tasksCompleted, 0), icon: CheckCircle2 },
            { label: 'System Efficiency', value: '94%', icon: Zap },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-teal-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-teal-400" />
                <p className="text-lg text-teal-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-teal-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <Card className="bg-gradient-to-br from-teal-950/20 to-cyan-950/20 border-teal-500/30 p-6">
          <h4 className="text-teal-400 mb-4">Available Agents</h4>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {agents.map((agent) => (
                <Card
                  key={agent.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedAgent?.id === agent.id
                      ? 'bg-teal-500/20 border-teal-500/50'
                      : 'bg-black/40 border-teal-500/30 hover:border-teal-500/40'
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded bg-teal-500/20 border border-teal-500/50">
                        {getRoleIcon(agent.role)}
                      </div>
                      <div>
                        <h5 className="text-teal-400 mb-1">{agent.name}</h5>
                        <p className="text-xs text-teal-600">{agent.role}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {agent.capabilities.map((cap, i) => (
                      <Badge key={i} className="bg-teal-500/10 text-teal-400 text-[10px]">
                        {cap}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-teal-600">
                    <span>{agent.messages} messages</span>
                    <span>{agent.tasksCompleted} tasks</span>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Communication & Messages */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-teal-950/20 to-cyan-950/20 border-teal-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-teal-400">Agent Communication</h4>
            {selectedAgent && (
              <Badge className="bg-teal-500/20 border-teal-500/50 text-teal-400">
                {selectedAgent.name}
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[500px] mb-4">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-teal-600 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-xs mt-1">Start a conversation with an agent</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg ${
                      msg.from === 'User'
                        ? 'bg-teal-500/20 border border-teal-500/50 ml-auto max-w-[80%]'
                        : 'bg-black/40 border border-teal-500/30 mr-auto max-w-[80%]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-teal-400 font-semibold">{msg.from}</span>
                      <span className="text-xs text-teal-600">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-teal-300">{msg.message}</p>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={selectedAgent ? `Message ${selectedAgent.name}...` : 'Select an agent first'}
              disabled={!selectedAgent}
              className="bg-black/60 border-teal-500/40 text-teal-100"
            />
            <Button
              onClick={sendMessage}
              disabled={!selectedAgent || !newMessage}
              className="bg-teal-500/20 border-teal-500/50 text-teal-400 hover:bg-teal-500/30"
            >
              Send
            </Button>
          </div>

          {/* Agent Collaboration */}
          <div className="mt-6 pt-6 border-t border-teal-500/20">
            <h5 className="text-teal-400 mb-3">Agent Collaboration</h5>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="border-teal-500/30 text-teal-400 hover:bg-teal-500/20"
              >
                Create Task Chain
              </Button>
              <Button
                variant="outline"
                className="border-teal-500/30 text-teal-400 hover:bg-teal-500/20"
              >
                Parallel Execution
              </Button>
              <Button
                variant="outline"
                className="border-teal-500/30 text-teal-400 hover:bg-teal-500/20"
              >
                Agent Handoff
              </Button>
              <Button
                variant="outline"
                className="border-teal-500/30 text-teal-400 hover:bg-teal-500/20"
              >
                Consensus Building
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

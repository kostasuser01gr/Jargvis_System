import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, Trash2, Download, Upload, Zap, Code, Cpu } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  text: string;
  timestamp: Date;
}

const SYSTEM_INFO = {
  os: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
  user: 'jarvis',
  version: '3.14.159',
  kernel: 'Quantum Core v5.0'
};

const AI_RESPONSES: Record<string, string> = {
  'help': `Available Commands:
  • help - Show this help message
  • sys - Display system information
  • scan - Run system diagnostics
  • deploy - Deploy to production
  • git status - Show repository status
  • npm install - Install dependencies
  • build - Build project
  • ai <query> - Ask AI assistant
  • code <file> - Open code editor
  • db query <sql> - Execute database query
  • clear - Clear terminal
  • ls - List files
  • pwd - Print working directory
  • whoami - Display current user`,
  'sys': `JARVIS System Information:
  OS: ${SYSTEM_INFO.os}
  User: ${SYSTEM_INFO.user}
  Version: ${SYSTEM_INFO.version}
  Kernel: ${SYSTEM_INFO.kernel}
  Quantum Processors: 8 cores @ 5.2 GHz
  Neural Networks: Active
  Uptime: 99.99%`,
  'scan': 'Initiating deep system scan...\n✓ CPU: Optimal\n✓ Memory: 67% utilized\n✓ Network: Strong\n✓ Security: No threats detected\n✓ All systems operational',
  'whoami': SYSTEM_INFO.user,
  'pwd': '/home/jarvis/projects/ultimate-system',
  'git status': `On branch main
Your branch is up to date with 'origin/main'.

Changes ready to commit:
  modified:   components/AITerminal.tsx
  modified:   components/CodeEditor.tsx
  new file:   components/GitHubIntegration.tsx`,
  'npm install': 'Installing dependencies...\n✓ 247 packages installed in 3.2s\n✓ Dependencies up to date',
  'build': 'Building production bundle...\n✓ Compiled successfully in 4.1s\n✓ Bundle size: 245 KB (gzipped)',
  'deploy': '🚀 Deploying to production...\n✓ Build complete\n✓ Uploading assets...\n✓ Deployment successful!\n🌐 Live at: https://jarvis-ultimate.vercel.app',
  'ls': 'components/\nsrc/\npublic/\npackage.json\nREADME.md\ntsconfig.json'
};

export function AITerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '0',
      type: 'info',
      text: 'JARVIS Ultimate Terminal v3.14.159',
      timestamp: new Date()
    },
    {
      id: '1',
      type: 'success',
      text: `Welcome back, Sir. Type 'help' for available commands.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Add command to history
    setCommandHistory(prev => [...prev, cmd]);
    
    // Add command line
    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'command',
      text: `$ ${cmd}`,
      timestamp: new Date()
    };
    
    setLines(prev => [...prev, commandLine]);

    if (!trimmedCmd) return;

    // Handle clear command
    if (trimmedCmd === 'clear') {
      setLines([]);
      return;
    }

    // Handle AI queries
    if (trimmedCmd.startsWith('ai ')) {
      const query = cmd.substring(3);
      const aiResponse = generateAIResponse(query);
      setTimeout(() => {
        setLines(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'success',
          text: `🤖 AI: ${aiResponse}`,
          timestamp: new Date()
        }]);
      }, 500);
      return;
    }

    // Handle code command
    if (trimmedCmd.startsWith('code ')) {
      const filename = cmd.substring(5);
      setTimeout(() => {
        setLines(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'success',
          text: `Opening ${filename} in code editor...`,
          timestamp: new Date()
        }]);
      }, 300);
      return;
    }

    // Handle database query
    if (trimmedCmd.startsWith('db query ')) {
      const query = cmd.substring(9);
      setTimeout(() => {
        setLines(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'success',
          text: `Executing query: ${query}\n✓ Query executed successfully\nRows affected: ${Math.floor(Math.random() * 100)}`,
          timestamp: new Date()
        }]);
      }, 800);
      return;
    }

    // Check predefined commands
    const response = AI_RESPONSES[trimmedCmd];
    
    if (response) {
      // Simulate processing time
      setTimeout(() => {
        setLines(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: response,
          timestamp: new Date()
        }]);
      }, 200);
    } else {
      // Unknown command
      setLines(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'error',
        text: `Command not found: ${cmd}\nType 'help' for available commands.`,
        timestamp: new Date()
      }]);
    }
  };

  const generateAIResponse = (query: string): string => {
    const responses = [
      `Analyzing your query about "${query}"... Based on neural network processing, I recommend optimizing your approach with quantum algorithms.`,
      `Processing "${query}" through deep learning models... The optimal solution involves multi-threaded processing and cache optimization.`,
      `Computing answer for "${query}"... My analysis suggests implementing a microservices architecture for maximum scalability.`,
      `Evaluating "${query}" using predictive analytics... The data indicates a 94% success rate with the proposed implementation.`,
      `Understanding "${query}" via natural language processing... I've identified 3 optimal approaches for your consideration.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case 'command': return 'text-cyan-400';
      case 'output': return 'text-cyan-300';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      default: return 'text-cyan-300';
    }
  };

  return (
    <Card className="bg-black/90 border-cyan-500/30 h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-cyan-500/30 p-4 flex items-center justify-between bg-gradient-to-r from-black/60 to-cyan-950/20">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-cyan-400 font-mono">AI TERMINAL</h3>
            <p className="text-xs text-cyan-600 font-mono">{SYSTEM_INFO.user}@jarvis:~$</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 border-green-500/50 text-green-400 text-xs">
            <Cpu className="w-3 h-3 mr-1" />
            Active
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 h-8"
            onClick={() => setLines([])}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Output */}
      <ScrollArea className="flex-1 p-4 font-mono text-sm">
        <div className="space-y-1">
          <AnimatePresence>
            {lines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${getLineColor(line.type)} whitespace-pre-wrap`}
              >
                {line.text}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-cyan-500/30 p-4 bg-black/60">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-mono flex-shrink-0">$</span>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            className="bg-transparent border-none text-cyan-300 font-mono focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-cyan-800"
            autoFocus
          />
          <Button
            type="submit"
            size="sm"
            className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-cyan-600">
          <span>↑↓ History</span>
          <span>Tab: Autocomplete</span>
          <span>Ctrl+C: Interrupt</span>
        </div>
      </form>
    </Card>
  );
}

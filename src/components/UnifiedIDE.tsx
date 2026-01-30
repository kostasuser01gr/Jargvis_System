import { useState } from 'react';
import { motion } from 'motion/react';
import { Code, Terminal, Folder, Search, GitBranch, Play, Bug, Package } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

export function UnifiedIDE() {
  const [activeFile, setActiveFile] = useState('App.tsx');
  const [code, setCode] = useState(`import { useState } from 'react';
import { Card } from './components/ui/card';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Card className="p-6">
        <h1 className="text-2xl mb-4">Welcome to JARVIS IDE</h1>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </Card>
    </div>
  );
}`);

  const fileTree = [
    { name: 'src', type: 'folder', expanded: true, children: [
      { name: 'components', type: 'folder', children: [
        { name: 'App.tsx', type: 'file' },
        { name: 'Header.tsx', type: 'file' }
      ]},
      { name: 'styles', type: 'folder', children: [
        { name: 'globals.css', type: 'file' }
      ]}
    ]},
    { name: 'package.json', type: 'file' },
    { name: 'tsconfig.json', type: 'file' }
  ];

  const features = [
    { icon: '🧠', name: 'AI Code Completion', description: 'Intelligent code suggestions' },
    { icon: '💬', name: 'AI Chat', description: 'Ask questions about your code' },
    { icon: '🔍', name: 'Smart Search', description: 'Find anything instantly' },
    { icon: '🐛', name: 'AI Debugging', description: 'Automated error detection' },
    { icon: '♻️', name: 'Refactoring', description: 'Code improvements' },
    { icon: '📦', name: 'Package Manager', description: 'npm, yarn, pnpm support' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-blue-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-blue-400 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Unified IDE
            </h3>
            <p className="text-xs text-blue-600 mt-1">
              VS Code + Cursor + AI = Ultimate Development Environment
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-green-500/20 border-green-500/50 text-green-400">
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button size="sm" className="bg-blue-500/20 border-blue-500/50 text-blue-400">
              <Bug className="w-4 h-4 mr-2" />
              Debug
            </Button>
          </div>
        </div>

        {/* IDE Interface */}
        <div className="grid grid-cols-12 gap-4 h-[600px]">
          {/* File Explorer */}
          <div className="col-span-3 bg-black/40 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm">Explorer</span>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-1">
                {fileTree.map((item, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-center gap-2 p-2 hover:bg-blue-500/10 rounded cursor-pointer">
                      <span>{item.type === 'folder' ? '📁' : '📄'}</span>
                      <span className="text-blue-300">{item.name}</span>
                    </div>
                    {item.children && (
                      <div className="ml-4">
                        {item.children.map((child, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-2 p-2 hover:bg-blue-500/10 rounded cursor-pointer"
                            onClick={() => child.type === 'file' && setActiveFile(child.name)}
                          >
                            <span>{child.type === 'folder' ? '📁' : '📄'}</span>
                            <span className="text-blue-300">{child.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Code Editor */}
          <div className="col-span-9 bg-black/40 border border-blue-500/20 rounded-lg overflow-hidden">
            <Tabs defaultValue="code" className="h-full">
              <div className="bg-black/60 border-b border-blue-500/20 px-4 py-2 flex items-center justify-between">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="code" className="data-[state=active]:bg-blue-500/20">
                    {activeFile}
                  </TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Badge className="bg-green-500/20 border-green-500/50 text-green-400 text-xs">
                    TypeScript
                  </Badge>
                  <Badge className="bg-blue-500/20 border-blue-500/50 text-blue-400 text-xs">
                    React
                  </Badge>
                </div>
              </div>

              <TabsContent value="code" className="h-[calc(100%-50px)] m-0">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <pre className="text-sm font-mono text-blue-100 leading-relaxed">
                      <code>{code}</code>
                    </pre>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature, i) => (
          <Card key={i} className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-blue-500/30 p-4">
            <div className="text-2xl mb-2">{feature.icon}</div>
            <h4 className="text-blue-400 mb-1">{feature.name}</h4>
            <p className="text-xs text-blue-600">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* AI Assistant Panel */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30 p-6">
        <h4 className="text-purple-400 mb-4">AI Code Assistant</h4>
        <div className="space-y-3">
          <div className="bg-black/40 border border-purple-500/20 rounded p-3">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🤖</div>
              <div className="flex-1">
                <p className="text-purple-300 text-sm mb-2">
                  I can help you with:
                </p>
                <ul className="text-xs text-purple-600 space-y-1">
                  <li>• Code completion and suggestions</li>
                  <li>• Bug fixes and debugging</li>
                  <li>• Code explanations</li>
                  <li>• Refactoring recommendations</li>
                  <li>• Best practices</li>
                </ul>
              </div>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Start AI Chat
          </Button>
        </div>
      </Card>
    </div>
  );
}

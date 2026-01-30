import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, File, ChevronRight, ChevronDown, Search, Plus, Trash2, Edit, Download, Upload } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: string;
  modified?: Date;
}

const FILE_SYSTEM: FileNode[] = [
  {
    name: 'components',
    type: 'folder',
    children: [
      { name: 'AITerminal.tsx', type: 'file', size: '12.4 KB', modified: new Date() },
      { name: 'CodeEditor.tsx', type: 'file', size: '15.2 KB', modified: new Date() },
      { name: 'AdvancedAIChatbot.tsx', type: 'file', size: '18.7 KB', modified: new Date() },
      {
        name: 'ui',
        type: 'folder',
        children: [
          { name: 'button.tsx', type: 'file', size: '3.2 KB', modified: new Date() },
          { name: 'card.tsx', type: 'file', size: '2.1 KB', modified: new Date() },
          { name: 'input.tsx', type: 'file', size: '1.8 KB', modified: new Date() }
        ]
      }
    ]
  },
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'App.tsx', type: 'file', size: '4.5 KB', modified: new Date() },
      { name: 'main.tsx', type: 'file', size: '1.2 KB', modified: new Date() },
      {
        name: 'utils',
        type: 'folder',
        children: [
          { name: 'helpers.ts', type: 'file', size: '5.7 KB', modified: new Date() },
          { name: 'api.ts', type: 'file', size: '8.3 KB', modified: new Date() }
        ]
      }
    ]
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'index.html', type: 'file', size: '2.1 KB', modified: new Date() },
      { name: 'favicon.ico', type: 'file', size: '4.2 KB', modified: new Date() }
    ]
  },
  { name: 'package.json', type: 'file', size: '2.8 KB', modified: new Date() },
  { name: 'tsconfig.json', type: 'file', size: '1.1 KB', modified: new Date() },
  { name: 'README.md', type: 'file', size: '3.4 KB', modified: new Date() }
];

export function FileSystemBrowser() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['components', 'src']));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderFileTree = (nodes: FileNode[], parentPath = '') => {
    return nodes.map((node) => {
      const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
      const isExpanded = expandedFolders.has(currentPath);
      const isSelected = selectedFile === currentPath;

      if (node.type === 'folder') {
        return (
          <div key={currentPath}>
            <motion.div
              whileHover={{ x: 5 }}
              onClick={() => toggleFolder(currentPath)}
              className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'hover:bg-cyan-500/10 text-cyan-300'
              }`}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-cyan-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-cyan-500" />
              )}
              <Folder className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">{node.name}</span>
              {node.children && (
                <Badge className="ml-auto bg-cyan-500/10 border-cyan-500/30 text-cyan-500 text-xs">
                  {node.children.length}
                </Badge>
              )}
            </motion.div>
            <AnimatePresence>
              {isExpanded && node.children && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-4 border-l border-cyan-500/20 pl-2"
                >
                  {renderFileTree(node.children, currentPath)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      return (
        <motion.div
          key={currentPath}
          whileHover={{ x: 5 }}
          onClick={() => {
            setSelectedFile(currentPath);
            toast.info(`Opened ${node.name}`);
          }}
          className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors ${
            isSelected
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'hover:bg-cyan-500/10 text-cyan-300'
          }`}
        >
          <div className="w-4" />
          <File className="w-4 h-4 text-cyan-400" />
          <span className="text-sm flex-1">{node.name}</span>
          {node.size && (
            <span className="text-xs text-cyan-600">{node.size}</span>
          )}
        </motion.div>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* File Tree */}
      <Card className="lg:col-span-1 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-cyan-400 flex items-center gap-2">
              <Folder className="w-5 h-5" />
              File Explorer
            </h3>
            <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400 h-8">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files..."
              className="pl-10 bg-black/60 border-cyan-500/40 text-cyan-100"
            />
          </div>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-1">
            {renderFileTree(FILE_SYSTEM)}
          </div>
        </ScrollArea>

        <div className="mt-4 pt-4 border-t border-cyan-500/20 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 text-xs">
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 text-xs">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </Card>

      {/* File Preview/Editor */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-cyan-500/20">
              <div>
                <h3 className="text-cyan-400 flex items-center gap-2">
                  <File className="w-5 h-5" />
                  {selectedFile.split('/').pop()}
                </h3>
                <p className="text-xs text-cyan-600 mt-1">{selectedFile}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400">
                  <Edit className="w-3 h-3 mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400">
                  <Download className="w-3 h-3 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="bg-black/60 border border-cyan-500/40 rounded-lg p-4 font-mono text-sm">
              <div className="text-cyan-300 leading-relaxed">
                <div className="text-cyan-600">1  </div>
                <div className="text-cyan-300">2  <span className="text-purple-400">import</span> {'{ useState }'} <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</div>
                <div className="text-cyan-600">3  </div>
                <div className="text-cyan-300">4  <span className="text-purple-400">export</span> <span className="text-purple-400">function</span> <span className="text-yellow-400">Component</span>() {'{'}</div>
                <div className="text-cyan-300">5    <span className="text-purple-400">const</span> [<span className="text-blue-400">state</span>, <span className="text-blue-400">setState</span>] = <span className="text-yellow-400">useState</span>(<span className="text-green-400">''</span>);</div>
                <div className="text-cyan-600">6  </div>
                <div className="text-cyan-300">7    <span className="text-purple-400">return</span> (</div>
                <div className="text-cyan-300">8      {'<'}<span className="text-blue-400">div</span>{'>'}</div>
                <div className="text-cyan-300">9        Hello JARVIS</div>
                <div className="text-cyan-300">10     {'</'}<span className="text-blue-400">div</span>{'>'}</div>
                <div className="text-cyan-300">11   );</div>
                <div className="text-cyan-300">12 {'}'}</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-black/40 border border-cyan-500/20 rounded-lg flex items-center justify-between text-xs text-cyan-600">
              <div className="flex items-center gap-4">
                <span>TypeScript</span>
                <span>•</span>
                <span>UTF-8</span>
                <span>•</span>
                <span>LF</span>
              </div>
              <div className="flex items-center gap-4">
                <span>12 lines</span>
                <span>•</span>
                <span>Last modified: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-cyan-600">
            <div className="text-center">
              <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a file to preview</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

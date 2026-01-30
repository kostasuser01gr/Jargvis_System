import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Search, Edit2, Save, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Shortcut {
  id: string;
  keys: string;
  description: string;
  category: string;
  action: string;
  editable: boolean;
}

const SHORTCUT_CATEGORIES = ['Navigation', 'Actions', 'System', 'Editor', 'Window'];

export function KeyboardShortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    // Navigation
    { id: '1', keys: '⌘K', description: 'Open Command Palette', category: 'Navigation', action: 'command-palette', editable: false },
    { id: '2', keys: '⌘A', description: 'Assistant Tab', category: 'Navigation', action: 'tab-assistant', editable: true },
    { id: '3', keys: '⌘D', description: 'Analytics Tab', category: 'Navigation', action: 'tab-analytics', editable: true },
    { id: '4', keys: '⌘N', description: 'Neural Network Tab', category: 'Navigation', action: 'tab-neural', editable: true },
    
    // Actions
    { id: '5', keys: '⌘S', description: 'Save Current Work', category: 'Actions', action: 'save', editable: true },
    { id: '6', keys: '⌘R', description: 'Refresh Data', category: 'Actions', action: 'refresh', editable: true },
    { id: '7', keys: '⌘P', description: 'Print/Export', category: 'Actions', action: 'print', editable: true },
    
    // System
    { id: '8', keys: '⌘V', description: 'Toggle Voice Control', category: 'System', action: 'voice-toggle', editable: false },
    { id: '9', keys: '⌘G', description: 'Toggle Gesture Control', category: 'System', action: 'gesture-toggle', editable: false },
    { id: '10', keys: '⌘,', description: 'Open Settings', category: 'System', action: 'settings', editable: true },
    
    // Editor
    { id: '11', keys: '⌘F', description: 'Find in Editor', category: 'Editor', action: 'find', editable: true },
    { id: '12', keys: '⌘H', description: 'Replace in Editor', category: 'Editor', action: 'replace', editable: true },
    { id: '13', keys: '⌘/', description: 'Toggle Comment', category: 'Editor', action: 'comment', editable: true },
    
    // Window
    { id: '14', keys: '⌘W', description: 'Close Window', category: 'Window', action: 'close', editable: true },
    { id: '15', keys: '⌘M', description: 'Minimize Window', category: 'Window', action: 'minimize', editable: true },
    { id: '16', keys: '⌘⇧F', description: 'Fullscreen', category: 'Window', action: 'fullscreen', editable: true }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesSearch = shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shortcut.keys.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || shortcut.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedShortcuts = SHORTCUT_CATEGORIES.reduce((acc, category) => {
    acc[category] = filteredShortcuts.filter(s => s.category === category);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  const startEditingShortcut = (shortcut: Shortcut) => {
    if (!shortcut.editable) return;
    setEditingShortcut(shortcut);
    setIsRecording(false);
  };

  const saveShortcut = (newKeys: string) => {
    if (editingShortcut) {
      setShortcuts(prev => prev.map(s => 
        s.id === editingShortcut.id ? { ...s, keys: newKeys } : s
      ));
      setEditingShortcut(null);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="text-cyan-400">Keyboard Shortcuts</h3>
              <p className="text-xs text-cyan-600">Customize your shortcuts</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className="pl-10 bg-black/60 border-cyan-500/40 text-cyan-100"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'border-cyan-500/30 text-cyan-400'}
            >
              All
            </Button>
            {SHORTCUT_CATEGORIES.map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'border-cyan-500/30 text-cyan-400'}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Shortcuts List */}
        <ScrollArea className="h-[500px]">
          <div className="space-y-6">
            {SHORTCUT_CATEGORIES.map(category => {
              const categoryShortcuts = groupedShortcuts[category];
              if (!categoryShortcuts || categoryShortcuts.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="text-cyan-400 mb-3 flex items-center gap-2">
                    {category}
                    <Badge className="bg-cyan-500/10 border-cyan-500/30 text-cyan-600">
                      {categoryShortcuts.length}
                    </Badge>
                  </h4>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut) => (
                      <motion.div
                        key={shortcut.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 transition-all flex items-center justify-between group"
                      >
                        <div className="flex-1">
                          <div className="text-cyan-300 mb-1">{shortcut.description}</div>
                          <div className="text-xs text-cyan-600">{shortcut.action}</div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {shortcut.keys.split('').map((key, i) => (
                              <kbd
                                key={i}
                                className="px-3 py-1.5 bg-cyan-950/50 border border-cyan-500/50 rounded text-cyan-400 font-mono text-sm shadow-lg"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                          
                          {shortcut.editable && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditingShortcut(shortcut)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-cyan-500/20">
          <div className="flex items-center gap-4 text-xs text-cyan-600">
            <span>⌘ = Command/Ctrl</span>
            <span>⇧ = Shift</span>
            <span>⌥ = Option/Alt</span>
            <span>⌃ = Control</span>
          </div>
        </div>
      </Card>

      {/* Edit Shortcut Dialog */}
      <Dialog open={!!editingShortcut} onOpenChange={() => setEditingShortcut(null)}>
        <DialogContent className="bg-gradient-to-br from-cyan-950/95 to-blue-950/95 border-cyan-500/50">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">
              Edit Keyboard Shortcut
            </DialogTitle>
          </DialogHeader>
          
          {editingShortcut && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-cyan-400 mb-2 block">Action</label>
                <Input
                  value={editingShortcut.description}
                  readOnly
                  className="bg-black/60 border-cyan-500/40 text-cyan-100"
                />
              </div>

              <div>
                <label className="text-sm text-cyan-400 mb-2 block">Current Shortcut</label>
                <div className="flex items-center gap-2 bg-black/60 border border-cyan-500/40 rounded-lg p-3">
                  {editingShortcut.keys.split('').map((key, i) => (
                    <kbd
                      key={i}
                      className="px-3 py-2 bg-cyan-950/50 border border-cyan-500/50 rounded text-cyan-400 font-mono"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-cyan-400 mb-2 block">New Shortcut</label>
                <Input
                  placeholder="Press keys..."
                  className="bg-black/60 border-cyan-500/40 text-cyan-100"
                  onKeyDown={(e) => {
                    e.preventDefault();
                    const keys = [];
                    if (e.metaKey || e.ctrlKey) keys.push('⌘');
                    if (e.shiftKey) keys.push('⇧');
                    if (e.altKey) keys.push('⌥');
                    if (e.key.length === 1) keys.push(e.key.toUpperCase());
                    saveShortcut(keys.join(''));
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setEditingShortcut(null)}
                  variant="outline"
                  className="flex-1 border-cyan-500/30 text-cyan-400"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

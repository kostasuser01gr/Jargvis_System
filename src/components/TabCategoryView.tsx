import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight, Grid3x3, Layers, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export interface TabInfo {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
  category: string;
  description?: string;
  shortcut?: string;
  badge?: number;
}

interface TabCategoryViewProps {
  tabs: TabInfo[];
  activeTab: string;
  onTabSelect: (value: string) => void;
  onTabFavorite?: (value: string) => void;
  favorites?: string[];
}

export function TabCategoryView({ 
  tabs, 
  activeTab, 
  onTabSelect, 
  onTabFavorite,
  favorites = [] 
}: TabCategoryViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('jarvis-expanded-categories');
    return saved ? new Set(JSON.parse(saved)) : new Set(['Core', 'AI/ML']);
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');

  // Save expanded categories
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      localStorage.setItem('jarvis-expanded-categories', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  // Group tabs by category
  const groupedTabs = useMemo(() => {
    const groups: Record<string, TabInfo[]> = {};
    tabs.forEach(tab => {
      if (!groups[tab.category]) {
        groups[tab.category] = [];
      }
      groups[tab.category].push(tab);
    });
    return groups;
  }, [tabs]);

  // Filter tabs
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupedTabs;
    
    const query = searchQuery.toLowerCase();
    const filtered: Record<string, TabInfo[]> = {};
    
    Object.entries(groupedTabs).forEach(([category, categoryTabs]) => {
      const matchingTabs = categoryTabs.filter(tab =>
        tab.label.toLowerCase().includes(query) ||
        tab.description?.toLowerCase().includes(query) ||
        tab.category.toLowerCase().includes(query)
      );
      
      if (matchingTabs.length > 0) {
        filtered[category] = matchingTabs;
      }
    });
    
    return filtered;
  }, [groupedTabs, searchQuery]);

  const categoryOrder = ['Core', 'AI/ML', 'Analytics', 'System', 'Security', 'Development', 'Collaboration', 'Quantum', 'Settings', 'Automation', 'Operations'];
  const sortedCategories = useMemo(() => {
    const ordered: string[] = [];
    const unordered: string[] = [];
    
    categoryOrder.forEach(cat => {
      if (filteredGroups[cat]) ordered.push(cat);
    });
    
    Object.keys(filteredGroups).forEach(cat => {
      if (!categoryOrder.includes(cat)) unordered.push(cat);
    });
    
    return [...ordered, ...unordered.sort()];
  }, [filteredGroups]);

  const totalTabs = tabs.length;
  const visibleTabs = Object.values(filteredGroups).flat().length;

  return (
    <div className="w-full space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600" />
            <Input
              placeholder="Search tabs by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-black/40 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-700"
            />
          </div>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
            {visibleTabs} / {totalTabs}
          </Badge>
        </div>
        
        <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
          <TabsList className="bg-black/40 border-cyan-500/20">
            <TabsTrigger value="grouped" className="data-[state=active]:bg-cyan-500/20">
              <Layers className="w-4 h-4 mr-1" />
              Grouped
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-cyan-500/20">
              <Grid3x3 className="w-4 h-4 mr-1" />
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tabs Display */}
      <ScrollArea className="h-[600px]">
        {viewMode === 'grouped' ? (
          <div className="space-y-2">
            {sortedCategories.map((category) => {
              const categoryTabs = filteredGroups[category];
              const isExpanded = expandedCategories.has(category);
              const activeInCategory = categoryTabs.some(t => t.value === activeTab);
              
              return (
                <Collapsible
                  key={category}
                  open={isExpanded}
                  onOpenChange={() => toggleCategory(category)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between p-3 h-auto bg-black/40 border border-cyan-500/20 hover:bg-cyan-500/10 ${
                        activeInCategory ? 'border-cyan-500/50 bg-cyan-500/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-cyan-400" />
                        )}
                        <span className="text-cyan-300 font-semibold">{category}</span>
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-500 text-xs">
                          {categoryTabs.length}
                        </Badge>
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="ml-6 mt-2 space-y-1 border-l border-cyan-500/20 pl-4">
                      {categoryTabs.map((tab) => (
                        <motion.button
                          key={tab.id}
                          onClick={() => onTabSelect(tab.value)}
                          className={`w-full flex items-center gap-3 p-2 rounded hover:bg-cyan-500/10 transition-colors text-left ${
                            activeTab === tab.value
                              ? 'bg-cyan-500/20 border border-cyan-500/50'
                              : 'border border-transparent'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex-shrink-0">
                            {tab.icon || <Grid3x3 className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${activeTab === tab.value ? 'text-cyan-300 font-semibold' : 'text-cyan-400'}`}>
                                {tab.label}
                              </span>
                              {favorites.includes(tab.value) && (
                                <span className="text-yellow-400 text-xs">★</span>
                              )}
                              {tab.badge && (
                                <Badge className="bg-cyan-500 text-black text-[10px] px-1">
                                  {tab.badge}
                                </Badge>
                              )}
                            </div>
                            {tab.description && (
                              <p className="text-xs text-cyan-600 truncate">{tab.description}</p>
                            )}
                          </div>
                          {tab.shortcut && (
                            <kbd className="hidden sm:inline-flex px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs font-mono text-cyan-500">
                              {tab.shortcut}
                            </kbd>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.values(filteredGroups).flat().map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => onTabSelect(tab.value)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  activeTab === tab.value
                    ? 'border-cyan-500 bg-cyan-500/20'
                    : 'border-cyan-500/30 bg-black/40 hover:border-cyan-500/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {tab.icon || <Grid3x3 className="w-4 h-4 text-cyan-400" />}
                  <span className={`text-sm font-medium ${activeTab === tab.value ? 'text-cyan-300' : 'text-cyan-400'}`}>
                    {tab.label}
                  </span>
                </div>
                {tab.description && (
                  <p className="text-xs text-cyan-600 mb-2">{tab.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-600">
                    {tab.category}
                  </Badge>
                  {tab.shortcut && (
                    <kbd className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] font-mono text-cyan-500">
                      {tab.shortcut}
                    </kbd>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Plus, Settings, Bookmark, History, Grid, List, Pin, Star, Folder, Clock } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export interface TabInfo {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  group: string;
  badge?: number;
  pinned?: boolean;
  lastAccessed?: Date;
  favorite?: boolean;
}

interface TabGroup {
  id: string;
  name: string;
  color: string;
  tabs: string[];
}

interface EnhancedTabNavigationProps {
  tabs: TabInfo[];
  activeTab: string;
  onTabChange: (value: string) => void;
  onTabClose?: (value: string) => void;
  onTabReorder?: (tabs: TabInfo[]) => void;
  onTabPin?: (value: string, pinned: boolean) => void;
  onTabFavorite?: (value: string, favorite: boolean) => void;
  onCreateGroup?: (group: TabGroup) => void;
}

export function EnhancedTabNavigation({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onTabReorder,
  onTabPin,
  onTabFavorite,
  onCreateGroup
}: EnhancedTabNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showGroups, setShowGroups] = useState(false);
  const [groups, setGroups] = useState<TabGroup[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('compact');
  const [showRecent, setShowRecent] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [draggedTab, setDraggedTab] = useState<string | null>(null);

  const filteredTabs = useMemo(() => {
    if (!searchQuery) return tabs;
    const query = searchQuery.toLowerCase();
    return tabs.filter(tab =>
      tab.label.toLowerCase().includes(query) ||
      tab.group.toLowerCase().includes(query) ||
      tab.value.toLowerCase().includes(query)
    );
  }, [tabs, searchQuery]);

  const groupedTabs = useMemo(() => {
    return filteredTabs.reduce((acc, tab) => {
      if (!acc[tab.group]) acc[tab.group] = [];
      acc[tab.group].push(tab);
      return acc;
    }, {} as Record<string, TabInfo[]>);
  }, [filteredTabs]);

  const recentTabs = useMemo(() => {
    return tabs
      .filter(t => t.lastAccessed)
      .sort((a, b) => (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0))
      .slice(0, 10);
  }, [tabs]);

  const favoriteTabs = useMemo(() => {
    return tabs.filter(t => t.favorite);
  }, [tabs]);

  const pinnedTabs = useMemo(() => {
    return tabs.filter(t => t.pinned);
  }, [tabs]);

  const handleDragStart = (tabId: string) => {
    setDraggedTab(tabId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetTabId: string) => {
    if (!draggedTab || !onTabReorder) return;
    
    const draggedIndex = tabs.findIndex(t => t.id === draggedTab);
    const targetIndex = tabs.findIndex(t => t.id === targetTabId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newTabs = [...tabs];
    const [removed] = newTabs.splice(draggedIndex, 1);
    newTabs.splice(targetIndex, 0, removed);
    
    onTabReorder(newTabs);
    setDraggedTab(null);
    toast.success('Tabs reordered');
  };

  return (
    <div className="relative w-full">
      {/* Search and Controls Bar */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-black/60 rounded-lg border border-cyan-500/30 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-600" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tabs... (⌘K)"
            className="pl-10 bg-black/80 border-cyan-500/40 text-cyan-100 placeholder:text-cyan-600"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20">
              <History className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-black/95 border-cyan-500/50 backdrop-blur-xl">
            <div className="space-y-4">
              <div>
                <h4 className="text-cyan-400 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Tabs
                </h4>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-1">
                    {recentTabs.length === 0 ? (
                      <p className="text-sm text-cyan-600 text-center py-4">No recent tabs</p>
                    ) : (
                      recentTabs.map(tab => (
                        <div
                          key={tab.id}
                          className="flex items-center justify-between p-2 hover:bg-cyan-500/10 rounded cursor-pointer group"
                          onClick={() => onTabChange(tab.value)}
                        >
                          <div className="flex items-center gap-2">
                            {tab.icon}
                            <span className="text-sm text-cyan-300">{tab.label}</span>
                          </div>
                          <span className="text-xs text-cyan-600 opacity-0 group-hover:opacity-100">
                            {tab.lastAccessed?.toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20">
              <Star className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-black/95 border-cyan-500/50 backdrop-blur-xl">
            <div>
              <h4 className="text-cyan-400 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                Favorite Tabs
              </h4>
              <ScrollArea className="h-[200px]">
                <div className="space-y-1">
                  {favoriteTabs.length === 0 ? (
                    <p className="text-sm text-cyan-600 text-center py-4">No favorite tabs</p>
                  ) : (
                    favoriteTabs.map(tab => (
                      <div
                        key={tab.id}
                        className="flex items-center justify-between p-2 hover:bg-cyan-500/10 rounded cursor-pointer"
                        onClick={() => onTabChange(tab.value)}
                      >
                        <div className="flex items-center gap-2">
                          {tab.icon}
                          <span className="text-sm text-cyan-300">{tab.label}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'compact' ? 'list' : viewMode === 'list' ? 'grid' : 'compact')}
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
        >
          {viewMode === 'grid' ? <List className="w-4 h-4" /> : viewMode === 'list' ? <Grid className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20">
              <Settings className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-black/95 border-cyan-500/50 backdrop-blur-xl">
            <Tabs defaultValue="groups" className="w-full">
              <TabsList className="bg-black/60 border-cyan-500/30">
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="groups" className="mt-4">
                <div className="space-y-2">
                  {groups.map(group => (
                    <div key={group.id} className="flex items-center justify-between p-2 bg-black/40 rounded">
                      <span className="text-sm text-cyan-300">{group.name}</span>
                      <Badge className="bg-cyan-500/20 text-cyan-400">{group.tabs.length}</Badge>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    className="w-full bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
                    onClick={() => toast.info('Group creation coming soon')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300">Show pinned tabs</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300">Group tabs by category</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300">Auto-hide inactive tabs</span>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      </div>

      {/* Pinned Tabs */}
      {pinnedTabs.length > 0 && (
        <div className="mb-2 flex gap-1 pb-2 border-b border-cyan-500/20">
          {pinnedTabs.map(tab => (
            <motion.div
              key={tab.id}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-xs ${
                activeTab === tab.value
                  ? 'bg-cyan-500/20 border border-cyan-500/50'
                  : 'bg-black/40 border border-cyan-500/20 hover:border-cyan-500/40'
              }`}
              onClick={() => onTabChange(tab.value)}
              whileHover={{ scale: 1.05 }}
            >
              {tab.icon}
              <span className="text-cyan-300 whitespace-nowrap">{tab.label}</span>
              {tab.badge && (
                <Badge className="bg-cyan-500/20 text-cyan-400 text-[10px] px-1">
                  {tab.badge}
                </Badge>
              )}
              <Pin className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Tabs - Compact Horizontal Scroll */}
      {viewMode === 'compact' && (
        <ScrollArea ref={scrollRef} className="w-full" orientation="horizontal">
          <div className="flex gap-1 pb-2">
            {filteredTabs
              .filter(t => !t.pinned)
              .map((tab, index) => (
                <motion.div
                  key={tab.id}
                  draggable
                  onDragStart={() => handleDragStart(tab.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(tab.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all min-w-fit ${
                    activeTab === tab.value
                      ? 'bg-cyan-500/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                      : 'bg-black/40 border border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/10'
                  }`}
                  onClick={() => onTabChange(tab.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    {tab.icon}
                    <span className="text-sm text-cyan-300 whitespace-nowrap">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <Badge className="bg-cyan-500/20 text-cyan-400 text-[10px]">
                      {tab.badge}
                    </Badge>
                  )}
                  {tab.favorite && (
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  )}
                  {onTabClose && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-cyan-500/20 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTabClose(tab.value);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </motion.div>
              ))}
          </div>
        </ScrollArea>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {Object.entries(groupedTabs).map(([group, groupTabs]) => (
            <div key={group} className="bg-black/40 rounded-lg p-4 border border-cyan-500/20">
              <h3 className="text-cyan-400 mb-3 flex items-center gap-2 text-sm">
                <Folder className="w-4 h-4" />
                {group}
                <Badge className="bg-cyan-500/20 text-cyan-400 text-[10px]">{groupTabs.length}</Badge>
              </h3>
              <div className="space-y-1">
                {groupTabs.map(tab => (
                  <div
                    key={tab.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                      activeTab === tab.value
                        ? 'bg-cyan-500/20 border border-cyan-500/50'
                        : 'bg-black/60 border border-cyan-500/10 hover:border-cyan-500/30'
                    }`}
                    onClick={() => onTabChange(tab.value)}
                  >
                    <div className="flex items-center gap-2">
                      {tab.icon}
                      <span className="text-sm text-cyan-300">{tab.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {tab.badge && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 text-[10px]">
                          {tab.badge}
                        </Badge>
                      )}
                      {tab.favorite && (
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      )}
                      {onTabPin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTabPin(tab.value, !tab.pinned);
                          }}
                        >
                          <Pin className={`w-3 h-3 ${tab.pinned ? 'text-yellow-400 fill-yellow-400' : 'text-cyan-600'}`} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {filteredTabs.map(tab => (
            <motion.div
              key={tab.id}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                activeTab === tab.value
                  ? 'bg-cyan-500/20 border-cyan-500/50'
                  : 'bg-black/40 border-cyan-500/20 hover:border-cyan-500/40'
              }`}
              onClick={() => onTabChange(tab.value)}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-cyan-400">{tab.icon}</div>
                <span className="text-xs text-cyan-300 text-center">{tab.label}</span>
                {tab.badge && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 text-[10px]">
                    {tab.badge}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Command Palette */}
      {searchQuery && (
        <Command className="absolute top-full mt-2 w-full bg-black/95 border border-cyan-500/50 rounded-lg shadow-2xl z-50">
          <CommandList>
            <CommandEmpty>No tabs found.</CommandEmpty>
            <CommandGroup heading="Tabs">
              {filteredTabs.slice(0, 10).map(tab => (
                <CommandItem
                  key={tab.id}
                  onSelect={() => {
                    onTabChange(tab.value);
                    setSearchQuery('');
                  }}
                  className="cursor-pointer"
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                  {tab.badge && (
                    <Badge className="ml-auto bg-cyan-500/20 text-cyan-400">
                      {tab.badge}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </div>
  );
}

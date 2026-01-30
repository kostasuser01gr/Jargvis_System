import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Command } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Command as CommandPalette, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export interface TabInfo {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
  category: string;
  description?: string;
  badge?: number;
  pinned?: boolean;
  favorite?: boolean;
  shortcut?: string;
}

interface TabSearchProps {
  tabs: TabInfo[];
  onTabSelect: (value: string) => void;
  activeTab: string;
}

export function TabSearch({ tabs, onTabSelect, activeTab }: TabSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTabs = useMemo(() => {
    if (!searchQuery) return tabs;
    const query = searchQuery.toLowerCase();
    return tabs.filter(tab =>
      tab.label.toLowerCase().includes(query) ||
      tab.category.toLowerCase().includes(query) ||
      tab.description?.toLowerCase().includes(query) ||
      tab.value.toLowerCase().includes(query)
    );
  }, [tabs, searchQuery]);

  const groupedTabs = useMemo(() => {
    const groups: Record<string, TabInfo[]> = {};
    filteredTabs.forEach(tab => {
      if (!groups[tab.category]) {
        groups[tab.category] = [];
      }
      groups[tab.category].push(tab);
    });
    return groups;
  }, [filteredTabs]);

  const handleSelect = (value: string) => {
    onTabSelect(value);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !e.shiftKey && !e.target || (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Search Button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
          >
            <Search className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Search Tabs</span>
            <kbd className="hidden sm:inline ml-2 px-1.5 py-0.5 text-xs bg-cyan-500/10 border border-cyan-500/30 rounded">
              ⌘K
            </kbd>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[500px] bg-black/95 border-cyan-500/30 backdrop-blur-xl p-0"
          align="start"
        >
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search tabs, categories, or descriptions..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-cyan-500/30 text-cyan-300"
            />
            <CommandList>
              <CommandEmpty>No tabs found.</CommandEmpty>
              {Object.entries(groupedTabs).map(([category, categoryTabs]) => (
                <CommandGroup key={category} heading={category}>
                  {categoryTabs.map((tab) => (
                    <CommandItem
                      key={tab.id}
                      value={tab.value}
                      onSelect={() => handleSelect(tab.value)}
                      className={`flex items-center gap-3 p-3 cursor-pointer ${
                        activeTab === tab.value ? 'bg-cyan-500/20' : ''
                      }`}
                    >
                      {tab.icon && <div className="text-cyan-400">{tab.icon}</div>}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300">{tab.label}</span>
                          {tab.badge && (
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                              {tab.badge}
                            </Badge>
                          )}
                          {tab.pinned && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Pinned
                            </Badge>
                          )}
                          {tab.favorite && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              ★
                            </Badge>
                          )}
                        </div>
                        {tab.description && (
                          <div className="text-xs text-cyan-600 mt-1">{tab.description}</div>
                        )}
                      </div>
                      {tab.shortcut && (
                        <kbd className="px-2 py-1 text-xs bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400">
                          {tab.shortcut}
                        </kbd>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Inline Search (for tab bar) */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-600" />
          <Input
            type="text"
            placeholder="Search tabs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-48 bg-black/40 border-cyan-500/30 text-cyan-300 placeholder:text-cyan-600"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

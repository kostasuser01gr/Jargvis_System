import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';
import { 
  Terminal, Mic, Hand, Gauge, Brain, Grid3x3, 
  Zap, Shield, Wifi, Database, Activity, Settings,
  Search, MessageSquare, BarChart, Target, Satellite,
  Cloud, Eye, Lock, Unlock, Power, RefreshCw, Palette
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useTheme } from '../contexts/ThemeContext';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const { themes, applyTheme, currentTheme } = useTheme();

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  const handleCommand = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  const commands = [
    {
      group: 'Navigation',
      items: [
        { id: 'dashboard', label: 'Open Dashboard', icon: Grid3x3, action: () => toast.info('Switching to Dashboard'), shortcut: '⌘H' },
        { id: 'assistant', label: 'Open Assistant', icon: Terminal, action: () => toast.info('Switching to Assistant'), shortcut: '⌘A' },
        { id: 'analytics', label: 'View Analytics', icon: BarChart, action: () => toast.info('Switching to Analytics'), shortcut: '⌘D' },
        { id: 'neural', label: 'Neural Network', icon: Brain, action: () => toast.info('Switching to Neural Network'), shortcut: '⌘N' },
        { id: 'monitor', label: 'System Monitor', icon: Grid3x3, action: () => toast.info('Switching to Monitor'), shortcut: '⌘M' },
        { id: 'cluster', label: 'Cluster Management', icon: Database, action: () => toast.info('Switching to Cluster Management'), shortcut: '⌘F' },
        { id: 'security', label: 'Security Center', icon: Shield, action: () => toast.info('Switching to Security'), shortcut: '⌘S' },
        { id: 'mission', label: 'Mission Control', icon: Target, action: () => toast.info('Switching to Mission Control'), shortcut: '⌘C' },
      ]
    },
  {
    group: 'Controls',
    items: [
      { id: 'voice', label: 'Toggle Voice Control', icon: Mic, action: () => toast.success('Voice control toggled'), shortcut: '⌘V' },
      { id: 'gesture', label: 'Toggle Gesture Control', icon: Hand, action: () => toast.success('Gesture control toggled'), shortcut: '⌘G' },
      { id: 'performance', label: 'Performance Mode', icon: Zap, action: () => toast.success('Performance mode activated'), shortcut: '⌘P' },
      { id: 'satellite', label: 'Satellite Tracking', icon: Satellite, action: () => toast.info('Satellite tracking active'), shortcut: '⌘T' },
      { id: 'biometric', label: 'Biometric Scan', icon: Eye, action: () => toast.info('Starting biometric scan'), shortcut: '⌘B' },
      { id: 'weather', label: 'Weather Monitor', icon: Cloud, action: () => toast.info('Weather data loading'), shortcut: '⌘W' },
    ]
  },
  {
    group: 'System',
    items: [
      { id: 'diagnostics', label: 'Run Diagnostics', icon: Activity, action: () => toast.info('Running system diagnostics...'), shortcut: '⌘R' },
      { id: 'threat', label: 'Threat Detection', icon: Shield, action: () => toast.info('Threat detection active'), shortcut: '⌘H' },
      { id: 'network', label: 'Network Status', icon: Wifi, action: () => toast.info('Network: Connected'), shortcut: '⌘I' },
      { id: 'database', label: 'Database Query', icon: Database, action: () => toast.info('Opening database interface'), shortcut: '⌘Q' },
      { id: 'settings', label: 'System Settings', icon: Settings, action: () => toast.info('Opening settings'), shortcut: '⌘,' },
      { id: 'lock', label: 'Lock System', icon: Lock, action: () => toast.warning('System locked'), shortcut: '⌘L' },
      { id: 'unlock', label: 'Unlock System', icon: Unlock, action: () => toast.success('System unlocked'), shortcut: '⌘U' },
      { id: 'reboot', label: 'System Reboot', icon: RefreshCw, action: () => toast.warning('Rebooting system...'), shortcut: '⌘⇧R' },
      { id: 'shutdown', label: 'Shutdown', icon: Power, action: () => toast.error('Initiating shutdown...'), shortcut: '⌘⇧Q' },
    ]
  },
    {
      group: 'Themes',
      items: [
        { id: 'theme-settings', label: 'Open Theme Settings', icon: Palette, action: () => {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'theme-system' }));
          toast.info('Opening theme settings');
        }, shortcut: '⌘⇧T' },
        ...themes.map(theme => ({
          id: `apply-theme-${theme.id}`,
          label: `Apply Theme: ${theme.name}`,
          icon: Palette,
          action: () => {
            applyTheme(theme.id);
            toast.success(`Applied ${theme.name} theme`);
          },
          shortcut: null,
        }))
      ]
    },
    {
      group: 'Quick Actions',
      items: [
        { id: 'search', label: 'Global Search', icon: Search, action: () => toast.info('Search activated'), shortcut: '⌘/' },
        { id: 'chat', label: 'New Conversation', icon: MessageSquare, action: () => toast.success('New conversation started'), shortcut: '⌘⇧N' },
        { id: 'predict', label: 'Predictive Analytics', icon: Brain, action: () => toast.info('Loading AI predictions...'), shortcut: '⌘⇧P' },
        { id: 'quantum', label: 'Quantum Processing', icon: Zap, action: () => toast.info('Quantum processor online'), shortcut: '⌘⇧Q' },
      ]
    }
  ];

  // #region agent log
  // Wrap in error boundary to catch cmdk subscribe errors
  const [commandError, setCommandError] = useState(false);
  
  useEffect(() => {
    if (commandError) {
      fetch('http://127.0.0.1:7244/ingest/7769055a-33e5-41ee-95ff-da63c73d21b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CommandPalette.tsx:111',message:'Command error state set',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    }
  }, [commandError]);
  // #endregion
  
  if (commandError) {
    // Fallback UI if Command fails
    return (
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <div className="bg-gradient-to-br from-black to-cyan-950/20 border-cyan-500/30 p-6">
          <div className="text-cyan-400 mb-4">Command Palette</div>
          <div className="text-cyan-600 text-sm mb-4">Search functionality temporarily unavailable</div>
          <div className="space-y-2">
            {commands.flatMap(g => g.items).slice(0, 10).map(item => (
              <button
                key={item.id}
                onClick={() => handleCommand(item.action)}
                className="w-full text-left px-3 py-2 rounded hover:bg-cyan-500/10 text-cyan-300 flex items-center gap-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </CommandDialog>
    );
  }
  
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="bg-gradient-to-br from-black to-cyan-950/20 border-cyan-500/30">
        <CommandInput 
          placeholder="Type a command or search..." 
          value={search}
          onValueChange={setSearch}
          className="border-b border-cyan-500/30 text-cyan-100 placeholder:text-cyan-700"
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty className="text-cyan-600 text-center py-6">
            No results found.
          </CommandEmpty>
          
          {commands.map((group, groupIndex) => (
            <div key={group.group}>
              <CommandGroup heading={group.group} className="text-cyan-400">
                {group.items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleCommand(item.action)}
                    className="text-cyan-300 aria-selected:bg-cyan-500/20 aria-selected:text-cyan-400 cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.shortcut && (
                      <kbd className="ml-auto px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs font-mono text-cyan-500 group-aria-selected:bg-cyan-500/20 group-aria-selected:border-cyan-500/50">
                        {item.shortcut}
                      </kbd>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              {groupIndex < commands.length - 1 && (
                <CommandSeparator className="bg-cyan-500/20" />
              )}
            </div>
          ))}
        </CommandList>
        
        <div className="border-t border-cyan-500/30 p-2 flex items-center justify-between text-xs text-cyan-600">
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded">↵</kbd>
              Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded">ESC</kbd>
            Close
          </span>
        </div>
      </div>
    </CommandDialog>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Check, Settings, Download, Upload, Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner@2.0.3';

export function QuickThemeSwitcher() {
  // #region agent log
  let themeContext;
  try {
    themeContext = useTheme();
  } catch(e: any) {
    throw e;
  }
  const { currentTheme, themes, applyTheme, exportTheme, importTheme } = themeContext;
  // #endregion
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presetThemes = filteredThemes.filter(t => t.preset);
  const customThemes = filteredThemes.filter(t => !t.preset);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string);
          importTheme(themeData);
          setIsOpen(false);
        } catch (error) {
          toast.error('Invalid theme file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
        >
          <Palette className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Theme</span>
          <div
            className="ml-2 w-3 h-3 rounded-full border border-cyan-500/50"
            style={{ backgroundColor: currentTheme.colors.primary }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 bg-black/95 border-cyan-500/30 backdrop-blur-xl p-0"
        align="end"
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              <h3 className="text-cyan-400 font-semibold">Themes</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-cyan-400 hover:bg-cyan-500/10"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = handleFileImport as any;
                  input.click();
                }}
                title="Import Theme"
              >
                <Upload className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-cyan-400 hover:bg-cyan-500/10"
                onClick={() => exportTheme(currentTheme.id)}
                title="Export Current Theme"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <Input
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/40 border-cyan-500/30 text-cyan-300 placeholder:text-cyan-600"
          />

          {/* Current Theme Indicator */}
          <div className="flex items-center gap-2 p-2 bg-cyan-500/10 rounded border border-cyan-500/30">
            <div
              className="w-4 h-4 rounded-full border border-cyan-500/50"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <span className="text-sm text-cyan-300 flex-1">{currentTheme.name}</span>
            <Check className="w-4 h-4 text-cyan-400" />
          </div>

          <Separator className="bg-cyan-500/20" />

          {/* Theme List */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {/* Preset Themes */}
              {presetThemes.length > 0 && (
                <div>
                  <div className="text-xs text-cyan-500 mb-2 px-2 font-semibold">PRESETS</div>
                  <div className="space-y-1">
                    {presetThemes.map((theme) => (
                      <motion.button
                        key={theme.id}
                        onClick={() => {
                          applyTheme(theme.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded hover:bg-cyan-500/10 transition-colors ${
                          currentTheme.id === theme.id ? 'bg-cyan-500/20 border border-cyan-500/50' : ''
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className="w-5 h-5 rounded border border-cyan-500/50 flex-shrink-0"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div className="flex-1 text-left">
                          <div className="text-sm text-cyan-300 font-medium">{theme.name}</div>
                          <div className="text-xs text-cyan-600">{theme.description}</div>
                        </div>
                        {currentTheme.id === theme.id && (
                          <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        )}
                        {theme.effects.glow > 20 && (
                          <Sparkles className="w-3 h-3 text-cyan-500/50 flex-shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Themes */}
              {customThemes.length > 0 && (
                <div>
                  <Separator className="bg-cyan-500/20 my-4" />
                  <div className="text-xs text-cyan-500 mb-2 px-2 font-semibold">CUSTOM</div>
                  <div className="space-y-1">
                    {customThemes.map((theme) => (
                      <motion.button
                        key={theme.id}
                        onClick={() => {
                          applyTheme(theme.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded hover:bg-cyan-500/10 transition-colors ${
                          currentTheme.id === theme.id ? 'bg-cyan-500/20 border border-cyan-500/50' : ''
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className="w-5 h-5 rounded border border-cyan-500/50 flex-shrink-0"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div className="flex-1 text-left">
                          <div className="text-sm text-cyan-300 font-medium">{theme.name}</div>
                          <div className="text-xs text-cyan-600">{theme.description}</div>
                        </div>
                        {currentTheme.id === theme.id && (
                          <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {filteredThemes.length === 0 && (
                <div className="text-center py-8 text-cyan-600 text-sm">
                  No themes found
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <Separator className="bg-cyan-500/20" />
          <Button
            variant="ghost"
            className="w-full justify-start text-cyan-400 hover:bg-cyan-500/10"
            onClick={() => {
              setIsOpen(false);
              // Navigate to full theme system - will be handled by parent
              window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'theme-system' }));
            }}
          >
            <Settings className="w-4 h-4 mr-2" />
            Advanced Theme Settings
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

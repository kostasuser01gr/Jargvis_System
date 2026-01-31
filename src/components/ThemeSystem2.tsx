import { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Sparkles, Moon, Sun, Monitor, Download, Upload, Eye, Save, RefreshCw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  preset: boolean;
}

interface CustomTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    glow: string;
    border: string;
  };
  effects: {
    blur: number;
    glow: number;
    animation: boolean;
  };
}

export function ThemeSystem2() {
  const { applyTheme: applyStoredTheme, setThemeMode } = useTheme();
  const [themes, setThemes] = useState<Theme[]>([
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      description: 'Neon colors with high contrast',
      colors: {
        primary: '#00ffff',
        secondary: '#ff00ff',
        accent: '#ffff00',
        background: '#000000',
        foreground: '#00ffff'
      },
      preset: true
    },
    {
      id: 'matrix',
      name: 'Matrix',
      description: 'Green terminal aesthetic',
      colors: {
        primary: '#00ff00',
        secondary: '#00cc00',
        accent: '#00ff88',
        background: '#000000',
        foreground: '#00ff00'
      },
      preset: true
    },
    {
      id: 'neon',
      name: 'Neon',
      description: 'Vibrant neon colors',
      colors: {
        primary: '#ff00ff',
        secondary: '#00ffff',
        accent: '#ffff00',
        background: '#0a0a0a',
        foreground: '#ffffff'
      },
      preset: true
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#10b981',
        background: '#ffffff',
        foreground: '#000000'
      },
      preset: true
    }
  ]);

  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    name: 'My Custom Theme',
    colors: {
      primary: '#22d3ee',
      secondary: '#6366f1',
      accent: '#a855f7',
      background: '#000000',
      foreground: '#ffffff',
      glow: '#22d3ee',
      border: '#22d3ee'
    },
    effects: {
      blur: 10,
      glow: 20,
      animation: true
    }
  });

  const [selectedTheme, setSelectedTheme] = useState<string>('cyberpunk');
  const [previewMode, setPreviewMode] = useState<'light' | 'dark' | 'auto'>('dark');

  const applyTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      applyStoredTheme(theme.id);
      toast.success(`Applied ${theme.name} theme`);
    }
  };

  const saveCustomTheme = () => {
    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: customTheme.name,
      description: 'Custom user theme',
      colors: {
        primary: customTheme.colors.primary,
        secondary: customTheme.colors.secondary,
        accent: customTheme.colors.accent,
        background: customTheme.colors.background,
        foreground: customTheme.colors.foreground
      },
      preset: false
    };
    setThemes([...themes, newTheme]);
    toast.success('Custom theme saved!');
  };

  const exportTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      const dataStr = JSON.stringify(theme, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      link.click();
      toast.success('Theme exported!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-pink-950/20 to-rose-950/20 border-pink-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-pink-400 flex items-center gap-2">
              <Palette className="w-6 h-5" />
              Theme System 2.0
            </h3>
            <p className="text-xs text-pink-600 mt-1">Custom theme builder with presets and effects</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-pink-500/50 text-pink-400 hover:bg-pink-500/20"
              onClick={() => {
                const nextMode = previewMode === 'dark' ? 'light' : previewMode === 'light' ? 'auto' : 'dark';
                setPreviewMode(nextMode);
                setThemeMode(nextMode === 'auto' ? 'system' : nextMode);
              }}
            >
              {previewMode === 'dark' ? <Moon className="w-4 h-4 mr-2" /> : previewMode === 'light' ? <Sun className="w-4 h-4 mr-2" /> : <Monitor className="w-4 h-4 mr-2" />}
              {previewMode}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Presets */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-pink-950/20 to-rose-950/20 border-pink-500/30 p-6">
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="bg-black/40 border-pink-500/30">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="custom">Custom Builder</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      selectedTheme === theme.id
                        ? 'bg-pink-500/20 border-pink-500/50'
                        : 'bg-black/40 border-pink-500/30 hover:border-pink-500/40'
                    }`}
                    onClick={() => applyTheme(theme.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-pink-400 mb-1">{theme.name}</h4>
                        <p className="text-xs text-pink-600">{theme.description}</p>
                      </div>
                      {theme.preset && (
                        <Badge className="bg-pink-500/10 text-pink-400 text-[10px]">
                          Preset
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {Object.values(theme.colors).map((color, i) => (
                        <div
                          key={i}
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-pink-500/30 text-pink-400 hover:bg-pink-500/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          applyTheme(theme.id);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-500/30 text-pink-400 hover:bg-pink-500/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          exportTheme(theme.id);
                        }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-pink-600 mb-2 block">Theme Name</label>
                  <Input
                    value={customTheme.name}
                    onChange={(e) => setCustomTheme({ ...customTheme, name: e.target.value })}
                    className="bg-black/60 border-pink-500/40 text-pink-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(customTheme.colors).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-xs text-pink-600 mb-2 block capitalize">{key}</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => setCustomTheme({
                            ...customTheme,
                            colors: { ...customTheme.colors, [key]: e.target.value }
                          })}
                          className="w-12 h-10 rounded border border-pink-500/40"
                        />
                        <Input
                          value={value}
                          onChange={(e) => setCustomTheme({
                            ...customTheme,
                            colors: { ...customTheme.colors, [key]: e.target.value }
                          })}
                          className="flex-1 bg-black/60 border-pink-500/40 text-pink-100 font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={saveCustomTheme}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Custom Theme
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="effects" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-pink-600 mb-2 block">Blur Intensity: {customTheme.effects.blur}px</label>
                  <Slider
                    value={[customTheme.effects.blur]}
                    onValueChange={([value]) => setCustomTheme({
                      ...customTheme,
                      effects: { ...customTheme.effects, blur: value }
                    })}
                    min={0}
                    max={20}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-xs text-pink-600 mb-2 block">Glow Intensity: {customTheme.effects.glow}px</label>
                  <Slider
                    value={[customTheme.effects.glow]}
                    onValueChange={([value]) => setCustomTheme({
                      ...customTheme,
                      effects: { ...customTheme.effects, glow: value }
                    })}
                    min={0}
                    max={50}
                    step={1}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-pink-500/30">
                  <div>
                    <label className="text-sm text-pink-400">Enable Animations</label>
                    <p className="text-xs text-pink-600">Smooth transitions and effects</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={customTheme.effects.animation}
                    onChange={(e) => setCustomTheme({
                      ...customTheme,
                      effects: { ...customTheme.effects, animation: e.target.checked }
                    })}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Preview */}
        <Card className="bg-gradient-to-br from-pink-950/20 to-rose-950/20 border-pink-500/30 p-6">
          <h4 className="text-pink-400 mb-4">Theme Preview</h4>
          <div 
            className="rounded-lg p-6 border-2 transition-all"
            style={{
              backgroundColor: customTheme.colors.background,
              color: customTheme.colors.foreground,
              borderColor: customTheme.colors.border,
              boxShadow: `0 0 ${customTheme.effects.glow}px ${customTheme.colors.glow}`,
              backdropFilter: `blur(${customTheme.effects.blur}px)`
            }}
          >
            <div className="space-y-3">
              <div 
                className="p-3 rounded"
                style={{ backgroundColor: customTheme.colors.primary + '20' }}
              >
                <div className="text-sm font-semibold" style={{ color: customTheme.colors.primary }}>
                  Primary Color
                </div>
              </div>
              <div 
                className="p-3 rounded"
                style={{ backgroundColor: customTheme.colors.secondary + '20' }}
              >
                <div className="text-sm font-semibold" style={{ color: customTheme.colors.secondary }}>
                  Secondary Color
                </div>
              </div>
              <div 
                className="p-3 rounded"
                style={{ backgroundColor: customTheme.colors.accent + '20' }}
              >
                <div className="text-sm font-semibold" style={{ color: customTheme.colors.accent }}>
                  Accent Color
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

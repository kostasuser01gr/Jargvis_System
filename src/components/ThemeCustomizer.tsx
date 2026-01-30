import { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Sparkles, Droplets, Zap, Sun, Moon, Monitor } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

const THEME_PRESETS = [
  { name: 'Cyan Matrix', primary: '#22d3ee', secondary: '#3b82f6', accent: '#06b6d4' },
  { name: 'Purple Nebula', primary: '#a855f7', secondary: '#ec4899', accent: '#8b5cf6' },
  { name: 'Green Terminal', primary: '#10b981', secondary: '#059669', accent: '#34d399' },
  { name: 'Red Alert', primary: '#ef4444', secondary: '#dc2626', accent: '#f87171' },
  { name: 'Gold Luxury', primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
  { name: 'Blue Ocean', primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8' }
];

export function ThemeCustomizer() {
  const [theme, setTheme] = useState({
    mode: 'dark',
    primaryColor: '#22d3ee',
    secondaryColor: '#3b82f6',
    accentColor: '#06b6d4',
    blur: 20,
    opacity: 95,
    glow: true,
    particles: true,
    animations: true,
    gridPattern: true
  });

  const applyTheme = (preset: typeof THEME_PRESETS[0]) => {
    setTheme(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    }));

    toast.success(`Applied ${preset.name} theme!`);
  };

  const resetTheme = () => {
    setTheme({
      mode: 'dark',
      primaryColor: '#22d3ee',
      secondaryColor: '#3b82f6',
      accentColor: '#06b6d4',
      blur: 20,
      opacity: 95,
      glow: true,
      particles: true,
      animations: true,
      gridPattern: true
    });
    toast.success('Theme reset to default');
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-cyan-400 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Customizer
          </h3>
          <p className="text-xs text-cyan-600 mt-1">Personalize your JARVIS interface</p>
        </div>
        <Button
          size="sm"
          onClick={resetTheme}
          className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
        >
          Reset
        </Button>
      </div>

      <Tabs defaultValue="presets">
        <TabsList className="bg-black/40 border border-cyan-500/20 mb-6">
          <TabsTrigger value="presets" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            Presets
          </TabsTrigger>
          <TabsTrigger value="colors" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            Colors
          </TabsTrigger>
          <TabsTrigger value="effects" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            Effects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets">
          <div className="grid grid-cols-2 gap-4">
            {THEME_PRESETS.map((preset) => (
              <motion.div
                key={preset.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => applyTheme(preset)}
                className="cursor-pointer"
              >
                <Card className="bg-black/40 border-cyan-500/20 hover:border-cyan-500/50 transition-all p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-lg border-2"
                      style={{ 
                        background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                        borderColor: preset.accent
                      }}
                    />
                    <div>
                      <div className="text-cyan-400 text-sm font-medium">{preset.name}</div>
                      <div className="text-xs text-cyan-600">Click to apply</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[preset.primary, preset.secondary, preset.accent].map((color, i) => (
                      <div
                        key={i}
                        className="flex-1 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="colors">
          <div className="space-y-6">
            <div>
              <Label className="text-cyan-400 mb-3 block">Primary Color</Label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-16 h-16 rounded-lg border-2 border-cyan-500/50 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-xs text-cyan-600 mb-2">HEX: {theme.primaryColor}</div>
                  <div 
                    className="h-4 rounded-full"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-cyan-400 mb-3 block">Secondary Color</Label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-16 h-16 rounded-lg border-2 border-cyan-500/50 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-xs text-cyan-600 mb-2">HEX: {theme.secondaryColor}</div>
                  <div 
                    className="h-4 rounded-full"
                    style={{ backgroundColor: theme.secondaryColor }}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-cyan-400 mb-3 block">Accent Color</Label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-16 h-16 rounded-lg border-2 border-cyan-500/50 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-xs text-cyan-600 mb-2">HEX: {theme.accentColor}</div>
                  <div 
                    className="h-4 rounded-full"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <Card className="bg-black/40 border-cyan-500/20 p-6">
              <div className="text-sm text-cyan-400 mb-4">Preview</div>
              <div 
                className="h-32 rounded-lg border-2 flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                  borderColor: theme.accentColor
                }}
              >
                <div className="text-white text-lg font-medium">JARVIS Interface</div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="effects">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-cyan-400">Blur Intensity</Label>
                <span className="text-cyan-400 font-mono text-sm">{theme.blur}px</span>
              </div>
              <Slider
                value={[theme.blur]}
                onValueChange={([value]) => setTheme(prev => ({ ...prev, blur: value }))}
                min={0}
                max={40}
                step={1}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-cyan-400">Background Opacity</Label>
                <span className="text-cyan-400 font-mono text-sm">{theme.opacity}%</span>
              </div>
              <Slider
                value={[theme.opacity]}
                onValueChange={([value]) => setTheme(prev => ({ ...prev, opacity: value }))}
                min={50}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <Label className="text-cyan-400">Glow Effects</Label>
                </div>
                <Switch
                  checked={theme.glow}
                  onCheckedChange={(checked) => setTheme(prev => ({ ...prev, glow: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  <Label className="text-cyan-400">Particle Field</Label>
                </div>
                <Switch
                  checked={theme.particles}
                  onCheckedChange={(checked) => setTheme(prev => ({ ...prev, particles: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <Label className="text-cyan-400">Animations</Label>
                </div>
                <Switch
                  checked={theme.animations}
                  onCheckedChange={(checked) => setTheme(prev => ({ ...prev, animations: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-cyan-400" />
                  <Label className="text-cyan-400">Grid Pattern</Label>
                </div>
                <Switch
                  checked={theme.gridPattern}
                  onCheckedChange={(checked) => setTheme(prev => ({ ...prev, gridPattern: checked }))}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => toast.success('Theme saved!', { description: 'Your customizations have been applied' })}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              >
                <Palette className="w-4 h-4 mr-2" />
                Apply Theme
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

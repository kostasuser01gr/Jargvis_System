import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layout, Grid, Columns, Sidebar, Maximize2, Minimize2, Save, RotateCcw, Monitor, Tablet, Smartphone } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface LayoutConfig {
  sidebarWidth: number;
  headerHeight: number;
  tabBarPosition: 'top' | 'bottom' | 'left' | 'right';
  tabBarStyle: 'compact' | 'comfortable' | 'spacious';
  contentPadding: number;
  showBreadcrumbs: boolean;
  showFavorites: boolean;
  showSearch: boolean;
  gridColumns: number;
  animationSpeed: 'slow' | 'normal' | 'fast';
  responsiveMode: 'desktop' | 'tablet' | 'mobile';
}

const DEFAULT_LAYOUT: LayoutConfig = {
  sidebarWidth: 280,
  headerHeight: 80,
  tabBarPosition: 'top',
  tabBarStyle: 'comfortable',
  contentPadding: 24,
  showBreadcrumbs: true,
  showFavorites: true,
  showSearch: true,
  gridColumns: 3,
  animationSpeed: 'normal',
  responsiveMode: 'desktop'
};

export function LayoutCustomizer() {
  const [config, setConfig] = useState<LayoutConfig>(() => {
    const saved = localStorage.getItem('jarvis-layout-config');
    return saved ? { ...DEFAULT_LAYOUT, ...JSON.parse(saved) } : DEFAULT_LAYOUT;
  });
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    // Apply layout config to CSS variables
    document.documentElement.style.setProperty('--layout-sidebar-width', `${config.sidebarWidth}px`);
    document.documentElement.style.setProperty('--layout-header-height', `${config.headerHeight}px`);
    document.documentElement.style.setProperty('--layout-content-padding', `${config.contentPadding}px`);
    document.documentElement.style.setProperty('--layout-grid-columns', config.gridColumns.toString());
    
    // Apply animation speed
    const speedMap = { slow: '0.5s', normal: '0.3s', fast: '0.15s' };
    document.documentElement.style.setProperty('--layout-animation-speed', speedMap[config.animationSpeed]);
    
    // Save to localStorage
    localStorage.setItem('jarvis-layout-config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (updates: Partial<LayoutConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetLayout = () => {
    setConfig(DEFAULT_LAYOUT);
    toast.success('Layout reset to defaults');
  };

  const saveLayout = () => {
    localStorage.setItem('jarvis-layout-config', JSON.stringify(config));
    toast.success('Layout saved successfully');
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Layout className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Layout Customizer</h2>
            <p className="text-sm text-cyan-600">Customize the interface layout and appearance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="border-cyan-500/30 text-cyan-400"
          >
            {previewMode ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetLayout}
            className="border-cyan-500/30 text-cyan-400"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={saveLayout}
            className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dimensions" className="w-full">
        <TabsList className="bg-black/40 border-cyan-500/20 mb-6">
          <TabsTrigger value="dimensions" className="data-[state=active]:bg-cyan-500/20">
            <Grid className="w-4 h-4 mr-2" />
            Dimensions
          </TabsTrigger>
          <TabsTrigger value="navigation" className="data-[state=active]:bg-cyan-500/20">
            <Sidebar className="w-4 h-4 mr-2" />
            Navigation
          </TabsTrigger>
          <TabsTrigger value="display" className="data-[state=active]:bg-cyan-500/20">
            <Monitor className="w-4 h-4 mr-2" />
            Display
          </TabsTrigger>
          <TabsTrigger value="responsive" className="data-[state=active]:bg-cyan-500/20">
            <Smartphone className="w-4 h-4 mr-2" />
            Responsive
          </TabsTrigger>
        </TabsList>

        {/* Dimensions */}
        <TabsContent value="dimensions" className="space-y-6">
          <div>
            <Label className="text-cyan-400 mb-3 block">
              Sidebar Width: {config.sidebarWidth}px
            </Label>
            <Slider
              value={[config.sidebarWidth]}
              onValueChange={([v]) => updateConfig({ sidebarWidth: v })}
              min={200}
              max={400}
              step={10}
            />
          </div>

          <div>
            <Label className="text-cyan-400 mb-3 block">
              Header Height: {config.headerHeight}px
            </Label>
            <Slider
              value={[config.headerHeight]}
              onValueChange={([v]) => updateConfig({ headerHeight: v })}
              min={60}
              max={120}
              step={5}
            />
          </div>

          <div>
            <Label className="text-cyan-400 mb-3 block">
              Content Padding: {config.contentPadding}px
            </Label>
            <Slider
              value={[config.contentPadding]}
              onValueChange={([v]) => updateConfig({ contentPadding: v })}
              min={12}
              max={48}
              step={4}
            />
          </div>

          <div>
            <Label className="text-cyan-400 mb-3 block">
              Grid Columns: {config.gridColumns}
            </Label>
            <Slider
              value={[config.gridColumns]}
              onValueChange={([v]) => updateConfig({ gridColumns: v })}
              min={1}
              max={6}
              step={1}
            />
          </div>
        </TabsContent>

        {/* Navigation */}
        <TabsContent value="navigation" className="space-y-6">
          <div>
            <Label className="text-cyan-400 mb-3 block">Tab Bar Position</Label>
            <Select
              value={config.tabBarPosition}
              onValueChange={(v: any) => updateConfig({ tabBarPosition: v })}
            >
              <SelectTrigger className="bg-black/60 border-cyan-500/40 text-cyan-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-cyan-400 mb-3 block">Tab Bar Style</Label>
            <Select
              value={config.tabBarStyle}
              onValueChange={(v: any) => updateConfig({ tabBarStyle: v })}
            >
              <SelectTrigger className="bg-black/60 border-cyan-500/40 text-cyan-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-cyan-400">Show Breadcrumbs</Label>
              <Switch
                checked={config.showBreadcrumbs}
                onCheckedChange={(v) => updateConfig({ showBreadcrumbs: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-cyan-400">Show Favorites Bar</Label>
              <Switch
                checked={config.showFavorites}
                onCheckedChange={(v) => updateConfig({ showFavorites: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-cyan-400">Show Search Bar</Label>
              <Switch
                checked={config.showSearch}
                onCheckedChange={(v) => updateConfig({ showSearch: v })}
              />
            </div>
          </div>
        </TabsContent>

        {/* Display */}
        <TabsContent value="display" className="space-y-6">
          <div>
            <Label className="text-cyan-400 mb-3 block">Animation Speed</Label>
            <Select
              value={config.animationSpeed}
              onValueChange={(v: any) => updateConfig({ animationSpeed: v })}
            >
              <SelectTrigger className="bg-black/60 border-cyan-500/40 text-cyan-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-black/40 border border-cyan-500/20 rounded-lg">
            <h4 className="text-cyan-300 mb-2 text-sm font-semibold">Layout Preview</h4>
            <div className="space-y-2 text-xs text-cyan-600">
              <div>Sidebar: {config.sidebarWidth}px</div>
              <div>Header: {config.headerHeight}px</div>
              <div>Padding: {config.contentPadding}px</div>
              <div>Grid: {config.gridColumns} columns</div>
              <div>Tab Bar: {config.tabBarPosition} ({config.tabBarStyle})</div>
            </div>
          </div>
        </TabsContent>

        {/* Responsive */}
        <TabsContent value="responsive" className="space-y-6">
          <div>
            <Label className="text-cyan-400 mb-3 block">Responsive Mode</Label>
            <Select
              value={config.responsiveMode}
              onValueChange={(v: any) => updateConfig({ responsiveMode: v })}
            >
              <SelectTrigger className="bg-black/60 border-cyan-500/40 text-cyan-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desktop">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Desktop
                  </div>
                </SelectItem>
                <SelectItem value="tablet">
                  <div className="flex items-center gap-2">
                    <Tablet className="w-4 h-4" />
                    Tablet
                  </div>
                </SelectItem>
                <SelectItem value="mobile">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-black/40 border border-cyan-500/20 rounded-lg">
            <h4 className="text-cyan-300 mb-2 text-sm font-semibold">Responsive Breakpoints</h4>
            <div className="space-y-2 text-xs text-cyan-600">
              <div>Desktop: &gt; 1024px</div>
              <div>Tablet: 768px - 1024px</div>
              <div>Mobile: &lt; 768px</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

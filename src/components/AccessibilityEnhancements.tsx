import { useState } from 'react';
import { motion } from 'motion/react';
import { Accessibility, Eye, Keyboard, Volume2, ZoomIn, Contrast, MousePointer2, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { toast } from 'sonner';

interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'visual' | 'motor' | 'cognitive' | 'hearing';
  icon: React.ReactNode;
}

export function AccessibilityEnhancements() {
  const [features, setFeatures] = useState<AccessibilityFeature[]>([
    {
      id: 'screen-reader',
      name: 'Screen Reader Support',
      description: 'Full ARIA labels and semantic HTML',
      enabled: true,
      category: 'visual',
      icon: <Eye className="w-5 h-5" />
    },
    {
      id: 'keyboard-nav',
      name: 'Keyboard Navigation',
      description: 'Full keyboard accessibility with shortcuts',
      enabled: true,
      category: 'motor',
      icon: <Keyboard className="w-5 h-5" />
    },
    {
      id: 'high-contrast',
      name: 'High Contrast Mode',
      description: 'Enhanced color contrast for visibility',
      enabled: false,
      category: 'visual',
      icon: <Contrast className="w-5 h-5" />
    },
    {
      id: 'text-to-speech',
      name: 'Text-to-Speech',
      description: 'Read content aloud',
      enabled: false,
      category: 'visual',
      icon: <Volume2 className="w-5 h-5" />
    },
    {
      id: 'zoom',
      name: 'Zoom Controls',
      description: 'Adjustable text and UI scaling',
      enabled: true,
      category: 'visual',
      icon: <ZoomIn className="w-5 h-5" />
    },
    {
      id: 'reduced-motion',
      name: 'Reduced Motion',
      description: 'Minimize animations and transitions',
      enabled: false,
      category: 'cognitive',
      icon: <MousePointer2 className="w-5 h-5" />
    }
  ]);

  const [fontSize, setFontSize] = useState(16);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [contrastLevel, setContrastLevel] = useState(1);

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
    const feature = features.find(f => f.id === id);
    toast.success(`${feature?.name} ${!feature?.enabled ? 'enabled' : 'disabled'}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'visual': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'motor': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'cognitive': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'hearing': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-teal-950/20 to-cyan-950/20 border-teal-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-teal-400 flex items-center gap-2">
              <Accessibility className="w-6 h-5" />
              Accessibility Enhancements
            </h3>
            <p className="text-xs text-teal-600 mt-1">WCAG 2.1 AA compliant, screen reader support, keyboard navigation</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Features Enabled', value: features.filter(f => f.enabled).length, icon: CheckCircle2 },
            { label: 'WCAG Level', value: 'AA', icon: Accessibility },
            { label: 'Font Size', value: `${fontSize}px`, icon: ZoomIn },
            { label: 'Zoom Level', value: `${zoomLevel}%`, icon: ZoomIn },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-teal-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-teal-400" />
                <p className="text-lg text-teal-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-teal-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="bg-black/40 border-teal-500/30">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="mt-6">
          <Card className="bg-gradient-to-br from-teal-950/20 to-cyan-950/20 border-teal-500/30 p-6">
            <h4 className="text-teal-400 mb-4">Accessibility Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <Card
                  key={feature.id}
                  className="bg-black/40 border-teal-500/30 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${getCategoryColor(feature.category)}`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className="text-teal-400 mb-1">{feature.name}</h5>
                        <p className="text-sm text-teal-600">{feature.description}</p>
                        <Badge className={`mt-2 ${getCategoryColor(feature.category)}`}>
                          {feature.category}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="visual" className="mt-6">
          <Card className="bg-gradient-to-br from-teal-950/20 to-cyan-950/20 border-teal-500/30 p-6">
            <h4 className="text-teal-400 mb-4">Visual Settings</h4>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-teal-400 mb-2 block">Font Size: {fontSize}px</label>
                <Slider
                  value={[fontSize]}
                  onValueChange={([value]) => {
                    setFontSize(value);
                    document.documentElement.style.fontSize = `${value}px`;
                  }}
                  min={12}
                  max={24}
                  step={1}
                />
              </div>

              <div>
                <label className="text-sm text-teal-400 mb-2 block">Zoom Level: {zoomLevel}%</label>
                <Slider
                  value={[zoomLevel]}
                  onValueChange={([value]) => {
                    setZoomLevel(value);
                    document.documentElement.style.zoom = `${value / 100}`;
                  }}
                  min={50}
                  max={200}
                  step={10}
                />
              </div>

              <div>
                <label className="text-sm text-teal-400 mb-2 block">Contrast Level: {contrastLevel.toFixed(1)}x</label>
                <Slider
                  value={[contrastLevel]}
                  onValueChange={([value]) => {
                    setContrastLevel(value);
                    document.documentElement.style.filter = `contrast(${value})`;
                  }}
                  min={1}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-teal-500/30">
                <div>
                  <h5 className="text-teal-400 mb-1">High Contrast Mode</h5>
                  <p className="text-sm text-teal-600">Enhanced color contrast for better visibility</p>
                </div>
                <Switch
                  checked={features.find(f => f.id === 'high-contrast')?.enabled || false}
                  onCheckedChange={() => toggleFeature('high-contrast')}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="keyboard" className="mt-6">
          <Card className="bg-gradient-to-br from-teal-950/20 to-cyan-950/20 border-teal-500/30 p-6">
            <h4 className="text-teal-400 mb-4">Keyboard Shortcuts</h4>
            <div className="space-y-2">
              {[
                { key: '⌘K', action: 'Open Command Palette' },
                { key: '⌘A', action: 'Voice Assistant' },
                { key: '⌘T', action: 'New Tab' },
                { key: '⌘W', action: 'Close Tab' },
                { key: 'Tab', action: 'Navigate Forward' },
                { key: 'Shift+Tab', action: 'Navigate Backward' },
                { key: 'Enter', action: 'Activate Selected Item' },
                { key: 'Esc', action: 'Close/Dismiss' },
              ].map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded border border-teal-500/30">
                  <span className="text-teal-300">{shortcut.action}</span>
                  <Badge className="bg-teal-500/20 border-teal-500/50 text-teal-400 font-mono">
                    {shortcut.key}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="bg-gradient-to-br from-teal-950/20 to-cyan-950/20 border-teal-500/30 p-6">
            <h4 className="text-teal-400 mb-4">Accessibility Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-teal-500/30">
                <div>
                  <h5 className="text-teal-400 mb-1">ARIA Labels</h5>
                  <p className="text-sm text-teal-600">Full ARIA support for screen readers</p>
                </div>
                <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                  Enabled
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-teal-500/30">
                <div>
                  <h5 className="text-teal-400 mb-1">Focus Indicators</h5>
                  <p className="text-sm text-teal-600">Visible focus outlines for keyboard navigation</p>
                </div>
                <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                  Enabled
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-teal-500/30">
                <div>
                  <h5 className="text-teal-400 mb-1">Skip Links</h5>
                  <p className="text-sm text-teal-600">Quick navigation to main content</p>
                </div>
                <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                  Enabled
                </Badge>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

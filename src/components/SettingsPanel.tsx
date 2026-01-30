import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, User, Bell, Lock, Globe, Palette, Zap, Save, RotateCcw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { toast } from 'sonner@2.0.3';
import { useTheme } from '../contexts/ThemeContext';
import { QuickThemeSwitcher } from './QuickThemeSwitcher';
import { ThemeSystem2 } from './ThemeSystem2';
import { LayoutCustomizer } from './LayoutCustomizer';

export function SettingsPanel() {
  const { currentTheme, themes, applyTheme, updateTheme } = useTheme();
  const [settings, setSettings] = useState({
    // Profile
    username: 'Tony Stark',
    email: 'tony@starkindustries.com',
    role: 'Administrator',
    
    // Appearance
    theme: 'dark',
    accentColor: '#22d3ee',
    fontSize: 14,
    animations: true,
    particles: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    desktopNotifications: false,
    
    // Security
    twoFactor: true,
    sessionTimeout: 30,
    autoLogout: true,
    
    // System
    language: 'en',
    timezone: 'UTC',
    autoSave: true,
    debugMode: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Simulate saving
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Saving settings...',
        success: 'Settings saved successfully!',
        error: 'Failed to save settings'
      }
    );
  };

  const resetSettings = () => {
    toast.success('Settings reset to defaults');
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-cyan-400">System Settings</h3>
            <p className="text-xs text-cyan-600">Configure JARVIS preferences</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={resetSettings}
            className="border-cyan-500/30 text-cyan-400"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={saveSettings}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="appearance">
        <TabsList className="bg-black/40 border border-cyan-500/20 mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Zap className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="themes" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Palette className="w-4 h-4 mr-2" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="layout" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Settings className="w-4 h-4 mr-2" />
            Layout
          </TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-cyan-400 mb-2 block">Username</Label>
                <Input
                  value={settings.username}
                  onChange={(e) => updateSetting('username', e.target.value)}
                  className="bg-black/60 border-cyan-500/40 text-cyan-100"
                />
              </div>
              <div>
                <Label className="text-cyan-400 mb-2 block">Email</Label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  className="bg-black/60 border-cyan-500/40 text-cyan-100"
                />
              </div>
            </div>

            <div>
              <Label className="text-cyan-400 mb-2 block">Role</Label>
              <Select value={settings.role} onValueChange={(v) => updateSetting('role', v)}>
                <SelectTrigger className="bg-black/60 border-cyan-500/40 text-cyan-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t border-cyan-500/20">
              <h4 className="text-cyan-400 mb-4">Profile Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 text-center">
                  <div className="text-2xl text-cyan-400 font-mono">247</div>
                  <div className="text-xs text-cyan-600 mt-1">Sessions</div>
                </div>
                <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 text-center">
                  <div className="text-2xl text-cyan-400 font-mono">1.2K</div>
                  <div className="text-xs text-cyan-600 mt-1">Commands</div>
                </div>
                <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 text-center">
                  <div className="text-2xl text-cyan-400 font-mono">99.8%</div>
                  <div className="text-xs text-cyan-600 mt-1">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <div className="space-y-6">
            {/* Quick Theme Switcher */}
            <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-cyan-400 font-semibold flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Quick Theme Switcher
                  </h4>
                  <p className="text-xs text-cyan-600 mt-1">Switch themes instantly</p>
                </div>
                <QuickThemeSwitcher />
              </div>
              <div className="mt-4">
                <div className="text-sm text-cyan-300 mb-2">Current Theme: <span className="font-semibold">{currentTheme.name}</span></div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border border-cyan-500/50"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  />
                  <div className="text-xs text-cyan-600">{currentTheme.description}</div>
                </div>
              </div>
            </div>
            
            {/* Theme Presets Grid */}
            <div>
              <h4 className="text-cyan-400 font-semibold mb-3">Theme Presets</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {themes.filter(t => t.preset).slice(0, 6).map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => applyTheme(theme.id)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      currentTheme.id === theme.id
                        ? 'border-cyan-500 bg-cyan-500/20'
                        : 'border-cyan-500/30 bg-black/40 hover:border-cyan-500/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded border border-cyan-500/50"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <span className="text-sm text-cyan-300 font-medium">{theme.name}</span>
                    </div>
                    <div className="text-xs text-cyan-600">{theme.description}</div>
                  </motion.button>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'theme-system' }));
                }}
              >
                <Palette className="w-4 h-4 mr-2" />
                Open Advanced Theme Settings
              </Button>
            </div>
            
            {/* Original Appearance Settings */}
            <div className="space-y-4 pt-4 border-t border-cyan-500/20">
              <div>
                <Label className="text-cyan-400 mb-2 block">Theme Mode</Label>
                <Select value={settings.theme} onValueChange={(v) => updateSetting('theme', v)}>
                  <SelectTrigger className="bg-black/60 border-cyan-500/40 text-cyan-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-cyan-400 mb-3 block">
                  Font Size: {settings.fontSize}px
                </Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([v]) => updateSetting('fontSize', v)}
                  min={12}
                  max={20}
                  step={1}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-cyan-400">Enable Animations</Label>
                  <Switch
                    checked={settings.animations}
                    onCheckedChange={(v) => updateSetting('animations', v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-cyan-400">Show Particle Field</Label>
                  <Switch
                    checked={settings.particles}
                    onCheckedChange={(v) => updateSetting('particles', v)}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-cyan-400">Email Notifications</Label>
                <p className="text-xs text-cyan-600 mt-1">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(v) => updateSetting('emailNotifications', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-cyan-400">Push Notifications</Label>
                <p className="text-xs text-cyan-600 mt-1">Browser push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(v) => updateSetting('pushNotifications', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-cyan-400">Sound Effects</Label>
                <p className="text-xs text-cyan-600 mt-1">Play notification sounds</p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(v) => updateSetting('soundEnabled', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-cyan-400">Desktop Notifications</Label>
                <p className="text-xs text-cyan-600 mt-1">Native OS notifications</p>
              </div>
              <Switch
                checked={settings.desktopNotifications}
                onCheckedChange={(v) => updateSetting('desktopNotifications', v)}
              />
            </div>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-cyan-400">Two-Factor Authentication</Label>
                <p className="text-xs text-cyan-600 mt-1">Add an extra layer of security</p>
              </div>
              <Switch
                checked={settings.twoFactor}
                onCheckedChange={(v) => updateSetting('twoFactor', v)}
              />
            </div>

            <div>
              <Label className="text-cyan-400 mb-3 block">
                Session Timeout: {settings.sessionTimeout} minutes
              </Label>
              <Slider
                value={[settings.sessionTimeout]}
                onValueChange={([v]) => updateSetting('sessionTimeout', v)}
                min={5}
                max={120}
                step={5}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-cyan-400">Auto Logout</Label>
                <p className="text-xs text-cyan-600 mt-1">Logout after inactivity</p>
              </div>
              <Switch
                checked={settings.autoLogout}
                onCheckedChange={(v) => updateSetting('autoLogout', v)}
              />
            </div>

            <div className="pt-4 border-t border-cyan-500/20">
              <Button className="w-full bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* System */}
        <TabsContent value="system">
          <div className="space-y-6">
            <div>
              <Label className="text-cyan-400 mb-2 block">Language</Label>
              <Select value={settings.language} onValueChange={(v) => updateSetting('language', v)}>
                <SelectTrigger className="bg-black/60 border-cyan-500/40 text-cyan-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-cyan-400 mb-2 block">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(v) => updateSetting('timezone', v)}>
                <SelectTrigger className="bg-black/60 border-cyan-500/40 text-cyan-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="PST">PST</SelectItem>
                  <SelectItem value="CST">CST</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-cyan-400">Auto Save</Label>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(v) => updateSetting('autoSave', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-cyan-400">Debug Mode</Label>
                <Switch
                  checked={settings.debugMode}
                  onCheckedChange={(v) => updateSetting('debugMode', v)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Themes */}
        <TabsContent value="themes">
          <ThemeSystem2 />
        </TabsContent>

        {/* Layout */}
        <TabsContent value="layout">
          <LayoutCustomizer />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

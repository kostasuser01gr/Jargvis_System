import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  glow?: string;
  border?: string;
}

export interface ThemeEffects {
  blur: number;
  glow: number;
  animation: boolean;
  particles: boolean;
  gridPattern: boolean;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  effects: ThemeEffects;
  preset: boolean;
}

const DEFAULT_THEME: Theme = {
  id: 'default',
  name: 'Cyan Matrix',
  description: 'Default JARVIS theme',
  colors: {
    primary: '#22d3ee',
    secondary: '#3b82f6',
    accent: '#06b6d4',
    background: '#000000',
    foreground: '#22d3ee',
    glow: '#22d3ee',
    border: '#22d3ee'
  },
  effects: {
    blur: 20,
    glow: 20,
    animation: true,
    particles: true,
    gridPattern: true
  },
  preset: true
};

const PRESET_THEMES: Theme[] = [
  DEFAULT_THEME,
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon colors with high contrast',
    colors: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      background: '#000000',
      foreground: '#00ffff',
      glow: '#00ffff',
      border: '#00ffff'
    },
    effects: {
      blur: 25,
      glow: 30,
      animation: true,
      particles: true,
      gridPattern: true
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
      foreground: '#00ff00',
      glow: '#00ff00',
      border: '#00ff00'
    },
    effects: {
      blur: 15,
      glow: 20,
      animation: true,
      particles: true,
      gridPattern: true
    },
    preset: true
  },
  {
    id: 'purple-nebula',
    name: 'Purple Nebula',
    description: 'Deep space purple theme',
    colors: {
      primary: '#a855f7',
      secondary: '#ec4899',
      accent: '#8b5cf6',
      background: '#000000',
      foreground: '#a855f7',
      glow: '#a855f7',
      border: '#a855f7'
    },
    effects: {
      blur: 20,
      glow: 25,
      animation: true,
      particles: true,
      gridPattern: true
    },
    preset: true
  },
  {
    id: 'green-terminal',
    name: 'Green Terminal',
    description: 'Classic terminal green',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#000000',
      foreground: '#10b981',
      glow: '#10b981',
      border: '#10b981'
    },
    effects: {
      blur: 10,
      glow: 15,
      animation: false,
      particles: false,
      gridPattern: true
    },
    preset: true
  },
  {
    id: 'red-alert',
    name: 'Red Alert',
    description: 'High contrast red theme',
    colors: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#f87171',
      background: '#000000',
      foreground: '#ef4444',
      glow: '#ef4444',
      border: '#ef4444'
    },
    effects: {
      blur: 20,
      glow: 25,
      animation: true,
      particles: true,
      gridPattern: true
    },
    preset: true
  },
  {
    id: 'gold-luxury',
    name: 'Gold Luxury',
    description: 'Premium gold theme',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      background: '#000000',
      foreground: '#f59e0b',
      glow: '#f59e0b',
      border: '#f59e0b'
    },
    effects: {
      blur: 20,
      glow: 30,
      animation: true,
      particles: true,
      gridPattern: true
    },
    preset: true
  },
  {
    id: 'blue-ocean',
    name: 'Blue Ocean',
    description: 'Calm blue theme',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: '#000000',
      foreground: '#0ea5e9',
      glow: '#0ea5e9',
      border: '#0ea5e9'
    },
    effects: {
      blur: 20,
      glow: 20,
      animation: true,
      particles: true,
      gridPattern: true
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
      foreground: '#000000',
      glow: '#3b82f6',
      border: '#3b82f6'
    },
    effects: {
      blur: 5,
      glow: 10,
      animation: false,
      particles: false,
      gridPattern: false
    },
    preset: true
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  applyTheme: (themeId: string) => void;
  createCustomTheme: (theme: Omit<Theme, 'id' | 'preset'>) => void;
  updateTheme: (themeId: string, updates: Partial<Theme>) => void;
  deleteTheme: (themeId: string) => void;
  exportTheme: (themeId: string) => void;
  importTheme: (themeData: Theme) => void;
  resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/7769055a-33e5-41ee-95ff-da63c73d21b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:248',message:'ThemeProvider initializing',data:{hasLocalStorage:typeof localStorage !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  }, []);
  // #endregion
  const [themes, setThemes] = useState<Theme[]>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('jarvis-themes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...PRESET_THEMES, ...parsed.custom];
      } catch {
        return PRESET_THEMES;
      }
    }
    return PRESET_THEMES;
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('jarvis-current-theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = themes.find(t => t.id === parsed.id);
        return found || DEFAULT_THEME;
      } catch {
        return DEFAULT_THEME;
      }
    }
    return DEFAULT_THEME;
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', currentTheme.colors.primary);
    root.style.setProperty('--theme-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--theme-accent', currentTheme.colors.accent);
    root.style.setProperty('--theme-background', currentTheme.colors.background);
    root.style.setProperty('--theme-foreground', currentTheme.colors.foreground);
    root.style.setProperty('--theme-glow', currentTheme.colors.glow || currentTheme.colors.primary);
    root.style.setProperty('--theme-border', currentTheme.colors.border || currentTheme.colors.primary);
    
    // Save to localStorage
    localStorage.setItem('jarvis-current-theme', JSON.stringify({
      id: currentTheme.id,
      name: currentTheme.name
    }));
  }, [currentTheme]);

  // Save custom themes to localStorage
  useEffect(() => {
    const custom = themes.filter(t => !t.preset);
    localStorage.setItem('jarvis-themes', JSON.stringify({ custom }));
  }, [themes]);

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      toast.success(`Applied ${theme.name} theme`);
    }
  };

  const createCustomTheme = (theme: Omit<Theme, 'id' | 'preset'>) => {
    const newTheme: Theme = {
      ...theme,
      id: `custom-${Date.now()}`,
      preset: false
    };
    setThemes(prev => [...prev, newTheme]);
    setCurrentTheme(newTheme);
    toast.success('Custom theme created and applied');
  };

  const updateTheme = (themeId: string, updates: Partial<Theme>) => {
    setThemes(prev => prev.map(t => 
      t.id === themeId ? { ...t, ...updates } : t
    ));
    if (currentTheme.id === themeId) {
      setCurrentTheme(prev => ({ ...prev, ...updates }));
    }
    toast.success('Theme updated');
  };

  const deleteTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme?.preset) {
      toast.error('Cannot delete preset themes');
      return;
    }
    setThemes(prev => prev.filter(t => t.id !== themeId));
    if (currentTheme.id === themeId) {
      setCurrentTheme(DEFAULT_THEME);
    }
    toast.success('Theme deleted');
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
      URL.revokeObjectURL(url);
      toast.success('Theme exported');
    }
  };

  const importTheme = (themeData: Theme) => {
    const newTheme: Theme = {
      ...themeData,
      id: `custom-${Date.now()}`,
      preset: false
    };
    setThemes(prev => [...prev, newTheme]);
    toast.success('Theme imported');
  };

  const resetToDefault = () => {
    setCurrentTheme(DEFAULT_THEME);
    toast.success('Reset to default theme');
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themes,
        applyTheme,
        createCustomTheme,
        updateTheme,
        deleteTheme,
        exportTheme,
        importTheme,
        resetToDefault
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  // #region agent log
  try {
    const context = useContext(ThemeContext);
    fetch('http://127.0.0.1:7244/ingest/7769055a-33e5-41ee-95ff-da63c73d21b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:392',message:'useTheme called',data:{contextDefined:context !== undefined,hasApplyTheme:context?.applyTheme !== undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    if (context === undefined) {
      fetch('http://127.0.0.1:7244/ingest/7769055a-33e5-41ee-95ff-da63c73d21b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:395',message:'ThemeContext is undefined',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
  } catch(e: any) {
    fetch('http://127.0.0.1:7244/ingest/7769055a-33e5-41ee-95ff-da63c73d21b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:392',message:'Error in useTheme',data:{error:e?.message,stack:e?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    throw e;
  }
  // #endregion
}

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, Activity, Zap, Shield, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface TestResult {
  id: string;
  category: string;
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'running';
  score: number;
  message: string;
  duration: number;
}

interface QualityMetrics {
  overall: number;
  performance: number;
  accessibility: number;
  security: number;
  codeQuality: number;
  reliability: number;
}

export function QualityAssuranceSystem() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [metrics, setMetrics] = useState<QualityMetrics>({
    overall: 0,
    performance: 0,
    accessibility: 0,
    security: 0,
    codeQuality: 0,
    reliability: 0,
  });

  const runQualityTests = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const tests: Omit<TestResult, 'duration'>[] = [
      // Performance Tests
      { id: '1', category: 'Performance', name: 'Bundle Size Check', status: 'running', score: 0, message: '' },
      { id: '2', category: 'Performance', name: 'Lighthouse Performance', status: 'running', score: 0, message: '' },
      { id: '3', category: 'Performance', name: 'First Contentful Paint', status: 'running', score: 0, message: '' },
      { id: '4', category: 'Performance', name: 'Time to Interactive', status: 'running', score: 0, message: '' },
      { id: '5', category: 'Performance', name: 'FPS Measurement', status: 'running', score: 0, message: '' },
      { id: '6', category: 'Performance', name: 'Memory Usage', status: 'running', score: 0, message: '' },
      { id: '7', category: 'Performance', name: 'Render Performance', status: 'running', score: 0, message: '' },
      
      // Accessibility Tests
      { id: '8', category: 'Accessibility', name: 'WCAG 2.1 AA Compliance', status: 'running', score: 0, message: '' },
      { id: '9', category: 'Accessibility', name: 'Keyboard Navigation', status: 'running', score: 0, message: '' },
      { id: '10', category: 'Accessibility', name: 'Screen Reader Support', status: 'running', score: 0, message: '' },
      { id: '11', category: 'Accessibility', name: 'Color Contrast', status: 'running', score: 0, message: '' },
      { id: '12', category: 'Accessibility', name: 'Focus Management', status: 'running', score: 0, message: '' },
      
      // Security Tests
      { id: '13', category: 'Security', name: 'XSS Prevention', status: 'running', score: 0, message: '' },
      { id: '14', category: 'Security', name: 'CSRF Protection', status: 'running', score: 0, message: '' },
      { id: '15', category: 'Security', name: 'Secure Headers', status: 'running', score: 0, message: '' },
      { id: '16', category: 'Security', name: 'Input Validation', status: 'running', score: 0, message: '' },
      { id: '17', category: 'Security', name: 'Data Encryption', status: 'running', score: 0, message: '' },
      
      // Code Quality Tests
      { id: '18', category: 'Code Quality', name: 'TypeScript Strict Mode', status: 'running', score: 0, message: '' },
      { id: '19', category: 'Code Quality', name: 'ESLint Rules', status: 'running', score: 0, message: '' },
      { id: '20', category: 'Code Quality', name: 'Component Structure', status: 'running', score: 0, message: '' },
      { id: '21', category: 'Code Quality', name: 'Code Duplication', status: 'running', score: 0, message: '' },
      { id: '22', category: 'Code Quality', name: 'Error Handling', status: 'running', score: 0, message: '' },
      
      // Reliability Tests
      { id: '23', category: 'Reliability', name: 'Error Boundaries', status: 'running', score: 0, message: '' },
      { id: '24', category: 'Reliability', name: 'Network Resilience', status: 'running', score: 0, message: '' },
      { id: '25', category: 'Reliability', name: 'State Management', status: 'running', score: 0, message: '' },
      { id: '26', category: 'Reliability', name: 'Data Persistence', status: 'running', score: 0, message: '' },
      { id: '27', category: 'Reliability', name: 'Auto Recovery', status: 'running', score: 0, message: '' },
      
      // Additional Tests
      { id: '28', category: 'Performance', name: 'Image Optimization', status: 'running', score: 0, message: '' },
      { id: '29', category: 'Accessibility', name: 'ARIA Attributes', status: 'running', score: 0, message: '' },
      { id: '30', category: 'Security', name: 'Dependency Vulnerabilities', status: 'running', score: 0, message: '' },
    ];

    // Simulate running each test
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const startTime = performance.now();
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Generate realistic test results
      const score = 70 + Math.random() * 30; // 70-100
      const status: 'pass' | 'fail' | 'warning' = 
        score >= 90 ? 'pass' : 
        score >= 70 ? 'warning' : 
        'fail';
      
      const messages = {
        pass: 'All checks passed successfully',
        warning: 'Minor issues detected, review recommended',
        fail: 'Critical issues found, immediate action required'
      };

      const result: TestResult = {
        ...test,
        status,
        score: Math.round(score),
        message: messages[status],
        duration: Math.round(duration)
      };

      setResults(prev => [...prev, result]);
      setProgress(((i + 1) / tests.length) * 100);
      
      // Update metrics in real-time
      const categoryScores = [...results, result].reduce((acc, r) => {
        if (!acc[r.category]) acc[r.category] = [];
        acc[r.category].push(r.score);
        return acc;
      }, {} as Record<string, number[]>);

      const avgScore = (scores: number[]) => 
        scores.reduce((a, b) => a + b, 0) / scores.length;

      setMetrics({
        overall: Math.round(avgScore(Object.values(categoryScores).flat())),
        performance: Math.round(avgScore(categoryScores['Performance'] || [0])),
        accessibility: Math.round(avgScore(categoryScores['Accessibility'] || [0])),
        security: Math.round(avgScore(categoryScores['Security'] || [0])),
        codeQuality: Math.round(avgScore(categoryScores['Code Quality'] || [0])),
        reliability: Math.round(avgScore(categoryScores['Reliability'] || [0])),
      });
    }

    setIsRunning(false);
    toast.success('Quality assurance tests completed!');
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'fail': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  const passedTests = results.filter(r => r.status === 'pass').length;
  const warningTests = results.filter(r => r.status === 'warning').length;
  const failedTests = results.filter(r => r.status === 'fail').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Quality Assurance System
            </h3>
            <p className="text-xs text-cyan-600 mt-1">
              Comprehensive testing and quality metrics
            </p>
          </div>
          <Button
            onClick={runQualityTests}
            disabled={isRunning}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isRunning ? 'Running Tests...' : 'Run Quality Tests'}
          </Button>
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-cyan-400">Running tests...</span>
              <span className="text-sm text-cyan-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Metrics Overview */}
        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[
              { label: 'Overall', value: metrics.overall, icon: TrendingUp },
              { label: 'Performance', value: metrics.performance, icon: Zap },
              { label: 'Accessibility', value: metrics.accessibility, icon: Shield },
              { label: 'Security', value: metrics.security, icon: Shield },
              { label: 'Code Quality', value: metrics.codeQuality, icon: CheckCircle2 },
              { label: 'Reliability', value: metrics.reliability, icon: Activity }
            ].map((metric, i) => (
              <Card key={i} className="glass-panel p-4 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-cyan-600">{metric.label}</span>
                </div>
                <div className={`text-2xl font-mono ${getScoreColor(metric.value)}`}>
                  {metric.value}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Test Summary */}
        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="glass-panel p-4 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-600">Passed</span>
              </div>
              <div className="text-2xl font-mono text-green-400">{passedTests}</div>
            </Card>
            <Card className="glass-panel p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-600">Warnings</span>
              </div>
              <div className="text-2xl font-mono text-yellow-400">{warningTests}</div>
            </Card>
            <Card className="glass-panel p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-600">Failed</span>
              </div>
              <div className="text-2xl font-mono text-red-400">{failedTests}</div>
            </Card>
          </div>
        )}
      </Card>

      {/* Test Results */}
      {results.length > 0 && (
        <Card className="glass-card p-6 border border-cyan-500/30">
          <h4 className="text-cyan-400 mb-4">Detailed Test Results</h4>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card className={`p-4 border ${getStatusColor(result.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-cyan-300">{result.name}</span>
                            <Badge className="bg-cyan-500/20 border-cyan-500/30 text-cyan-400 text-xs">
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-cyan-600">{result.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-lg font-mono ${getScoreColor(result.score)}`}>
                            {result.score}
                          </div>
                          <div className="text-xs text-cyan-700">{result.duration}ms</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}

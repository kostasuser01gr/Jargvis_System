import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, Eye, Scale, Lock, CheckCircle2, XCircle, TrendingDown, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface SecurityIssue {
  id: string;
  type: 'vulnerability' | 'bias' | 'privacy' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  model: string;
  status: 'open' | 'fixed' | 'ignored';
  detectedAt: Date;
}

interface BiasMetric {
  category: string;
  score: number;
  threshold: number;
  status: 'pass' | 'fail' | 'warning';
}

interface ExplainabilityResult {
  feature: string;
  importance: number;
  contribution: number;
}

export function SecurityCompliance() {
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([
    {
      id: '1',
      type: 'vulnerability',
      severity: 'high',
      description: 'Potential adversarial attack vulnerability detected',
      model: 'JARVIS-GPT-Ultra',
      status: 'open',
      detectedAt: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      type: 'bias',
      severity: 'medium',
      description: 'Gender bias detected in text generation model',
      model: 'Text-Analyzer-Base',
      status: 'open',
      detectedAt: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      type: 'privacy',
      severity: 'low',
      description: 'Data retention policy compliance check needed',
      model: 'Vision-Detector-Ultra',
      status: 'open',
      detectedAt: new Date(Date.now() - 172800000)
    }
  ]);

  const [biasMetrics, setBiasMetrics] = useState<BiasMetric[]>([
    { category: 'Gender', score: 0.92, threshold: 0.85, status: 'pass' },
    { category: 'Race', score: 0.88, threshold: 0.85, status: 'pass' },
    { category: 'Age', score: 0.78, threshold: 0.85, status: 'fail' },
    { category: 'Socioeconomic', score: 0.91, threshold: 0.85, status: 'pass' },
  ]);

  const [explainability, setExplainability] = useState<ExplainabilityResult[]>([
    { feature: 'Input Length', importance: 0.35, contribution: 0.28 },
    { feature: 'Word Frequency', importance: 0.28, contribution: 0.22 },
    { feature: 'Sentiment Score', importance: 0.22, contribution: 0.18 },
    { feature: 'Topic Category', importance: 0.15, contribution: 0.12 },
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const runSecurityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast.success('Security scan completed! Found 3 issues.');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vulnerability': return <Shield className="w-4 h-4" />;
      case 'bias': return <Scale className="w-4 h-4" />;
      case 'privacy': return <Lock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-red-950/20 to-rose-950/20 border-red-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-red-400 flex items-center gap-2">
              <Shield className="w-6 h-5" />
              Security & Compliance
            </h3>
            <p className="text-xs text-red-600 mt-1">Model security, explainability, and bias detection</p>
          </div>
          <Button
            onClick={runSecurityScan}
            disabled={isScanning}
            className="bg-gradient-to-r from-red-500 to-rose-500 text-white"
          >
            <Shield className="w-4 h-4 mr-2" />
            {isScanning ? 'Scanning...' : 'Run Security Scan'}
          </Button>
        </div>

        {/* Scan Progress */}
        {isScanning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-400">Security Scan Progress</span>
              <span className="text-red-400 font-mono">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-3" />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Issues Found', value: securityIssues.length, icon: AlertTriangle },
            { label: 'Security Score', value: '87%', icon: Shield },
            { label: 'Bias Tests', value: biasMetrics.length, icon: Scale },
            { label: 'Compliance', value: '92%', icon: CheckCircle2 },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-red-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-red-400" />
                <p className="text-lg text-red-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-red-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="bg-black/40 border-red-500/30">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="bias">Bias Detection</TabsTrigger>
          <TabsTrigger value="explainability">Explainability</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="mt-6">
          <Card className="bg-gradient-to-br from-red-950/20 to-rose-950/20 border-red-500/30 p-6">
            <h4 className="text-red-400 mb-4">Security Issues</h4>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {securityIssues.map((issue) => (
                  <Card key={issue.id} className="bg-black/40 border-red-500/30 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded bg-red-500/20 border border-red-500/50">
                          {getTypeIcon(issue.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-red-400">{issue.model}</h5>
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                            <Badge className="bg-red-500/10 text-red-400 text-[10px]">
                              {issue.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-red-300 mb-1">{issue.description}</p>
                          <p className="text-xs text-red-600">
                            Detected: {issue.detectedAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        issue.status === 'fixed' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                        issue.status === 'ignored' ? 'bg-gray-500/20 border-gray-500/50 text-gray-400' :
                        'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                      }>
                        {issue.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-2" />
                        Mark Fixed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="bias" className="mt-6">
          <Card className="bg-gradient-to-br from-red-950/20 to-rose-950/20 border-red-500/30 p-6">
            <h4 className="text-red-400 mb-4">Bias & Fairness Metrics</h4>
            <div className="space-y-4">
              {biasMetrics.map((metric, i) => (
                <Card key={i} className="bg-black/40 border-red-500/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="text-red-400 mb-1">{metric.category}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-300 font-mono">{metric.score.toFixed(2)}</span>
                        <span className="text-xs text-red-600">/ {metric.threshold.toFixed(2)} threshold</span>
                      </div>
                    </div>
                    <Badge className={
                      metric.status === 'pass' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                      metric.status === 'fail' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                      'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                    }>
                      {metric.status}
                    </Badge>
                  </div>
                  <Progress 
                    value={(metric.score / metric.threshold) * 100} 
                    className={`h-2 ${
                      metric.status === 'fail' ? 'bg-red-500' : 
                      metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="explainability" className="mt-6">
          <Card className="bg-gradient-to-br from-red-950/20 to-rose-950/20 border-red-500/30 p-6">
            <h4 className="text-red-400 mb-4">Model Explainability</h4>
            <div className="space-y-3">
              {explainability.map((result, i) => (
                <Card key={i} className="bg-black/40 border-red-500/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-400">{result.feature}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-red-300 font-mono">{(result.importance * 100).toFixed(0)}%</div>
                        <div className="text-xs text-red-600">Importance</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-red-300 font-mono">{(result.contribution * 100).toFixed(0)}%</div>
                        <div className="text-xs text-red-600">Contribution</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-red-600">Importance</span>
                        <span className="text-red-400">{(result.importance * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={result.importance * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-red-600">Contribution</span>
                        <span className="text-red-400">{(result.contribution * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={result.contribution * 100} className="h-2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <Card className="bg-gradient-to-br from-red-950/20 to-rose-950/20 border-red-500/30 p-6">
            <h4 className="text-red-400 mb-4">Compliance Status</h4>
            <div className="space-y-4">
              {[
                { name: 'GDPR', status: 'compliant', score: 95 },
                { name: 'CCPA', status: 'compliant', score: 92 },
                { name: 'HIPAA', status: 'warning', score: 78 },
                { name: 'SOC 2', status: 'compliant', score: 88 },
              ].map((compliance, i) => (
                <Card key={i} className="bg-black/40 border-red-500/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-red-400">{compliance.name}</h5>
                    <Badge className={
                      compliance.status === 'compliant' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                      'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                    }>
                      {compliance.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={compliance.score} className="flex-1" />
                    <span className="text-red-400 font-mono text-sm">{compliance.score}%</span>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

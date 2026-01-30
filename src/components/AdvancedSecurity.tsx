import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Search, Lock, Unlock, Eye, FileText, Zap, Network, Database } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface Vulnerability {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  cve?: string;
  status: 'open' | 'fixed' | 'ignored';
  discoveredAt: Date;
  fixedAt?: Date;
}

interface SecurityScan {
  id: string;
  type: 'penetration' | 'vulnerability' | 'dependency' | 'code';
  status: 'running' | 'completed' | 'failed';
  progress: number;
  findings: number;
  startedAt: Date;
  completedAt?: Date;
}

export function AdvancedSecurity() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([
    {
      id: 'vuln-1',
      title: 'SQL Injection in User Input',
      severity: 'critical',
      category: 'Injection',
      description: 'User input is not properly sanitized before database queries',
      cve: 'CVE-2024-1234',
      status: 'open',
      discoveredAt: new Date(Date.now() - 3600000)
    },
    {
      id: 'vuln-2',
      title: 'XSS in Comment Section',
      severity: 'high',
      category: 'XSS',
      description: 'Cross-site scripting vulnerability in user comments',
      status: 'open',
      discoveredAt: new Date(Date.now() - 7200000)
    },
    {
      id: 'vuln-3',
      title: 'Weak Password Policy',
      severity: 'medium',
      category: 'Authentication',
      description: 'Password requirements are too lenient',
      status: 'fixed',
      discoveredAt: new Date(Date.now() - 86400000),
      fixedAt: new Date(Date.now() - 3600000)
    }
  ]);

  const [scans, setScans] = useState<SecurityScan[]>([
    {
      id: 'scan-1',
      type: 'vulnerability',
      status: 'completed',
      progress: 100,
      findings: 3,
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(Date.now() - 1800000)
    },
    {
      id: 'scan-2',
      type: 'penetration',
      status: 'running',
      progress: 65,
      findings: 1,
      startedAt: new Date(Date.now() - 1800000)
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);

  const startScan = (type: SecurityScan['type']) => {
    setIsScanning(true);
    const newScan: SecurityScan = {
      id: `scan-${Date.now()}`,
      type,
      status: 'running',
      progress: 0,
      findings: 0,
      startedAt: new Date()
    };
    setScans([newScan, ...scans]);
    toast.info(`${type} scan started...`);

    // Simulate scan progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScans(prev => prev.map(s =>
        s.id === newScan.id ? { ...s, progress: Math.min(100, progress) } : s
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScans(prev => prev.map(s =>
          s.id === newScan.id ? { ...s, status: 'completed' as const, completedAt: new Date(), findings: Math.floor(Math.random() * 5) } : s
        ));
        toast.success(`${type} scan completed!`);
      }
    }, 500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  const securityScore = 100 - (vulnerabilities.filter(v => v.status === 'open').length * 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-red-950/20 to-rose-950/20 border-red-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-red-400 flex items-center gap-2">
              <Shield className="w-6 h-5" />
              Advanced Security & Penetration Testing
            </h3>
            <p className="text-xs text-red-600 mt-1">Vulnerability scanning, penetration testing, and security analysis</p>
          </div>
        </div>

        {/* Security Score */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Security Score', value: `${securityScore}/100`, icon: Shield, color: securityScore >= 80 ? 'text-green-400' : securityScore >= 60 ? 'text-yellow-400' : 'text-red-400' },
            { label: 'Open Vulnerabilities', value: vulnerabilities.filter(v => v.status === 'open').length, icon: AlertTriangle },
            { label: 'Fixed Issues', value: vulnerabilities.filter(v => v.status === 'fixed').length, icon: CheckCircle2 },
            { label: 'Active Scans', value: scans.filter(s => s.status === 'running').length, icon: Zap },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-red-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color || 'text-red-400'}`} />
                <p className={`text-lg font-mono ${stat.color || 'text-red-400'}`}>{stat.value}</p>
              </div>
              <p className="text-xs text-red-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="vulnerabilities" className="w-full">
        <TabsList className="bg-black/40 border-red-500/30">
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="scans">Security Scans</TabsTrigger>
          <TabsTrigger value="penetration">Penetration Testing</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="vulnerabilities" className="mt-6">
          <Card className="bg-gradient-to-br from-red-950/20 to-rose-950/20 border-red-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-red-400">Vulnerability Report</h4>
              <Button
                onClick={() => startScan('vulnerability')}
                disabled={isScanning}
                className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
              >
                <Search className="w-4 h-4 mr-2" />
                Run Scan
              </Button>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {vulnerabilities.map((vuln) => (
                  <Card key={vuln.id} className="bg-black/40 border-red-500/30 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="text-red-400 mb-1">{vuln.title}</h5>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(vuln.severity)}>
                            {vuln.severity}
                          </Badge>
                          <Badge className="bg-red-500/10 text-red-400 text-[10px]">
                            {vuln.category}
                          </Badge>
                          {vuln.cve && (
                            <Badge className="bg-red-500/10 text-red-400 text-[10px] font-mono">
                              {vuln.cve}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-red-300 mb-2">{vuln.description}</p>
                        <div className="text-xs text-red-600">
                          Discovered: {vuln.discoveredAt.toLocaleString()}
                          {vuln.fixedAt && ` • Fixed: ${vuln.fixedAt.toLocaleString()}`}
                        </div>
                      </div>
                      <Badge className={
                        vuln.status === 'fixed' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                        vuln.status === 'ignored' ? 'bg-gray-500/20 border-gray-500/50 text-gray-400' :
                        'bg-red-500/20 border-red-500/50 text-red-400'
                      }>
                        {vuln.status}
                      </Badge>
                    </div>
                    {vuln.status === 'open' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
                          onClick={() => {
                            setVulnerabilities(prev => prev.map(v =>
                              v.id === vuln.id ? { ...v, status: 'fixed' as const, fixedAt: new Date() } : v
                            ));
                            toast.success('Vulnerability marked as fixed');
                          }}
                        >
                          Mark Fixed
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          View Details
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="scans" className="mt-6">
          <Card className="bg-gradient-to-br from-red-950/20 to-rose-950/20 border-red-500/30 p-6">
            <h4 className="text-red-400 mb-4">Security Scans</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {['vulnerability', 'penetration', 'dependency', 'code'].map((type) => (
                <Button
                  key={type}
                  onClick={() => startScan(type as SecurityScan['type'])}
                  disabled={isScanning}
                  className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {type.charAt(0).toUpperCase() + type.slice(1)} Scan
                </Button>
              ))}
            </div>
            <div className="space-y-3">
              {scans.map((scan) => (
                <Card key={scan.id} className="bg-black/40 border-red-500/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="text-red-400 mb-1">
                        {scan.type.charAt(0).toUpperCase() + scan.type.slice(1)} Scan
                      </h5>
                      <div className="text-xs text-red-600">
                        Started: {scan.startedAt.toLocaleString()}
                        {scan.completedAt && ` • Completed: ${scan.completedAt.toLocaleString()}`}
                      </div>
                    </div>
                    <Badge className={
                      scan.status === 'completed' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                      scan.status === 'running' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                      'bg-red-500/20 border-red-500/50 text-red-400'
                    }>
                      {scan.status}
                    </Badge>
                  </div>
                  {scan.status === 'running' && (
                    <div className="mt-2">
                      <Progress value={scan.progress} className="h-2" />
                      <div className="text-xs text-red-600 mt-1">{scan.progress}%</div>
                    </div>
                  )}
                  {scan.status === 'completed' && (
                    <div className="text-sm text-red-400 mt-2">
                      Findings: {scan.findings}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="penetration" className="mt-6">
          <Card className="bg-gradient-to-br from-red-950/20 to-rose-950/20 border-red-500/30 p-6">
            <h4 className="text-red-400 mb-4">Penetration Testing</h4>
            <div className="space-y-4">
              {[
                { name: 'SQL Injection', status: 'tested', result: 'vulnerable' },
                { name: 'XSS', status: 'tested', result: 'vulnerable' },
                { name: 'CSRF', status: 'tested', result: 'protected' },
                { name: 'Authentication Bypass', status: 'testing', result: 'pending' },
              ].map((test, i) => (
                <Card key={i} className="bg-black/40 border-red-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-red-400 mb-1">{test.name}</h5>
                      <div className="text-xs text-red-600">Status: {test.status}</div>
                    </div>
                    <Badge className={
                      test.result === 'protected' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                      test.result === 'vulnerable' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                      'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                    }>
                      {test.result}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="dependencies" className="mt-6">
          <Card className="bg-gradient-to-br from-red-950/20 to-rose-950/20 border-red-500/30 p-6">
            <h4 className="text-red-400 mb-4">Dependency Security</h4>
            <div className="space-y-3">
              {[
                { name: 'react@18.3.1', vulnerabilities: 0, status: 'safe' },
                { name: 'lodash@4.17.21', vulnerabilities: 2, status: 'warning' },
                { name: 'axios@1.6.0', vulnerabilities: 0, status: 'safe' },
              ].map((dep, i) => (
                <Card key={i} className="bg-black/40 border-red-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-red-400 font-mono">{dep.name}</div>
                      <div className="text-xs text-red-600">
                        {dep.vulnerabilities} known vulnerabilities
                      </div>
                    </div>
                    <Badge className={
                      dep.status === 'safe' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                      'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                    }>
                      {dep.status}
                    </Badge>
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

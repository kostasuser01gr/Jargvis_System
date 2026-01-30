import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Key, Lock, Unlock, Zap, Network, Eye, EyeOff, RefreshCw, Download, Upload } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface QuantumKey {
  id: string;
  length: number;
  entropy: number;
  generatedAt: Date;
  used: boolean;
}

interface QKDSession {
  id: string;
  status: 'establishing' | 'active' | 'error';
  keyLength: number;
  errorRate: number;
  distance: number; // km
  startTime: Date;
}

export function QuantumCryptography() {
  const [quantumKeys, setQuantumKeys] = useState<QuantumKey[]>([]);
  const [qkdSessions, setQkdSessions] = useState<QKDSession[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [keyLength, setKeyLength] = useState(256);
  const [entropy, setEntropy] = useState(0);
  const [isQKDActive, setIsQKDActive] = useState(false);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            setIsGenerating(false);
            generateKey();
            return 0;
          }
          return prev + 2;
        });
        setEntropy(prev => Math.min(100, prev + Math.random() * 5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const generateKey = () => {
    const newKey: QuantumKey = {
      id: `key-${Date.now()}`,
      length: keyLength,
      entropy: 100,
      generatedAt: new Date(),
      used: false
    };
    setQuantumKeys([newKey, ...quantumKeys]);
    toast.success(`Generated ${keyLength}-bit quantum key`);
  };

  const startQKD = () => {
    const session: QKDSession = {
      id: `qkd-${Date.now()}`,
      status: 'establishing',
      keyLength: 256,
      errorRate: 0.5,
      distance: 50,
      startTime: new Date()
    };
    setQkdSessions([session, ...qkdSessions]);
    setIsQKDActive(true);
    toast.info('QKD session establishing...');

    setTimeout(() => {
      setQkdSessions(prev => prev.map(s =>
        s.id === session.id ? { ...s, status: 'active' as const, errorRate: 0.1 } : s
      ));
      toast.success('QKD session established!');
    }, 3000);
  };

  const generateRandomNumber = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setEntropy(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-green-400 flex items-center gap-2">
              <Shield className="w-6 h-5" />
              Quantum Cryptography
            </h3>
            <p className="text-xs text-green-600 mt-1">Quantum Key Distribution, Quantum RNG, and Post-Quantum Security</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Keys Generated', value: quantumKeys.length, icon: Key },
            { label: 'QKD Sessions', value: qkdSessions.filter(s => s.status === 'active').length, icon: Network },
            { label: 'Entropy', value: `${entropy.toFixed(1)}%`, icon: Zap },
            { label: 'Security Level', value: 'Post-Quantum', icon: Shield },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-green-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-green-400" />
                <p className="text-lg text-green-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-green-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="qkd" className="w-full">
        <TabsList className="bg-black/40 border-green-500/30">
          <TabsTrigger value="qkd">QKD</TabsTrigger>
          <TabsTrigger value="rng">Quantum RNG</TabsTrigger>
          <TabsTrigger value="post-quantum">Post-Quantum</TabsTrigger>
          <TabsTrigger value="keys">Key Management</TabsTrigger>
        </TabsList>

        <TabsContent value="qkd" className="mt-6">
          <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-green-400">Quantum Key Distribution</h4>
              <Button
                onClick={startQKD}
                disabled={isQKDActive}
                className="bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
              >
                <Network className="w-4 h-4 mr-2" />
                Start QKD Session
              </Button>
            </div>

            <div className="space-y-4">
              {qkdSessions.map((session) => (
                <Card key={session.id} className="bg-black/40 border-green-500/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="text-green-400 mb-1">QKD Session {session.id.slice(-6)}</h5>
                      <Badge className={
                        session.status === 'active' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                        session.status === 'establishing' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                        'bg-red-500/20 border-red-500/50 text-red-400'
                      }>
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-green-600">Key Length:</span>
                      <div className="text-green-400 font-mono">{session.keyLength} bits</div>
                    </div>
                    <div>
                      <span className="text-green-600">Error Rate:</span>
                      <div className="text-green-400 font-mono">{session.errorRate.toFixed(2)}%</div>
                    </div>
                    <div>
                      <span className="text-green-600">Distance:</span>
                      <div className="text-green-400 font-mono">{session.distance} km</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rng" className="mt-6">
          <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30 p-6">
            <h4 className="text-green-400 mb-4">Quantum Random Number Generator</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-green-600 mb-2 block">Key Length: {keyLength} bits</label>
                <input
                  type="range"
                  min="128"
                  max="4096"
                  step="128"
                  value={keyLength}
                  onChange={(e) => setKeyLength(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-green-600 mt-1">
                  <span>128</span>
                  <span>2048</span>
                  <span>4096</span>
                </div>
              </div>

              {isGenerating && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-400">Generating...</span>
                    <span className="text-sm text-green-400">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <div className="mt-2 text-xs text-green-600">
                    Entropy: {entropy.toFixed(1)}%
                  </div>
                </div>
              )}

              <Button
                onClick={generateRandomNumber}
                disabled={isGenerating}
                className="w-full bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Generate Quantum Random Number
              </Button>

              {quantumKeys.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-green-400 mb-2">Generated Keys</h5>
                  <div className="space-y-2">
                    {quantumKeys.slice(0, 5).map((key) => (
                      <div key={key.id} className="p-3 bg-black/40 rounded border border-green-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-green-400 font-mono">{key.id}</div>
                            <div className="text-xs text-green-600">
                              {key.length} bits • {key.entropy.toFixed(1)}% entropy
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-green-500/30 text-green-400">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-green-500/30 text-green-400">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="post-quantum" className="mt-6">
          <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30 p-6">
            <h4 className="text-green-400 mb-4">Post-Quantum Cryptography</h4>
            <div className="space-y-4">
              {[
                { name: 'CRYSTALS-Kyber', type: 'Key Encapsulation', security: 'High', status: 'Recommended' },
                { name: 'CRYSTALS-Dilithium', type: 'Digital Signature', security: 'High', status: 'Recommended' },
                { name: 'FALCON', type: 'Digital Signature', security: 'High', status: 'Alternative' },
                { name: 'SPHINCS+', type: 'Hash-based Signature', security: 'Very High', status: 'Alternative' },
              ].map((algo, i) => (
                <Card key={i} className="bg-black/40 border-green-500/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="text-green-400 mb-1">{algo.name}</h5>
                      <p className="text-xs text-green-600">{algo.type}</p>
                    </div>
                    <Badge className={
                      algo.status === 'Recommended' 
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                    }>
                      {algo.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-green-600">
                    Security Level: <span className="text-green-400">{algo.security}</span>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="mt-6">
          <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30 p-6">
            <h4 className="text-green-400 mb-4">Key Management</h4>
            <div className="space-y-3">
              {quantumKeys.map((key) => (
                <Card key={key.id} className="bg-black/40 border-green-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-green-400 font-mono mb-1">{key.id}</div>
                      <div className="text-xs text-green-600 space-y-1">
                        <div>Length: {key.length} bits</div>
                        <div>Entropy: {key.entropy.toFixed(1)}%</div>
                        <div>Generated: {key.generatedAt.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={key.used ? 'bg-gray-500/20 text-gray-400' : 'bg-green-500/20 text-green-400'}>
                        {key.used ? 'Used' : 'Available'}
                      </Badge>
                      <Button size="sm" variant="outline" className="border-green-500/30 text-green-400">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
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

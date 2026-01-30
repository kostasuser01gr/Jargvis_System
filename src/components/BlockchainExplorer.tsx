import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Blocks, TrendingUp, Shield, Activity, Hash, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface Block {
  id: number;
  hash: string;
  previousHash: string;
  timestamp: Date;
  transactions: number;
  validator: string;
  size: number;
}

export function BlockchainExplorer() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [latestBlock, setLatestBlock] = useState(12847);

  useEffect(() => {
    // Initialize blocks
    const initialBlocks: Block[] = Array.from({ length: 10 }, (_, i) => ({
      id: 12847 - i,
      hash: `0x${Math.random().toString(16).substring(2, 18)}...`,
      previousHash: `0x${Math.random().toString(16).substring(2, 18)}...`,
      timestamp: new Date(Date.now() - i * 15000),
      transactions: Math.floor(Math.random() * 200) + 50,
      validator: `Node-${Math.floor(Math.random() * 100)}`,
      size: Math.floor(Math.random() * 500) + 100
    }));
    setBlocks(initialBlocks);

    // Simulate new blocks
    const interval = setInterval(() => {
      setLatestBlock(prev => prev + 1);
      setBlocks(prev => {
        const newBlock: Block = {
          id: latestBlock + 1,
          hash: `0x${Math.random().toString(16).substring(2, 18)}...`,
          previousHash: prev[0]?.hash || `0x${Math.random().toString(16).substring(2, 18)}...`,
          timestamp: new Date(),
          transactions: Math.floor(Math.random() * 200) + 50,
          validator: `Node-${Math.floor(Math.random() * 100)}`,
          size: Math.floor(Math.random() * 500) + 100
        };
        return [newBlock, ...prev.slice(0, 9)];
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [latestBlock]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Latest Block', value: latestBlock.toLocaleString(), icon: Blocks, color: 'cyan' },
          { label: 'TPS', value: '2,847', icon: Activity, color: 'green' },
          { label: 'Validators', value: '147', icon: Shield, color: 'blue' },
          { label: 'Gas Price', value: '23 Gwei', icon: TrendingUp, color: 'purple' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-4">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                <span className="text-xs text-cyan-600">{stat.label}</span>
              </div>
              <div className={`text-2xl text-${stat.color}-400 font-mono`}>{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Blockchain */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <Blocks className="w-5 h-5" />
              Live Blockchain
            </h3>
            <p className="text-xs text-cyan-600 mt-1">Real-time block production</p>
          </div>
          <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            Live
          </Badge>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                      <Blocks className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-cyan-400">Block #{block.id}</span>
                        {index === 0 && (
                          <Badge className="bg-green-500/20 border-green-500/50 text-green-400 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-cyan-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {block.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-mono text-sm">{block.transactions}</div>
                    <div className="text-xs text-cyan-600">TXs</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-cyan-600 mb-1 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      Hash
                    </div>
                    <div className="text-cyan-400 font-mono">{block.hash}</div>
                  </div>
                  <div>
                    <div className="text-cyan-600 mb-1">Validator</div>
                    <div className="text-cyan-400 font-mono">{block.validator}</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs">
                  <span className="text-cyan-600">Size: {block.size} KB</span>
                  <span className="text-green-400">✓ Verified</span>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

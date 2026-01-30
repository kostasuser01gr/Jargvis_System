import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Mic, Image as ImageIcon, Code, Sparkles, Zap, Brain, Cpu } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';
import { ArcReactor } from './ArcReactor';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'code' | 'analysis';
  metadata?: {
    model?: string;
    confidence?: number;
    processingTime?: number;
  };
}

const AI_PERSONALITIES = {
  technical: {
    name: 'Technical Assistant',
    icon: Code,
    systemPrompt: 'I am JARVIS, a technical AI assistant specialized in software engineering, system architecture, and advanced computing.'
  },
  creative: {
    name: 'Creative Advisor',
    icon: Sparkles,
    systemPrompt: 'I am JARVIS, your creative AI companion for innovative thinking, design, and problem-solving.'
  },
  analytical: {
    name: 'Data Analyst',
    icon: Brain,
    systemPrompt: 'I am JARVIS, an analytical AI focused on data interpretation, predictions, and insights.'
  },
  quantum: {
    name: 'Quantum Processor',
    icon: Cpu,
    systemPrompt: 'I am JARVIS, leveraging quantum computing for complex calculations and optimizations.'
  }
};

const ADVANCED_RESPONSES = [
  "Based on my neural network analysis, I've identified several optimization opportunities in your query. Let me break this down into actionable insights...",
  "Processing your request through quantum algorithms... I've computed multiple solution paths. Here's the optimal approach based on 97.4% confidence...",
  "Interesting query, Sir. Cross-referencing with my knowledge base across 247 million parameters. The most effective solution involves...",
  "I've analyzed your request using deep learning models. The data suggests a multi-layered approach would yield the best results...",
  "Running predictive analytics on your query... My recommendation incorporates both classical and quantum computing methodologies...",
  "Accessing distributed computing resources... I've synthesized information from multiple domains to provide you with this comprehensive answer...",
  "Your question requires advanced reasoning. I've engaged my transformer-based architecture to provide contextually aware insights...",
  "Processing through my language model with 128 attention layers... Here's a nuanced response tailored to your specific needs..."
];

export function AdvancedAIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Good evening, Sir. JARVIS Ultimate AI is online. I\'m equipped with advanced natural language processing, quantum computing capabilities, and real-time learning. How may I assist you today?',
      timestamp: new Date(),
      metadata: {
        model: 'JARVIS-GPT-4-Quantum',
        confidence: 1.0,
        processingTime: 0
      }
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [personality, setPersonality] = useState<keyof typeof AI_PERSONALITIES>('technical');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (userQuery: string): string => {
    // Keyword-based intelligent responses
    const query = userQuery.toLowerCase();
    
    if (query.includes('deploy') || query.includes('deployment')) {
      return "Deployment protocol initiated. I recommend using our edge network for optimal performance. I can configure automatic deployments with CI/CD integration, set up staging environments, and implement blue-green deployment strategies. Would you like me to proceed with the deployment configuration?";
    }
    
    if (query.includes('code') || query.includes('programming')) {
      return "I'll assist with your coding needs. I can generate code in multiple languages including TypeScript, Python, Rust, and Go. I utilize best practices, design patterns, and can optimize for performance, security, and maintainability. What specific coding task would you like me to help with?";
    }
    
    if (query.includes('database') || query.includes('sql')) {
      return "Database management is one of my core competencies. I can help you design schemas, write optimized queries, set up indexes, and manage migrations. I support SQL (PostgreSQL, MySQL) and NoSQL (MongoDB, Redis) databases. I can also assist with ORMs like Prisma and TypeORM. What database operation do you need?";
    }
    
    if (query.includes('security') || query.includes('threat')) {
      return "Security analysis initiated. I'm running comprehensive scans across all attack vectors including XSS, CSRF, SQL injection, and zero-day vulnerabilities. I recommend implementing multi-factor authentication, encryption at rest and in transit, and regular security audits. Current threat level: LOW. All systems are secure.";
    }
    
    if (query.includes('optimize') || query.includes('performance')) {
      return "Performance optimization analysis complete. I've identified several areas for improvement: 1) Implement lazy loading for components, 2) Enable code splitting, 3) Optimize bundle size with tree shaking, 4) Use service workers for caching, 5) Implement CDN for static assets. Estimated performance gain: 40-60%.";
    }
    
    if (query.includes('ai') || query.includes('machine learning')) {
      return "Machine Learning operations are my specialty. I can help you build neural networks, train models, perform data preprocessing, and deploy ML pipelines. I utilize TensorFlow, PyTorch, and custom quantum algorithms. Current capabilities include NLP, computer vision, predictive analytics, and reinforcement learning.";
    }
    
    // Return random advanced response
    return ADVANCED_RESPONSES[Math.floor(Math.random() * ADVANCED_RESPONSES.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const startTime = Date.now();

    // Simulate AI processing
    setTimeout(() => {
      const response = generateResponse(input);
      const processingTime = Date.now() - startTime;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: {
          model: `JARVIS-${personality.toUpperCase()}-v3`,
          confidence: 0.92 + Math.random() * 0.08,
          processingTime
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const currentPersonality = AI_PERSONALITIES[personality];
  const PersonalityIcon = currentPersonality.icon;

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-cyan-500/30 p-4 bg-gradient-to-r from-black/60 to-cyan-950/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <ArcReactor size={48} animated />
            </motion.div>
            <div>
              <h3 className="text-cyan-400 flex items-center gap-2">
                <Bot className="w-5 h-5" />
                JARVIS AI CHATBOT
              </h3>
              <p className="text-xs text-cyan-600">Neural Language Model v3.14.159</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
              <Zap className="w-3 h-3 mr-1 animate-pulse" />
              Active
            </Badge>
          </div>
        </div>

        {/* Personality Selector */}
        <div className="flex gap-2">
          {Object.entries(AI_PERSONALITIES).map(([key, value]) => {
            const Icon = value.icon;
            return (
              <Button
                key={key}
                size="sm"
                variant="outline"
                onClick={() => setPersonality(key as keyof typeof AI_PERSONALITIES)}
                className={`${
                  personality === key
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'border-cyan-500/30 text-cyan-600 hover:text-cyan-400'
                } transition-all`}
              >
                <Icon className="w-3 h-3 mr-1" />
                <span className="text-xs">{value.name.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {message.role === 'assistant' ? (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ArcReactor size={40} animated />
                  </motion.div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-2 border-cyan-400 shadow-lg shadow-cyan-500/50">
                    <span className="text-white">U</span>
                  </div>
                )}

                {/* Message Content */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`max-w-[75%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50'
                      : 'bg-gradient-to-br from-blue-950/40 to-cyan-950/20 border-cyan-500/30'
                  } border rounded-2xl p-4 backdrop-blur-sm relative group`}
                >
                  {message.role === 'assistant' && message.metadata && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-cyan-500/20">
                      <PersonalityIcon className="w-3 h-3 text-cyan-500" />
                      <span className="text-xs text-cyan-500 font-mono">{message.metadata.model}</span>
                    </div>
                  )}

                  <p className="text-cyan-100 text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-cyan-500/20">
                    <span className="text-xs text-cyan-600 font-mono">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.metadata && (
                      <div className="flex items-center gap-3 text-xs text-cyan-600">
                        {message.metadata.confidence && (
                          <span>Confidence: {(message.metadata.confidence * 100).toFixed(1)}%</span>
                        )}
                        {message.metadata.processingTime !== undefined && (
                          <span>{message.metadata.processingTime}ms</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-500 pointer-events-none" />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <ArcReactor size={40} animated />
              <div className="bg-gradient-to-br from-blue-950/40 to-cyan-950/20 border border-cyan-500/30 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{
                          y: [0, -12, 0],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-cyan-400">Processing your query...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-cyan-500/30 p-4 bg-gradient-to-r from-black/60 to-cyan-950/10">
        <div className="flex gap-3 mb-3">
          <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-600 hover:text-cyan-400">
            <Mic className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask JARVIS anything..."
              className="bg-black/60 border-cyan-500/40 text-cyan-100 placeholder:text-cyan-800 pr-12"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-4 bg-cyan-400/50 rounded-full"
                  animate={{
                    height: [16, 8, 16],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
          <Button
            onClick={handleSend}
            disabled={isTyping}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 shadow-lg shadow-cyan-500/30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs text-cyan-700">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI-powered responses
          </span>
          <span>•</span>
          <span>Quantum processing enabled</span>
          <span>•</span>
          <span>Real-time learning active</span>
        </div>
      </div>
    </Card>
  );
}

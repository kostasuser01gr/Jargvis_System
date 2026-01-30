import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Send, Mic, MicOff, Sparkles, Zap, Brain, Volume2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArcReactor } from './ArcReactor';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'jarvis';
  timestamp: Date;
  type?: 'command' | 'query' | 'response' | 'alert';
  confidence?: number;
}

export function EnhancedVoiceAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Good evening, Sir. All systems are online and functioning at optimal capacity. How may I assist you?',
      sender: 'jarvis',
      timestamp: new Date(),
      type: 'response'
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [typingEffect, setTypingEffect] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Typing indicator effect
    if (isThinking) {
      let i = 0;
      const text = 'Analyzing';
      const interval = setInterval(() => {
        setTypingEffect(text.slice(0, (i % (text.length + 1))));
        i++;
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isThinking]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'query'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const response = generateEnhancedResponse(input.toLowerCase());
      const jarvisMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'jarvis',
        timestamp: new Date(),
        type: response.type,
        confidence: response.confidence
      };
      setMessages(prev => [...prev, jarvisMessage]);
      setIsThinking(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateEnhancedResponse = (input: string): { text: string; type: 'command' | 'response' | 'alert'; confidence: number } => {
    const responses: Record<string, { text: string; type: 'command' | 'response' | 'alert'; confidence: number }> = {
      'hello': { text: 'Hello, Sir. Always a pleasure to assist you.', type: 'response', confidence: 0.98 },
      'status': { 
        text: 'All systems functioning within normal parameters. Power levels at 89%, security protocols active, and network connectivity at 98%. Neural network accuracy at 97.4%. Shall I provide a detailed breakdown?', 
        type: 'response', 
        confidence: 0.99 
      },
      'analyze': { text: 'Initiating deep analysis protocol. Accessing quantum processors and neural networks for comprehensive data analysis.', type: 'command', confidence: 0.95 },
      'power': { text: 'Power systems nominal. Arc reactor output at 89%. All energy distribution channels operating efficiently.', type: 'response', confidence: 0.97 },
      'security': { text: 'Security scan complete. All encryption protocols active. No intrusion attempts detected. Firewall integrity at 100%.', type: 'response', confidence: 1.0 },
      'time': { text: `The current time is ${new Date().toLocaleTimeString()}. All chronological systems synchronized.`, type: 'response', confidence: 1.0 },
      'weather': { text: 'Accessing meteorological databases... Current conditions: Clear skies, 72°F. Optimal conditions for all operations.', type: 'response', confidence: 0.92 },
      'diagnostic': { text: 'Running comprehensive system diagnostics. CPU: 45%, Memory: 67%, Network: 98%, All subsystems nominal.', type: 'command', confidence: 0.96 },
      'alert': { text: 'Alert system armed. All monitoring protocols active. I will notify you immediately of any anomalies.', type: 'alert', confidence: 0.94 }
    };

    // Find matching response
    for (const [key, value] of Object.entries(responses)) {
      if (input.includes(key)) {
        return value;
      }
    }

    // Default intelligent responses
    const defaults = [
      { text: "I've processed your request through my neural networks. The optimal solution has been calculated and is ready for execution.", type: 'response' as const, confidence: 0.87 },
      { text: "Analyzing data patterns... I've identified several correlations that may be of interest to you, Sir.", type: 'response' as const, confidence: 0.91 },
      { text: "That's an intriguing query. I've consulted multiple databases and cross-referenced with historical data for the most accurate response.", type: 'response' as const, confidence: 0.89 },
      { text: "Running advanced algorithms on your request. All computational resources are dedicated to providing you the best solution.", type: 'command' as const, confidence: 0.85 },
      { text: "Understood, Sir. I've logged this request and prioritized it in my processing queue.", type: 'response' as const, confidence: 0.93 }
    ];

    return defaults[Math.floor(Math.random() * defaults.length)];
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'command': return <Zap className="w-3 h-3" />;
      case 'alert': return <Sparkles className="w-3 h-3" />;
      case 'query': return <Brain className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      className="relative h-full"
    >
      <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/40 rounded-xl backdrop-blur-xl overflow-hidden h-full flex flex-col shadow-2xl shadow-cyan-500/10">
        {/* Enhanced Header */}
        <div className="relative border-b border-cyan-500/30 p-5 bg-gradient-to-r from-black/60 to-cyan-950/20">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <ArcReactor size={56} animated />
              </motion.div>
              <div>
                <h2 className="text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  J.A.R.V.I.S
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </motion.div>
                </h2>
                <p className="text-xs text-cyan-600 mt-1">Neural Language Interface • Quantum Processing</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsListening(!isListening)}
                size="sm"
                className={`${
                  isListening
                    ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                    : 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                } border transition-all`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <Volume2 className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-cyan-400">Audio: ON</span>
              </div>
            </div>
          </div>

          {/* System Status Bar */}
          <div className="mt-3 flex gap-2">
            <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400 text-xs">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
              Neural Net Active
            </Badge>
            <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">
              Response Time: 0.24s
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400 text-xs">
              Accuracy: 97.4%
            </Badge>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-5">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
                  className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {message.sender === 'jarvis' && (
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="flex-shrink-0"
                    >
                      <ArcReactor size={36} animated />
                    </motion.div>
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[75%] relative group ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50'
                        : 'bg-gradient-to-br from-blue-950/40 to-cyan-950/20 border-cyan-500/30'
                    } border rounded-2xl p-4 backdrop-blur-sm`}
                  >
                    {/* Message Type Indicator */}
                    {message.type && (
                      <div className="flex items-center gap-1.5 mb-2">
                        {getMessageIcon(message.type)}
                        <span className="text-xs text-cyan-500 uppercase tracking-wider">
                          {message.type}
                        </span>
                      </div>
                    )}

                    <p className="text-cyan-100 text-sm leading-relaxed">{message.text}</p>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-cyan-500/20">
                      <p className="text-xs text-cyan-600 font-mono">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                      {message.confidence && (
                        <div className="flex items-center gap-1.5">
                          <div className="h-1 w-16 bg-cyan-950/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${message.confidence * 100}%` }}
                              className="h-full bg-gradient-to-r from-cyan-400 to-green-400"
                            />
                          </div>
                          <span className="text-xs text-cyan-500">
                            {(message.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-500 pointer-events-none" />
                  </motion.div>

                  {message.sender === 'user' && (
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-2 border-cyan-400 shadow-lg shadow-cyan-500/50">
                      <span className="text-white text-sm font-semibold">U</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <ArcReactor size={36} animated />
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
                    <span className="text-sm text-cyan-400">{typingEffect}</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Enhanced Input */}
        <div className="border-t border-cyan-500/30 p-4 bg-gradient-to-r from-black/60 to-cyan-950/10">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Speak to JARVIS..."
                className="bg-black/60 border-cyan-500/40 text-cyan-100 placeholder:text-cyan-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 pr-20 h-12"
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
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 h-12 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-cyan-700 mt-2 font-mono flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            // Neural processing enabled • Real-time response optimization
          </p>
        </div>
      </div>
    </motion.div>
  );
}

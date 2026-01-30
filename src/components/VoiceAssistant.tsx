import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArcReactor } from './ArcReactor';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'jarvis';
  timestamp: Date;
}

export function VoiceAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Good evening, Sir. All systems are online and functioning at optimal capacity. How may I assist you?',
      sender: 'jarvis',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const response = generateResponse(input.toLowerCase());
      const jarvisMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'jarvis',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, jarvisMessage]);
      setIsThinking(false);
    }, 1000 + Math.random() * 1500);
  };

  const generateResponse = (input: string): string => {
    const responses = [
      "Running diagnostics on that request, Sir. Everything appears to be in order.",
      "Certainly, Sir. Executing protocol now.",
      "I've analyzed the data. Shall I display the results on your screen?",
      "As you wish, Sir. Accessing the mainframe.",
      "That's an interesting query. Processing through my neural network.",
      "My algorithms suggest this is the optimal solution, Sir.",
      "I've cross-referenced multiple databases. Here's what I found.",
      "Scanning all available resources. One moment, please.",
      "That request has been logged and is being processed.",
      "Interesting. Let me run a few simulations."
    ];

    if (input.includes('hello') || input.includes('hi')) {
      return "Hello, Sir. Always a pleasure to assist you.";
    }
    if (input.includes('status') || input.includes('report')) {
      return "All systems functioning within normal parameters. Power levels at 89%, security protocols active, and network connectivity at 98%. Shall I provide a detailed breakdown?";
    }
    if (input.includes('thank')) {
      return "You're most welcome, Sir. It's what I'm here for.";
    }
    if (input.includes('help')) {
      return "I am at your service, Sir. I can monitor systems, analyze data, run diagnostics, or assist with any queries you may have.";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg backdrop-blur-sm overflow-hidden"
      style={{ height: 'calc(100vh - 12rem)' }}
    >
      {/* Header */}
      <div className="border-b border-cyan-500/30 p-4 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ArcReactor size={50} animated />
            <div>
              <h2 className="text-cyan-400 uppercase tracking-wider">J.A.R.V.I.S</h2>
              <p className="text-xs text-cyan-600">Artificial Intelligence Assistant</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setIsListening(!isListening)}
              className={`${
                isListening
                  ? 'bg-red-500/20 border-red-500 text-red-400'
                  : 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
              } border`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {message.sender === 'jarvis' && (
                <div className="flex-shrink-0">
                  <ArcReactor size={32} animated />
                </div>
              )}
              
              <div
                className={`max-w-[70%] ${
                  message.sender === 'user'
                    ? 'bg-cyan-500/10 border-cyan-500/40'
                    : 'bg-blue-950/30 border-cyan-500/20'
                } border rounded-lg p-4`}
              >
                <p className="text-cyan-100 text-sm leading-relaxed">{message.text}</p>
                <p className="text-xs text-cyan-600 mt-2 font-mono">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.sender === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center">
                  <span className="text-cyan-400 text-xs">U</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <ArcReactor size={32} animated />
            <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.3, 1, 0.3]
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
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-cyan-500/30 p-4 bg-black/20">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Speak to JARVIS..."
            className="bg-black/40 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-800 focus:border-cyan-500 font-mono"
          />
          <Button
            onClick={handleSend}
            className="bg-cyan-500/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/30 px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-cyan-700 mt-2 font-mono">
          // Try: "Status report" or "Hello JARVIS"
        </p>
      </div>
    </motion.div>
  );
}

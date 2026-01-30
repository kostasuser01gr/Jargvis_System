import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function VoiceController() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.success('Voice control activated', { duration: 2000 });
    };

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      const conf = event.results[last][0].confidence;
      
      setTranscript(text);
      setConfidence(conf);

      if (event.results[last].isFinal) {
        processCommand(text);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error !== 'no-speech') {
        toast.error(`Voice error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setTranscript('');
    };

    recognitionRef.current = recognition;

    // Auto-start
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processCommand = (text: string) => {
    const command = text.toLowerCase().trim();
    
    // Command processing
    if (command.includes('hello') || command.includes('jarvis')) {
      speak('Hello, Sir. How may I assist you?');
    } else if (command.includes('status')) {
      speak('All systems operational. Running at peak efficiency.');
    } else if (command.includes('time')) {
      const time = new Date().toLocaleTimeString();
      speak(`The current time is ${time}`);
    } else if (command.includes('analytics')) {
      toast.info('Opening analytics dashboard');
      speak('Opening analytics dashboard');
    } else if (command.includes('scan')) {
      toast.info('Initiating system scan');
      speak('Initiating comprehensive system scan');
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <div className="bg-gradient-to-br from-cyan-950/90 to-blue-950/90 border border-cyan-500/50 rounded-lg p-4 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 min-w-[300px]">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{
                scale: isListening ? [1, 1.2, 1] : 1,
                opacity: isListening ? [0.5, 1, 0.5] : 1
              }}
              transition={{
                duration: 1.5,
                repeat: isListening ? Infinity : 0
              }}
              className={`p-2 rounded-full ${
                isListening ? 'bg-green-500/20' : 'bg-cyan-500/20'
              }`}
            >
              {isListening ? (
                <Mic className="w-5 h-5 text-green-400" />
              ) : (
                <MicOff className="w-5 h-5 text-cyan-400" />
              )}
            </motion.div>
            <div className="flex-1">
              <p className="text-xs text-cyan-400">Voice Control</p>
              <p className="text-xs text-cyan-600">
                {isListening ? 'Listening...' : 'Standby'}
              </p>
            </div>
            <Volume2 className="w-4 h-4 text-cyan-400" />
          </div>

          {isListening && transcript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-cyan-500/30 pt-3 mt-3"
            >
              <p className="text-xs text-cyan-600 mb-1">Transcript:</p>
              <p className="text-sm text-cyan-300">{transcript}</p>
              {confidence > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-cyan-600 mb-1">
                    <span>Confidence</span>
                    <span>{Math.round(confidence * 100)}%</span>
                  </div>
                  <div className="h-1 bg-cyan-950/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          <div className="mt-3 pt-3 border-t border-cyan-500/30">
            <p className="text-xs text-cyan-700">
              Try: "Hello JARVIS" or "Show status"
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

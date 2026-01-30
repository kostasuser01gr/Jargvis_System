import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArcReactor } from './ArcReactor';

interface BootSequenceProps {
  onComplete: () => void;
}

const bootStages = [
  { progress: 0, text: 'Initializing quantum processors...', system: 'QUANTUM_CORE' },
  { progress: 6, text: 'Loading neural network matrices...', system: 'NEURAL_NET' },
  { progress: 12, text: 'Establishing encrypted communication channels...', system: 'COMMS' },
  { progress: 18, text: 'Synchronizing holographic interface arrays...', system: 'HOLO_DISPLAY' },
  { progress: 24, text: 'Calibrating voice recognition systems...', system: 'VOICE_AI' },
  { progress: 30, text: 'Activating gesture control modules...', system: 'GESTURE_CTRL' },
  { progress: 36, text: 'Initializing distributed computing clusters...', system: 'CLUSTER_OPS' },
  { progress: 42, text: 'Loading threat detection protocols...', system: 'SECURITY' },
  { progress: 48, text: 'Connecting to satellite network...', system: 'SAT_LINK' },
  { progress: 54, text: 'Starting AI terminal and code editor...', system: 'DEV_TOOLS' },
  { progress: 60, text: 'Establishing GitHub integration...', system: 'GIT_HUB' },
  { progress: 66, text: 'Initializing database management systems...', system: 'DATABASE' },
  { progress: 72, text: 'Configuring deployment pipelines...', system: 'DEPLOY' },
  { progress: 78, text: 'Activating advanced AI chatbot...', system: 'AI_CHAT' },
  { progress: 80, text: 'Starting server monitoring systems...', system: 'SERVER_MON' },
  { progress: 83, text: 'Loading API management tools...', system: 'API_MGMT' },
  { progress: 86, text: 'Initializing theme customizer...', system: 'THEME_SYS' },
  { progress: 89, text: 'Starting workflow automation engine...', system: 'WORKFLOW' },
  { progress: 92, text: 'Loading data visualization dashboard...', system: 'DATA_VIZ' },
  { progress: 94, text: 'Initializing system logs monitor...', system: 'LOGS_SYS' },
  { progress: 91, text: 'Configuring settings panel...', system: 'SETTINGS' },
  { progress: 93, text: 'Initializing quantum computing core...', system: 'QUANTUM' },
  { progress: 95, text: 'Loading AI model repository...', system: 'AI_MODELS' },
  { progress: 97, text: 'Starting collaboration services...', system: 'COLLAB' },
  { progress: 92, text: 'Connecting to blockchain network...', system: 'BLOCKCHAIN' },
  { progress: 93, text: 'Loading plugin manager...', system: 'PLUGINS' },
  { progress: 94, text: 'Initializing health monitoring...', system: 'HEALTH' },
  { progress: 95, text: 'Starting advanced diagnostics...', system: 'DIAGNOSTICS' },
  { progress: 96, text: 'Loading AI model marketplace...', system: 'MARKETPLACE' },
  { progress: 97, text: 'Initializing model fusion engine...', system: 'FUSION' },
  { progress: 98, text: 'Starting custom model builder...', system: 'BUILDER' },
  { progress: 99, text: 'Connecting to cloud platforms...', system: 'PLATFORMS' },
  { progress: 100, text: 'All systems operational. FUSION V6.0 achieved!', system: 'JARVIS_FUSION_ULTIMATE' }
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1.5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const stage = bootStages.findIndex(s => s.progress > progress);
    if (stage !== -1 && stage !== currentStage) {
      setCurrentStage(stage);
    }
  }, [progress, currentStage]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="boot-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#boot-grid)" />
        </svg>
      </div>

      {/* Arc Reactor */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <ArcReactor size={240} animated />
      </motion.div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 space-y-6 w-full max-w-2xl px-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-4xl text-cyan-400 tracking-[0.3em] mb-2"
          >
            J.A.R.V.I.S
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-sm text-cyan-600"
          >
            Just A Rather Very Intelligent System
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-cyan-400 text-sm">
            <span className="font-mono">SYSTEM INITIALIZATION</span>
            <motion.span
              key={Math.floor(progress)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-mono"
            >
              {Math.floor(progress)}%
            </motion.span>
          </div>
          
          <div className="h-2 bg-cyan-950/30 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </div>
        </div>

        {/* Boot Messages */}
        <div className="space-y-2 font-mono text-xs min-h-[180px]">
          {bootStages.slice(0, currentStage + 1).map((stage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: i === currentStage ? 1 : 0.4, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 ${
                i === currentStage
                  ? 'text-cyan-400'
                  : stage.progress === 100
                  ? 'text-green-400'
                  : 'text-cyan-600'
              }`}
            >
              <span className="flex-shrink-0">{'>'}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyan-500">[{stage.system}]</span>
                  {i === currentStage && stage.progress < 100 && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-cyan-400"
                    >
                      ▓
                    </motion.span>
                  )}
                  {stage.progress === 100 && (
                    <span className="text-green-400">✓</span>
                  )}
                </div>
                <span>{stage.text}</span>
              </div>
              {i === currentStage && stage.progress < 100 && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  _
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* System Checks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 50 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-4 pt-6 border-t border-cyan-900/30"
        >
          {[
            { label: 'NEURAL NET', status: progress > 60 ? 'ONLINE' : 'LOADING' },
            { label: 'HOLOGRAPHICS', status: progress > 75 ? 'ONLINE' : 'LOADING' },
            { label: 'VOICE SYS', status: progress > 85 ? 'ONLINE' : 'LOADING' }
          ].map((system) => (
            <div key={system.label} className="text-center">
              <div className={`text-xs mb-1 ${
                system.status === 'ONLINE' ? 'text-green-400' : 'text-cyan-600'
              }`}>
                {system.label}
              </div>
              <div className="flex items-center justify-center gap-1">
                <motion.div
                  className={`w-2 h-2 rounded-full ${
                    system.status === 'ONLINE' ? 'bg-green-400' : 'bg-cyan-400'
                  }`}
                  animate={system.status === 'ONLINE' ? {
                    opacity: [0.5, 1, 0.5]
                  } : {
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
                <span className={`text-xs font-mono ${
                  system.status === 'ONLINE' ? 'text-green-400' : 'text-cyan-600'
                }`}>
                  {system.status}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

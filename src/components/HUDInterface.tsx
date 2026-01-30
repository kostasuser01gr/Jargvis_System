import { motion } from 'motion/react';

export function HUDInterface() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Circular HUD Elements - Top */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-8">
        {[0, 1, 2].map((i) => (
          <motion.svg
            key={i}
            width="60"
            height="60"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ delay: i * 0.2 + 1 }}
          >
            <motion.circle
              cx="30"
              cy="30"
              r="25"
              stroke="rgba(34, 211, 238, 0.6)"
              strokeWidth="1"
              fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 10 + i * 5, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: 'center' }}
            />
            <motion.circle
              cx="30"
              cy="30"
              r="20"
              stroke="rgba(34, 211, 238, 0.4)"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="4 4"
              animate={{ rotate: -360 }}
              transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: 'center' }}
            />
            <circle cx="30" cy="30" r="3" fill="rgba(34, 211, 238, 0.8)" />
          </motion.svg>
        ))}
      </div>

      {/* Side HUD Markers */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`left-${i}`}
          className="absolute left-8"
          style={{ top: `${20 + i * 12}%` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.3, x: 0 }}
          transition={{ delay: i * 0.1 + 1.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-cyan-400/60" />
            <div className="w-2 h-2 border border-cyan-400/60 rotate-45" />
          </div>
        </motion.div>
      ))}

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`right-${i}`}
          className="absolute right-8"
          style={{ top: `${20 + i * 12}%` }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.3, x: 0 }}
          transition={{ delay: i * 0.1 + 1.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 border border-cyan-400/60 rotate-45" />
            <div className="w-8 h-px bg-cyan-400/60" />
          </div>
        </motion.div>
      ))}

      {/* Crosshair Center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <svg width="40" height="40">
          <circle cx="20" cy="20" r="15" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" fill="none" />
          <line x1="20" y1="0" x2="20" y2="8" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
          <line x1="20" y1="32" x2="20" y2="40" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
          <line x1="0" y1="20" x2="8" y2="20" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
          <line x1="32" y1="20" x2="40" y2="20" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Targeting Brackets - Bottom Corners */}
      <motion.svg
        className="absolute bottom-8 left-8"
        width="80"
        height="80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
      >
        <path d="M 10 40 L 10 10 L 40 10" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="2" fill="none" />
        <path d="M 5 40 L 5 5 L 40 5" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="1" fill="none" />
      </motion.svg>

      <motion.svg
        className="absolute bottom-8 right-8"
        width="80"
        height="80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
      >
        <path d="M 70 40 L 70 10 L 40 10" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="2" fill="none" />
        <path d="M 75 40 L 75 5 L 40 5" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="1" fill="none" />
      </motion.svg>
    </div>
  );
}

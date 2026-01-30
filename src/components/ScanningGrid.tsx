import { motion } from 'motion/react';

export function ScanningGrid() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(34, 211, 238, 0.5)"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern id="grid-large" width="200" height="200" patternUnits="userSpaceOnUse">
            <path
              d="M 200 0 L 0 0 0 200"
              fill="none"
              stroke="rgba(34, 211, 238, 0.8)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#grid-large)" />
      </svg>

      {/* Scanning Lines */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          backgroundImage: 'linear-gradient(45deg, transparent 45%, rgba(34, 211, 238, 0.03) 50%, transparent 55%)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Vertical Scan */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-32"
        animate={{
          y: ['-100%', '200%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Horizontal Scan */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent w-32"
        animate={{
          x: ['-100%', '200%']
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Corner Brackets - Top Left */}
      <svg className="absolute top-0 left-0 w-32 h-32 text-cyan-400/40">
        <path d="M 60 10 L 10 10 L 10 60" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 50 15 L 15 15 L 15 50" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      {/* Corner Brackets - Top Right */}
      <svg className="absolute top-0 right-0 w-32 h-32 text-cyan-400/40">
        <path d="M 72 10 L 122 10 L 122 60" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 82 15 L 117 15 L 117 50" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      {/* Corner Brackets - Bottom Left */}
      <svg className="absolute bottom-0 left-0 w-32 h-32 text-cyan-400/40">
        <path d="M 60 122 L 10 122 L 10 72" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 50 117 L 15 117 L 15 82" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      {/* Corner Brackets - Bottom Right */}
      <svg className="absolute bottom-0 right-0 w-32 h-32 text-cyan-400/40">
        <path d="M 72 122 L 122 122 L 122 72" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 82 117 L 117 117 L 117 82" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      {/* Floating Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -50, -100]
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  );
}

import { motion } from 'motion/react';

interface ArcReactorProps {
  size?: number;
  animated?: boolean;
}

export function ArcReactor({ size = 120, animated = false }: ArcReactorProps) {
  const center = size / 2;
  const radius1 = size * 0.4;
  const radius2 = size * 0.3;
  const radius3 = size * 0.2;
  const radius4 = size * 0.1;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={`arcGlow-${size}`}>
          <stop offset="0%" stopColor="rgba(34, 211, 238, 0.8)" />
          <stop offset="50%" stopColor="rgba(34, 211, 238, 0.4)" />
          <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
        </radialGradient>
        <filter id={`glow-${size}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer Glow */}
      {animated && (
        <motion.circle
          cx={center}
          cy={center}
          r={radius1 * 1.2}
          fill={`url(#arcGlow-${size})`}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: 'center' }}
        />
      )}

      {/* Outer Ring */}
      <motion.circle
        cx={center}
        cy={center}
        r={radius1}
        stroke="rgba(34, 211, 238, 0.6)"
        strokeWidth="1.5"
        fill="none"
        filter={`url(#glow-${size})`}
        animate={animated ? {
          rotate: 360
        } : {}}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transformOrigin: 'center' }}
      />

      {/* Middle Ring */}
      <motion.circle
        cx={center}
        cy={center}
        r={radius2}
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="2"
        fill="none"
        filter={`url(#glow-${size})`}
        animate={animated ? {
          rotate: -360
        } : {}}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transformOrigin: 'center' }}
      />

      {/* Triangle Pattern */}
      {[0, 120, 240].map((angle, i) => {
        const x1 = center + radius2 * Math.cos((angle * Math.PI) / 180);
        const y1 = center + radius2 * Math.sin((angle * Math.PI) / 180);
        const x2 = center + radius4 * Math.cos(((angle + 30) * Math.PI) / 180);
        const y2 = center + radius4 * Math.sin(((angle + 30) * Math.PI) / 180);
        const x3 = center + radius4 * Math.cos(((angle - 30) * Math.PI) / 180);
        const y3 = center + radius4 * Math.sin(((angle - 30) * Math.PI) / 180);

        return (
          <motion.path
            key={i}
            d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`}
            fill="rgba(34, 211, 238, 0.3)"
            stroke="rgba(34, 211, 238, 0.8)"
            strokeWidth="1"
            filter={`url(#glow-${size})`}
            animate={animated ? {
              opacity: [0.3, 1, 0.3]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        );
      })}

      {/* Inner Ring */}
      <motion.circle
        cx={center}
        cy={center}
        r={radius3}
        stroke="rgba(34, 211, 238, 1)"
        strokeWidth="1"
        fill="rgba(34, 211, 238, 0.2)"
        filter={`url(#glow-${size})`}
        animate={animated ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: 'center' }}
      />

      {/* Core */}
      <circle
        cx={center}
        cy={center}
        r={radius4}
        fill="rgba(34, 211, 238, 0.9)"
        filter={`url(#glow-${size})`}
      />
    </svg>
  );
}

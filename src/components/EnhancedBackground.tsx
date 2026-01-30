import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function EnhancedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      
      {/* Moving Gradient Orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
          left: '10%',
          top: '20%',
        }}
        animate={{
          x: mousePosition.x * 100,
          y: mousePosition.y * 100,
          scale: [1, 1.2, 1],
        }}
        transition={{
          x: { type: 'spring', stiffness: 50, damping: 30 },
          y: { type: 'spring', stiffness: 50, damping: 30 },
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
          right: '10%',
          bottom: '20%',
        }}
        animate={{
          x: -mousePosition.x * 80,
          y: -mousePosition.y * 80,
          scale: [1, 1.3, 1],
        }}
        transition={{
          x: { type: 'spring', stiffness: 50, damping: 30 },
          y: { type: 'spring', stiffness: 50, damping: 30 },
          scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />

      {/* Animated Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Scanlines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 211, 238, 0.05) 2px, rgba(34, 211, 238, 0.05) 4px)',
        }} />
      </div>
    </div>
  );
}

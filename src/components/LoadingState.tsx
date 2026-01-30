import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { ArcReactor } from './ArcReactor';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = 'Loading...', fullScreen = false }: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <ArcReactor size={80} animated />
      </motion.div>

      <div className="text-center">
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
          className="text-cyan-400 mb-2"
        >
          {message}
        </motion.div>
        
        <div className="flex items-center gap-2 justify-center">
          {[...Array(3)].map((_, i) => (
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
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

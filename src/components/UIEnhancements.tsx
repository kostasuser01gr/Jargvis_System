import { motion } from 'motion/react';
import { ReactNode } from 'react';

// Animated Card with Hover Effects
export function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)',
        transition: { duration: 0.2 }
      }}
      className={`glass-card rounded-xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Glowing Button
export function GlowButton({ 
  children, 
  onClick, 
  variant = 'cyan',
  className = ''
}: { 
  children: ReactNode; 
  onClick?: () => void;
  variant?: 'cyan' | 'purple' | 'blue' | 'green';
  className?: string;
}) {
  const colors = {
    cyan: 'from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-cyan-500/50',
    purple: 'from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-500/50',
    blue: 'from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 shadow-blue-500/50',
    green: 'from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-green-500/50',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative px-6 py-3 rounded-lg font-medium
        bg-gradient-to-r ${colors[variant]}
        text-white shadow-lg hover:shadow-xl
        transition-all duration-300
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
}

// Stat Card with Animation
export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = 'cyan',
  delay = 0
}: {
  label: string;
  value: string | number;
  icon?: any;
  trend?: number;
  color?: 'cyan' | 'purple' | 'blue' | 'green' | 'orange';
  delay?: number;
}) {
  const colors = {
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    blue: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
    orange: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5 }}
      className={`
        relative glass-card rounded-xl p-6 border
        bg-gradient-to-br ${colors[color]}
        overflow-hidden group cursor-pointer
      `}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`absolute inset-0 blur-xl ${colors[color].split(' ')[0]}`} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-80">{label}</span>
          {Icon && <Icon className="w-5 h-5 opacity-60" />}
        </div>
        <div className="flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
            className="text-3xl font-bold font-mono"
          >
            {value}
          </motion.div>
          {trend !== undefined && (
            <div className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </motion.div>
  );
}

// Section Header with Underline Animation
export function SectionHeader({
  title,
  subtitle,
  icon: Icon
}: {
  title: string;
  subtitle?: string;
  icon?: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
        )}
        <h2 className="text-2xl font-bold text-cyan-400 text-glow-cyan">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-sm text-cyan-600 ml-13">{subtitle}</p>
      )}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="h-px bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent mt-3"
      />
    </motion.div>
  );
}

// Loading Spinner
export function LoadingSpinner({ size = 'md', color = 'cyan' }: { size?: 'sm' | 'md' | 'lg'; color?: string }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} border-t-${color}-400 border-r-transparent border-b-${color}-400 border-l-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// Pulse Dot Indicator
export function PulseDot({ color = 'green', size = 'md' }: { color?: 'green' | 'red' | 'yellow' | 'blue'; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const colors = {
    green: 'bg-green-400',
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-400',
  };

  return (
    <div className="relative">
      <motion.div
        className={`${sizes[size]} ${colors[color]} rounded-full`}
        animate={{
          boxShadow: [
            `0 0 0 0 rgba(${color === 'green' ? '52, 211, 153' : color === 'red' ? '248, 113, 113' : color === 'yellow' ? '251, 191, 36' : '96, 165, 250'}, 0.7)`,
            `0 0 0 10px rgba(${color === 'green' ? '52, 211, 153' : color === 'red' ? '248, 113, 113' : color === 'yellow' ? '251, 191, 36' : '96, 165, 250'}, 0)`,
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
}

// Badge with Glow
export function GlowBadge({
  children,
  variant = 'cyan',
  size = 'md'
}: {
  children: ReactNode;
  variant?: 'cyan' | 'purple' | 'green' | 'orange' | 'red';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variants = {
    cyan: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-cyan-500/50',
    purple: 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-purple-500/50',
    green: 'bg-green-500/20 border-green-500/50 text-green-400 shadow-green-500/50',
    orange: 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-orange-500/50',
    red: 'bg-red-500/20 border-red-500/50 text-red-400 shadow-red-500/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${variants[variant]} ${sizes[size]}
        shadow-lg backdrop-blur-sm
      `}
    >
      {children}
    </motion.span>
  );
}

// Tooltip with Animation
export function AnimatedTooltip({
  content,
  children
}: {
  content: string;
  children: ReactNode;
}) {
  return (
    <div className="relative group">
      {children}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
                   bg-black/90 border border-cyan-500/30 rounded-lg text-xs text-cyan-400
                   whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none
                   transition-all duration-200 z-50"
      >
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
          <div className="border-4 border-transparent border-t-cyan-500/30" />
        </div>
      </motion.div>
    </div>
  );
}

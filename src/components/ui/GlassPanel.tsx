'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'light' | 'dark' | 'gold' | 'blue';
  blur?: 'sm' | 'md' | 'lg';
  border?: boolean;
  glow?: boolean;
  className?: string;
}

const variantStyles = {
  light: 'bg-glass-white-20 border-glass-white-30',
  dark: 'bg-glass-black-30 border-glass-white-10',
  gold: 'bg-gradient-to-br from-accent-gold/20 to-accent-gold-dark/10 border-accent-gold/30',
  blue: 'bg-gradient-to-br from-accent-blue/20 to-accent-blue-dark/10 border-accent-blue/30',
};

const blurStyles = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
};

const glowStyles = {
  light: 'shadow-lg shadow-white/10',
  dark: 'shadow-lg shadow-black/20',
  gold: 'shadow-lg shadow-accent-gold/20 animate-glow',
  blue: 'shadow-lg shadow-accent-blue/20',
};

export const GlassPanel = ({
  children,
  variant = 'dark',
  blur = 'md',
  border = true,
  glow = false,
  className = '',
  ...motionProps
}: GlassPanelProps) => {
  const variantClass = variantStyles[variant];
  const blurClass = blurStyles[blur];
  const borderClass = border ? 'border' : '';
  const glowClass = glow ? glowStyles[variant] : '';

  return (
    <motion.div
      className={`
        ${variantClass}
        ${blurClass}
        ${borderClass}
        ${glowClass}
        rounded-2xl
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

interface GradientTextProps {
  children: ReactNode;
  variant?: 'gold' | 'blue' | 'gold-blue';
  className?: string;
}

export const GradientText = ({ 
  children, 
  variant = 'gold',
  className = '' 
}: GradientTextProps) => {
  const gradientClasses = {
    gold: 'bg-gradient-to-r from-accent-gold to-accent-gold-light',
    blue: 'bg-gradient-to-r from-accent-blue to-accent-blue-light',
    'gold-blue': 'bg-gradient-to-r from-accent-gold via-accent-blue to-accent-gold-dark',
  };

  return (
    <span 
      className={`
        ${gradientClasses[variant]}
        bg-clip-text
        text-transparent
        font-semibold
        ${className}
      `}
    >
      {children}
    </span>
  );
};

interface FloatingElementProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  amplitude?: number;
  duration?: number;
  className?: string;
}

export const FloatingElement = ({
  children,
  delay = 0,
  amplitude = 10,
  duration = 3,
  className = '',
  ...motionProps
}: FloatingElementProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude/2, amplitude/2, -amplitude/2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

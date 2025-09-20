'use client';

import { motion } from 'framer-motion';
import { ArrowLeftIcon, HomeIcon, ViewfinderCircleIcon } from '@heroicons/react/24/outline';

interface NavigationControlsProps {
  showBackButton: boolean;
  onBack: () => void;
  onHome: () => void;
  selectedFloor?: number;
  className?: string;
}

export const NavigationControls = ({
  showBackButton,
  onBack,
  onHome,
  selectedFloor,
  className = '',
}: NavigationControlsProps) => {
  return (
    <motion.div
      className={`fixed top-4 left-4 z-10 flex flex-col gap-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      {showBackButton && (
        <motion.button
          onClick={onBack}
          className="glass-effect touch-target flex items-center justify-center w-12 h-12 rounded-xl text-primary-white hover:text-accent-gold transition-colors duration-200 active:scale-95"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </motion.button>
      )}

      {/* Home Button */}
      <motion.button
        onClick={onHome}
        className="glass-effect touch-target flex items-center justify-center w-12 h-12 rounded-xl text-primary-white hover:text-accent-gold transition-colors duration-200 active:scale-95"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <HomeIcon className="w-6 h-6" />
      </motion.button>

      {/* Floor Indicator */}
      {selectedFloor && (
        <motion.div
          className="glass-effect px-3 py-2 rounded-xl text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-accent-gold text-sm font-medium">Floor</div>
          <div className="text-primary-white text-lg font-bold">{selectedFloor}</div>
        </motion.div>
      )}
    </motion.div>
  );
};

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const FloatingActionButton = ({
  icon,
  onClick,
  className = '',
  variant = 'primary',
}: FloatingActionButtonProps) => {
  const variantClasses = {
    primary: 'gradient-gold text-primary-black',
    secondary: 'glass-effect text-primary-white',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`touch-target flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      {icon}
    </motion.button>
  );
};

interface ControlPanelProps {
  isVisible: boolean;
  children: React.ReactNode;
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
  className?: string;
}

export const ControlPanel = ({
  isVisible,
  children,
  position = 'bottom-center',
  className = '',
}: ControlPanelProps) => {
  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-effect p-4 rounded-2xl">
        {children}
      </div>
    </motion.div>
  );
};

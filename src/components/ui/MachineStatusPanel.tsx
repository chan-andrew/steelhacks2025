'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Machine } from '@/types/gym';

interface MachineStatusPanelProps {
  machine: Machine | null;
  onToggleStatus: () => void;
  onClose: () => void;
  className?: string;
}

const machineTypeIcons = {
  cardio: '🏃‍♂️',
  strength: '💪',
  functional: '🤸‍♀️',
  'free-weights': '🏋️‍♂️',
};

const machineTypeNames = {
  cardio: 'Cardio Equipment',
  strength: 'Strength Training',
  functional: 'Functional Training',
  'free-weights': 'Free Weights',
};

export const MachineStatusPanel = ({
  machine,
  onToggleStatus,
  onClose,
  className = '',
}: MachineStatusPanelProps) => {
  if (!machine) return null;

  return (
    <motion.div
      className={`fixed inset-x-4 bottom-4 z-20 ${className}`}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="glass-effect p-6 rounded-2xl max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{machineTypeIcons[machine.type]}</span>
            <div>
              <h3 className="text-lg font-semibold text-primary-white">
                {machine.name}
              </h3>
              <p className="text-sm text-primary-white/70">
                {machineTypeNames[machine.type]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full glass-dark text-primary-white/70 hover:text-primary-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {machine.isInUse ? (
              <XCircleIcon className="w-5 h-5 text-red-400" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
            )}
            <span
              className={`font-medium ${
                machine.isInUse ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {machine.isInUse ? 'In Use' : 'Available'}
            </span>
          </div>
          
          {machine.isInUse && (
            <p className="text-sm text-primary-white/70">
              This machine is currently being used by another member.
            </p>
          )}
        </div>

        {/* Machine Details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-primary-white/70">Type:</span>
            <span className="text-primary-white">{machineTypeNames[machine.type]}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-primary-white/70">Position:</span>
            <span className="text-primary-white">
              ({machine.position[0].toFixed(1)}, {machine.position[2].toFixed(1)})
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-primary-white/70">Dimensions:</span>
            <span className="text-primary-white">
              {machine.dimensions[0]} × {machine.dimensions[1]} × {machine.dimensions[2]}m
            </span>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={onToggleStatus}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            machine.isInUse
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Cog6ToothIcon className="w-5 h-5" />
          {machine.isInUse ? 'Mark as Available' : 'Mark as In Use'}
        </motion.button>

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-glass-white-10">
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-accent-gold font-semibold">24/7</div>
              <div className="text-primary-white/70">Available</div>
            </div>
            <div className="text-center">
              <div className="text-accent-gold font-semibold">∞</div>
              <div className="text-primary-white/70">Uses</div>
            </div>
            <div className="text-center">
              <div className="text-accent-gold font-semibold">★★★★★</div>
              <div className="text-primary-white/70">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

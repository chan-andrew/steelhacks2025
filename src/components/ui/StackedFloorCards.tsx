'use client';

import { motion } from 'framer-motion';
import { GymFloor } from '@/types/gym';

interface StackedFloorCardsProps {
  floors: GymFloor[];
  onFloorSelect: (floorId: number) => void;
  className?: string;
}

const machineTypeColors = {
  cardio: '#ffffff',
  strength: '#cccccc', 
  functional: '#999999',
  'free-weights': '#666666',
};

const FloorCard = ({ 
  floor, 
  index, 
  totalFloors, 
  onSelect 
}: { 
  floor: GymFloor; 
  index: number; 
  totalFloors: number; 
  onSelect: () => void;
}) => {
  // Calculate stacking offset and scale
  const stackOffset = index * 12; // 12px offset between cards for more dramatic stacking
  const scale = 1 - (index * 0.03); // More noticeable scale reduction for depth
  const opacity = 0.9 - (index * 0.08); // More dramatic opacity reduction
  
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        zIndex: totalFloors - index,
        transform: `translateY(${stackOffset}px) scale(${scale})`,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }}
      whileHover={{ 
        scale: scale + 0.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      onClick={onSelect}
    >
      <div className="glass-effect backdrop-blur-xl bg-white/5 border border-white/15 rounded-2xl p-6 w-96 h-72 relative overflow-hidden shadow-2xl">
        {/* Floor Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Floor {floor.id}
            </h3>
            <p className="text-white/70 text-sm">
              {floor.machines.length} machines
            </p>
          </div>
          <div className="text-3xl font-bold text-white/30">
            {floor.id}
          </div>
        </div>

        {/* Machine Grid Visualization */}
        <div className="grid grid-cols-10 gap-1.5 mb-6">
          {Array.from({ length: 50 }, (_, i) => {
            const machine = floor.machines[i];
            return (
              <div
                key={i}
                className="w-3 h-3 rounded-full transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: machine 
                    ? machine.isInUse 
                      ? '#ef4444' 
                      : machineTypeColors[machine.type] || '#ffffff'
                    : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: machine && !machine.isInUse 
                    ? '0 0 8px rgba(255, 255, 255, 0.3)' 
                    : machine?.isInUse 
                      ? '0 0 8px rgba(239, 68, 68, 0.5)'
                      : 'none'
                }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-between text-xs text-white/60">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span>Cardio</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white/70"></div>
            <span>Strength</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <span>Free Weights</span>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/10 to-accent-blue/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      </div>
    </motion.div>
  );
};

export const StackedFloorCards = ({ 
  floors, 
  onFloorSelect, 
  className = '' 
}: StackedFloorCardsProps) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative">
        {floors.map((floor, index) => (
          <FloorCard
            key={floor.id}
            floor={floor}
            index={index}
            totalFloors={floors.length}
            onSelect={() => onFloorSelect(floor.id)}
          />
        ))}
      </div>
    </div>
  );
};

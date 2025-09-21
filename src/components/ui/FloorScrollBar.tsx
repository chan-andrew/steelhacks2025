'use client';

import { motion } from 'framer-motion';

interface FloorScrollBarProps {
  totalFloors: number;
  currentFloor?: number;
  onFloorSelect: (floorId: number) => void;
  className?: string;
}

export const FloorScrollBar = ({
  totalFloors,
  currentFloor,
  onFloorSelect,
  className = ''
}: FloorScrollBarProps) => {
  const floors = Array.from({ length: totalFloors }, (_, i) => i + 1);

  const handleDotClick = (floorId: number) => {
    console.log(`FloorScrollBar: Dot clicked for floor ${floorId}, current floor=${currentFloor}`);
    onFloorSelect(floorId);
  };

  return (
    <div className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-20 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Floor dots */}
        {floors.map((floorId) => {
          const isCurrentFloor = currentFloor === floorId;
          return (
            <motion.button
              key={floorId}
              onClick={() => handleDotClick(floorId)}
              className="relative w-4 h-4 rounded-full border-2 border-white/30 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Dot fill */}
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  isCurrentFloor ? 'bg-white' : 'bg-gray-500'
                }`}
                animate={{
                  scale: isCurrentFloor ? 1 : 0.6,
                  opacity: isCurrentFloor ? 1 : 0.5,
                }}
                transition={{
                  duration: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />

              {/* Floor number label */}
              <div className={`absolute -left-8 top-1/2 transform -translate-y-1/2 text-xs font-medium ${
                isCurrentFloor ? 'text-white' : 'text-gray-400'
              }`}>
                {floorId}
              </div>
            </motion.button>
          );
        })}

        {/* Connecting line */}
        <div className="absolute top-2 bottom-2 left-1/2 w-px bg-white/20 transform -translate-x-1/2 -z-10" />
      </div>
    </div>
  );
};
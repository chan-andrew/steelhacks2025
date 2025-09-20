'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface EquipmentLegendProps {
  show: boolean;
}

export const EquipmentLegend = ({ show }: EquipmentLegendProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Fade in after 1000ms delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  const legendItems = [
    { 
      type: 'Cardio', 
      color: 'bg-teal-600', 
      dotColor: 'bg-green-500',
      description: 'Treadmills, bikes, ellipticals'
    },
    { 
      type: 'Strength', 
      color: 'bg-teal-800', 
      dotColor: 'bg-green-500',
      description: 'Weight machines, cable systems'
    },
    { 
      type: 'Free Weights', 
      color: 'bg-red-700', 
      dotColor: 'bg-red-500',
      description: 'Dumbbells, barbells, plates'
    }
  ];

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] // cubic-bezier easing
      }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
    >
      <div className="glass-effect rounded-2xl p-6 backdrop-blur-md bg-black/20 border border-white/10">
        <h3 className="text-white text-lg font-semibold mb-4 text-center">Equipment Types</h3>
        
        <div className="flex flex-col space-y-3">
          {legendItems.map((item, index) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
              transition={{ 
                duration: 0.3, 
                delay: isVisible ? 0.1 * index : 0,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="flex items-center space-x-3"
            >
              {/* Equipment Rectangle */}
              <div className={`w-8 h-6 ${item.color} rounded-sm shadow-lg relative`}>
                {/* Status Dot */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 ${item.dotColor} rounded-full border border-white/20`} />
              </div>
              
              {/* Equipment Info */}
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{item.type}</div>
                <div className="text-white/60 text-xs">{item.description}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status Legend */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-white/80">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-white/80">Occupied</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

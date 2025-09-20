'use client';

import { useState, useCallback, useMemo } from 'react';
import { GymState, GymFloor, Machine, ViewMode, CameraState } from '@/types/gym';

const FLOOR_COLORS = [
  '#FFFFFF', // White
  '#FFFFFF', // White
  '#FFFFFF', // White
  '#FFFFFF', // White
  '#FFFFFF', // White
];

const createInitialMachines = (floorId: number): Machine[] => {
  const machines: Machine[] = [];
  const machineTypes: Machine['type'][] = ['cardio', 'strength', 'functional', 'free-weights'];
  
  // Fixed number of machines per floor to avoid hydration mismatch
  const machinesPerFloor = 10;
  const gridSize = Math.ceil(Math.sqrt(machinesPerFloor));
  
  for (let i = 0; i < machinesPerFloor; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    
    // Use deterministic values based on floor and machine index to avoid hydration issues
    const typeIndex = (floorId + i) % machineTypes.length;
    const isInUse = (floorId + i) % 4 === 0; // Every 4th machine is in use
    
    machines.push({
      id: `floor-${floorId}-machine-${i}`,
      name: `Machine ${i + 1}`,
      type: machineTypes[typeIndex],
      position: [
        (col - gridSize / 2) * 2, // x
        0, // y (floor level)
        (row - gridSize / 2) * 2, // z
      ],
      rotation: [0, (i * 0.5) % (Math.PI * 2), 0], // Deterministic rotation
      isInUse,
      dimensions: [1, 1.5, 0.8], // typical gym machine dimensions
    });
  }
  
  return machines;
};

const createInitialFloors = (): GymFloor[] => {
  return Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    name: `Floor ${index + 1}`,
    level: index + 1,
    machines: createInitialMachines(index + 1),
    color: FLOOR_COLORS[index],
    opacity: 0.3,
    isSelected: false,
  }));
};

const INITIAL_CAMERA_STATE: CameraState = {
  position: [-15, 8, -15], // Rotated 180 degrees to fix text orientation
  target: [0, 0, 0], // Look at center of cube
  fov: 60,
};

const FLOOR_DETAIL_CAMERA_STATE: CameraState = {
  position: [0, 20, 0], // Top-down view for detail
  target: [0, 0, 0], // Look at center of selected floor
  fov: 50,
};

export const useGymState = () => {
  const [gymState, setGymState] = useState<GymState>({
    floors: createInitialFloors(),
    currentView: {
      type: 'overview',
      cameraState: INITIAL_CAMERA_STATE,
    },
    isTransitioning: false,
    selectedMachine: undefined,
  });

  const selectFloor = useCallback((floorId: number) => {
    const floorY = (floorId - 3) * 1.5; // Match the floor positioning
    
    setGymState(prev => ({
      ...prev,
      isTransitioning: true,
      floors: prev.floors.map(floor => ({
        ...floor,
        isSelected: floor.id === floorId,
        opacity: floor.id === floorId ? 0.8 : 0.1,
      })),
      currentView: {
        type: 'floor-detail',
        selectedFloor: floorId,
        cameraState: {
          ...FLOOR_DETAIL_CAMERA_STATE,
          position: [0, floorY + 15, 0], // Position camera above the selected floor
          target: [0, floorY, 0], // Look down at the selected floor
        },
      },
    }));

    // Reset transition state after animation
    setTimeout(() => {
      setGymState(prev => ({ ...prev, isTransitioning: false }));
    }, 1200); // Longer transition for smooth camera movement
  }, []);

  const returnToOverview = useCallback(() => {
    setGymState(prev => ({
      ...prev,
      isTransitioning: true,
      floors: prev.floors.map(floor => ({
        ...floor,
        isSelected: false,
        opacity: 0.3,
      })),
      currentView: {
        type: 'overview',
        cameraState: INITIAL_CAMERA_STATE,
      },
      selectedMachine: undefined,
    }));

    // Reset transition state after animation
    setTimeout(() => {
      setGymState(prev => ({ ...prev, isTransitioning: false }));
    }, 1200); // Match the transition duration
  }, []);

  const toggleMachineStatus = useCallback((machineId: string) => {
    setGymState(prev => ({
      ...prev,
      floors: prev.floors.map(floor => ({
        ...floor,
        machines: floor.machines.map(machine =>
          machine.id === machineId
            ? { ...machine, isInUse: !machine.isInUse }
            : machine
        ),
      })),
    }));
  }, []);

  const selectMachine = useCallback((machineId: string) => {
    setGymState(prev => ({
      ...prev,
      selectedMachine: prev.selectedMachine === machineId ? undefined : machineId,
    }));
  }, []);

  const selectedFloor = useMemo(() => {
    if (gymState.currentView.type === 'floor-detail' && gymState.currentView.selectedFloor) {
      return gymState.floors.find(floor => floor.id === gymState.currentView.selectedFloor);
    }
    return undefined;
  }, [gymState.floors, gymState.currentView]);

  const selectedMachine = useMemo(() => {
    if (!gymState.selectedMachine) return undefined;
    
    for (const floor of gymState.floors) {
      const machine = floor.machines.find(m => m.id === gymState.selectedMachine);
      if (machine) return machine;
    }
    return undefined;
  }, [gymState.floors, gymState.selectedMachine]);

  return {
    gymState,
    selectedFloor,
    selectedMachine,
    actions: {
      selectFloor,
      returnToOverview,
      toggleMachineStatus,
      selectMachine,
    },
  };
};

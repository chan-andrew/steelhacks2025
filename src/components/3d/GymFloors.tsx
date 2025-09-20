'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Cylinder } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { GymFloor, ViewMode } from '@/types/gym';
import { GymMachine } from './GymMachine';

interface GymFloorsProps {
  floors: GymFloor[];
  currentView: ViewMode;
  isTransitioning: boolean;
  onFloorClick: (floorId: number) => void;
  onMachineClick: (machineId: string) => void;
  onMachineToggle: (machineId: string) => void;
  selectedMachine?: string;
}

const FloorComponent = ({
  floor,
  isSelected,
  isDetailView,
  onFloorClick,
  onMachineClick,
  onMachineToggle,
  selectedMachine,
}: {
  floor: GymFloor;
  isSelected: boolean;
  isDetailView: boolean;
  onFloorClick: (floorId: number) => void;
  onMachineClick: (machineId: string) => void;
  onMachineToggle: (machineId: string) => void;
  selectedMachine?: string;
}) => {
  const floorRef = useRef<THREE.Group>(null);
  const floorMeshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [animationScale, setAnimationScale] = useState(1);
  
  // Position floors as slices of a cube - closer together for layered look
  const floorY = (floor.level - 3) * 1.5; // Center around 0, 1.5 units apart
  const shouldShowMachines = isDetailView && isSelected;
  
  // Cube dimensions
  const cubeSize = 12;

  // Floor scaling animation when selected
  useEffect(() => {
    if (isSelected && isDetailView) {
      // Animate scale from 1x to 1.8x over 1200ms (less aggressive scaling)
      const startTime = Date.now();
      const duration = 1200;
      const startScale = 1;
      const targetScale = 1.8;

      const animateScale = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Cubic-bezier easing
        const easeProgress = progress * progress * (3 - 2 * progress);
        const currentScale = startScale + (targetScale - startScale) * easeProgress;
        
        setAnimationScale(currentScale);

        if (progress < 1) {
          requestAnimationFrame(animateScale);
        }
      };

      animateScale();
    } else {
      setAnimationScale(1);
    }
  }, [isSelected, isDetailView]);

  // Animate floor glow effect
  useFrame((state) => {
    if (floorMeshRef.current) {
      const material = floorMeshRef.current.material as THREE.MeshStandardMaterial;
      if (isSelected) {
        material.emissive.setHex(0x333333);
        material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        material.emissive.setHex(0x000000);
        material.emissiveIntensity = 0;
      }
    }
  });

  // Glass-like material for the floor slices
  const floorMaterial = useMemo(() => {
    const baseColor = (isHovered || isSelected) ? '#FFD700' : '#FFFFFF'; // Gold when hovered/selected
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      transparent: true,
      opacity: isSelected ? 0.8 : isHovered ? 0.6 : 0.3,
      roughness: 0.1,
      metalness: 0.8,
      emissive: baseColor,
      emissiveIntensity: isSelected ? 0.3 : isHovered ? 0.2 : 0.05,
    });
  }, [isSelected, isHovered]);

  // Wireframe material for cube edges
  const edgesMaterial = useMemo(() => {
    const edgeColor = (isHovered || isSelected) ? '#FFD700' : '#FFFFFF';
    return new THREE.LineBasicMaterial({
      color: edgeColor,
      transparent: true,
      opacity: isSelected ? 1.0 : isHovered ? 0.8 : 0.6,
    });
  }, [isSelected, isHovered]);

  return React.createElement(
    'group',
    { 
      ref: floorRef, 
      position: [0, floorY, 0], 
      scale: [animationScale, 1, animationScale],
      rotation: isDetailView && isSelected ? [0, 0, 0] : [0, Math.PI / 4, 0] // No rotation in detail view, 45° in overview
    },
    // Main Floor Plane - Paper-thin flat surface
    React.createElement(Box, {
      ref: floorMeshRef,
      args: [cubeSize, 0.02, cubeSize], // Very thin box to simulate plane
      material: floorMaterial,
      castShadow: true,
      receiveShadow: true,
      onClick: (e) => {
        e.stopPropagation();
        onFloorClick(floor.id);
      },
      onPointerOver: (e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      },
      onPointerOut: () => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }
    }),

    // Floor Border - Thin wireframe outline
    React.createElement('lineSegments', { ref: edgesRef },
      React.createElement('edgesGeometry', { args: [new THREE.BoxGeometry(cubeSize, 0.02, cubeSize)] }),
      React.createElement('primitive', { object: edgesMaterial })
    ),

    // Floor Number Label
    React.createElement(Text, {
      position: [cubeSize/2 + 1, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      fontSize: 1,
      color: isSelected ? "#FFD700" : "#FFFFFF",
      anchorX: "center",
      anchorY: "middle"
    }, `Floor ${floor.id}`),

    // Machines - only show when in detail view and floor is selected
    shouldShowMachines && React.createElement('group', {},
      floor.machines.map((machine) => 
        React.createElement(GymMachine, {
          key: machine.id,
          machine: machine,
          isSelected: selectedMachine === machine.id,
          onClick: () => onMachineClick(machine.id),
          onToggle: () => onMachineToggle(machine.id)
        })
      )
    ),

    // Machine Dots Visualization - Small dots representing machines on the floor plane
    !shouldShowMachines && React.createElement('group', {},
      floor.machines.slice(0, 25).map((machine, i) => {
        const x = (i % 5 - 2) * 2;
        const z = (Math.floor(i / 5) - 2) * 2;
        return React.createElement('mesh', { 
          key: machine.id, 
          position: [x, 0.03, z] 
        },
          React.createElement('sphereGeometry', { args: [0.06] }),
          React.createElement('meshStandardMaterial', {
            color: machine.isInUse ? '#ef4444' : '#ffffff',
            emissive: machine.isInUse ? '#ef4444' : '#ffffff',
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8
          })
        );
      })
    ),

    // Floor Grid Pattern (when in detail view)
    shouldShowMachines && React.createElement('gridHelper', {
      args: [cubeSize, 12, '#333333', '#222222'],
      position: [0, -0.01, 0]
    })
  );
};

export const GymFloors = ({
  floors,
  currentView,
  isTransitioning,
  onFloorClick,
  onMachineClick,
  onMachineToggle,
  selectedMachine,
}: GymFloorsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const isDetailView = currentView.type === 'floor-detail';

  // Debug logging
  console.log('GymFloors rendering:', { 
    floorsCount: floors.length, 
    isDetailView, 
    floors: floors.map(f => ({ id: f.id, machineCount: f.machines.length }))
  });

  // Remove the floating animation - keep floors static
  // useFrame((state) => {
  //   if (groupRef.current && !isTransitioning) {
  //     // Subtle floating animation in overview mode
  //     if (!isDetailView) {
  //       groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
  //       groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  //     }
  //   }
  // });

  return React.createElement('group', { 
    ref: groupRef,
    rotation: [0, (100 * Math.PI) / 180, 0] // Rotate 100 degrees around Y-axis to make text visible
  },
    floors
      .filter(floor => floor.opacity > 0) // Only render visible floors
      .map((floor) => 
        React.createElement(FloorComponent, {
          key: floor.id,
          floor: floor,
          isSelected: floor.isSelected,
          isDetailView: isDetailView,
          onFloorClick: onFloorClick,
          onMachineClick: onMachineClick,
          onMachineToggle: onMachineToggle,
          selectedMachine: selectedMachine
        })
      )
  );
};

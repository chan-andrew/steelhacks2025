'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Machine } from '@/types/gym';

interface GymMachineProps {
  machine: Machine;
  isSelected: boolean;
  onClick: () => void;
  onToggle: () => void;
}

const getMachineColor = (type: Machine['type'], isInUse: boolean) => {
  const baseColors = {
    cardio: '#008B8B',        // Teal for cardio
    strength: '#006666',      // Darker teal for strength  
    functional: '#008B8B',    // Teal for functional
    'free-weights': '#8B0000', // Dark red for free weights
  };

  // For free weights, always show red. For others, show red when in use
  if (type === 'free-weights') {
    return '#DC143C'; // Crimson red for free weights
  }
  
  return isInUse ? '#DC143C' : baseColors[type]; // Red when in use, teal when available
};

const getMachineGeometry = (type: Machine['type']) => {
  switch (type) {
    case 'cardio':
      return { width: 1.2, height: 1.8, depth: 0.8 };
    case 'strength':
      return { width: 1.5, height: 2.2, depth: 1.2 };
    case 'functional':
      return { width: 0.8, height: 1.5, depth: 0.8 };
    case 'free-weights':
      return { width: 1.0, height: 0.8, depth: 1.0 };
    default:
      return { width: 1.0, height: 1.5, depth: 0.8 };
  }
};

export const GymMachine = ({ machine, isSelected, onClick, onToggle }: GymMachineProps) => {
  const machineRef = useRef<THREE.Group>(null);
  const mainBodyRef = useRef<THREE.Mesh>(null);
  
  const geometry = getMachineGeometry(machine.type);
  const color = getMachineColor(machine.type, machine.isInUse);

  // Animate machine
  useFrame((state) => {
    if (machineRef.current) {
      // Subtle hover animation when selected
      if (isSelected) {
        machineRef.current.position.y = 
          machine.position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        machineRef.current.rotation.y = 
          machine.rotation[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      } else {
        machineRef.current.position.y = machine.position[1];
        machineRef.current.rotation.y = machine.rotation[1];
      }
    }

    // Glow effect for selected machine
    if (mainBodyRef.current) {
      const material = mainBodyRef.current.material as THREE.MeshStandardMaterial;
      if (isSelected) {
        material.emissive.setHex(0x333333);
        material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      } else if (machine.isInUse) {
        material.emissive.setHex(0x441111);
        material.emissiveIntensity = 0.2;
      } else {
        material.emissive.setHex(0x000000);
        material.emissiveIntensity = 0;
      }
    }
  });

  const machineMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: machine.isInUse ? 0.9 : 0.8,
    });
  }, [color, machine.isInUse]);

  const accentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: machine.isInUse ? '#FFD700' : '#CCCCCC',
      roughness: 0.1,
      metalness: 0.9,
      emissive: machine.isInUse ? '#FFD700' : '#000000',
      emissiveIntensity: machine.isInUse ? 0.1 : 0,
    });
  }, [machine.isInUse]);

  return (
    <group
      ref={machineRef}
      position={machine.position}
      rotation={machine.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Main Machine Body */}
      <Box
        ref={mainBodyRef}
        args={[geometry.width, geometry.height, geometry.depth]}
        material={machineMaterial}
        castShadow
        receiveShadow
      />

      {/* Machine Details based on type */}
      {machine.type === 'cardio' && (
        <>
          {/* Screen */}
          <Box
            args={[0.6, 0.4, 0.05]}
            position={[0, geometry.height / 2 - 0.3, geometry.depth / 2]}
            material={accentMaterial}
          />
          {/* Handles */}
          <Box
            args={[0.1, 0.8, 0.1]}
            position={[-0.4, 0, geometry.depth / 2 - 0.1]}
            material={accentMaterial}
          />
          <Box
            args={[0.1, 0.8, 0.1]}
            position={[0.4, 0, geometry.depth / 2 - 0.1]}
            material={accentMaterial}
          />
        </>
      )}

      {machine.type === 'strength' && (
        <>
          {/* Weight Stack */}
          <Box
            args={[0.3, 1.5, 0.3]}
            position={[0.5, 0, -0.3]}
            material={accentMaterial}
          />
          {/* Seat */}
          <Box
            args={[0.8, 0.1, 0.6]}
            position={[0, -0.3, 0]}
            material={accentMaterial}
          />
        </>
      )}

      {machine.type === 'functional' && (
        <>
          {/* Suspension Points */}
          <Sphere
            args={[0.05]}
            position={[-0.3, geometry.height / 2, 0]}
            material={accentMaterial}
          />
          <Sphere
            args={[0.05]}
            position={[0.3, geometry.height / 2, 0]}
            material={accentMaterial}
          />
        </>
      )}

      {machine.type === 'free-weights' && (
        <>
          {/* Weight Plates */}
          <Sphere
            args={[0.2]}
            position={[-0.4, -0.2, 0]}
            material={accentMaterial}
          />
          <Sphere
            args={[0.2]}
            position={[0.4, -0.2, 0]}
            material={accentMaterial}
          />
          {/* Barbell */}
          <Box
            args={[1.2, 0.05, 0.05]}
            position={[0, 0, 0]}
            material={accentMaterial}
          />
        </>
      )}

      {/* Status Indicator Dot */}
      <Sphere
        args={[0.1]}
        position={[0, geometry.height / 2 + 0.2, 0]}
        material={
          new THREE.MeshStandardMaterial({
            color: machine.isInUse ? '#FF0000' : '#00FF00', // Red for occupied, green for available
            emissive: machine.isInUse ? '#FF0000' : '#00FF00',
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.9,
          })
        }
      />

      {/* Machine Label (only show when selected) */}
      {isSelected && (
        <Text
          position={[0, geometry.height / 2 + 0.8, 0]}
          fontSize={0.3}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
          billboard
        >
          {machine.name}
          {'\n'}
          {machine.isInUse ? 'IN USE' : 'AVAILABLE'}
        </Text>
      )}

      {/* Selection Outline */}
      {isSelected && (
        <Box
          args={[geometry.width + 0.1, geometry.height + 0.1, geometry.depth + 0.1]}
          material={
            new THREE.MeshBasicMaterial({
              color: '#FFD700',
              transparent: true,
              opacity: 0.2,
              wireframe: true,
            })
          }
        />
      )}
    </group>
  );
};

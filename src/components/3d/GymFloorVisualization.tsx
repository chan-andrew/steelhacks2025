'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GymFloors } from './GymFloors';
import { CameraController } from './CameraController';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { TouchGestureOverlay } from '../ui/TouchGestureOverlay';
import { useGymState } from '@/hooks/useGymState';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { TouchGesture } from '@/types/gym';
import * as THREE from 'three';

interface GymFloorVisualizationProps {
  className?: string;
}

export const GymFloorVisualization = ({ className = '' }: GymFloorVisualizationProps) => {
  const { gymState, actions } = useGymState();
  const mobileOpt = useMobileOptimization();
  const controlsRef = useRef<any>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();

  const handleFloorClick = (floorId: number) => {
    if (gymState.currentView.type === 'overview') {
      actions.selectFloor(floorId);
    }
  };

  const handleBackgroundClick = () => {
    if (gymState.currentView.type === 'floor-detail') {
      actions.returnToOverview();
    }
  };

  const handleTouchGesture = useCallback((gesture: TouchGesture) => {
    switch (gesture.type) {
      case 'tap':
        // Handle tap gestures for floor/machine selection
        break;
      case 'pinch':
        // Handle pinch-to-zoom
        if (controlsRef.current && gesture.scale) {
          const currentDistance = controlsRef.current.getDistance();
          const newDistance = Math.max(5, Math.min(50, currentDistance / gesture.scale));
          controlsRef.current.dollyTo(newDistance, true);
        }
        break;
      case 'pan':
        // Handle pan gestures for camera movement
        break;
    }
  }, []);

  return (
    <motion.div
      className={`relative w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: mobileOpt.performance.reducedMotion ? 0.1 : 0.5 }}
    >
      <TouchGestureOverlay onGesture={handleTouchGesture} className="w-full h-full">
        <Canvas
          shadows={mobileOpt.performance.animationQuality !== 'low'}
          camera={{ 
            position: [-15, 8, -15], // Rotated 180 degrees to fix text orientation
            fov: mobileOpt.viewport.fov 
          }}
          className="w-full h-full"
          onPointerMissed={handleBackgroundClick}
          dpr={mobileOpt.performance.pixelRatio}
        >
        <Suspense fallback={null}>
          {/* Camera with smooth transitions */}
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={gymState.currentView.cameraState.position}
            fov={gymState.currentView.cameraState.fov}
          />

          {/* Camera Controller with Smooth Transitions */}
          <CameraController
            targetState={gymState.currentView.cameraState}
            isTransitioning={gymState.isTransitioning}
            transitionDuration={1200}
          />

          {/* Lighting */}
          <ambientLight intensity={0.3} color="#ffffff" />
          <directionalLight
            position={[10, 20, 5]}
            intensity={0.8}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={mobileOpt.performance.shadowMapSize}
            shadow-mapSize-height={mobileOpt.performance.shadowMapSize}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          
          {/* Accent lighting */}
          <pointLight
            position={[0, 15, 0]}
            intensity={0.5}
            color="#FFD700"
            distance={30}
          />
          <pointLight
            position={[-10, 10, 10]}
            intensity={0.3}
            color="#4169E1"
            distance={20}
          />

          {/* Gym Floors */}
          <GymFloors
            floors={gymState.floors}
            currentView={gymState.currentView}
            isTransitioning={gymState.isTransitioning}
            onFloorClick={handleFloorClick}
            onMachineClick={actions.selectMachine}
            onMachineToggle={actions.toggleMachineStatus}
            selectedMachine={gymState.selectedMachine}
          />

          {/* Environment */}
          <fog attach="fog" args={['#000000', 30, 100]} />
        </Suspense>
        </Canvas>
      </TouchGestureOverlay>

      {/* Loading Overlay */}
      <Suspense fallback={<LoadingSpinner />}>
        {gymState.isTransitioning && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-effect p-4 rounded-lg"
            >
              <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
            </motion.div>
          </div>
        )}
      </Suspense>
    </motion.div>
  );
};
